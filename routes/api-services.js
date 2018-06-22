var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { UnObfuscateString, CambiarCadenaConexion } = require('../utility/tools')
var { Ejecutar_Procedimientos, EXEC_SQL, EXEC_SQL_DBMaster,EXEC_QUERY_DBMaster, LOGIN_SQL } = require('../utility/exec_sp_sql')

 
router.post('/login_movil', function (req, res) {
    input = req.body 
    parametros = [
        { nom_parametro: 'RUC', valor_parametro: input.RUC },
    ] 

    if(input.Cod_Caja==null || input.Cod_Caja==''){

        if(global.userDB==''){
            if(TraerConexion(req,res))
                VerificarLogin(req,res)
            else
                return res.json({respuesta:"error"}) 
        }else{
            VerificarLogin(req,res)
        }

    }else{
        VerificarArqueoCaja(req,res)
    }
}); 


router.post('/checking_caja', function (req, res) { 
  
    if(global.userDB==''){
        if(TraerConexion(req,res))
            VerificarArqueoCaja(req,res)
        else
            return res.json({respuesta:"error"}) 
    }else{
        VerificarArqueoCaja(req,res)
    }
}); 

router.post('/arquear_caja', function (req, res) { 
  
    if(global.userDB==''){
        if(TraerConexion(req,res)){
            Arquear(req,res)
        }else
            return res.json({respuesta:"error"}) 
    }else{
       
    }
}); 


function VerificarArqueoCaja(req,res){
     
    p = [
        { nom_parametro: 'Cod_Turno', valor_parametro: req.body.Cod_Turno }
    ]
    EXEC_SQL('usp_CAJ_TURNO_ATENCION_TXPK', p , function (dataTurno) {
        
        if (dataTurno.err) {
            return res.json({respuesta:"error"})
        }

        if(dataTurno.result.length>0){
            req.app.locals.turno = dataTurno.result
            p = [
                { nom_parametro: 'Cod_Caja', valor_parametro: req.body.Cod_Caja }
            ]

            EXEC_SQL('usp_CAJ_CAJAS_TXPK', p, function (dataCaja) {

                if (dataCaja.err) {
                    return res.json({respuesta:"error"})
                }

                req.app.locals.caja = dataCaja.result
                p = [
                    { nom_parametro: 'Cod_Sucursal', valor_parametro: dataCaja.result[0].Cod_Sucursal }
                ] 

                EXEC_SQL('usp_PRI_SUCURSAL_TXPK', p , function (dataSucursal) {

                    if (dataSucursal.err) {
                        return res.json({respuesta:"error"})
                    }

                    req.app.locals.sucursal = dataSucursal.result
                    p = [
                        { nom_parametro: 'CodCaja', valor_parametro: dataCaja.result[0].Cod_Caja },
                        { nom_parametro: 'CodTurno', valor_parametro:  req.app.locals.turno[0].Cod_Turno }
                    ] 
                    EXEC_SQL('USP_CAJ_ARQUEOFISICO_TXCajaTurno', p , function (dataArqueoFisico) {

                        if (dataArqueoFisico.err) {
                            return res.json({respuesta:"error"})
                        }
    

                        if(dataArqueoFisico.result.length<=0){
                            req.app.locals.arqueo = dataArqueoFisico.result
                            p = [
                                { nom_parametro: 'CodCaja', valor_parametro: dataCaja.result[0].Cod_Caja }
                            ] 

                            EXEC_SQL('USP_CAJ_ARQUEOFISICO_TNumeroSiguiente', p , function (dataNumero) {

                                if (dataNumero.err) {
                                    return res.json({respuesta:"error"})
                                }

                                p = [
                                    { nom_parametro: 'Cod_Caja', valor_parametro: dataCaja.result[0].Cod_Caja },
                                    { nom_parametro: 'Cod_Turno', valor_parametro:  req.app.locals.turno[0].Cod_Turno }
                                ]
                                EXEC_SQL('USP_CAJ_ARQUEOFISICO_TSaldoAnteriorXCajaTurno', p , function (dataSaldoAnterior) {
                                    
                                    
                                    if (dataSaldoAnterior.err) {
                                        return res.json({respuesta:"error"})
                                    }

                                    if(dataSaldoAnterior.result.length==0){


                                        return res.json({respuesta:"ok",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,data_cierre:{flag_apertura:'NUEVO',saldo:0}}}) 
 
                                    }else{
 
                                        if(dataSaldoAnterior.result[0].Flag_Cerrado.toString().toUpperCase()=="TRUE"){
                                            return res.json({respuesta:"ok",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1, data_cierre:{flag_apertura:'CERRADO',saldo:dataSaldoAnterior.result[0].Monto?dataSaldoAnterior.result[0].Monto:0}}}) 
                                        }else{
                                            return res.json({respuesta:"ok",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1, data_cierre:{flag_apertura:'ABIERTO',saldo:dataSaldoAnterior.result[0].Monto?dataSaldoAnterior.result[0].Monto:0}}}) 
                                        } 
                                    }
                                })
                            })

                        
                        }else{
                            
                            p = [
                                { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result[0].id_ArqueoFisico }
                            ] 
                            
                            EXEC_SQL('usp_CAJ_ARQUEOFISICO_TXPK', p , function (dataArqueo) {
                                
                                if (dataArqueo.err) {
                                    return res.json({respuesta:"error"})
                                }else{
                                    req.app.locals.arqueo = dataArqueo.result
                                    return res.json({respuesta:"ok"})
                                }
                               
                            })
                        }
                    
                    })
                })
            })
        }else{
            res.json({respuesta:"error"})
        }                  
    })
}

function VerificarLogin(req,res){
    var input = req.body 
    LOGIN_SQL(input.usuario, input.password, function (dataLogin) {
        if (dataLogin.err) {
            return res.json({respuesta:"error"}) 
        }else{
            p = [
                { nom_parametro: 'Cod_Usuarios', valor_parametro: dataLogin.Cod_Usuarios}
            ]  
            EXEC_SQL('USP_CAJ_CAJAS_TXCodCajero',p, function (e) {
                if (e.err) {
                    return res.json({respuesta:"error"}) 
                }

                if(e.result.length>0){
                
                    EXEC_SQL('USP_VIS_PERIODOS_TraerPorFechaGestion',TraerGestion(), function (dataPeriodos) {
                        if (dataPeriodos.err)
                            return res.json({respuesta:"error"})  
                        pPeriodo = [
                            {nom_parametro: 'Cod_Periodo', valor_parametro:dataPeriodos.result[0].Cod_Periodo},
                        ]
                        EXEC_SQL('USP_CAJ_TURNO_ATENCION_TXCodPeriodo', pPeriodo, function (dataTurnos) {
                            if (dataTurnos.err) {
                                return res.json({respuesta:"error"})
                            }else{
                                return res.json({respuesta:"ok",data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result}}) 
                            }
                        })
                    })

                }else{
                    
                    return res.json({respuesta:"ok",data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:[],periodos:[],turnos:[]}}) 
                
                }             
            }) 
        }
    })
}

function Arquear(req,res){
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)

    var Numero = req.body.Numero
    var Des_ArqueoFisico = req.body.Apertura
    var Obs_ArqueoFisico = ''
    var Fecha = fecha_format
    var Flag_Cerrado = 0
    var Cod_Usuario = req.body.Cod_Usuario
    var Cod_Caja = req.body.Cod_Caja
    var Cod_Turno =  req.body.Cod_Turno

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
        if(dataArqueoFisico.err) return res.json({respuesta:"error"}) 
         
            var parametros = [
                { nom_parametro: 'id_ArqueoFisico', valor_parametro: dataArqueoFisico.result},
                { nom_parametro: 'Cod_Moneda', valor_parametro: 'PEN'},
                { nom_parametro: 'Tipo', valor_parametro: "SALDO INICIAL"},
                { nom_parametro: 'Monto', valor_parametro: req.body.Monto},
                { nom_parametro: 'Cod_Usuario', valor_parametro: Cod_Usuario}
            ]

            EXEC_SQL('USP_CAJ_ARQUEOFISICO_SALDO_G', parametros, function (dataSaldoArqueo) {
                if(dataSaldoArqueo.err) return res.json({respuesta:"error"}) 
                p = [
                    { nom_parametro: 'CodCaja', valor_parametro: Cod_Caja },
                    { nom_parametro: 'CodTurno', valor_parametro:  Cod_Turno}
                ] 
                EXEC_SQL('USP_CAJ_ARQUEOFISICO_TXCajaTurno', p , function (dataArqueoFisico) {
                    if(dataArqueoFisico.err) return res.json({respuesta:"error"}) 
                    req.app.locals.arqueo = dataArqueoFisico.result
                    return res.json({respuesta:"ok"}) 
                })

            }) 
    })
}

function TraerGestion(){
    const fecha = new Date()
    var anio = fecha.getFullYear() 
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_now = anio + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)

    pGestion = [
        {nom_parametro: 'Gestion', valor_parametro:anio},
        {nom_parametro: 'Fecha', valor_parametro:fecha_now}
    ]

    return pGestion
}
 
function TraerConexion(req, res){
    parametros = [
        { nom_parametro: 'RUC', valor_parametro: req.body.RUC },
    ] 

    EXEC_SQL_DBMaster('USP_PRI_EMPRESA_TXRUC', parametros, function (m) {
        if (m.err) {
            return false
        }else{
            if(m.result.length>0){
                if(m.result[0].CadenaConexion!=null){
                    CambiarCadenaConexion(UnObfuscateString(m.result[0].CadenaConexion))
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }
    }) 
}
 
 
module.exports = router;