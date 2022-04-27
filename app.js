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
    maxAge: 1000 * 100,
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

// user routes
app.get('/userProfile/:id', (req, res) => {
    const userId = req.params.id;

    User.findById(userId)
    .then((userResult) => {
        Blog.find().sort({createdAt: -1})
        .then((result) => {
            res.render('userProfile', {blogs: result, user: userResult})
        })
        .catch((err) => {
            console.log(err)
        })
    })
    .catch((err) => {
        console.log(err)
        res.render('404')
    })
})

app.get('/myBlogs/:id', (req, res) => {
    const userId = req.params.id;

    User.findById(userId)
    .then((userResult) => {
        console.log(userResult)
        Blog.find().sort({createdAt: -1})
        .then((result) => {
            res.render(`myBlogs`, {blogs: result, user: userResult})
        })
        .catch((err) => {
            console.log(err)
        })
    })
    .catch((err) => {
        console.log(err)
        res.render('404')
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

// create routes
app.get('/create/:id', (req, res) => {
    const userId = req.params.id;

    User.findById(userId)
        .then((userResult) => {
            res.render('create', {user: userResult})
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post('/create', async (req, res) => {
    let findUser = await User.findOne({id: req.params._id});
    if(findUser) {
        const blog = new Blog({
            userId: findUser._id,
            title: req.body.title,
            body: req.body.body,
        });
        blog.save()
            .then((result) => {
                console.log(result)
                res.redirect(`userProfile/${findUser._id}`)
            })
            .catch((err) => {
                console.log(err)
        });
    } else {
        console.log('error')
    }
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
                res.redirect(`userProfile/${result._id}`)
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
            req.session.id = findUser._id;
            res.redirect(`userProfile/${findUser._id}`)
        } else {
            res.send('Incorrect username or password')
        }
    } catch {
        res.status(500).send('An error Occured')
    }
})

//error route
app.use((req, res) => {
    res.status(404).render('404');
})