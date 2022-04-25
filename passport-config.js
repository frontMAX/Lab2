// const { authenticate } = require('passport');

// const LocalStrategy = require('passport-local').Strategy;


// function initialize(passport) {
//     const authenticateUser = (username, password, done) => {
//         const user = getUserByUsername(username)
//         if(user == null) {
//             return done(null, false, { message: 'No user with that email' })
//         }
//     }
//     passport.use(new LocalStrategy(
//         {
//             usernameField: 'email',
//         }
//     ), authenticateUser)
//     passport.serializeUser((user, done) => { })
//     passport.deserializeUser((id, done) => { })
// }