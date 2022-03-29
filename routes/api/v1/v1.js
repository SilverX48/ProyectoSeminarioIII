const express = require('express');
const router = express.Router();
const { verifyApiHeaderToken } = require('./headerVerifyMiddleware');

router.use(passport.initialize());

const pacientesRoutes = require('./pacientes/pacientes');
const citasRoutes = require('./citas/citas');

router.use('/pacientes', pacientesRoutes);
router.use('/citas', citasRoutes);

module.exports = router;