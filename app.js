const express = require('express');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const User = require('./models/user');
const Blog = require('./models/blog');
const { render } = require('ejs');

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
app.use(cookieSession({
    maxAge: 1000 * 10,
    secret: 'aVeryS3cr3tK3y',
    httpOnly: true,
    secure: false,
}))

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

app.get('/userProfile', (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then((result) => {
        res.render('userProfile', {blogs: result})
    })
    .catch((err) => {
        console.log(err)
    })
})

app.get('/myBlogs', (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then((result) => {
        res.render('myBlogs', {blogs: result})
    })
    .catch((err) => {
        console.log(err)
    })
})

app.get('/myBlogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', {blog: result})
        })
        .catch((err) => {
            console.log(err);
        })
})

app.delete('/myBlogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({
                redirect: '/myBlogs',
            });
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/myBlogs/edit/:id', (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
        .then((result) => {
            res.render('edit', {blog: result})
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post('/myBlogs/edit/:id', (req, res) => {
    const query = {_id:req.params.id};

    let blogpost = {};
    blogpost.title = req.body.title;
    blogpost.body = req.body.body;

    Blog.updateOne(query, blogpost)
        .then((result) => {
            res.redirect('/myBlogs')
        })
        .catch((err) => {
            console.log(err);
        })
})

// register routes
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    let findUser = await User.findOne({email: req.body.email});
    if(findUser) {
        return res.status(409).send('User with that email already exists')
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
        });
        user.save()
            .then((result) => {
                console.log(result)
                res.redirect('userProfile')
            })
            .catch((err) => {
                console.log(err)
        });
    }
})

// login routes
app.get('/login', (req, res) => {
    res.render('login')
})
 
app.post('/login', async (req, res) => {
    const findUser = await User.findOne({email: req.body.email})
    if(findUser == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, findUser.password)) {
            res.redirect('userProfile')
        } else {
            res.send('Incorrect username or password')
        }
    } catch {
        res.status(500).send('An error Occured')
    }
})

// create routes
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