var { LOGIN_SQL,
      Ejecutar_Procedimientos_DBMaster, 
      EXEC_SQL_DBMaster, 
      EXEC_QUERY_DBMaster,
      EXEC_QUERY,
      EXEC_SQL,
      EXEC_SQL_OUTPUT } = require('./utility/exec_sp_sql')

var { UnObfuscateString, CambiarCadenaConexion, RUCValido, EmailValido } = require('./utility/tools')

var express = require('express');
var multer = require('multer');
var ext = require('file-extension');
var bodyParser = require("body-parser");
var session = require('express-session');
var PDFGeneratorAPI = require('pdf-generator-api');    

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
app.set('view engine', 'pug'); 
app.use(express.static('public')); 
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.disable('x-powered-by');
app.use(session({ secret: '_secret_', cookie: { maxAge: 60 * 60 * 1000 }, saveUninitialized: false, resave: false }));
// app.use(authChecker);
 

// configuration default
app.locals.isla = false
app.locals.apertura = false
app.locals.CierreCompleto = true
app.locals.caja = { Cod_Caja : null }
app.locals.turno = null
app.locals.sucursal = null
app.locals.arqueo = null
 

function CargarVariables(req,res){
  p = [
    { nom_parametro: 'Cod_Turno', valor_parametro: req.session.turno }
  ]
  EXEC_SQL('usp_CAJ_TURNO_ATENCION_TXPK', p , function (dataTurno) {
    if(dataTurno.result.length>0){
      app.locals.turno = dataTurno.result
      p = [
        { nom_parametro: 'Cod_Caja', valor_parametro: req.session.caja }
      ]

      EXEC_SQL('usp_CAJ_CAJAS_TXPK', p, function (dataCaja) {
        app.locals.caja = dataCaja.result
        p = [
          { nom_parametro: 'Cod_Sucursal', valor_parametro: dataCaja.result[0].Cod_Sucursal }
        ] 
        EXEC_SQL('usp_PRI_SUCURSAL_TXPK', p , function (dataSucursal) {
          app.locals.sucursal = dataSucursal.result
          p = [
            { nom_parametro: 'CodCaja', valor_parametro: dataCaja.result[0].Cod_Caja },
            { nom_parametro: 'CodTurno', valor_parametro:  req.session.turno }
          ] 
          EXEC_SQL('USP_CAJ_ARQUEOFISICO_TXCajaTurno', p , function (dataArqueoFisico) {
            if(dataArqueoFisico.result.length<=0){
              app.locals.arqueo = dataArqueoFisico.result
              p = [
                { nom_parametro: 'CodCaja', valor_parametro: dataCaja.result[0].Cod_Caja }
              ] 

              EXEC_SQL('USP_CAJ_ARQUEOFISICO_TNumeroSiguiente', p , function (dataNumero) {
                p = [
                  { nom_parametro: 'Cod_Caja', valor_parametro: dataCaja.result[0].Cod_Caja },
                  { nom_parametro: 'Cod_Turno', valor_parametro:  req.session.turno }
                ]
                EXEC_SQL('USP_CAJ_ARQUEOFISICO_TSaldoAnteriorXCajaTurno', p , function (dataSaldoAnterior) {
                  
                  if(dataSaldoAnterior.result.length==0){

                    EXEC_SQL('USP_VIS_MONEDAS_TT', [] , function (dataMonedas) {
                        res.render('loginarqueo.ejs', {  title: 'iFacturacion - Procesos', 
                                                          caja: app.locals.caja, 
                                                          turno:req.session.turno,
                                                          numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,
                                                          apertura:"Arqueo de "+app.locals.caja[0].Des_Caja+" para el Turno "+req.session.turno,
                                                          monedas: dataMonedas.result});                      
                    }) 
                  }else{

                    app.locals.CierreCompleto = app.locals.isla 
                    if(app.locals.CierreCompleto){

                      res.render('loginarqueo.ejs', { title: 'iFacturacion - Procesos', 
                                                      caja: app.locals.caja, 
                                                      turno:req.session.turno,
                                                      numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,
                                                      apertura:"Arqueo de "+app.locals.caja[0].Des_Caja+" para el Turno "+req.session.turno,
                                                      dataCierre: dataSaldoAnterior.result})
                    }else{
                      if(dataSaldoAnterior.result[0].Flag_Cerrado.toString().toUpperCase()=="TRUE"){
                        
                        res.render('loginarqueo.ejs', { title: 'iFacturacion - Procesos', 
                                                        caja: app.locals.caja, 
                                                        turno:req.session.turno,
                                                        numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,
                                                        apertura:"Arqueo de "+app.locals.caja[0].Des_Caja+" para el Turno "+req.session.turno,
                                                        dataCierre: dataSaldoAnterior.result})

                      }else{
                        errores = "No se Puede Aperturar el Turno "+ req.session.turno+ " sin antes Cerrar el Turno "+dataSaldoAnterior.result[0].Cod_Turno+".\n\nVuelva a intentarlo otra vez"
                        app.locals.isla = false
                        app.locals.apertura = false
                        app.locals.CierreCompleto = true
                        app.locals.caja = { Cod_Caja : null }
                        app.locals.turno = null
                        app.locals.sucursal = null
                        app.locals.arqueo = null
                        delete req.session.authenticated;
                        res.redirect('/login');
                      }
                    }
                  }
                })
              })

            // res.render('loginarqueo.ejs', { title: 'iFacturacion - Procesos', caja: app.locals.caja, turno:req.session.turno,apertura:"Arqueo de "+app.locals.caja[0].Des_Caja+" para el Turno "+req.session.turno});
            }else{
              
              p = [
                { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result[0].id_ArqueoFisico }
              ] 
              
              EXEC_SQL('usp_CAJ_ARQUEOFISICO_TXPK', p , function (dataArqueo) {
                  app.locals.arqueo = dataArqueo.result
                  res.render('index_procesos', {  title: 'iFacturacion - Procesos',
                                              Cod_Usuarios:req.session.username,
                                              Nick:req.session.nick });
              })
            }
            
          })
        })
      })
    }else{
      errores = "No existe el turno seleccionado"
      res.redirect('/logout');
    }                  
  })

}
 
app.get('/', function (req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
  } else{
    if(!app.locals.apertura){
      if (req.session.caja) {
        CargarVariables(req,res) 
      }else{
        errores = "No tiene asignada ninguna caja. No puede iniciar sesion en el sistema"
        res.redirect('/logout');
      }
    }else{
      res.render('index_procesos', {  title: 'iFacturacion - Procesos',
                                                Cod_Usuarios:req.session.username,
                                                Nick:req.session.nick });
    }
  }
})

app.get('/administracion', function (req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
  } else{
    if (req.session.caja) {
      res.render('index', { title: 'iFacturacion',
                            Cod_Usuarios:req.session.username,
                            Nick:req.session.nick });
    }else{
      res.redirect('/logout');
    }
  }
}) 


app.get('/login', function (req, res) {
  if (req.session && req.session.authenticated) {
    return res.redirect('/');
  }  
  const fecha = new Date()
  var anio = fecha.getFullYear() 

  EXEC_QUERY_DBMaster('SELECT * FROM PRI_EMPRESA', [], function (o) {
    if (o.err){ 
      return null
    }
    else{
      res.render('login.ejs', { title: 'iFacturacion - Usuarios ', empresa : o.result, gestion: anio , err:errores});
      return o.result
    }
    
  }) 
})


app.post('/login', function (req, res) {

  parametros = [
    { nom_parametro: 'RUC', valor_parametro: req.body.RUC }
  ]

  EXEC_SQL_DBMaster('USP_PRI_EMPRESA_TXRUC', parametros, function (m) {   
    if (m.err) {
      errores = "Ocurrio un error. Vuelva a intentarlo mas tarde"
      return res.redirect('/login');
    }else{
      if(m.result.length>0){
        CambiarCadenaConexion(UnObfuscateString(m.result[0].CadenaConexion))
        EXEC_SQL('USP_PRI_EMPRESA_TraerUnicaEmpresa', [], function (e) {
          if (e.err){
            errores = "Ocurrio un error. Vuelva a intentarlo mas tarde"
            return res.redirect('/login');
          } 
          var Cod_Empresa=e.result[0].Cod_Empresa
          p = [
            { nom_parametro: 'Cod_Empresa', valor_parametro: Cod_Empresa }
          ]

          EXEC_SQL('usp_PRI_EMPRESA_TXPK', p, function (e) {
            
            app.locals.empresa = e.result 
            global.empresa = e.result
            
            if(req.body.Gestion!=undefined && req.body.Periodo!=undefined && req.body.Turno!=undefined){
              LOGIN_SQL(req.body.usuario, req.body.password, function (e) {
                if (e.err) {
                  errores = e.err
                  return res.redirect('/login');
                }
          
                if (app.locals.isla){
          
                  pIsla = [
                    { nom_parametro: 'Cod_Usuario', valor_parametro: e.Cod_Usuarios },
                    { nom_parametro: 'Cod_Caja', valor_parametro: app.locals.caja.Cod_Caja }
                  ]
          
                  EXEC_SQL('USP_CAJ_CAJAS_TXUsuario', pIsla , function (dataCajaIsla) {
                    if (e.err) {
                      errores = dataCajaIsla.err
                      return res.redirect('/login'); 
                    }
          
                    if(dataCajaIsla.result.length>=1){
          
                      req.session.authenticated = true;
                      req.session.username = e.Cod_Usuarios
                      req.session.nick = e.Nick
                      req.session.turno = req.body.Turno
                      req.session.periodo = req.body.Periodo
                      req.session.gestion = req.body.Gestion
                      req.session.caja = app.locals.caja.Cod_Caja 
                      
                      CargarVariables(req,res)
          
                    }else{
                      app.locals.isla = false
                      app.locals.apertura = false
                      app.locals.CierreCompleto = true
                      app.locals.caja = { Cod_Caja : null }
                      app.locals.turno = null
                      app.locals.sucursal = null
                      app.locals.arqueo = null
                      delete req.session.authenticated;
                      errores = "No existe Relación de esta caja con el usuario Asignado.\n\n En caso que Desea agregarlo comuniquese con el administrador de sistemas."
                      return res.redirect('/login');
                    }
                  })
                }else{
          
                  req.session.authenticated = true;
                  req.session.username = e.Cod_Usuarios
                  req.session.nick = e.Nick
                  req.session.turno = req.body.Turno
                  req.session.periodo = req.body.Periodo
                  req.session.gestion = req.body.Gestion
                  
                  p = [
                    { nom_parametro: 'Cod_Usuarios', valor_parametro: req.session.username}
                  ]  
          
                  EXEC_SQL('USP_CAJ_CAJAS_TXCodCajero', p , function (e) {
                    if(e.result.length>0){
                      res.render('logincajas.ejs', { title: 'iFacturacion - Procesos',cajas:e.result ,mensaje:'Seleccione una de las cajas asignadas a este usuario'});
                    }else{
          
                      EXEC_SQL('USP_CAJ_CAJAS_TActivos', [] , function (m) {
                        if(m.result.length>0){
                          res.render('logincajas.ejs', { title: 'iFacturacion - Procesos',cajas:m.result ,mensaje:'El usuario no tiene ninguna caja asignada. Seleccione una caja activa de la lista e inicie sesion'});
                        }else{
                          errores = 'No existen cajas activas'
                          app.locals.isla = false
                          app.locals.apertura = false
                          app.locals.CierreCompleto = true
                          app.locals.caja = { Cod_Caja : null }
                          app.locals.turno = null
                          app.locals.sucursal = null
                          app.locals.arqueo = null
                          delete req.session.authenticated;
                          return res.redirect('/login');
                        }                     
                      })
          
                    }                
                  })
                  
                }
          
              })
            }else{
              errores = "Todos los campos son necesarios"
              return res.redirect('/login');
            }
        
          })
        })
      }else{
        errores = "No se encontro la empresa con el RUC indicado"
        return res.redirect('/login');
      }
    }
  })

})
 

app.post('/logincajas', function (req, res) {
  if (!req.session || !req.session.authenticated) {
    return res.redirect('/');
  }else{
    req.session.caja = req.body.Caja
    return res.redirect('/');
  } 
})

app.post('/loginarqueo', function (req, res) {
  if (!req.session || !req.session.authenticated) {
    return res.redirect('/');
  }else{ 

    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)

    var Numero = req.body.Numero
    var Des_ArqueoFisico = req.body.Apertura
    var Obs_ArqueoFisico = ''
    var Fecha = fecha_format
    var Flag_Cerrado = 0
    var Cod_Usuario = req.session.username
    var Cod_Caja = req.session.caja
    var Cod_Turno =  req.session.turno

    p = [
      { nom_parametro: 'id_ArqueoFisico', valor_parametro: -1, tipo:"output"},
      { nom_parametro: 'Cod_Caja', valor_parametro: Cod_Caja},
      { nom_parametro: 'Cod_Turno', valor_parametro: Cod_Turno},
      { nom_parametro: 'Numero', valor_parametro: Numero},
      { nom_parametro: 'Des_ArqueoFisico', valor_parametro: Des_ArqueoFisico},
      { nom_parametro: 'Obs_ArqueoFisico', valor_parametro: Obs_ArqueoFisico},
      { nom_parametro: 'Fecha', valor_parametro: Fecha},
      { nom_parametro: 'Flag_Cerrado', valor_parametro: Flag_Cerrado},
      { nom_parametro: 'Cod_Usuario', valor_parametro: Cod_Usuario}
    ]

    EXEC_SQL_OUTPUT('USP_CAJ_ARQUEOFISICO_G', p , function (dataArqueoFisico) {
      for(var i=0;i<req.body.Cod_Moneda.length;i++){
        var parametros = [
              { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result[0].valor},
              { nom_parametro: 'Cod_Moneda', valor_parametro: req.body.Cod_Moneda[i]},
              { nom_parametro: 'Tipo', valor_parametro: "SALDO INICIAL"},
              { nom_parametro: 'Monto', valor_parametro: req.body.Monto_Moneda[i]},
              { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username}
            ]

        EXEC_SQL('USP_CAJ_ARQUEOFISICO_SALDO_G', parametros, function (dataSaldoArqueo) {
           
          p = [
            { nom_parametro: 'CodCaja', valor_parametro: Cod_Caja },
            { nom_parametro: 'CodTurno', valor_parametro:  Cod_Turno}
          ] 
          EXEC_SQL('USP_CAJ_ARQUEOFISICO_TXCajaTurno', p , function (dataArqueoFisicoCajaTurno) {

            p_ = [
              { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result[0].valor }
            ] 

            EXEC_SQL('usp_CAJ_ARQUEOFISICO_TXPK', p_ , function (dataArqueo) {
              
              app.locals.arqueo = dataArqueo.result
              
            })

              //app.locals.arqueo = dataArqueoFisico.result
          })

        })
      }
      app.locals.apertura = true
      res.redirect('/')
    })
  } 
})

app.get('/register',function(req,res){
  res.render('register.ejs', { });
})

app.post('/register',function(req,res){
  var input = req.body
  if(!RUCValido(input.RUC)){
    res.render('register.ejs', {err:'El RUC es inválido'});
  }else{
    if(!EmailValido(input.email)){
      res.render('register.ejs', {err:'El email es inválido'});
    }else{
      if(input.password==input.repeatpassword && input.repeatpassword!='' && input.password!=''){
        if(input.nombre!='' && input.telefono!='' && input.password!='' && input.password==input.repeatpassword){

        }else{
          res.render('register.ejs', {err:'Existe campos vacios'});
        }
      }else{
        res.render('register.ejs', {err:'Las contraseñas no coinciden'});
      }
    }
  }
   
})
 
app.get('/logout', function (req, res) {
  errores = ''
  app.locals.isla = false
  app.locals.apertura = false
  app.locals.CierreCompleto = true
  app.locals.caja = { Cod_Caja : null }
  app.locals.turno = null
  app.locals.sucursal = null
  app.locals.arqueo = null
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
var recepciones_api = require('./routes/api-recepciones')
var series_api = require('./routes/api-series')
var reservas_api = require('./routes/api-reservas')
var services_api = require('./routes/api-services')
var formas_pago_api = require('./routes/api-formas-pago')
var comprobantes_pago_api = require('./routes/api-comprobantes-pago')
var compra_venta_moneda_extranjera_api = require('./routes/api-compra-venta-moneda-extranjera')
 
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
app.use('/recepciones_api', recepciones_api)
app.use('/series_api', series_api)
app.use('/reservas_api', reservas_api)
app.use('/ws', services_api)
app.use('/formas_pago_api', formas_pago_api)
app.use('/comprobantes_pago_api', comprobantes_pago_api)
 

//Listen Server
var server = app.listen(3000, function (err) {
  if (err) return console.log('Hubo un error'), process.exit(1);
  console.log('Escuchando en el puerto 3000');
})

var jsreport = require('jsreport')
var fs = require('fs')
var reportingApp = express(),
    jsreportInstance;

app.post('/api/report', function(req, res) {

  console.log(req.body)

  var request = {
    template: req.body.template,
    data: req.body.data
  }; 
  
  jsreport.render(request).then(function (o) { 
    o.result.pipe(res);
  }).catch(function (e) { 
    console.error(e)
    return res.json({respuesta:'error'})
  })
 

  /*var input = req.body
  var COD_LIBRO = input.COD_LIBRO 
  var NOMBRE = app.locals.empresa[0].RazonSocial
  var DIRECCION = app.locals.empresa[0].Direccion
  var RUC = app.locals.empresa[0].RUC
  var COD_TIPOCOMPROBANTE = input.COD_TIPOCOMPROBANTE
  var DOCUMENTO = input.DOCUMENTO
  var SERIE = input.SERIE
  var NUMERO = input.NUMERO
  var CLIENTE = input.CLIENTE
  var COD_DOCCLIENTE = input.COD_DOCCLIENTE
  var RUC_CLIENTE = input.RUC_CLIENTE
  var FLAG_ANULADO = input.FLAG_ANULADO
  var MOTIVO_ANULACION = input.MOTIVO_ANULACION
  var DIRECCION_CLIENTE = input.DIRECCION_CLIENTE
  var FECHA_EMISION = input.FECHA_EMISION
  var FECHA_VENCIMIENTO = input.FECHA_VENCIMIENTO
  var FORMA_PAGO = input.FORMA_PAGO
  var GLOSA = input.GLOSA
  var OBSERVACIONES = input.OBSERVACIONES
  var USUARIO = req.session.username
  var MONEDA = input.MONEDA
  var ESCRITURA_MONTO = input.ESCRITURA_MONTO
  var GRAVADAS = input.GRAVADAS
  var EXONERADAS = input.EXONERADAS
  var GRATUITAS = input.GRATUITAS
  var INAFECTAS = input.INAFECTAS
  var DESCUENTO = input.DESCUENTO
  var IGV = input.IGV
  var TOTAL = input.TOTAL
  if(COD_TIPOCOMPROBANTE=='TKF' || COD_TIPOCOMPROBANTE=='TKB' || COD_TIPOCOMPROBANTE=='FE' || COD_TIPOCOMPROBANTE=='BE'){*/
    /*jsreport.render({
      extensions: {
        assets: {
          publicAccessEnabled: true
        }
      },
      template: {
        name: COD_TIPOCOMPROBANTE=='FE' || COD_TIPOCOMPROBANTE=='BE'?'FacturaComprobante':'TicketFactura',
        recipe: "chrome-pdf",
        engine: 'handlebars',
        chrome: { 
          width: (COD_TIPOCOMPROBANTE!='FE' && COD_TIPOCOMPROBANTE!='BE')?'8.27in':'2.00in',
          height:(COD_TIPOCOMPROBANTE!='FE' && COD_TIPOCOMPROBANTE!='BE')?'11.7in':'5.5in'
        }
      },
      data:{
        "URL_LOGO":"https://www.sparksuite.com/images/logo.png",
        "FLAG":false,
        "NOMBRE":NOMBRE,
        "DIRECCION":DIRECCION,
        "RUC":RUC,
        "COD_TIPOCOMPROBANTE": COD_TIPOCOMPROBANTE,
        "DOCUMENTO": DOCUMENTO,
        "SERIE": SERIE,
        "NUMERO": NUMERO,
        "FLAG_ANULADO": FLAG_ANULADO,
        "MOTIVO_ANULACION" : MOTIVO_ANULACION,
        "CLIENTE": CLIENTE,
        "COD_DOCCLIENTE":COD_DOCCLIENTE,
        "RUC_CLIENTE": RUC_CLIENTE,
        "DIRECCION_CLIENTE": DIRECCION_CLIENTE,
        "FECHA_EMISION": FECHA_EMISION,
        "FECHA_VENCIMIENTO": FECHA_VENCIMIENTO,
        "FORMA_PAGO": FORMA_PAGO,
        "GLOSA": GLOSA,
        "OBSERVACIONES": OBSERVACIONES,
        "CAJERO": USUARIO,
        "MONEDA": MONEDA,
        "ESCRITURA_MONTO": "SON: "+ESCRITURA_MONTO,
        "GRAVADAS": GRAVADAS,
        "EXONERADAS": EXONERADAS,
        "GRATUITAS": GRATUITAS,
        "INAFECTAS": INAFECTAS,
        "DESCUENTO": DESCUENTO,
        "IGV": IGV,
        "TOTAL": TOTAL,
        "PIE_DE_PAGINA":"Representación impresa del comprobante electrónico, consulte su documento en www.ifacturacion.pe",
        "VERSION_SISTEMA":"F|9.1.4",
        "DETALLES": JSON.parse(input.DETALLES)
      }*/
    /*}).then(function (resp) {
  
        //var fs = require('fs')
        //fs.writeFileSync('public/media/documento1.pdf', resp.content)
        //return res.json({respuesta:'ok'})
        o.result.pipe(res);
    }).catch(function (e) {
      return res.json({respuesta:'error'})
      //console.error(e)
    })*/
  //}
 
});
  
app.use('/reporting', reportingApp);


jsreportInstance = jsreport({
  express: { app :reportingApp, server: server },
  appPath: "/reporting"
});

jsreportInstance.init().catch(function (e) {
  console.error('error initializing jsreport:', e);
});

/* var reportingApp = express();
 app.use('/reporting', reportingApp);
 var jsreport = require('jsreport')({
   express: { app :reportingApp, server: server },
   appPath: "/reporting"
 });
 jsreport.init().then(() => {
  console.log('jsreport server started')
  

})

app.use('/reporting/api',function(req,res){
  
          jsreport.render({
            template: {
              "shortid":"HJh43EuzQ",
              "engine": "handlebars",
              "recipe": "phantom-pdf",
            },
            data:{
              "hola":"sssssssssssss"
            }
          }).then(function(out) {										
            
          }).catch(function(err){
         
            console.log(err)
          });
        })*/