// Essa parte é responsável somente pela lógica

const bcryptjs = require('bcryptjs');
const prisma = require('../../shared/prisma');
const jwt = require('jsonwebtoken');

async function createUser(name, email, password, role) {
    const passwordHash = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, passwordHash, role }
    });
    return user;
}

async function loginUser(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Credenciais inválidas');

    const senhaCorreta = await bcryptjs.compare(password, user.passwordHash);
    if (!senhaCorreta) throw new Error('Credenciais inválidas');

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );
    return { token, role: user.role };
}

async function gravarConsentimento(dados) {
    const consentimento = await prisma.consentAgreement.create({
        data: {
            userId: dados.idUsuario,
            consentVersion: dados.versaoTermo,
            ipAdress: dados.ipRequisicao,
            acceptedAt: dados.timestamp
        }
    });
    return consentimento;
}

async function atualizarSenhaSimples(email, novaSenha) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Usuário não encontrado');

    const passwordHash = await bcryptjs.hash(novaSenha, 10);
    await prisma.user.update({ where: { email }, data: { passwordHash } });
    return true;
}

async function buscarUsuarioPorId(id) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    if (!user) throw new Error('Usuário não encontrado');
    return user;
}

async function excluirUsuarioPorId(id) {
    // Deleta o usuário. O Prisma vai cascatear conforme definido no schema.
    // Se houver registros relacionados sem cascade, vai lançar erro P2003 (foreign key).
    await prisma.user.delete({ where: { id } });
    return true;
}

module.exports = { 
    createUser, 
    loginUser, 
    gravarConsentimento, 
    atualizarSenhaSimples,
    buscarUsuarioPorId,
    excluirUsuarioPorId
};
