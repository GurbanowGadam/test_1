const express = require('express');
const port = 3000;
const host = 'localhost';
const exphbs = require('express-handlebars')
const app = express();
const fileUpload = require('express-fileupload');
const moment = require('moment');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
// const genereteDate=require('./helpers/genereteDate').genereteDate;
// const limit = require('./helpers/limit').limit;
// const truncate = require('./helpers/truncate').truncate;
const { genereteDate, limit, truncate, paginate } = require('./helpers/hbs')


const main = require('./router/main');
const posts = require('./router/posts');
const users = require('./router/users');
const admin = require('./router/admin/admin-router');
const contact = require('./router/contact');

//public package
app.use(express.static('public'));

//database connect
mongoose.connect('mongodb://localhost:27017/group', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//app.set('trust proxy', 1) // trust first proxy
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
    store: MongoStore.create({
        mongoUrl: `mongodb://${host}/group`,
        autoRemove: 'native' // Default
    })
}))

// Display link middleware
app.use((req, res, next) => {
    const { userId } = req.session
    if (userId) {
        res.locals = {
            displayLink: true
        }
    }
    else {
        res.locals = {
            displayLink: false
        }
    }
    next()
})

// message middlewaer
app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
})


// default options
app.use(fileUpload());

//view engine register
const hbs = exphbs.create({
    helpers:{
        genereteDate:genereteDate,
        limit: limit,
        truncate: truncate,
        paginate: paginate
    }
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars');
app.set('views', './views');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// override with POST having ?_method=DELETE
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))

app.use('/', main);
app.use('/posts', posts);
app.use('/users', users);
app.use('/admin', admin)
app.use('/contact', contact);

app.listen(port, host, () => console.log(`server isleya http://${host}:${port}`));