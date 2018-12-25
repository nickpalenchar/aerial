let db = require('./db');
let Tokens = db.model('Tokens');
let Users = db.model('Users');

module.exports.authenticate = function(req, res, next) {
  let uid = req.header('Authentication');
  console.log('>P>>>', uid);
  let token = Tokens.findOne({uid}).document;
  console.log('token ', token);
  if (!token) {
    return res.redirect('/login');
  }
  let user = Users.findOne({id: token.user});
  if (!user) {
    return res.redirect('/login');
  }
  req.user = user.document;
  next();
}
