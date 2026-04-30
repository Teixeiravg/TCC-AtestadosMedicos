const prisma = require('../../shared/prisma');

// Função responsável por criar um atestado
async function createCertificate(req, res) {
    try {
        // 1. Extraia o motivo e observacoes do req.body
        const { startDate, durationDays, crmNumber, motivo, observacoes } = req.body;

        if (!req.user) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo é obrigatório' });
        }

        if (!startDate || !durationDays || !crmNumber) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // 2. Adicione motivo e observacoes no data do Prisma
        const certificate = await prisma.medicalCertificate.create({
            data: {
                startDate: new Date(startDate),
                endDate: new Date(new Date(startDate).getTime() + Number(durationDays) * 24 * 60 * 60 * 1000),
                crmNumber,
                motivo,        // Salva o motivo
                observacoes,   // Salva as observações
                fileUrl: `/uploads/${req.file.filename}`,
                userId: req.user.id,
                status: 'PENDING'
            }
        });

        return res.status(201).json({
            message: "Atestado enviado com sucesso",
            data: certificate
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

// Função para LISTAR atestados do usuário logado
async function getUserCertificates(req, res) {
    try {

        // Verifica autenticação
        if (!req.user) {
            return res.status(401).json({
                error: 'Usuário não autenticado'
            });
        }

        // 🔥 BUSCA NO BANCO (isso estava faltando)
        const certificates = await prisma.medicalCertificate.findMany({
            where: {
                userId: req.user.id
            },
            orderBy: {
                startDate: 'desc'
            }
        });

        // Monta URL completa
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const formattedCertificates = certificates.map(cert => ({
            ...cert,
            fileUrl: `${baseUrl}${cert.fileUrl}`
        }));

        return res.json(formattedCertificates);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    createCertificate,
    getUserCertificates
};
