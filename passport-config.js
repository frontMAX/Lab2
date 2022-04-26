// const { authenticate } = require('passport');
// const bcrypt = require('bcrypt');

// const LocalStrategy = require('passport-local').Strategy;


// function initialize(passport, getUserByEmail) {
//     const authenticateUser = (email, password, done) => {
//         const user = getUserByEmail(email)
//         if(user == null) {
//             return done(null, false, { message: 'No user with that email' })
//         }
//         try {
//             if(await bcrypt.compare(password, user.password)) {
//                 return done(null, user)
//             } else {
//                 return done(null, false, { message: 'password incorrect' })
//             }
//         }
//         catch(err){
//             return done(err)
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

// module.exports = initialize;