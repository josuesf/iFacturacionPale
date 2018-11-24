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
var path = require('path')

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
//app.use('/static', express.static('formatos'));  
app.use(bodyParser.json({limit:'50mb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({ limit:'50mb',extended: true, parameterLimit: 1000000 })); // support encoded bodies 
app.disable('x-powered-by');
app.use(session({ secret: '_secret_', cookie: { maxAge: 60 * 60 * 1000 }, saveUninitialized: false, resave: false }));
 
// configuration default

app.locals.isla = false
app.locals.apertura = false
app.locals.CierreCompleto = true
app.locals.caja = { Cod_Caja : null }
app.locals.turno = null
app.locals.sucursal = null
app.locals.arqueo = null
app.locals.cajasUsuarios =[]

// configuration init jsreport
const reportingApp = express();
app.use('/reporting', reportingApp);

jsreport = require('jsreport-core')(
  {
    tempDirectory: path.join(__dirname, 'formatos/temp'),
    store: {
      provider: 'fs'
    },
    logger: {
      'console': { 'transport': 'console', 'level': 'debug' }
    },
    extensions: {
        express: { app: reportingApp, server: server },
        'fs-store': {
          dataDirectory: path.join(__dirname, 'formatos/default'),
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
 
jsreport.init().then(() => { 
  console.log('jsreport server started')
}).catch((e) => { 
  console.error(e);
});

// others configurations login

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
                       
                        var pcajas= [
                          { nom_parametro: 'Cod_Usuarios', valor_parametro: req.session.username}
                        ]  
                
                        EXEC_SQL('USP_CAJ_CAJAS_TXCodCajero', pcajas , function (e) {
                          if (e.err) {
                            errores = "Ocurrio un error. "+e.err
                            return res.redirect('/login');
                          }else{
                            if(e.result.length>0){
                              app.locals.cajasUsuarios = e.result 
                              res.render('logincajas.ejs', { title: 'iFacturacion - Procesos',cajas:e.result,err:errores});
                            }else{
                  
                              EXEC_SQL('USP_CAJ_CAJAS_TActivos', [] , function (m) {
                                if(m.result.length>0){
                                  app.locals.cajasUsuarios = m.result 
                                  res.render('logincajas.ejs', { title: 'iFacturacion - Procesos',cajas:m.result,err:errores});
                                }else{
                                  errores = 'No existen cajas activas'
                                  app.locals.isla = false
                                  app.locals.apertura = false
                                  app.locals.CierreCompleto = true
                                  app.locals.caja = { Cod_Caja : null }
                                  app.locals.turno = null
                                  app.locals.sucursal = null
                                  app.locals.arqueo = null
                                  app.locals.cajasUsuarios=[]
                                  delete req.session.authenticated;
                                  return res.redirect('/login');
                                }                     
                              })
                  
                            }  
                          }              
                        })

                        /*app.locals.isla = false
                        app.locals.apertura = false
                        app.locals.CierreCompleto = true
                        app.locals.caja = { Cod_Caja : null }
                        app.locals.turno = null
                        app.locals.sucursal = null
                        app.locals.arqueo = null
                        delete req.session.authenticated;
                        res.redirect('/login');*/
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
                  res.render('index_procesos.ejs', {  title: 'iFacturacion - Procesos',
                                                      Nom_Empresa: app.locals.empresa[0].Nom_Comercial,
                                                      Cod_Usuarios:req.session.username,
                                                      Nick:req.session.nick,
                                                      Turno:app.locals.turno[0].Des_Turno });
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
        console.log("turno cambiado",app.locals.turno)
        CargarVariables(req,res) 
      }else{
        errores = "No tiene asignada ninguna caja. No puede iniciar sesion en el sistema"
        res.redirect('/logout');
      }
    }else{ 
      res.render('index_procesos.ejs', {  title: 'iFacturacion - Procesos',
                                          Nom_Empresa: app.locals.empresa[0].Nom_Comercial,
                                          Cod_Usuarios:req.session.username,
                                          Nick:req.session.nick,
                                          Turno:app.locals.turno[0].Des_Turno });
    }
  }
})

app.get('/consultas', function (req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
  } else{ 
      res.render('index.ejs', { title: 'iFacturacion',
                            Cod_Usuarios:req.session.username,
                            Nick:req.session.nick });
  }
}) 


app.get('/login', function (req, res) { 
  if (req.session && req.session.authenticated) {
    return res.redirect('/');
  }else{
    res.render('login.ejs', { title: 'iFacturacion - Usuarios ', err:errores});
    errores=''
  }  
  /*const fecha = new Date()
  var anio = fecha.getFullYear() 

  EXEC_QUERY_DBMaster('SELECT * FROM PRI_EMPRESA', [], function (o) {
    if (o.err){ 
      return null
    }
    else{
      res.render('login.ejs', { title: 'iFacturacion - Usuarios ', empresa : o.result, gestion: anio , err:errores});
      return o.result
    }
    
  }) */
})


app.post('/login', function (req, res) {
  global.tipo_cliente = null
  parametros = [
    { nom_parametro: 'RUC', valor_parametro: req.body.RUC }
  ]

  EXEC_SQL_DBMaster('USP_PRI_EMPRESA_TXRUC', parametros, function (m) {   
    if (m.err) {
      errores = "Ocurrio un error con el servidor comuniquese con el administrador. " //+m.err
      return res.redirect('/login');
    }else{
      console.log(m)
      if(m.result.length>0){
        //-- validacion extra para el caso de clientes
        if(m.result[0].CadenaConexion!=undefined && m.result[0].CadenaConexion!=null && m.result[0].CadenaConexion!=''){
          CambiarCadenaConexion(UnObfuscateString(m.result[0].CadenaConexion))
          EXEC_SQL('USP_PRI_EMPRESA_TraerUnicaEmpresa', [], function (e) {
            if (e.err){
              errores = "Ocurrio un error con el servidor comuniquese con el administrador. " //+e.err
              return res.redirect('/login');
            } 
            var Cod_Empresa=e.result[0].Cod_Empresa
            p = [
              { nom_parametro: 'Cod_Empresa', valor_parametro: Cod_Empresa }
            ]

            EXEC_SQL('usp_PRI_EMPRESA_TXPK', p, function (e) {
              
              app.locals.empresa = e.result 
              global.empresa = e.result
              
              //if(req.body.Gestion!=undefined && req.body.Periodo!=undefined && req.body.Turno!=undefined){
                LOGIN_SQL(req.body.usuario, req.body.password, function (e) {
                  if (e.err) {
                    errores = e.err
                    return res.redirect('/login');
                  }
           
                    req.session.authenticated = true;
                    req.session.username = e.Cod_Usuarios
                    req.session.nick = e.Nick
              
                    //req.session.turno = req.body.Turno
                    //req.session.periodo = req.body.Periodo
                    //req.session.gestion = req.body.Gestion
                    
                    p = [
                      { nom_parametro: 'Cod_Usuarios', valor_parametro: req.session.username}
                    ]  
            
                    EXEC_SQL('USP_CAJ_CAJAS_TXCodCajero', p , function (e) {
                      if(e.result.length>0){
                        app.locals.cajasUsuarios = e.result 
                        res.render('logincajas.ejs', { title: 'iFacturacion - Procesos',cajas:e.result });
                      }else{
            
                        EXEC_SQL('USP_CAJ_CAJAS_TActivos', [] , function (m) {
                          if(m.result.length>0){
                            app.locals.cajasUsuarios = m.result 
                            res.render('logincajas.ejs', { title: 'iFacturacion - Procesos',cajas:m.result });
                          }else{
                            errores = 'No existen cajas activas'
                            app.locals.isla = false
                            app.locals.apertura = false
                            app.locals.CierreCompleto = true
                            app.locals.caja = { Cod_Caja : null }
                            app.locals.turno = null
                            app.locals.sucursal = null
                            app.locals.arqueo = null
                            app.locals.cajasUsuarios=[]
                            delete req.session.authenticated;
                            return res.redirect('/login');
                          }                     
                        })
            
                      }                
                    })
                    
                  //}
            
                })
              //}else{
              //  errores = "Todos los campos son necesarios"
              //  return res.redirect('/login');
              //}
          
            })
          })
        }else{
          // login nuevo 
            req.session.authenticated = true;
            req.session.username = 'D001'
            req.session.nick = 'DEMO'
            return res.redirect('/consultas');
        }
      }else{
        errores = "No se encontro la empresa con el RUC indicado"
        return res.redirect('/login');
      }
    }
  })

})
 

app.post('/logincajas', function (req, res) {
  if(req.body.Turno!=undefined && req.body.Caja!=undefined){ 
    if (!req.session || !req.session.authenticated) {
      return res.redirect('/');
    }else{
      const fecha = new Date()
      var anio_format = fecha.getFullYear()
      const mes = fecha.getMonth() + 1
      var periodo_format = anio_format + '-' + (mes > 9 ? mes : '0' + mes)
      req.session.caja = req.body.Caja
      req.session.turno = req.body.Turno
      req.session.periodo = periodo_format
      req.session.gestion = anio_format
      iniciarJsReport(app.locals.empresa[0].RUC,function(flag){
        if(flag){ 
          return res.redirect('/');
        }else{
          errores = "Ocurrio un error. Comuniquese con el administrador de sistema "
          return res.redirect('/login');
        } 
      })
    } 
  }else{    
    if(app.locals.cajasUsuarios.length>0){ 
      //const fecha = new Date()
      //var anio = fecha.getFullYear() 
      res.render('logincajas.ejs', { title: 'iFacturacion - Procesos',cajas:app.locals.cajasUsuarios ,mensaje:'Seleccione una de las cajas asignadas a este usuario',err:'Es necesario ingresar todos los campos'});
    }else{ 
      errores = ''
      return res.redirect('/login');
    }
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
              { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result['id_ArqueoFisico']},//dataArqueoFisico.result[0].valor},
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
              { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result['id_ArqueoFisico']},//dataArqueoFisico.result[0].valor }
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
 
app.get('/logout', function (req, res) {
  errores = ''
  app.locals.isla = false
  app.locals.apertura = false
  app.locals.CierreCompleto = true
  app.locals.caja = { Cod_Caja : null }
  app.locals.turno = null
  app.locals.sucursal = null
  app.locals.arqueo = null
  app.locals.cajasUsuarios = []  
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
var services_web_api = require('./routes/api-web-services')
var formas_pago_api = require('./routes/api-formas-pago')
var comprobantes_pago_api = require('./routes/api-comprobantes-pago')
var compra_venta_moneda_extranjera_api = require('./routes/api-compra-venta-moneda-extranjera')
var precios_api = require('./routes/api-precios')
var reporte_api = require('./routes/api-reporte')
var cambio_monetario_api = require('./routes/api-cambio-monetario')
 
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
app.use('/ws_movil', services_api)
app.use('/ws', services_web_api)
app.use('/formas_pago_api', formas_pago_api)
app.use('/comprobantes_pago_api', comprobantes_pago_api)
app.use('/precios_api', precios_api)
app.use('/reporte_api', reporte_api)
app.use('/cambio_monetario_api', cambio_monetario_api)
 

//Listen Server
var server = app.listen(3000, function (err) {
  if (err) return console.log('Hubo un error'), process.exit(1);
  console.log('Escuchando en el puerto 3000');
})
 
app.post('/api/report', function(req, res) {  
  if(Object.keys(GETCONFIG(app.locals.empresa[0].RUC)).length>0){  
    /*let dir = path.join(__dirname, 'formatos/'+app.locals.empresa[0].RUC+'/recibos_tickets/assets/logo.jpg');
    if (fs.existsSync(dir)) { 
      req.body.template.data['FLAG'] = true
    }else{
      req.body.template.data['FLAG'] = false
    }*/
     
    req.body.template.data['NOMBRE'] = app.locals.empresa[0].RazonSocial
    req.body.template.data['DIRECCION'] = app.locals.empresa[0].Direccion
    req.body.template.data['RUC'] = app.locals.empresa[0].RUC
    req.body.template.data['DES_IMPUESTO'] = app.locals.empresa[0].Des_Impuesto
    req.body.template.data['IMPUESTO'] = app.locals.empresa[0].Por_Impuesto
    req.body.template.data['USUARIO'] = req.session.username
    req.body.template.data['FLAG_ANULADO'] = req.body.template.data['FLAG_ANULADO']=='true'?true:false
    //fecha y hora de la generacion del reporte
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate() 
    var fecha_format = (dia > 9 ? dia : '0' + dia) + '/' + (mes > 9 ? mes : '0' + mes) + '/' + fecha.getFullYear() + ' '+ [(fecha.getHours()>9?fecha.getHours():'0'+fecha.getHours()), (fecha.getMinutes()>9?fecha.getMinutes():'0'+fecha.getMinutes())].join(':');
    req.body.template.data['FECHA_SISTEMA'] = fecha_format 
    /*var request = {
      template: GETCONFIG(app.locals.empresa[0].RUC)[req.body.template.data.COD_TIPO_DOCUMENTO],
      data: req.body.template.data,
      options: { preview: req.body.template.data.FLAG_PREVIEW?req.body.template.data.FLAG_PREVIEW:true }
    };*/
    var request = {}
    request['template']=GETCONFIG(app.locals.empresa[0].RUC)[req.body.template.data.COD_TIPO_DOCUMENTO]
    request['data']=req.body.template.data
    if(req.body.template.data.FLAG_PREVIEW || req.body.template.data.FLAG_PREVIEW==undefined){
      request['options']={ preview: req.body.template.data.FLAG_PREVIEW?req.body.template.data.FLAG_PREVIEW:true }
    }

    /*crearArchivoReporte(jsreport,GETCONFIG(app.locals.empresa[0].RUC)[req.body.template.data.COD_TIPO_DOCUMENTO],req.body.template.data).then((result)=>{
      base64ArchivoReporte(jsreport,GETCONFIG(app.locals.empresa[0].RUC)[req.body.template.data.COD_TIPO_DOCUMENTO],req.body.template.data,res)
    }).catch((err)=>{
      res.end('<div id="topcontainer" class="bodycontainer clearfix uk-scrollspy-init-inview uk-scrollspy-inview uk-animation-fade"  style="margin: 0 auto;width: 100%;max-width: 1000px;text-align: center;">'+
      '<i class="fa fa-warning fa-5x"></i><br/><h3><span>Ocurrio un error.'+err+'</span></h3></div>')
    })*/
    
    jsreport.render(request).then(function (o) { 
      //o.result.pipe(fs.createWriteStream('pruebaEXCEL.xlsx')); 
      o.result.pipe(res);
      //res.end('<iframe src="prueba1.xlsx"></iframe>')
    }).catch(function (e) { 
      console.error(e)
      res.end('<div id="topcontainer" class="bodycontainer clearfix uk-scrollspy-init-inview uk-scrollspy-inview uk-animation-fade"  style="margin: 0 auto;width: 100%;max-width: 1000px;text-align: center;">'+
      '<i class="fa fa-warning fa-5x"></i><br/><h3><span>Ocurrio un error.'+e+'</span></h3></div>')
    })
  }else{
    res.end('<div id="topcontainer" class="bodycontainer clearfix uk-scrollspy-init-inview uk-scrollspy-inview uk-animation-fade"  style="margin: 0 auto;width: 100%;max-width: 1000px;text-align: center;">'+
      '<i class="fa fa-warning fa-5x"></i><br/><h3><span>No existe una configuracion del formato para el documento.</span></h3></div>')
  }
});
 
/* FUNCTIONS PRIVATES */

function crearArchivoReporte(jsreport,template,data){
  return new Promise((resolve,reject)=>{
    let request = {
      template: template,
      data: data
    }; 
    
    jsreport.render(request).then(function (o) { 
      o.result.pipe(fs.createWriteStream('prueba1.xlsx'));
      resolve("ok")
    }).catch(function (e) { 
      reject(e)
    })
  })
}

function base64ArchivoReporte(jsreport,template,data,res){
 
    let request = {
      template: template,
      data: data,
      options: { preview: true }
    }; 
    
    jsreport.render(request).then(function (o) { 
      o.result.pipe(res);
    }).catch(function (e) { 
      console.error(e)
      res.end('<div id="topcontainer" class="bodycontainer clearfix uk-scrollspy-init-inview uk-scrollspy-inview uk-animation-fade"  style="margin: 0 auto;width: 100%;max-width: 1000px;text-align: center;">'+
      '<i class="fa fa-warning fa-5x"></i><br/><h3><span>Ocurrio un error.'+e+'</span></h3></div>')
    }) 
}

function iniciarJsReport(ruc,callback){
  crearDirectorioEmpresa(ruc,function(flag){
    callback(flag)
  })
}
 
function crearDirectorioEmpresa(ruc,callback){ 
  try{
    var dir = path.join(__dirname, 'formatos/'+ruc);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        const fse = require('fs-extra')
        fse.copy(path.join(__dirname, 'formatos/default'), path.join(__dirname, 'formatos/'+ruc), err => {
          if (err)  callback(false)
          callback(true)
        }) 
    }else{
      callback(true)
    }
  }catch(e){
    callback(false)
  }
}
 
 