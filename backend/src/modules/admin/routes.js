const express = require('express');
const router = express.Router()

const fakeAuth = require('../../shared/middlewares/fakeAuth');
const isAdmin = require('../../shared/middlewares/isAdmin');

router.use(fakeAuth);
router.use(isAdmin);

router.get('/certificates', (req, res) => {
    res.json({message: "Lista de certificados (admin)"})
})

router.patch('/certificates/:id/approve', (req, res) => {
    res.json({message: `Certificado aprovado`})
})

router.patch('/certificates/:id/reject', (req, res) => {
    res.json({message: `Certificado rejeitado`})
})

module.exports = router;