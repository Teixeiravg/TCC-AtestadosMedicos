const express = require('express');
const router = express.Router();

// Importa o middleware de autenticação do módulo de auth
const { authenticate } = require('../auth/auth.middleware');

// Importa o controller e o upload do service
const { createCertificate, getUserCertificates } = require('./certificates.controller');
const { upload } = require('./certificates.service');

// Aplica o authenticate em todas as rotas — só usuário logado acessa
router.use(authenticate);

// POST /certificates — envia um novo atestado com arquivo
router.post('/', upload.single('arquivo'), createCertificate);

// GET /certificates — lista os atestados do usuário logado
router.get('/', getUserCertificates);

module.exports = router;