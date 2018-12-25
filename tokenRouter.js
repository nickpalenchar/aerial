let router = require('express').Router();
let db = require('./db');

let Users = db.model('Users');

router.post('/phone', (req, res) => {
  console.log('req.params ', req.params);
  console.log('obdy ', req.body)
  if (!req.params.phone) {
    return res.status(400).send();
  }
  user = Users.findOne({phone: req.params.phone});
  if (!user) {
    return res.status(403).send("You're phone number is not in the system. Ask the Admin about this");
  }
  // twillio send
  return res.status(200).send('OK');
})

module.exports = router;
