const express = require('express');
const router = express.Router();
const {passport, jwtMiddleware} = require('./seguridad_personal/jwtHelper');
const { verifyApiHeaderToken } = require('./headerVerifyMiddleware');


//variables
const pacientesRoutes = require('./pacientes/pacientes');
const citasRoutes = require('./citas/citas');
const seguridad_personalRoutes = require('./seguridad_personal/seguridad_personal');
const reservacionesRoutes = require('./reservaciones/reservaciones');


//rutas
router.use(passport.initialize());

router.use('/pacientes', jwtMiddleware, pacientesRoutes);
router.use('/citas', jwtMiddleware, citasRoutes);
router.use('/seguridad_personal', seguridad_personalRoutes);
router.use('/reservaciones', jwtMiddleware, reservacionesRoutes);

module.exports = router;