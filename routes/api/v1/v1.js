const express = require('express');
const router = express.Router();

const { passport, jwtMiddleware } = require('./seguridad/jwtHelper');
const consultasRoutes = require('./consultas/consultas');
const ingresosRoutes = require('./ingresos/ingresos');
const seguridadRoutes = require('./seguridad/seguridad');


//middlewares

router.use(passport.initialize());
router.use('/consultas', jwtMiddleware, consultasRoutes);
router.use('/ingresos', ingresosRoutes);
router.use('/seguridad', seguridadRoutes);

module.exports = router;