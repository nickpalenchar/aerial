const app = require('express')();
const PORT = 3555;
const passport = require('passport');
const { authenticate } = require('./authTokenStrategy');

app.get('/', (req, res) => res.send("Hello, World!"));

let LocalStrategy = require('passport-local-token')



app.use('/token', require('./tokenRouter'));

app.get('/login', (req, res) => res.send('login page'));

app.get('/me', authenticate, (req, res) => res.send(req.user));

app.post('/login', (req, res, next) => {
  console.log(3242343223);
  next();
},
  passport.authenticate('local-token', {
  successRedirect: '/yes',
  failureRedirect: '/no',
}))


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
