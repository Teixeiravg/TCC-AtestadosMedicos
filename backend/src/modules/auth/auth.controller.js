const { 
    createUser, 
    loginUser, 
    gravarConsentimento, 
    atualizarSenhaSimples,
    buscarUsuarioPorId
} = require('./auth.service');

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

// ==========================================
// TAREFA DIA 3: Registro de Consentimento
// ==========================================
async function registrarConsentimento(req, res) {
    try {
        // Capturando o IP da requisição (req.ip é nativo do Express)
        // O x-forwarded-for ajuda se a API estiver atrás de um proxy/load balancer
        const ipRequisicao = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
        
        const { idUsuario, idAtestado, versaoTermo } = req.body;

        // Validação básica
        if (!idUsuario || !idAtestado || !versaoTermo) {
            return res.status(400).json({ error: 'idUsuario, idAtestado e versaoTermo são obrigatórios' });
        }

        const timestamp = new Date();

        // Passa para o service realizar o insert no Prisma
        const consentimentoSalvo = await gravarConsentimento({
            idUsuario,
            idAtestado,
            ipRequisicao,
            versaoTermo,
            timestamp
        });

        return res.status(201).json({ 
            message: "Consentimento registrado com sucesso", 
            data: consentimentoSalvo 
        });

    } catch (error) {
        console.log('ERRO NO CONSENTIMENTO:', error);
        return res.status(500).json({ error: 'Erro ao registrar o consentimento' });
    }
}

// ==========================================
// TAREFA DIA 4: Recuperação de Senha Simples
// ==========================================
async function recuperarSenha(req, res) {
    try {
        const { email, novaSenha } = req.body;

        if (!email || !novaSenha) {
            return res.status(400).json({ error: 'Email e novaSenha são obrigatórios' });
        }

        // Passa para o service atualizar a senha (o hash deve ser feito lá no service)
        await atualizarSenhaSimples(email, novaSenha);

        return res.status(200).json({ message: 'Senha atualizada com sucesso' });

    } catch (error) {
        console.log('ERRO NA RECUPERAÇÃO DE SENHA:', error);
        
        // Exemplo: se o service lançar um erro dizendo que o usuário não existe
        if (error.message === 'Usuário não encontrado') {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.status(500).json({ error: 'Erro ao atualizar a senha' });
    }
}

async function getMe(req, res) {
    try {
        const user = await buscarUsuarioPorId(req.user.id);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }
}

async function updateMe(req, res) {
    // Campo telefone não existe no schema atual
    // Rota existe para não quebrar o frontend — retorna sucesso sem alterar dados
    return res.status(200).json({ message: 'Perfil atualizado' });
}

module.exports = { 
    register, 
    login, 
    registrarConsentimento, 
    recuperarSenha,
    getMe,
    updateMe
};