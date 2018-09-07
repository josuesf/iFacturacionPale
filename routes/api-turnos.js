var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos, EXEC_SQL, EXEC_SQL_OUTPUT} = require('../utility/exec_sp_sql')
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
    var gestion = req.body.Gestion
    var periodo = req.body.Periodo
    var turno = req.body.Turno 
    var caja = req.app.locals.caja[0].Cod_Caja
    var desc_caja = req.app.locals.caja[0].Des_Caja
    var usuario = req.session.username
    CargarVariables(gestion,periodo,turno,caja,desc_caja,usuario,req,res)
})


function CargarVariables(gestion,periodo,turno,caja,desc_caja,usuario,req,res){
    var p = [
      { nom_parametro: 'Cod_Turno', valor_parametro: turno }
    ]
    EXEC_SQL('usp_CAJ_TURNO_ATENCION_TXPK', p , function (dataTurno) {
      if(dataTurno.err){
        res.json({respuesta:"error",data:dataTurno.err}) 
      }

      if(dataTurno.result.length>0){
        p = [
          { nom_parametro: 'CodCaja', valor_parametro: caja },
          { nom_parametro: 'CodTurno', valor_parametro: turno }
        ] 
        EXEC_SQL('USP_CAJ_ARQUEOFISICO_TXCajaTurno', p , function (dataArqueoFisico) {
          if(dataArqueoFisico.err){
            res.json({respuesta:"error",data:dataArqueoFisico.err}) 
          }
          if(dataArqueoFisico.result.length<=0){
            p = [
              { nom_parametro: 'CodCaja', valor_parametro: caja }
            ] 

            EXEC_SQL('USP_CAJ_ARQUEOFISICO_TNumeroSiguiente', p , function (dataNumero) {
              if(dataArqueoFisico.err){
                res.json({respuesta:"error",data:dataNumero.err}) 
              }
              p = [
                { nom_parametro: 'Cod_Caja', valor_parametro: caja },
                { nom_parametro: 'Cod_Turno', valor_parametro:  turno }
              ]
              EXEC_SQL('USP_CAJ_ARQUEOFISICO_TSaldoAnteriorXCajaTurno', p , function (dataSaldoAnterior) {

                if(dataSaldoAnterior.err){
                  res.json({respuesta:"error",data:dataNumero.err}) 
                }
                
                if(dataSaldoAnterior.result.length==0){

                  EXEC_SQL('USP_VIS_MONEDAS_TT', [] , function (dataMonedas) {
                    var arregloMon=[]
                    dataMonedas.result.forEach(element => {
                      if(element.Nom_Moneda!='OTROS'){
                        arregloMon.push({
                          Cod_Moneda:element.Cod_Moneda,
                          Monto_Moneda:0
                        })
                      }
                    });
                    console.log("monedas total")

                    ArquearCaja(  dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,
                                  "Arqueo de "+desc_caja+" para el Turno "+turno,
                                  turno,
                                  usuario,
                                  caja,
                                  arregloMon,req,function(flag){
                                    if(flag){ 
                                      req.session.periodo = periodo
                                      req.session.gestion = gestion
                                      req.app.locals.turno = dataTurno.result
                                      res.json({respuesta:"ok"}) 
                                    }
                                  })                    
                  })
                  
                }else{
                  req.app.locals.CierreCompleto = req.app.locals.isla 
                  if(req.app.locals.CierreCompleto){

                    var arregloMon=[]
                    dataSaldoAnterior.result.forEach(element => {
                      if(element.Nom_Moneda!='OTROS'){
                        arregloMon.push({
                          Cod_Moneda:element.Cod_Moneda,
                          Monto_Moneda:element.Monto
                        })
                      }
                    });
                    console.log("cierre completo 1")
                    ArquearCaja(  dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,
                                  "Arqueo de "+desc_caja+" para el Turno "+turno,
                                  turno,
                                  usuario,
                                  caja,
                                  arregloMon,req,function(flag){
                                    if(flag){
                                      req.session.periodo = periodo
                                      req.session.gestion = gestion
                                      req.app.locals.turno = dataTurno.result
                                      res.json({respuesta:"ok"}) 
                                    }
                                  }) 
                  }else{
                    if(dataSaldoAnterior.result[0].Flag_Cerrado.toString().toUpperCase()=="TRUE"){
                      console.log("cierre completo 2")
                      var arregloMon=[]
                      dataSaldoAnterior.result.forEach(element => {
                        if(element.Nom_Moneda!='OTROS'){
                          arregloMon.push({
                            Cod_Moneda:element.Cod_Moneda,
                            Monto_Moneda:element.Monto
                          })
                        }
                      });

                      ArquearCaja(  dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,
                                    "Arqueo de "+desc_caja+" para el Turno "+turno,
                                    turno,
                                    usuario,
                                    caja,
                                    dataSaldoAnterior.result,req,function(flag){
                                      if(flag){
                                        req.session.periodo = periodo
                                        req.session.gestion = gestion
                                        req.app.locals.turno = dataTurno.result
                                        res.json({respuesta:"ok"}) 
                                      }
                                    }) 

                    }else{ 
                      res.json({respuesta:"error",data:"No se Puede Aperturar el Turno "+ turno+ " sin antes Cerrar el Turno "+dataSaldoAnterior.result[0].Cod_Turno+".\n\nVuelva a intentarlo otra vez"})
                    }
                  }
                }
              })
            })
          }else{
            
            p = [
              { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result[0].id_ArqueoFisico }
            ] 
            
            EXEC_SQL('usp_CAJ_ARQUEOFISICO_TXPK', p , function (dataArqueo) {
              if(dataArqueo.err){
                res.json({respuesta:"error",data:dataArqueo.err})
              }
              req.app.locals.arqueo = dataArqueo.result
              req.session.periodo = periodo
              req.session.gestion = gestion
              req.app.locals.turno = dataTurno.result
              res.json({respuesta:"ok"}) 
            })
          }
          
        }) 
      }else{
        res.json({respuesta:"error",data:"No existe el turno seleccionado"}) 
      }                  
    })
}

function ArquearCaja(Numero,Des_ArqueoFisico,Cod_Turno,Cod_Usuario,Cod_Caja,ArrayMonedas,req,callback){
  console.log(ArrayMonedas)
  const fecha = new Date()
  const mes = fecha.getMonth() + 1
  const dia = fecha.getDate()
  var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
 
  var Obs_ArqueoFisico = ''
  var Fecha = fecha_format
  var Flag_Cerrado = 0 

  var p = [
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
    if(dataArqueoFisico.err){
      callback(false)
    }
    for(var i=0;i<ArrayMonedas.length;i++){
      var parametros = [
            { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result[0].valor},
            { nom_parametro: 'Cod_Moneda', valor_parametro: ArrayMonedas[i].Cod_Moneda},
            { nom_parametro: 'Tipo', valor_parametro: "SALDO INICIAL"},
            { nom_parametro: 'Monto', valor_parametro: ArrayMonedas[i].Monto_Moneda},
            { nom_parametro: 'Cod_Usuario', valor_parametro: Cod_Usuario}
          ]

      EXEC_SQL('USP_CAJ_ARQUEOFISICO_SALDO_G', parametros, function (dataSaldoArqueo) {

        if(dataSaldoArqueo.err){
          callback(false)
        }
         
        p = [
          { nom_parametro: 'CodCaja', valor_parametro: Cod_Caja },
          { nom_parametro: 'CodTurno', valor_parametro:  Cod_Turno}
        ] 
        EXEC_SQL('USP_CAJ_ARQUEOFISICO_TXCajaTurno', p , function (dataArqueoFisicoCajaTurno) {

          if(dataArqueoFisicoCajaTurno.err){
            callback(false)
          }

          p_ = [
            { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result[0].valor }
          ] 

          EXEC_SQL('usp_CAJ_ARQUEOFISICO_TXPK', p_ , function (dataArqueo) {
            if(dataArqueo.err){
              callback(false)
            }
            req.app.locals.arqueo = dataArqueo.result
            
          }) 
        })

      })
    }
    req.app.locals.apertura = true
    callback(true)
  })
}
   



module.exports = router;