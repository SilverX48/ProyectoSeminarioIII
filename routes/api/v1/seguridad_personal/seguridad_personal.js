const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Personal = require('../../../../dao/personal/personal.model');
const personalModel = new Personal();


router.get('/all', async (req, res) => {
    try {
        console.log("User Request", req.user);
        const rows = await personalModel.getAll();
        res.status(200).json({status:'ok', personal: rows});
    } catch (ex) {
        console.log(ex);
        res.status(500).json({status:'failed'});
    }
});


router.post('/new_user', async (req, res)=>{
  try {
    const {identidad, nombre_completo, fecha_nacimiento, email, user, password, rol, estado} = req.body;

    let rslt = await personalModel.new(identidad, nombre_completo, fecha_nacimiento, email, user, password, rol, estado);

    res.status(200).json({status: 'success', result: rslt});
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});


router.post('/login', async (req, res)=>{
  try {
    const { user, password } = req.body;
    const userInDb = await personalModel.getByUser(user);
    
    if (userInDb) {
      const isPasswordValid = await personalModel.comparePassword(password, userInDb.password);
      
      if (isPasswordValid) {
        const {user, rol, _id} = userInDb;
        const payload = {
          jwt: jwt.sign({ user, rol, _id }, process.env.JWT_SECRET),
          user: { user, rol, _id }
        }

        res.status(200).json(payload);
        console.log(payload);
      } else {
        res.status(400).json({ status: 'failed', error: 2 });
      }
    } else {
      res.status(400).json({ status: 'failed', error: 1 });
    }
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});


router.put('/update/:id', async (req, res) => {
  try{
    const {identidad, nombre_completo, fecha_nacimiento, email, user, password, rol, estado} = req.body;
    const { id } = req.params;
    const result = await personalModel.updateOne(id, identidad, nombre_completo, fecha_nacimiento, email, user, password, rol, estado);
    res.status(200).json({
      status:'ok',
      result
    });
  } catch(ex){
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await personalModel.deleteOne(id);
    res.status(200).json({
      status: 'ok',
      result
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: 'failed' });
  }
})


module.exports = router;

