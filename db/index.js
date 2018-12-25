let path = require('path');
let fs = require('fs');
let shell = require('shelljs');
const UIDGenerator = require('uid-generator');
const uid16 = new UIDGenerator(UIDGenerator.BASE16);

class Service {

  constructor(collectionName) {
    this.collectionName = collectionName
  }

  model(name) {
    console.log(shell.ls(__dirname));
    let models = shell.ls(__dirname).stdout.split('\n').filter(model => model);
    for (let i = 0; i < models.length; i++) {
      let model = models[i];
      if (name === model) {
        return new Service(model);
      }
    }
    throw new ReferenceError("No model by name of " + name);
  }

  createOne(obj) {
    let id = uid16.generateSync();
    if (this.findById(id)) {
      return this.createOne(obj);
    }
    if ('id' in obj) {
      throw new Error("Document cannot use reserved key 'id'");
    }
    obj.id = id;
    fs.writeFileSync(`${__dirname}/${this.collectionName}/${id}.json`, JSON.stringify(obj));
    return obj;
  }

  updateOne(queryObj, updateObj) {
    let docToUpdate = this._findOne(queryObj);
    console.log("TO UPDATE ", docToUpdate);
    if (!docToUpdate) {
      return null;
    }
    console.log('updateobj', updateObj);
    if ('id' in updateObj) {
      updateObj.id = docToUpdate.id;
    }
    console.log('doctupdate regiht be fore assign ', docToUpdate)
    let updatedObj = Object.assign({}, docToUpdate, updateObj);
    console.log("to update again ", updatedObj);
    console.log(path.join(__dirname, this.collectionName, updatedObj.id + '.json'))
    shell.rm(path.join(__dirname, this.collectionName, updatedObj.id + '.json'));
    fs.writeFileSync(`${__dirname}/${this.collectionName}/${updatedObj.id}.json`, JSON.stringify(updatedObj));
  }

  find(queryObj) {
    return this._getAllDocumentIds()
      .map(id => this.findById(id))
      .filter(doc => this._matchesQueryObject(queryObj, doc));

  }

  findOne(queryObj) {
    let obj = this._findOne(queryObj);
    return new Document(obj, this);
  }
  _findOne(queryObj) {
    let ids = this._getAllDocumentIds();
    for (let i = 0; i < ids.length; i++) {
      let doc = this.findById(ids[i]);
      if (this._matchesQueryObject(queryObj, doc)) {
        return doc
      }
    }
  }

  findById(id) {
    let docs = this._getAllDocumentIds();
    try {
      return require(path.join(__dirname, this.collectionName, id));
    }
    catch (e) {
      return null
    }
  }

  _matchesQueryObject(queryObj, obj) {
    for (let k in queryObj) {
      if (queryObj[k] !== obj[k]) {
        return false;
      }
    }
    return true;
  }

  _getAllDocumentIds() {
    return shell.ls(path.join(__dirname, this.collectionName))
      .stdout
      .split('\n')
      .map(filename => filename.replace(/\.json/,''))
      .filter(doc => doc);
  }

  DEV_whoami() {
    console.log("Hello, I am working");
    console.log("my obj is \n", this)
  }
}

class Document {
  constructor(obj, col) {
    this.document = obj;
    this.collection = col;
  }
  save() {
    this.collection.updateOne({'id': this.document.id}, this.document);
  }
}

module.exports = new Service();
