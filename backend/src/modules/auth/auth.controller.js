const { createUser, loginUser } = require('./auth.service');

async function register(req, res) {
    try {
        // Extrai os campos do corpo da requisição
        // Se o frontend não enviar um desses, a validação abaixo vai pegar
        const { name, email, password, role } = req.body;

        // Validação básica — garante que nenhum campo veio vazio ou undefined
        // Retorna 400 (Bad Request) se faltar algum campo
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Chama o service para fazer o trabalho de verdade
        // Se der erro, cai no catch abaixo
        const user = await createUser(name, email, password, role);

        // Retorna 201 (Created) com os dados públicos do usuário
        // NUNCA retornar passwordHash na resposta
        return res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });

    } catch (error) {
        // P2002 é o código do Prisma para violação de campo único (email duplicado)
        // Retorna 409 (Conflict) em vez de 500 para o frontend saber o que aconteceu
        console.log('ERRO NO REGISTER:', error);
        
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        // Qualquer outro erro inesperado cai aqui
        // Em produção, esse error.message não deveria ser exposto — mas para TCC está ok
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function login(req, res) {
    try {
        // Extrai email e senha do corpo da requisição
        const { email, password } = req.body;

        // Validação básica — os dois campos são obrigatórios
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Chama o service que verifica as credenciais e gera o token
        // Se as credenciais forem inválidas, o service lança um erro que cai no catch
        const { token, role } = await loginUser(email, password);

        // Retorna o token e o role para o frontend salvar e usar nas próximas requisições
        return res.status(200).json({ token, role });

    } catch (error) {
        // Credenciais inválidas — retorna 401 (Unauthorized)
        // Mensagem genérica propositalmente — não revela se foi email ou senha que errou
        if (error.message === 'Credenciais inválidas') {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = { register, login };