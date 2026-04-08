const jwt = require('jsonwebtoken');

// Middleware de autenticação — verifica se o token JWT é válido
// Deve ser usado em todas as rotas que exigem login
function authenticate(req, res, next) {

    // Pega o header Authorization da requisição
    // O frontend envia no formato: "Bearer eyJhbGci..."
    const authHeader = req.headers['authorization'];

    // Se não veio nenhum header, o usuário não está logado
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Separa o "Bearer" do token em si
    // authHeader.split(' ') retorna ['Bearer', 'eyJhbGci...']
    // o [1] pega só o token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token malformado' });
    }

    try {
        // Verifica se o token é válido e não expirou
        // Se for válido, decoded vai conter { id, role } que foram colocados no login
        // Se for inválido ou expirado, lança um erro que cai no catch abaixo
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Coloca os dados do usuário no req para as próximas funções acessarem
        // Depois daqui, qualquer rota pode usar req.user.id e req.user.role
        req.user = decoded;

        // Passa para o próximo middleware ou para a rota
        next();

    } catch (error) {
        // Token inválido ou expirado
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}

// Middleware de RBAC — verifica se o usuário tem o role correto
// Deve ser usado DEPOIS do authenticate, pois depende do req.user
function authorizeAdmin(req, res, next) {

    // req.user foi preenchido pelo middleware authenticate
    // Se o role não for ADMIN, bloqueia com 403 (Forbidden)
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    // Se for ADMIN, passa para a rota
    next();
}

// Exporta os dois middlewares para Dev 4 e Dev 5 importarem nas próprias pastas
module.exports = { authenticate, authorizeAdmin };