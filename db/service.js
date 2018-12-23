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

  findOne(obj) {

  }

  _getAllDocuments() {

  }

  DEV_whoami() {
    console.log("Hello, I am working");
    console.log("my obj is \n", this)
  }
}

module.exports = new Service();
