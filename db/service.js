let path = require('path');
let shell = require('shelljs');

console.log('>>> ', shell)

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

  find(queryObj) {

    return this._getAllDocumentIds()
      .map(id => this.findById(id))
      .filter(doc => this._matchesQueryObject(queryObj, doc));

  }
  findOne(queryObj) {
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
      return {}
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

module.exports = new Service();
