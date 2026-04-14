const prisma = require('../../shared/prisma')

async function listarAtestados(page, limit, status) {
    const skip = (page - 1) * limit;
    const where = {};
    if (status) {
        where.status = status;
    }
    const [total, atestados] = await Promise.all([
        prisma.medicalCertificate.count({ where }),
        prisma.medicalCertificate.findMany({
            where,
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    ]);
        return { total, atestados }
}

async function buscarAtestadoPorId(id) {
    const atestado = await prisma.medicalCertificate.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            reviewedBy: {
                select: {
                    id: true, 
                    name: true,
                },
            },
            auditLogs: {
                orderBy: {
                    timestamp: 'desc',
                },
            },
        },
    });
    return atestado;
}

async function alterarStatusAtestado(id, novoStatus, adminId, adminNotes, ipAddress) {
    return await prisma.$transaction(async (prisma) => {
        const atestado = await prisma.medicalCertificate.findUnique({
            where: { id },
        });

        if (!atestado) {
            throw new Error('Atestado não encontrado');
        }

        const atualizacao = await prisma.medicalCertificate.update({
            where: { id },
            data: {
                status: novoStatus,
                reviewedById: adminId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                reviewedBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        await prisma.auditLog.create({
            data: {
                action: `ATESTADO_${novoStatus}`,
                previousState: atestado.status,
                newState: novoStatus,
                adminNotes: adminNotes || null,
                ipAddress: ipAddress || null,
                certificatedId: id,
                actorId: adminId,
            },
        });
        return atualizacao;
    });
}

module.exports = {
    listarAtestados,
    buscarAtestadoPorId,
    alterarStatusAtestado
}