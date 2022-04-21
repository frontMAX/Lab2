const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/user');
const Blog = require('./models/blog');

// express app
const app = express();

//connect mongoDB
const dbUrl = 'mongodb+srv://abc:123@userdb.bmzdc.mongodb.net/userDB?retryWrites=true&w=majority';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set('views', './views');
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//routes
app.get('/', (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then((result) => {
        res.render('home', {blogs: result})
    })
    .catch((err) => {
        console.log(err)
    })
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('create')
        })
        .catch((err) => {
            console.log(err)
        });
})

//error route
app.use((req, res) => {
    res.status(404).render('404');
})












// // Delete a note with the specified noteId in the request
// exports.delete = (req, res) => {
//     Note.findByIdAndRemove(req.params.noteId)
//     .then(note => {
//         if(!note) {
//             return res.status(404).send({
//                 message: "Note not found with id " + req.params.noteId
//             });
//         }
//         res.send({message: "Note deleted successfully!"});
//     }).catch(err => {
//         if(err.kind === 'ObjectId' || err.name === 'NotFound') {
//             return res.status(404).send({
//                 message: "Note not found with id " + req.params.noteId
//             });                
//         }
//         return res.status(500).send({
//             message: "Could not delete note with id " + req.params.noteId
//         });
//     });
// };