var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { UnObfuscateString, TraerConexion } = require('../utility/tools')
var { Ejecutar_Procedimientos, EXEC_SQL,EXEC_SQL_OUTPUT,EXEC_QUERY_DBMaster, LOGIN_SQL } = require('../utility/exec_sp_sql')

 
router.post('/login_movil', function (req, res) {
    input = req.body 
    parametros = [
        { nom_parametro: 'RUC', valor_parametro: input.RUC },
    ]  

    //if(input.Cod_Caja==null || input.Cod_Caja==''){
    TraerConexion(req,res,function(flag){
        console.log(flag)
        if(flag)
            VerificarLogin(req,res)
        else
            return res.json({respuesta:"error"}) 
    });
    /*}else{
        TraerConexion(req,res,function(flag){
            if(flag)
                VerificarArqueoCaja(req,res)
            else
                return res.json({respuesta:"error"}) 
        });
    }*/
}); 


router.post('/checking_caja', function (req, res) {
    TraerConexion(req,res,function(flag){
        if(flag)
            VerificarArqueoCaja(req,res)
        else
            return res.json({respuesta:"error"}) 
    });
}); 

router.post('/arquear_caja', function (req, res) { 
   
    TraerConexion(req,res,function(flag){
        if(flag)
            Arquear(req,res)
        else
            return res.json({respuesta:"error"}) 
    });
    
}); 


router.post('/get_all_productos_serv', function (req, res) {
    
    TraerConexion(req,res,function(flag){
        if(flag){
            procedimientos =[
                {nom_respuesta:'productos',sp_name:'USP_PRI_PRODUCTO_TT1',parametros:[]} 
            ]
            Ejecutar_Procedimientos(res,procedimientos)
        }else
            return res.json({respuesta:"error"}) 
    });

}); 
 

function VerificarArqueoCaja(req,res){
    // console.log(req.body)
    p = [
        { nom_parametro: 'Cod_Turno', valor_parametro: req.body.Cod_Turno }
    ]
    EXEC_SQL('usp_CAJ_TURNO_ATENCION_TXPK', p , function (dataTurno) {
        
        if (dataTurno.err) {
            return res.json({respuesta:"error"})
        }

        if(dataTurno.result.length>0){
            //req.app.locals.turno = dataTurno.result
            p = [
                { nom_parametro: 'Cod_Caja', valor_parametro: req.body.Cod_Caja }
            ]

            EXEC_SQL('usp_CAJ_CAJAS_TXPK', p, function (dataCaja) {

                if (dataCaja.err) {
                    return res.json({respuesta:"error"})
                }

                //req.app.locals.caja = dataCaja.result
                p = [
                    { nom_parametro: 'Cod_Sucursal', valor_parametro: dataCaja.result[0].Cod_Sucursal }
                ] 

                EXEC_SQL('usp_PRI_SUCURSAL_TXPK', p , function (dataSucursal) {

                    if (dataSucursal.err) {
                        return res.json({respuesta:"error"})
                    }

                    //req.app.locals.sucursal = dataSucursal.result
                    p = [
                        { nom_parametro: 'CodCaja', valor_parametro: dataCaja.result[0].Cod_Caja },
                        { nom_parametro: 'CodTurno', valor_parametro:  req.body.Cod_Turno }
                    ] 
                    EXEC_SQL('USP_CAJ_ARQUEOFISICO_TXCajaTurno', p , function (dataArqueoFisico) {

                        if (dataArqueoFisico.err) {
                            return res.json({respuesta:"error"})
                        }
                         

                        if(dataArqueoFisico.result.length<=0){
                            //req.app.locals.arqueo = dataArqueoFisico.result
                            p = [
                                { nom_parametro: 'CodCaja', valor_parametro: dataCaja.result[0].Cod_Caja }
                            ] 

                            EXEC_SQL('USP_CAJ_ARQUEOFISICO_TNumeroSiguiente', p , function (dataNumero) {

                                if (dataNumero.err) {
                                    return res.json({respuesta:"error"})
                                }

                                p = [
                                    { nom_parametro: 'Cod_Caja', valor_parametro: dataCaja.result[0].Cod_Caja },
                                    { nom_parametro: 'Cod_Turno', valor_parametro:  req.body.Cod_Turno }
                                ]
                                EXEC_SQL('USP_CAJ_ARQUEOFISICO_TSaldoAnteriorXCajaTurno', p , function (dataSaldoAnterior) {
                                    
                                    
                                    if (dataSaldoAnterior.err) {
                                        return res.json({respuesta:"error"})
                                    }

                                    if(dataSaldoAnterior.result.length==0){


                                        return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,data_cierre:{flag_apertura:'NUEVO',saldo:0,Cod_Turno:{}}}}) 
 
                                    }else{
 
                                        if(dataSaldoAnterior.result[0].Flag_Cerrado.toString().toUpperCase()=="TRUE"){
                                            return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1, data_cierre:{flag_apertura:'CERRADO',saldo:dataSaldoAnterior.result[0].Monto?dataSaldoAnterior.result[0].Monto:0,Cod_Turno:{}}}}) 
                                        }else{
                                            return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1, data_cierre:{flag_apertura:'ABIERTO',saldo:dataSaldoAnterior.result[0].Monto?dataSaldoAnterior.result[0].Monto:0,Cod_Turno:dataSaldoAnterior.result[0].Cod_Turno}}}) 
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
                                    if(dataArqueo.result[0].Flag_Cerrado){
 
                                        return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:'', data_cierre:{flag_apertura:'CERRADO',saldo:0,Cod_Turno:''}}}) 
                                                    //return res.json({respuesta:"ok",flag_caja_abierta:_flag_caja_abierta,data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result}}) 
                                                 
                                        //VerificarLogin(req,res,"no")
                                    }else{
                                        return res.json({respuesta:"ok",flag_caja_abierta:"ok",data:{numero:'', data_cierre:{flag_apertura:'ABIERTO',saldo:0,Cod_Turno:''}}}) 
                                        //return res.json({respuesta:"ok",flag_caja_abierta:"ok"})
                                    }
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
                                return res.json({respuesta:"error1"})
                            }else{ 
                                if(req.body.Cod_Caja!='' && req.body.Cod_Turno!='' && req.body.Cod_Caja!=undefined && req.body.Cod_Turno!=undefined){
                                   
                                    p = [
                                        { nom_parametro: 'Cod_Turno', valor_parametro: req.body.Cod_Turno }
                                    ]
                                    EXEC_SQL('usp_CAJ_TURNO_ATENCION_TXPK', p , function (dataTurno) {
                                        
                                        if (dataTurno.err) {
                                            return res.json({respuesta:"error"})
                                        }
                                
                                        if(dataTurno.result.length>0){ 
                                            p = [
                                                { nom_parametro: 'Cod_Caja', valor_parametro: req.body.Cod_Caja }
                                            ]
                                
                                            EXEC_SQL('usp_CAJ_CAJAS_TXPK', p, function (dataCaja) {
                                
                                                if (dataCaja.err) {
                                                    return res.json({respuesta:"error"})
                                                }
                                
                                                //req.app.locals.caja = dataCaja.result
                                                p = [
                                                    { nom_parametro: 'Cod_Sucursal', valor_parametro: dataCaja.result[0].Cod_Sucursal }
                                                ] 
                                
                                                EXEC_SQL('usp_PRI_SUCURSAL_TXPK', p , function (dataSucursal) {
                                
                                                    if (dataSucursal.err) {
                                                        return res.json({respuesta:"error"})
                                                    }
                                
                                                    //req.app.locals.sucursal = dataSucursal.result
                                                    p = [
                                                        { nom_parametro: 'CodCaja', valor_parametro: dataCaja.result[0].Cod_Caja },
                                                        { nom_parametro: 'CodTurno', valor_parametro:  req.body.Cod_Turno }
                                                    ] 
                                                    EXEC_SQL('USP_CAJ_ARQUEOFISICO_TXCajaTurno', p , function (dataArqueoFisico) {
                                
                                                        if (dataArqueoFisico.err) {
                                                            return res.json({respuesta:"error"})
                                                        }
                                                        
                                
                                                        if(dataArqueoFisico.result.length<=0){
                                                            //req.app.locals.arqueo = dataArqueoFisico.result
                                                            p = [
                                                                { nom_parametro: 'CodCaja', valor_parametro: dataCaja.result[0].Cod_Caja }
                                                            ] 
                                
                                                            EXEC_SQL('USP_CAJ_ARQUEOFISICO_TNumeroSiguiente', p , function (dataNumero) {
                                
                                                                if (dataNumero.err) {
                                                                    return res.json({respuesta:"error"})
                                                                }
                                
                                                                p = [
                                                                    { nom_parametro: 'Cod_Caja', valor_parametro: dataCaja.result[0].Cod_Caja },
                                                                    { nom_parametro: 'Cod_Turno', valor_parametro:  req.body.Cod_Turno }
                                                                ]
                                                                EXEC_SQL('USP_CAJ_ARQUEOFISICO_TSaldoAnteriorXCajaTurno', p , function (dataSaldoAnterior) {
                                                                    
                                                                    
                                                                    if (dataSaldoAnterior.err) {
                                                                        return res.json({respuesta:"error"})
                                                                    }
                                
                                                                    if(dataSaldoAnterior.result.length==0){
                                
                                                                        return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result,data_cierre:{flag_apertura:'NUEVO',saldo:0,Cod_Turno:{}}}}) 
                                                                        //return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,data_cierre:{flag_apertura:'NUEVO',saldo:0,Cod_Turno:{}}}}) 
                                
                                                                    }else{
                                
                                                                        if(dataSaldoAnterior.result[0].Flag_Cerrado.toString().toUpperCase()=="TRUE"){
                                                                            return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result,data_cierre:{flag_apertura:'CERRADO',saldo:dataSaldoAnterior.result[0].Monto?dataSaldoAnterior.result[0].Monto:0,Cod_Turno:{}}}}) 
                                                                            //return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1, data_cierre:{flag_apertura:'CERRADO',saldo:dataSaldoAnterior.result[0].Monto?dataSaldoAnterior.result[0].Monto:0,Cod_Turno:{}}}}) 
                                                                        }else{
                                                                            return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result,data_cierre:{flag_apertura:'ABIERTO',saldo:dataSaldoAnterior.result[0].Monto?dataSaldoAnterior.result[0].Monto:0,Cod_Turno:dataSaldoAnterior.result[0].Cod_Turno}}}) 
                                                                            //return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1, data_cierre:{flag_apertura:'ABIERTO',saldo:dataSaldoAnterior.result[0].Monto?dataSaldoAnterior.result[0].Monto:0,Cod_Turno:dataSaldoAnterior.result[0].Cod_Turno}}}) 
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
                                                                    if(dataArqueo.result[0].Flag_Cerrado){
                                
                                                                        
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
                                                                                    
                                                                                    return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:'-1',Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result,data_cierre:{flag_apertura:'CERRADO',saldo:0,Cod_Turno:''}}}) 
                                                                                    //return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:'', data_cierre:{flag_apertura:'CERRADO',saldo:0,Cod_Turno:''}}}) 
                                                                                    //return res.json({respuesta:"ok",flag_caja_abierta:_flag_caja_abierta,data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result}}) 
                                                                                }
                                                                            })
                                                                        })
                                
                                                                        //VerificarLogin(req,res,"no")
                                                                    }else{
                                                                        return res.json({respuesta:"ok",flag_caja_abierta:"ok",data:{numero:'-1',Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result,data_cierre:{flag_apertura:'ABIERTO',saldo:0,Cod_Turno:''}}}) 
                                                                        //return res.json({respuesta:"ok",flag_caja_abierta:"ok",data:{numero:'', data_cierre:{flag_apertura:'ABIERTO',saldo:0,Cod_Turno:''}}}) 
                                                                        //return res.json({respuesta:"ok",flag_caja_abierta:"ok"})
                                                                    }
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



                                }else{
                                    return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result}}) 
                                }
                                
                                //return res.json({respuesta:"ok",flag_caja_abierta:_flag_caja_abierta,data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result}}) 
                            }
                        })
                    })

                }else{
                    
                    return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:[],periodos:[],turnos:[]}}) 
                
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
    var Des_ArqueoFisico = "Arqueo de "+req.body.Cod_Caja+" para el Turno "+req.body.Cod_Turno//req.body.Apertura
    var Obs_ArqueoFisico = ''
    var Fecha = fecha_format
    var Flag_Cerrado = req.body.Flag_Cerrado
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
        if(dataArqueoFisico.err) return res.json({respuesta:"error"+dataArqueoFisico.err}) 
         
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
 
 
 
module.exports = router;