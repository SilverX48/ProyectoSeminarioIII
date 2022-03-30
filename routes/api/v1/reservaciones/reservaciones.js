const express = require('express');
const router = express.Router();

const Reservaciones = require('../../../../dao/reservaciones/reservacion.model');
const reservacionesModel = new Reservaciones();


router.get('/all', async (req, res) => {
  try {
    console.log("User Request", req.user);
    const rows = await reservacionesModel.getAll();
    res.status(200).json({status:'ok', reservaciones: rows});
  } catch (ex) {
    console.log(ex);
    res.status(500).json({status:'failed'});
  }
});

const allowedItemsNumber = [10, 15, 20];

router.get('/facet/:page/:items', async (req, res) => {
  const page = parseInt(req.params.page, 10);
  const items = parseInt(req.params.items, 10);
  if (allowedItemsNumber.includes(items)) {
    try {
      const citas = await citaModel.getFaceted(page, items);
      res.status(200).json({docs:citas});
    } catch (ex) {
      console.log(ex);
      res.status(500).json({ status: 'failed' });
    }
  } else {
    return res.status(403).json({status:'error', msg:'Not a valid item value (10,15,20)'});
  }

});


router.post('/new', async (req, res) => {
  const {fecha, descripcion} = req.body;
  try {
    rslt = await reservacionesModel.new(fecha, descripcion);
    res.status(200).json(
      {
        status: 'ok',
        result: rslt
      });
  } catch (ex) {
    console.log(ex);
    res.status(500).json(
      {
        status: 'failed',
        result: {}
      });
  }
});


router.put('/update/:id', async (req, res) => {
  try{
    const { fecha, descripcion} = req.body;
    const { id } = req.params;
    const result = await reservacionesModel.updateOne(id, fecha, descripcion);
    res.status(200).json({
      status:'ok',
      result
    });
  } catch(ex){
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});


router.put('/addtagset/:id', async (req, res) => {
  try {
    const { tag } = req.body;
    const { id } = req.params;
    const result = await citaModel.updateAddTagSet(id, tag);
    res.status(200).json({
      status: 'ok',
      result
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await reservacionesModel.deleteOne(id);
    res.status(200).json({
      status: 'ok',
      result
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});


module.exports = router;