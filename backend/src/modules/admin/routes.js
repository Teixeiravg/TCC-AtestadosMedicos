const express = require('express');
const router = express.Router()
const adminController = require('./controller');

const {authenticate, authorizeAdmin} = require('../auth/auth.middleware');

router.use(authenticate);
router.use(authorizeAdmin);

router.get('/certificates', authenticate, authorizeAdmin, adminController.listarAtestados);

router.get('/certificates/:id', authenticate, authorizeAdmin, adminController.buscarAtestadoPorId);

router.patch('/certificates/:id/approve', authenticate, authorizeAdmin, adminController.aprovarAtestado);

router.patch('/certificates/:id/reject', authenticate, authorizeAdmin, adminController.rejeitarAtestado);

module.exports = router;