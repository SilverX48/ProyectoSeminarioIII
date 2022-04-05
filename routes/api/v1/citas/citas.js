const express = require('express');
const router = express.Router();

const Citas = require('../../../../dao/citas/citas.model');
const citaModel = new Citas();


router.get('/all', async (req, res) => {
  try {
    console.log("User Request", req.user);
    const rows = await citaModel.getAll();
    res.send(rows)
  } catch (ex) {
    console.log(ex);
    res.status(500).json({status:'failed'});
  }
});


router.get('/byid/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const row = await citaModel.getById(id);
    res.status(200).json({ status: 'ok', cita: row });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: 'failed' });
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


router.get('/byname/:name/:page/:items', async (req, res) => {
  const name = req.params.name;
  const page = parseInt(req.params.page, 10);
  const items = parseInt(req.params.items, 10);
  if (allowedItemsNumber.includes(items)) {
    try {
      const citas = await citaModel.getFaceted(page, items, {nombres: name});
      res.status(200).json({ docs: citas });
    } catch (ex) {
      console.log(ex);
      res.status(500).json({ status: 'failed' });
    }
  } else {
    return res.status(403).json({ status: 'error', msg: 'Not a valid item value (10,15,20)' });
  }

});


router.post('/new', async (req, res) => {
  const {diagnostico, precio, fecha} = req.body;
  try {
    rslt = await citaModel.new(diagnostico, precio, fecha);
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
    const { paciente, user, doctor, diagnostico, precio, fecha} = req.body;
    const { id } = req.params;
    const result = await citaModel.updateOne(id, paciente, user, doctor, diagnostico, precio, fecha);
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
    const result = await citaModel.deleteOne(id);
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