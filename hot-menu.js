var express = require('express');
const session = require("express-session")
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
const exphbs = require("express-handlebars")
const handlebars = require("handlebars")
const layouts = require("handlebars-layouts")
const passport = require("passport")
const flash = require("connect-flash")
handlebars.registerHelper(layouts(handlebars))


var app = express();
app.use(cors());

//======== Create Server Starts =======//
console.log(hostName, 'hostname')
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



require('./middlewares/passport')(passport);

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//#region  hbs setup
var hbs = exphbs.create({
  extname: '.hbs', //we will be creating this layout shortly
  helpers: {
    inc :function(value, options){
      return parseInt(value) + 1;
    },
      if_eq: function (a, b, opts) {
        if (a == b) // Or === depending on your needs
          return opts.fn(this);
        else
          return opts.inverse(this);
      },
      if_neq: function (a, b, opts) {
        if (a != b) // Or === depending on your needs
          return opts.fn(this);
        else
          return opts.inverse(this);
      },
      inArray: function(array, value, block) {
        if (array.indexOf(value) !== -1) {
          return block.fn(this);
        }
        else {
          return block.inverse(this);
        }
      },
  
      for: function(from, to, incr, block) {
        var accum = 0;
        for(var i = from; i < to; i += incr)
            accum += block.fn(i);
        return accum;
      },
      total_price: function(v1, v2) {
        return v1 * v2;
      },
      ternary: (exp, ...a) => {
        return eval(exp);
      },
      eq: function (v1, v2) {
          return v1 == v2;
      },
      ne: function (v1, v2) {
          return v1 !== v2;
      },
      lt: function (v1, v2) {
          return v1 < v2;
      },
      gt: function (v1, v2) {
          return v1 > v2;
      },
      lte: function (v1, v2) {
          return v1 <= v2;
      },
      gte: function (v1, v2) {
          return v1 >= v2;
      },
      and: function (v1, v2) {
          return v1 && v2;
      },
      or: function (v1, v2) {
          return v1 || v2;
      },
      dateFormat: require('handlebars-dateformat'),
      inc: function(value, options) {
        return parseInt(value) + 1;
      },
      perc: function(value, total, options) {
          return Math.round((parseInt(value) / parseInt(total) * 100) * 100) / 100;
      },
      img_src: function(value, options) {
        if (fs.existsSync("public/events/"+value) && value != "") {
          return "/events/"+value;
        }
        else {
          return "/admin/assets/img/pattern-cover.png";
        }
      },
  
      events: function() {
        return Event.find({}, { event_name: 1 }).map(function (event) {
          return event
        });
      },
      profile_src: function(value, options) {
        if (fs.existsSync("public/profile/"+value) && value != "") {
          return "/profile/"+value;
        }
        else {
          return "/admin/assets/img/pattern-cover.png";
        }
      },
      product_img: function(value, options) {
        if (fs.existsSync("public/product/"+value) && value != "") {
          return "/product/"+value;
        }
        else {
          return "/admin/assets/img/pattern-cover.png";
        }
      },
      formatCurrency: function(value) {
        return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      },
      twoDecimalPoint: function(value){
          return parseFloat(Math.round(value * 100) / 100).toFixed(2);  
      },
      fiveDecimalPoint: function(value){
        return parseFloat(Math.round(value * 100) / 100).toFixed(5);
      },
      nFormatter: function (num, digits) {
        var si = [{
            value: 1,
            symbol: ""
          },
          {
            value: 1E3,
            symbol: "k"
          },
          {
            value: 1E6,
            symbol: "M"
          },
          {
            value: 1E9,
            symbol: "B"
          },
          {
            value: 1E12,
            symbol: "T"
          },
          {
            value: 1E15,
            symbol: "P"
          },
          {
            value: 1E18,
            symbol: "E"
          }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
          if (num >= si[i].value) {
            break;
          }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
      },
      toLowerCase: function(value){
        return value.toLowerCase();
      },
      toUpperCase: function(value){
        return value.toUpperCase();
      },
      checkCurrencies: function(value, arr) {
        var tempArr = lodash.filter(arr, x => x.Currency.alt_name === value);
        //return tempArr.length > 0 ? tempArr[0].balance : '';
        return tempArr.length > 0 ? tempArr[0].balance : '0.00';
      },
      checkAnswer: function(value, arr) {
        var tempArr = lodash.filter(arr, x => x.option_id === value);
        return tempArr.length > 0 ? true : false;
      },
      getUploadedFileExtension: function(value){
  
        if(value != null){
          return value.substr(value.lastIndexOf('.') + 1);
        }
        
      },
  
      multiple_if: function(){
        const args = Array.prototype.slice.call(arguments, 0, -1);
        return args.every(function (expression) {
            return args[0] === expression;
        });
      },
      empty_array: function(arr, opts) {
        if (arr.length <= 0)
          return opts.fn(this);
        else
          return opts.inverse(this);
        
      },
      not_empty_array: function(arr, opts) {
        if (arr.length > 0)
          return opts.fn(this);
        else
          return opts.inverse(this);
      }
    }
});
//#endregion

app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');


//====== Add Middleware for Rest Starts ======//
// app.use(express.json({ extended: true, limit: '200000kb', parameterLimit: 200000 * 100 }));
// app.use(express.urlencoded({ extended: true, limit: '200000kb', parameterLimit: 200000 * 100 }));
    
// app.use(bodyParser.json({extended: true}));
// app.use(bodyParser.urlencoded({}));
// app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())
app.use(fileUpload({
  limits : {
    fileSize : 5000000  //5mb
  },
  abortOnLimit : true,
  responseOnLimit : "File size maximum 5MB"
}));

app.use(session({
	secret: 'W$q4=25*8%v-}UV',
	resave: false,
    saveUninitialized: true,
    cookie: {
        path: "/",
        // maxAge: 1800000
    },
    name: "id",
    ttl: (1* 60* 60)
})); // session secret

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//====== Add Middleware for Rest Ends ======//

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//===== CORS Support Statrs =====//
app.use(corsMiddleWare);
//===== CORS Support Ends =====//

//==== Load Router =====//

const customerRoutes = require('./routes/customers');
app.use('/api/customer',customerRoutes);

//#region Admin routes
const adminIndexRoute = require('./routes/admin/index');
app.use(adminIndexRoute)
//#endregion



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
