var { LOGIN_SQL,
      EXEC_SQL_DBMaster,
      EXEC_SQL,
      EXEC_SQL_OUTPUT } = require('./utility/exec_sp_sql')

var { UnObfuscateString, CambiarCadenaConexion } = require('./utility/tools')
var  GETCONFIG  = require('./src/constantes_entorno/constantes')

var express = require('express');
var multer = require('multer');
var ext = require('file-extension');
var bodyParser = require("body-parser");
var session = require('express-session'); 

const fs = require('fs');   
 

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, +Date.now() + '.' + ext(file.originalname))
  }
})
var upload = multer({ storage: storage }).single('picture');
var app = express();
var errores = '';
//app.set('view engine', 'ejs'); 
app.use(express.static('public'));
app.use('/static', express.static('formatos'));  
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.disable('x-powered-by');
app.use(session({ secret: '_secret_', cookie: { maxAge: 60 * 60 * 1000 }, saveUninitialized: false, resave: false }));
// app.use(authChecker);
 
// configuration init jsreport
const reportingApp = express();
app.use('/reporting', reportingApp);

jsreport = require('jsreport-core')(
  {
    tempDirectory: require('path').join(__dirname, 'formatos/temp'),
    store: {
      provider: 'fs'
    },
    logger: {
      'console': { 'transport': 'console', 'level': 'debug' }
    },
    extensions: {
        express: { app: reportingApp, server: server },
        'fs-store': {
          dataDirectory: require('path').join(__dirname, 'formatos/default'),
          syncModifications: true
        },
        'authentication' : {
            "cookieSession": {
                "secret": "dasd321as56d1sd5s61vdv32"        
            },
            "admin": {
                "username" : "palerp",
                "password": "palerp123"
            }
        }
    },
    appPath: "/reporting"
  }
);

/*jsreport.use(require('jsreport-import-export')());
jsreport.use(require('jsreport-tags')());
jsreport.use(require('jsreport-templates')());
jsreport.use(require('jsreport-jsrender')());
jsreport.use(require('jsreport-authentication')());
jsreport.use(require('jsreport-handlebars')());
jsreport.use(require('jsreport-cli')());
jsreport.use(require('jsreport-freeze')());
jsreport.use(require('jsreport-debug')()); 
jsreport.use(require('jsreport-express')()); 
jsreport.use(require('jsreport-fop-pdf')());
jsreport.use(require('jsreport-pdf-utils')());
jsreport.use(require('jsreport-data')());
jsreport.use(require('jsreport-chrome-pdf')());
jsreport.use(require('jsreport-html-to-xlsx')());
jsreport.use(require('jsreport-child-templates')());
jsreport.use(require('jsreport-browser-client')());
jsreport.use(require('jsreport-licensing')());
jsreport.use(require('jsreport-authorization')());
jsreport.use(require('jsreport-version-control')());
jsreport.use(require('jsreport-assets')());
jsreport.use(require('jsreport-reports')());
jsreport.use(require('jsreport-text')());
jsreport.use(require('jsreport-base')()); 
jsreport.use(require('jsreport-studio')());
jsreport.use(require('jsreport-fs-store')())
jsreport.use(require('jsreport-scripts')());

jsreport.use(require('jsreport-scheduling')());
jsreport.use(require('jsreport-xlsx')());
jsreport.use(require('jsreport-sample-template')());
jsreport.use(require('jsreport-resources')());
jsreport.use(require('jsreport-public-templates')()); */


jsreport.init().then(() => { 
  console.log('jsreport server started')
}).catch((e) => { 
  console.error(e);
});
  
//Listen Server
var server = app.listen(9000, function (err) {
  if (err) return console.log('Hubo un error'), process.exit(1);
  console.log('Escuchando en el puerto 9000');
})
  
  
 