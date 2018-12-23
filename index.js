const app = require('express')();
const PORT = 3555;
const passport = require('passport');

app.get('/', (req, res) => res.send("Hello, World!"));



const AuthTokenStrategy = require('passport-auth-token');

// app.use('authtoken', new AuthTokenStrategy(
//   function (token, done) {
//     // find a token
//     done();
//   }
// ))
const service = require('./db/service');
let Users = service.model('Users');
Users.DEV_whoami()

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                               failureRedirect: '/login',
                               failureFlash: true
                             })
);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
