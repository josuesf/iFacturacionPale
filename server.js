var express = require('express');
var multer  = require('multer');
var ext = require('file-extension');
var bodyParser = require("body-parser");
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
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.get('/', function (req, res) {
  res.render('index', { title: 'iFacturacion' });
})
app.get('/usuarios', function (req, res) {  
  res.render('index', { title: 'iFacturacion - Usuarios' });
})
//Routes
var usuarios_api = require('./routes/api-usuarios')
var cajas_api = require('./routes/api-cajas')
var modulos_api = require('./routes/api-modulos')
var sucursales_api = require('./routes/api-sucursales')
var perfiles_api = require('./routes/api-perfiles')
app.use('/usuarios_api', usuarios_api);
app.use('/cajas_api', cajas_api);
app.use('/modulos_api', modulos_api);
app.use('/sucursales_api', sucursales_api);
app.use('/perfiles_api', perfiles_api);
//Listen Server
app.listen(3000, function (err) {
  if (err) return console.log('Hubo un error'), process.exit(1);
  console.log('Escuchando en el puerto 3000');
})