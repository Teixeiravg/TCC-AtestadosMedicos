const adminService = require('./service');

async function listarAtestados(req, res) {
    try{
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
        const status = req.query.status;

        const {total, atestados} = await adminService.listarAtestados(page, limit, status);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            page,
            limit,
            total,
            totalPages,
            data: atestados,
        });
    } catch (error) {
        console.error('Erro ao listar atestados:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = {
    listarAtestados,
}