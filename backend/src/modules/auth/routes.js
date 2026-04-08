const express = require('express');
const router = express.Router()

// Importar as funções do controller
const {register} = require('./auth.controller');

// Rota pública — qualquer um pode acessar sem estar logado
// POST /auth/register
router.post('/register', register);

module.exports = router;