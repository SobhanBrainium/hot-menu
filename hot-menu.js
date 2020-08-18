var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var fs = require('fs');
var http = require('http');
var https = require('https');
const config = require('./config');
const mongoose = require('mongoose');
var cors = require('cors');
const corsMiddleWare = require('./middlewares/cors-middleware');
const os = require('os')
var hostName = os.hostname()


var app = express();
app.use(cors());

//======== Create Server Starts =======//

if (hostName == 'nodeserver.brainiuminfotech.com') {
    var credentials = {
        key: fs.readFileSync('/etc/letsencrypt/live/nodeserver.mydevfactory.com/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/nodeserver.mydevfactory.com/fullchain.pem', 'utf8')
    };

    var server = https.createServer(credentials, app);

} else {
    var server = http.createServer(app);
}

//======== Create Server ends =======//

app.use(logger('dev'));


//====== Add Middleware for Rest Starts ======//
// app.use(express.json({ extended: true, limit: '200000kb', parameterLimit: 200000 * 100 }));
// app.use(express.urlencoded({ extended: true, limit: '200000kb', parameterLimit: 200000 * 100 }));
    
app.use(bodyParser.json({extended: true, limit: '200000kb', parameterLimit: 200000 * 100}));
app.use(bodyParser.urlencoded({extended: true, limit: '200000kb', parameterLimit: 200000 * 100}));
app.use(fileUpload());
//====== Add Middleware for Rest Ends ======//

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//===== CORS Support Statrs =====//
app.use(corsMiddleWare);
//===== CORS Support Ends =====//

//==== Load Router =====//

const customerRoutes = require('./routes/customers');
app.use('/api/customer',customerRoutes);


//===== MongoDB Connection starts =====//
const productionDBString = `mongodb://${config.production.username}:${config.production.password}@${config.production.host}:${config.production.port}/${config.production.dbName}?authSource=${config.production.authDb}`;

var options = {useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true};


mongoose.connect(productionDBString, options, function(err) {
    if(err) {
        console.log('Mongo db connection failed');
    } else {
        console.log('Connected to mongo db');
    }
});

/** Mongo on connection emit */
mongoose.connection.on('connect', function() {
    console.log('Mongo Db connection success');
});

/** Mongo db error emit */
mongoose.connection.on('error', function(err) {
    console.log(`Mongo Db Error ${err}`);
});

/** Mongo db Retry Conneciton */
mongoose.connection.on('disconnected', function() {
    console.log('Mongo db disconnected....trying to reconnect. Please wait.....');
    mongoose.createConnection();
})
//===== MongoDB Connection ends =====//

mongoose.set('debug', true)

app.set('port', config.port);
server.listen(app.get('port'), function(err) {
    if (err) {
        throw err;
    } else {
        console.log(`Hot menu server is running and listening to ${config.serverhost}:${app.get('port')} `);
    }
});

server.timeout = 500000;
