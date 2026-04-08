const express = require('express');
const router = express.Router();

// Importa as funções do controller
const { register, login } = require('./auth.controller');

// Rota pública — qualquer um pode acessar sem estar logado
// POST /auth/register
router.post('/register', register);

// Rota pública — qualquer um pode acessar sem estar logado
// POST /auth/login
router.post('/login', login);

module.exports = router;