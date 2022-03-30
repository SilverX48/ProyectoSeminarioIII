const ObjectId = require('mongodb').ObjectId;
const getDb = require('../mongodb');

let db = null;
class Reservaciones {
    collection = null;
    
    constructor() {
      getDb()
        .then((database) => {
          db = database;
          this.collection = db.collection('Reservaciones');
          if (process.env.MIGRATE === 'true') {
          }
        })
        .catch((err) => { console.error(err) });
    }


    async new(fecha, descripcion) {
      const newReservacion = {
        fecha,
        descripcion
      };
      const rslt = await this.collection.insertOne(newReservacion);
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


    async getByDate(fecha) {
      const filter = {fecha};
      return await this.collection.findOne(filter);
    }


    async updateOne(id, fecha, descripcion) {
      const filter = {_id: new ObjectId(id)};
      const updateCmd = {
        '$set':{
          fecha,
          descripcion
        }
      };
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

module.exports = Reservaciones;
