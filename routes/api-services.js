var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { UnObfuscateString, TraerConexion } = require('../utility/tools')
var { Ejecutar_Procedimientos, EXEC_SQL,EXEC_SQL_OUTPUT,EXEC_QUERY_DBMaster,EXEC_QUERY, LOGIN_SQL } = require('../utility/exec_sp_sql')

 
router.post('/login_movil', function (req, res) {
    input = req.body 
    parametros = [
        { nom_parametro: 'RUC', valor_parametro: input.RUC },
    ]  

    
    TraerConexion(req,res,function(flag){
        console.log(flag)
        if(flag)
            VerificarLogin(req,res)
        else
            return res.json({respuesta:"error"}) 
    });
     
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

router.post('/venta_simple', function (req, res) { 
   
    TraerConexion(req,res,function(flag){
        if(flag)
            VentaSimple(req,res)
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


function VentaSimple(req,res){

    var input = req.body 
 
    EXEC_SQL('USP_VIS_PERIODOS_TraerPorFechaGestion',TraerGestion(), function (dataPeriodos) {
        if (dataPeriodos.err)
            return res.json({respuesta:"error"})
        
            parametros = [
                { nom_parametro: 'Cod_Caja', valor_parametro: input.Cod_Caja },
                { nom_parametro: 'Cod_Libro', valor_parametro: '14' }
            ]
        
            EXEC_SQL('USP_CAJ_CAJAS_DOC_TXFacRapida',parametros, function (dataFacRapida) {
                if (dataFacRapida.err)
                    return res.json({respuesta:"error"})  
                
                var Cod_Periodo = dataPeriodos.result[0].Cod_Periodo
                var Cod_Caja = input.Cod_Caja
                var Cod_Turno = input.Cod_Turno
                var Cod_TipoOperacion = '01'

                if(dataFacRapida.result.length>0){
                    var Serie = dataFacRapida.result[0].Serie
                    var CodTipoComprobante = dataFacRapida.result[0].Cod_TipoComprobante
                    var Nro_Ticketera = ""
                    if(CodTipoComprobante == "TKB" || CodTipoComprobante == "TKF"){
                        Nro_Ticketera = dataFacRapida.result[0].Nro_SerieTicketera   
                    } 
                    var Id_Cliente = input.Id_Cliente
                    var Cod_TipoDoc = ''
                    var Doc_Cliente = ''
                    var Nom_Cliente = ''
                    var Direccion_Cliente = ''
                    if(Id_Cliente== undefined && Id_Cliente=="" && Id_Cliente==null){

                    }else{
                        Id_Cliente = input.Id_Cliente
                        Cod_TipoDoc = input.Cod_TipoDoc
                        Doc_Cliente = input.Doc_Cliente
                        Nom_Cliente = input.Nom_Cliente
                        Direccion_Cliente = input.Direccion_Cliente 
                    }

                    var FechaEmision = input.FechaEmision
                    var FechaVencimiento = input.FechaVencimiento
                    var FechaCancelacion = input.FechaCancelacion
                    var Glosa = 'POR LA VENTA DE MERCADERIA'
                    var TipoCambio = 1
                    var Flag_Anulado = '0'
                    var Flag_Despachado = '1'
                    var Cod_FormaPago = input.Cod_FormaPago
                    var Descuento_Total = 0
                    var Cod_Moneda = input.Cod_Moneda
                    var Impuesto = input.Impuesto
                    var Total = input.Total
                    var Obs_Comprobante = input.Obs_Comprobante
                    var Id_GuiaRemision = 0
                    var GuiaRemision = ''
                    var id_ComprobanteRef = 0
                    var Cod_Plantilla = null
                    var Numero = ''
                    var Cod_UsuarioVendedor = null
                    var Cod_RegimenPercepcion = null
                    var Tasa_Percepcion = 0
                    var Placa_Vehiculo = ''
                    var Cod_TipoDocReferencia = null
                    var Nro_DocReferencia = null
                    var Valor_Resumen = null
                    var Valor_Firma = null
                    var Cod_EstadoComprobante = 'EMI'
                    var MotivoAnulacion = null
                    var Otros_Cargos = 0
                    var Otros_Tributos = 0
                    var Cod_Usuario = input.Cod_Usuario

                    var parametrosComprobante = [
                        { nom_parametro: 'id_ComprobantePago', valor_parametro: -1, tipo:"output"},
                        { nom_parametro: 'Cod_Libro', valor_parametro: '14'},
                        { nom_parametro: 'Cod_Periodo', valor_parametro:Cod_Periodo},
                        { nom_parametro: 'Cod_Caja', valor_parametro: Cod_Caja},
                        { nom_parametro: 'Cod_Turno', valor_parametro: Cod_Turno},
                        { nom_parametro: 'Cod_TipoOperacion', valor_parametro: Cod_TipoOperacion},
                        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: Cod_TipoComprobante},
                        { nom_parametro: 'Serie', valor_parametro: Serie},
                        { nom_parametro: 'Numero', valor_parametro: Numero},
                        { nom_parametro: 'Id_Cliente', valor_parametro: Id_Cliente},
                        { nom_parametro: 'Cod_TipoDoc', valor_parametro: Cod_TipoDoc},
                        { nom_parametro: 'Doc_Cliente', valor_parametro: Doc_Cliente},
                        { nom_parametro: 'Nom_Cliente', valor_parametro: Nom_Cliente},
                        { nom_parametro: 'Direccion_Cliente', valor_parametro: Direccion_Cliente},
                        { nom_parametro: 'FechaEmision', valor_parametro: FechaEmision},
                        { nom_parametro: 'FechaVencimiento', valor_parametro: FechaEmision},
                        { nom_parametro: 'FechaCancelacion', valor_parametro: FechaEmision},
                        { nom_parametro: 'Glosa', valor_parametro: Glosa},
                        { nom_parametro: 'TipoCambio', valor_parametro: TipoCambio},
                        { nom_parametro: 'Flag_Anulado', valor_parametro: Flag_Anulado},
                        { nom_parametro: 'Flag_Despachado', valor_parametro: Flag_Despachado},
                        { nom_parametro: 'Cod_FormaPago', valor_parametro: Cod_FormaPago},
                        { nom_parametro: 'Descuento_Total', valor_parametro: Descuento_Total},
                        { nom_parametro: 'Cod_Moneda', valor_parametro: Cod_Moneda},
                        { nom_parametro: 'Impuesto', valor_parametro: Impuesto},
                        { nom_parametro: 'Total', valor_parametro: Total},
                        { nom_parametro: 'Obs_Comprobante', valor_parametro: Obs_Comprobante},
                        { nom_parametro: 'Id_GuiaRemision', valor_parametro: Id_GuiaRemision},
                        { nom_parametro: 'GuiaRemision', valor_parametro: GuiaRemision},
                        { nom_parametro: 'id_ComprobanteRef', valor_parametro: id_ComprobanteRef},
                        { nom_parametro: 'Cod_Plantilla', valor_parametro: Cod_Plantilla},
                        { nom_parametro: 'Nro_Ticketera', valor_parametro: Nro_Ticketera},
                        { nom_parametro: 'Cod_UsuarioVendedor', valor_parametro: Cod_UsuarioVendedor},
                        { nom_parametro: 'Cod_RegimenPercepcion', valor_parametro: Cod_RegimenPercepcion},
                        { nom_parametro: 'Tasa_Percepcion', valor_parametro: Tasa_Percepcion},
                        { nom_parametro: 'Placa_Vehiculo', valor_parametro: Placa_Vehiculo},
                        { nom_parametro: 'Cod_TipoDocReferencia', valor_parametro: Cod_TipoDocReferencia},
                        { nom_parametro: 'Nro_DocReferencia', valor_parametro: Nro_DocReferencia},
                        { nom_parametro: 'Valor_Resumen', valor_parametro: Valor_Resumen},
                        { nom_parametro: 'Valor_Firma', valor_parametro: Valor_Firma},
                        { nom_parametro: 'Cod_EstadoComprobante', valor_parametro: Cod_EstadoComprobante},
                        { nom_parametro: 'MotivoAnulacion', valor_parametro: MotivoAnulacion},
                        { nom_parametro: 'Otros_Cargos', valor_parametro: Otros_Cargos},
                        { nom_parametro: 'Otros_Tributos', valor_parametro: Otros_Tributos},
                        { nom_parametro: 'Cod_Usuario', valor_parametro: Cod_Usuario},
                    ]
                    
                    EXEC_SQL_OUTPUT('USP_CAJ_COMPROBANTE_PAGO_G',parametrosComprobante, function (dataComprobante) {
                        if (dataComprobante.err)
                            return res.json({respuesta:"error",detalle_error:'No se pudo guardar correctamente la venta'})
                        
                        //return res.json({respuesta:"ok"})
                        for(var i=0; i<input.productos.length;i++){
                            var parametrosComprobanteDetalles = [
                                { nom_parametro: 'id_ComprobantePago', valor_parametro: dataComprobante.result},
                                { nom_parametro: 'id_Detalle', valor_parametro: i},
                                { nom_parametro: 'Id_Producto', valor_parametro:input.productos[i].Id_Producto},
                                { nom_parametro: 'Cod_Almacen', valor_parametro: input.productos[i].Cod_Almacen},
                                { nom_parametro: 'Cantidad', valor_parametro: input.productos[i].Cantidad},
                                { nom_parametro: 'Cod_UnidadMedida', valor_parametro: input.productos[i].Cod_UnidadMedida},
                                { nom_parametro: 'Despachado', valor_parametro: 1},
                                { nom_parametro: 'Descripcion', valor_parametro: input.productos[i].Descripcion},
                                { nom_parametro: 'PrecioUnitario', valor_parametro: input.productos[i].PrecioUnitario},
                                { nom_parametro: 'Descuento', valor_parametro: input.productos[i].Descuento},
                                { nom_parametro: 'Sub_Total', valor_parametro: input.productos[i].Sub_Total},
                                { nom_parametro: 'Tipo', valor_parametro: input.productos[i].Tipo},
                                { nom_parametro: 'Obs_ComprobanteD', valor_parametro: input.productos[i].Obs_ComprobanteD},
                                { nom_parametro: 'Cod_Manguera', valor_parametro: '001'},
                                { nom_parametro: 'Flag_AplicaImpuesto', valor_parametro: 1},
                                { nom_parametro: 'Formalizado', valor_parametro: 1},
                                { nom_parametro: 'Valor_NoOneroso', valor_parametro: 0},
                                { nom_parametro: 'Cod_TipoISC', valor_parametro: null},
                                { nom_parametro: 'Porcentaje_ISC', valor_parametro: 0},
                                { nom_parametro: 'ISC', valor_parametro: 0},
                                { nom_parametro: 'Cod_TipoIGV', valor_parametro: input.productos[i].Cod_TipoIGV},
                                { nom_parametro: 'Porcentaje_IGV', valor_parametro: input.productos[i].Porcentaje_IGV},
                                { nom_parametro: 'IGV', valor_parametro: input.productos[i].IGV},
                                { nom_parametro: 'Cod_Usuario', valor_parametro: input.Cod_Usuario}
                            ]

                            EXEC_SQL('USP_CAJ_COMPROBANTE_D_G',parametrosComprobanteDetalles, function (dataComprobanteDetalle) {
                                if (dataComprobanteDetalle.err){
                                    return res.json({respuesta:"error",detalle_error:'No se pudo guardar correctamente los detalles de la venta'})
                                    break
                                }   
                            })
                        }
                        return res.json({respuesta:"ok"})

                    })


                }else{
                    return res.json({respuesta:"error",detalle_error:'No se puede continuar ya que no se configuro un documento para emision rapida'})  
                }
            })
        
    }) 
}

function VerificarArqueoCaja(req,res){ 
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

            EXEC_SQL('USP_PRI_EMPRESA_TraerUnicaEmpresa', [], function (dataEmpresa) {
                if (dataEmpresa.err){
                    return res.json({respuesta:"error"}) 
                } 

                var Cod_Empresa=dataEmpresa.result[0].Cod_Empresa
                p = [
                    { nom_parametro: 'Cod_Empresa', valor_parametro: Cod_Empresa }
                ]

                EXEC_SQL('USP_PRI_EMPRESA_TXPK', p , function (dataE) {
                    if(dataE.err) return res.json({respuesta:"error"}) 


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
                                                //console.log("caja diferente")
                                                
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
                                        
                                                                                return res.json({respuesta:"ok",empresa:dataE.result[0],flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result,data_cierre:{flag_apertura:'NUEVO',saldo:0,Cod_Turno:{}}}}) 
                                                                                //return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,data_cierre:{flag_apertura:'NUEVO',saldo:0,Cod_Turno:{}}}}) 
                                        
                                                                            }else{
                                        
                                                                                if(dataSaldoAnterior.result[0].Flag_Cerrado.toString().toUpperCase()=="TRUE"){
                                                                                    return res.json({respuesta:"ok",empresa:dataE.result[0],flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result,data_cierre:{flag_apertura:'CERRADO',saldo:dataSaldoAnterior.result[0].Monto?dataSaldoAnterior.result[0].Monto:0,Cod_Turno:{}}}}) 
                                                                                    //return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1, data_cierre:{flag_apertura:'CERRADO',saldo:dataSaldoAnterior.result[0].Monto?dataSaldoAnterior.result[0].Monto:0,Cod_Turno:{}}}}) 
                                                                                }else{
                                                                                    return res.json({respuesta:"ok",empresa:dataE.result[0],flag_caja_abierta:"no",data:{numero:dataNumero.result.length==0?1:dataNumero.result[0].Numero+1,Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result,data_cierre:{flag_apertura:'ABIERTO',saldo:dataSaldoAnterior.result[0].Monto?dataSaldoAnterior.result[0].Monto:0,Cod_Turno:dataSaldoAnterior.result[0].Cod_Turno}}}) 
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
                                                                                            
                                                                                            return res.json({respuesta:"ok",empresa:dataE.result[0],flag_caja_abierta:"no",data:{numero:'-1',Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result,data_cierre:{flag_apertura:'CERRADO',saldo:0,Cod_Turno:''}}}) 
                                                                                            //return res.json({respuesta:"ok",flag_caja_abierta:"no",data:{numero:'', data_cierre:{flag_apertura:'CERRADO',saldo:0,Cod_Turno:''}}}) 
                                                                                            //return res.json({respuesta:"ok",flag_caja_abierta:_flag_caja_abierta,data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result}}) 
                                                                                        }
                                                                                    })
                                                                                })
                                        
                                                                                //VerificarLogin(req,res,"no")
                                                                            }else{
                                                                                return res.json({respuesta:"ok",empresa:dataE.result[0],flag_caja_abierta:"ok",data:{numero:'-1',Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result,data_cierre:{flag_apertura:'ABIERTO',saldo:0,Cod_Turno:''}}}) 
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
                                                    return res.json({respuesta:"ok",empresa:dataE.result[0],flag_caja_abierta:"error",data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result}}) 
                                                    //res.json({respuesta:"error"})
                                                }                  
                                            })
        
        
        
                                        }else{
                                            return res.json({respuesta:"ok",empresa:dataE.result[0],flag_caja_abierta:"no",data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result}}) 
                                        }
                                        
                                        //return res.json({respuesta:"ok",flag_caja_abierta:_flag_caja_abierta,data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:e.result,periodos:dataPeriodos.result[0],turnos:dataTurnos.result}}) 
                                    }
                                })
                            })
        
                        }else{
                            
                            return res.json({respuesta:"ok",empresa:dataE.result[0],flag_caja_abierta:"no",data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick,cajas:[],periodos:[],turnos:[]}}) 
                        
                        }             
                    }) 

                    
                })


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