var express = require('express');
var multer = require('multer');
var ext = require('file-extension');
var bodyParser = require("body-parser");
var session = require('express-session');
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
app.disable('x-powered-by');
app.use(session({ secret: '_secret_', cookie: { maxAge: 60 * 60 * 1000 }, saveUninitialized: false, resave: false }));
// app.use(authChecker);
 

app.get('/', function (req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
  } else
    res.render('index_procesos', { title: 'iFacturacion - Procesos',Cod_Usuarios:req.session.username,Nick:req.session.nick });
})
app.get('/administracion', function (req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
  } else
    res.render('index', { title: 'iFacturacion',Cod_Usuarios:req.session.username,Nick:req.session.nick });
})

var { Ejecutar_Procedimientos_DBMaster, EXEC_SQL_DBMaster, EXEC_QUERY_DBMaster } = require('./utility/exec_sp_sql')
app.get('/login', function (req, res) {
  if (req.session && req.session.authenticated) {
    return res.redirect('/');
  }  
  
  EXEC_QUERY_DBMaster('SELECT * FROM PRI_EMPRESA', [], function (o) {
    if (o.error) return null 
    p = [
        { nom_parametro: 'RUC', valor_parametro: o.result.RUC }
    ]

    EXEC_SQL_DBMaster('USP_PRI_EMPRESA_TXRUC', p, function (m) {
      res.render('login.ejs', { title: 'iFacturacion - Usuarios' , empresa : m.result });
        return m.result
    })
  }) 
})
var { LOGIN_SQL } = require('./utility/exec_sp_sql')
app.post('/login', function (req, res) {
  LOGIN_SQL(req.body.usuario, req.body.password, function (e) {
    if (e.err) return res.render('login.ejs', { title: 'iFacturacion - Usuarios',err:e.err });
    req.session.authenticated = true;
    req.session.username = e.Cod_Usuarios
    req.session.nick = e.Nick
    return res.redirect('/');
  })
})
app.get('/logout', function (req, res) {
  delete req.session.authenticated;
  res.redirect('/');
});
//Routes
var usuarios_api = require('./routes/api-usuarios')
var cajas_api = require('./routes/api-cajas')
var modulos_api = require('./routes/api-modulos')
var sucursales_api = require('./routes/api-sucursales')
var perfiles_api = require('./routes/api-perfiles')
var parametros_api = require('./routes/api-parametros')
var empresa_api = require('./routes/api-empresa')
var categorias_api = require('./routes/api-categorias')
var turnos_api = require('./routes/api-turnos')
var almacenes_api = require('./routes/api-almacenes')
var conceptos_api = require('./routes/api-conceptos')
var productos_serv_api = require('./routes/api-productos_serv')
var clientes_api = require('./routes/api-clientes')
var cuentas_bancarias_api = require('./routes/api-cuentas_bancarias')
var movimientos_caja_api = require('./routes/api-movimientos_caja')
var recibo_iegreso_api = require('./routes/api-recibo_iegreso')
var envios_api = require('./routes/api-envios')

// Routes Procesos
var compra_venta_moneda_extranjera_api = require('./routes/api-compra-venta-moneda-extranjera')

function authChecker(req, res, next) {
  if ((req.session && req.session.authenticated)||req.path==='/login') {
      next();
  } else {
      res.render('login.ejs', { title: 'iFacturacion - Usuarios' });
  }
}
app.use('/usuarios_api',usuarios_api);
app.use('/cajas_api', cajas_api);
app.use('/modulos_api', modulos_api);
app.use('/sucursales_api', sucursales_api);
app.use('/perfiles_api', perfiles_api);
app.use('/parametros_api', parametros_api);
app.use('/empresa_api', empresa_api);
app.use('/categorias_api', categorias_api)
app.use('/turnos_api', turnos_api)
app.use('/almacenes_api', almacenes_api);
app.use('/conceptos_api', conceptos_api);
app.use('/productos_serv_api', productos_serv_api);
app.use('/clientes_api', clientes_api);
app.use('/cuentas_bancarias_api', cuentas_bancarias_api);
app.use('/movimientos_caja_api',movimientos_caja_api)

app.use('/compra_venta_moneda_extranjera_api', compra_venta_moneda_extranjera_api);
app.use('/recibo_iegreso_api',recibo_iegreso_api)
app.use('/envios_api', envios_api)


//Listen Server
var server = app.listen(3000, function (err) {
  if (err) return console.log('Hubo un error'), process.exit(1);
  console.log('Escuchando en el puerto 3000');
})


// var reportingApp = express();
// app.use('/reporting', reportingApp);
// var jsreport = require('jsreport')({
//   express: { app :reportingApp, server: server },
//   appPath: "/reporting"
// });
// jsreport.init().catch(function (e) {
//   console.error(e);
// });