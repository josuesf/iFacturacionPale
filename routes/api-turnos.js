var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos, EXEC_QUERY} = require('../utility/exec_sp_sql')
// define the home page route

router.post('/get_turnos', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    procedimientos =[
        {nom_respuesta:'turnos',sp_name:'usp_CAJ_TURNO_ATENCION_TP',parametros},
        {nom_respuesta:'num_filas',sp_name:'usp_CAJ_TURNO_ATENCION_TNF',parametros:[{nom_parametro:'ScripWhere',valor_parametro:input.ScripWhere}]}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});


router.post('/guardar_turno', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Turno', valor_parametro: input.Cod_Turno},
        {nom_parametro: 'Des_Turno', valor_parametro: input.Des_Turno},
        {nom_parametro: 'Fecha_Inicio', valor_parametro: input.Fecha_Inicio},
        {nom_parametro: 'Fecha_Fin', valor_parametro: input.Fecha_Fin},
        {nom_parametro: 'Flag_Cerrado', valor_parametro: input.Flag_Cerrado},
        {nom_parametro: 'Cod_Usuario', valor_parametro: input.Cod_Usuario},
    ]
    procedimientos = [
        {nom_respuesta: 'turno', sp_name: 'USP_CAJ_TURNO_ATENCION_G', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/cambiar_comprobante_by_turno', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'id_ComprobantePago', valor_parametro: input.id_ComprobantePago},
        {nom_parametro: 'Cod_Turno', valor_parametro: input.Cod_Turno},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username},
    ]
    procedimientos = [
        {nom_respuesta: 'turno', sp_name: 'USP_CAJ_COMPROBANTE_PAGO_CambiarTurno', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/cambiar_movimientos_by_turno', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_MovimientoCaja', valor_parametro: input.Id_MovimientoCaja},
        {nom_parametro: 'Cod_TurnoActual', valor_parametro: input.Cod_TurnoActual},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username},
    ]
    procedimientos = [
        {nom_respuesta: 'turno', sp_name: 'USP_CAJ_CAJA_MOVIMIENTOS_CambiarTurno', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/cambiar_almacen_by_turno', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Id_AlmacenMov', valor_parametro: input.Id_AlmacenMov},
        {nom_parametro: 'Cod_TurnoActual', valor_parametro: input.Cod_TurnoActual},
        {nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username},
    ]
    procedimientos = [
        {nom_respuesta: 'turno', sp_name: 'USP_ALM_ALMACEN_MOV_CambiarTurno', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

router.post('/eliminar_turno', function (req, res){
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Turno', valor_parametro: input.Cod_Turno}
    ]
    procedimientos = [
        {nom_respuesta: 'turno', sp_name: 'usp_CAJ_TURNO_ATENCION_E', parametros}
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})



router.post('/cambiar_turno_sistema', function (req, res){
    input = req.body
    //var turno = req.body.Turno 
    CargarVariables(req,res)
})


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
                          const fecha = new Date()
                          var anio = fecha.getFullYear() 
  
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
                                res.render('logincajas.ejs', { title: 'iFacturacion - Procesos',gestion: anio,cajas:e.result,err:errores});
                              }else{
                    
                                EXEC_SQL('USP_CAJ_CAJAS_TActivos', [] , function (m) {
                                  if(m.result.length>0){
                                    app.locals.cajasUsuarios = m.result 
                                    res.render('logincajas.ejs', { title: 'iFacturacion - Procesos',gestion: anio,cajas:m.result,err:errores});
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
                                                Cod_Usuarios:req.session.username,
                                                Nick:req.session.nick });
                })
              }
              
            })
          })
        })
      }else{
        res.json({respuesta:"error",data:"No existe el turno seleccionado"}) 
      }                  
    })
  
  }
   



module.exports = router;