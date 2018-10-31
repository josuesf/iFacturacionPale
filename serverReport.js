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
app.use(express.static('public'));
app.use('/static', express.static('formatos'));  
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.disable('x-powered-by');
app.use(session({ secret: '_secret_', cookie: { maxAge: 60 * 60 * 1000 }, saveUninitialized: false, resave: false }));
 
// configuration init jsreport
const reportingApp = express();
app.get('/', function (req, res) { 
  res.redirect('/reporting');
})

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
          dataDirectory: require('path').join(__dirname, 'formatos/default/reportes'),//almacena templates genericos para los reportes
          //dataDirectory: require('path').join(__dirname, 'formatos/default/recibos_tickets'),//almacena templates genericos de recibos y tickets
          //dataDirectory: require('path').join(__dirname, 'formatos/[RUC DE LA EMPRESA]/recibos_tickets'), //almacena templates para los recibos y tickets de una determinada empresa
          //dataDirectory: require('path').join(__dirname, 'formatos/[RUC DE LA EMPRESA]/reportes'), // almacena templates para otro tipo de reportes que no sean comprobantes o tickets de una determinada empresa
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

app.get('/prueba', function(req, res) { 
  //console.log("request")
  //console.log(req.body) 
  //console.log("configuracionb de "+GETCONFIG(app.locals.empresa[0].RUC))
  jsreport.render({
    template: {
      recipe: 'html-to-xlsx',
      engine: 'jsrender',
      content: fs.readFileSync(require('path').join('formatos/default/reportes/templates/ReporteXTotalCliente', 'content.html'), 'utf8'),
      //content: '<table><tr><td style="height: 50px; font-size: 35px">{{:foo}}</td><td>world</td></tr> <tr><td style="width: 20px; text-align:right">right</td><td>world</td></tr><tr><td>world</td><td>world</td></tr></table>'
    },
    data: {
      'NOMBRE':'PRUEBAAAA'
    },
    options: { preview: true }
  }).then(function (out) {
     

    out.stream.pipe(res)
  }).catch(function (e) {
    
    console.log("Errrrrrr",e)
    res.end(e.message);
  });
});

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
  return jsreport.render({
    template: {
      recipe: 'xlsx',
      engine: 'handlebars',
      content: '{{{xlsxPrint}}}',
      xlsxTemplate: {
        content: fs.readFileSync('prueba.xlsx').toString('base64')
      }
    }
  }).then(function (report) {
    report.stream.pipe(fs.createWriteStream('out.xlsx'))
  })
}).catch((e) => { 
  console.error(e);
});
  
//Listen Server
var server = app.listen(9000, function (err) {
  if (err) return console.log('Hubo un error'), process.exit(1);
  console.log('Escuchando en el puerto 9000');
})
  
  
 