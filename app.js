require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const cors = require('cors')




// mongoose
//   .connect('mongodb://localhost/remBillsApp', {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
//   .catch(err => console.error('Error connecting to mongo', err));




const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
require('./config/db.config');



//cross-origin
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true //this needs set up on the frontend side as well in axios with credentials true
  })
)

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// use session here
require('./config/session.config')(app);
// Set up passport
require('./config/passport.config')(app);


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'my-logo.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


//Routes
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/offLineAccount'));
app.use('/', require('./routes/authentication.routes'));
app.use('/', require('./routes/plaid.routes'));
app.use('/', require('./routes/CreditReminder.routes'));
app.use('/', require('./routes/OffLineAccountReminder.routes'));


// mongoose.connection.on('open', function (ref) {
//   console.log('Connected to mongo server.');
//   //trying to get collection names
//   mongoose.connection.db.listCollections().toArray(function (err, names) {
//     console.log(names);
//   })
// })

module.exports = app;
