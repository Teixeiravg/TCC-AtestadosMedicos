const { createUser } = require('./auth.service');

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
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        // Qualquer outro erro inesperado cai aqui
        // Em produção, esse error.message não deveria ser exposto — mas para TCC está ok
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = { register };