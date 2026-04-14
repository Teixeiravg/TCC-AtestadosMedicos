const express = require('express');
const router = express.Router();

const { 
    register, 
    login, 
    registrarConsentimento, 
    recuperarSenha,
    getMe,
    updateMe
} = require('./auth.controller');

const { authenticate } = require('./auth.middleware');

// Rotas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/recuperar-senha', recuperarSenha);

// Rotas privadas
router.post('/consentimento', authenticate, registrarConsentimento);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

module.exports = router;