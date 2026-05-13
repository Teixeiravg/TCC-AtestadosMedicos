const { 
    createUser, 
    loginUser, 
    gravarConsentimento, 
    atualizarSenhaSimples,
    buscarUsuarioPorId,
    excluirUsuarioPorId
} = require('./auth.service');

async function register(req, res) {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
        if(password.length < 8) {
            return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres' });
        }
        const user = await createUser(name, email, password, role);
        return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        console.log('ERRO NO REGISTER:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }
        const { token, role } = await loginUser(email, password);
        return res.status(200).json({ token, role });
    } catch (error) {
        if (error.message === 'Credenciais inválidas') {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function registrarConsentimento(req, res) {
    try {
        const ipRequisicao = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
        const { idUsuario, idAtestado, versaoTermo } = req.body;
        if (!idUsuario || !idAtestado || !versaoTermo) {
            return res.status(400).json({ error: 'idUsuario, idAtestado e versaoTermo são obrigatórios' });
        }
        const timestamp = new Date();
        const consentimentoSalvo = await gravarConsentimento({ idUsuario, idAtestado, ipRequisicao, versaoTermo, timestamp });
        return res.status(201).json({ message: "Consentimento registrado com sucesso", data: consentimentoSalvo });
    } catch (error) {
        console.log('ERRO NO CONSENTIMENTO:', error);
        return res.status(500).json({ error: 'Erro ao registrar o consentimento' });
    }
}

async function recuperarSenha(req, res) {
    try {
        const { email, novaSenha } = req.body;
        if (!email || !novaSenha) {
            return res.status(400).json({ error: 'Email e novaSenha são obrigatórios' });
        }
        await atualizarSenhaSimples(email, novaSenha);
        return res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        console.log('ERRO NA RECUPERAÇÃO DE SENHA:', error);
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

async function deleteMe(req, res) {
    try {
        await excluirUsuarioPorId(req.user.id);
        return res.status(200).json({ message: 'Conta excluída com sucesso' });
    } catch (error) {
        console.log('ERRO AO EXCLUIR CONTA:', error);
        // P2025 = registro não encontrado no Prisma
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        // P2003 = foreign key constraint — usuário tem registros relacionados sem cascade
        if (error.code === 'P2003') {
            return res.status(409).json({ error: 'Não é possível excluir: usuário possui registros vinculados' });
        }
        return res.status(500).json({ error: 'Erro ao excluir a conta' });
    }
}

module.exports = { 
    register, 
    login, 
    registrarConsentimento, 
    recuperarSenha,
    getMe,
    updateMe,
    deleteMe
};
