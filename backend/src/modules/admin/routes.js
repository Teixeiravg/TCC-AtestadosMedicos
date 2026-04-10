const express = require('express');
const router = express.Router()
const adminController = require('./controller');

const {authenticate, authorizeAdmin} = require('../auth/auth.middleware');

router.use(authenticate);
router.use(authorizeAdmin);

router.get('/certificates', authenticate, authorizeAdmin, adminController.listarAtestados);

router.patch('/certificates/:id/approve', (req, res) => {
    res.json({message: `Certificado aprovado`})
})

router.patch('/certificates/:id/reject', (req, res) => {
    res.json({message: `Certificado rejeitado`})
})

module.exports = router;