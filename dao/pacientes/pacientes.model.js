const ObjectId = require('mongodb').ObjectId;
const getDb = require('../mongodb');

let db = null;
class Pacientes {
  collection = null;
  
  constructor() {
    getDb()
      .then((database) => {
        db = database;
        this.collection = db.collection('Pacientes');
        if (process.env.MIGRATE === 'true') {
        }
      })
      .catch((err) => { console.error(err) });
  }

  async new(identidad, nombre_completo, telefono, fecha_nacimiento, email) {
    const newPaciente = {
      identidad,
      nombre_completo,
      telefono,
      fecha_nacimiento,
      email
    };
    const rslt = await this.collection.insertOne(newPaciente);
    return rslt;
  }


  async getAll() {
    const cursor = this.collection.find({});
    const documents = await cursor.toArray();
    return documents;
  }


  async getFaceted(page, items, filter = {}) {
    const cursor = this.collection.find(filter);
    const totalItems = await cursor.count();
    cursor.skip((page -1) * items);
    cursor.limit(items);
    const resultados = await cursor.toArray();
    return {
      totalItems,
      page,
      items,
      totalPages: (Math.ceil(totalItems / items)),
      resultados
    };
  }


  async getById(id) {
    const _id = new ObjectId(id);
    const filter = {_id};
    console.log(filter);
    const myDocument = await this.collection.findOne(filter);
    return myDocument;
  }


  async updateOne(id, identidad, nombre_completo, telefono, fecha_nacimiento, email) {
    const filter = {_id: new ObjectId(id)};
    const updateCmd = {
      '$set':{
      identidad,
      nombre_completo,
      telefono,
      fecha_nacimiento,
      edad,
      id_seguro,
      seguro,
      email
      }
    };
    return await this.collection.updateOne(filter, updateCmd);
  }


  async updateAddTag(id, tagEntry){
    const updateCmd = {
      "$push": {
        tags: tagEntry
      }
    }
    const filter = {_id: new ObjectId(id)};
    return await this.collection.updateOne(filter, updateCmd);
  }


  async updateAddTagSet(id, tagEntry) {
    const updateCmd = {
      "$addToSet": {
        tags: tagEntry
      }
    }
    const filter = { _id: new ObjectId(id) };
    return await this.collection.updateOne(filter, updateCmd);
  }


  async deleteOne(id) {
    const _id = new ObjectId(id);
    const filter = {_id};
    console.log(filter);
    const result = await this.collection.deleteOne(filter);
    return result;
  }
}

module.exports = Pacientes;
