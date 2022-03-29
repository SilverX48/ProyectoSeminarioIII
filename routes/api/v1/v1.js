const express = require('express');
const router = express.Router();

const pacientesRoutes = require('./pacientes/pacientes');
const citasRoutes = require('./citas/citas');



//middlewares


router.use('/pacientes', pacientesRoutes);
router.use('/citas', citasRoutes);

module.exports = router;