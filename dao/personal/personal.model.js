const ObjectId = require('mongodb').ObjectId;
const getDb = require('../mongodb');
const bcrypt = require('bcrypt');

let db = null;
class Personal {
  collection = null;
  
  constructor() {
        getDb()
        .then((database) => {
            db = database;
            this.collection = db.collection('Personal');
            if (process.env.MIGRATE === 'true') {
                this.collection.createIndex({"user":1},{ unique: true})
                .then((rslt)=>{
                    console.log("Indices creados", rslt);
                }
                )
                .catch((err)=>{
                    console.error("Error al crear indice", err);
                });
            }
        })
        .catch((err) => { console.error(err) });
    }


    async new(identidad, nombre_completo, fecha_nacimiento, email, user, password, rol, estado) {
        const newPersonal = {
            identidad,
            nombre_completo,
            fecha_nacimiento,
            email,
            user,
            password: await this.hashPassword(password),
            rol,
            estado
        };
        const rslt = await this.collection.insertOne(newPersonal);
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


    async getByIdentidad(identidad) {
        const filter = {identidad};
        return await this.collection.findOne(filter);
    }


    async getByName(nombre_completo) {
        const filter = {nombre_completo};
        return await this.collection.findOne(filter);
    }


    async getByUser(user){
        const filter = {user};
        return await this.collection.findOne(filter);
    }


    async updateOne(id, identidad, nombre_completo, fecha_nacimiento, email, user, password, roles, estado) {
        const filter = {_id: new ObjectId(id)};
        const updateCmd = {
        '$set':{
            identidad,
            nombre_completo,
            fecha_nacimiento,
            email,
            user,
            password : await this.hashPassword(password),
            roles,
            estado
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


    async hashPassword(rawPassword){
        return await bcrypt.hash(rawPassword, 10);
    }


    async comparePassword (rawPassword, dbPassword) {
        return await bcrypt.compare(rawPassword, dbPassword);
    }
}

module.exports = Personal;
