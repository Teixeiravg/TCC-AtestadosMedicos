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

async function buscarAtestadoPorId(req, res) {
    try {
        const id = req.params.id;

        const atestado = await adminService.buscarAtestadoPorId(id);

        if (!atestado) {
            return res.status(404).json({ error: 'Atestado não encontrado' });
        }

        return res.status(200).json(atestado);
    } catch (error) {
        console.error('Erro ao buscar atestado:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function aprovarAtestado(req, res) {
    try {
        const { id } = req.params;
        const { adminNotes } = req.body;

        const atestado = await adminService.alterarStatusAtestado(
            id,
            'APPROVED',
            req.user.id,
            adminNotes,
            req.ip,
        );
        return res.status(200).json(atestado);
    } catch (error) {
        if (error.message === 'Atestado não encontrado') {
            return res.status(404).json({ error: 'Atestado não encontrado' });
        }

        console.error('Erro ao aprovar atestado:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function rejeitarAtestado(req, res) {
    try {
        const { id } = req.params;
        const { adminNotes } = req.body;

        const atestado = await adminService.alterarStatusAtestado(
            id,
            'REJECTED',
            req.user.id,
            adminNotes,
            req.ip,
        );
        return res.status(200).json(atestado);
    } catch (error) {
        if (error.message === 'Atestado não encontrado') {
            return res.status(404).json({ error: 'Atestado não encontrado' });
        }

        console.error('Erro ao rejeitar atestado:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = {
    listarAtestados,
    buscarAtestadoPorId,
    aprovarAtestado,
    rejeitarAtestado
}