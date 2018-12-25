let db = require('./db');
let UIDGenerator = require('uid-generator');

let tokenId = new UIDGenerator();

Users = db.model('Users');
Tokens = db.model('Tokens');

let me = Users.findOne({firstName: 'Nick'});

me.document.test = 'yoy';

me.save();
