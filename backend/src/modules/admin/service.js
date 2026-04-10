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

module.exports = {
    listarAtestados,
}