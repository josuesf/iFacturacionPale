var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')

var { TraerConexion,RUCValido } = require('../utility/tools')
var { EXEC_SQL } = require('../utility/exec_sp_sql')

var arrayValidacionTipoComprobante = ['BE','FE']
var arrayValidacionTipoComprobanteNotas = ['NCE','NDE']
var jsonValidacionMotivosNotaCredito = {
    '01':'POR LA ANULACION DE LA OPERACION DE :',
    '02': 'POR LA ANULACION POR ERROR EN EL RUC DE :',
    '03':'POR CORRECCION POR ERROR EN LA DESCRIPCION DE :',
    '04':'POR DESCUENTO GLOBAL DE :',
    '05': 'POR DESCUENTO POR ITEM DE :',
    '06':'POR DEVOLUCION TOTAL DE : ',
    '07':'POR DEVOLUCION POR ITEM DE : ',
    '08':'POR BONIFICACION DE :',
    '09':'POR DISMINUCION EN EL VALOR DEL ITEM DE :',
    '10':'POR OTROS CONCEPTOS DE : '
} 
var jsonValidacionMotivosNotaDebito = {
    '01':'POR INTERES POR MORA DE :',
    '02':'POR AUMENTO EN EL VALOR DE LOS ITEMS DE :',
    '03':' POR PENALIDADES/OTROS CONCEPTOS DE : '
}

var arrayValidacion = [null,'null','',undefined]
var Cod_Libro = '14'
 
router.post('/get_token', function (req, res) {
    input = req.body 
    var user = {data:input.RUC};

    var token = jwt.sign(user, 'secret', {
        expiresIn: 86400 // un dia
    });
    return res.json({respuesta:"ok",data:token}) 
 
});

router.post('/guardar_comprobante', function (req, res) { 
    input = req.body
    let token = input.token
    let RUC = input.RUC

    if (token) {
        jwt.verify(token, 'secret', function(err, token_data) {
            if (err) {
                return res.json({respuesta:"error", data:"El token no es valido"})
            }else{
                TraerConexion(req,res,function(flag,result){
                    if(flag)
                        ComprobantePago(req,res)
                    else
                        return res.json({respuesta:"error", data:result}) 
                });
            }
        });
    } else {
        return res.json({respuesta:"error", data:"Es necesario el token de autorizacion"}) 
    }
}); 

router.post('/guardar_nota_credito_debito', function (req, res) { 
    input = req.body
    let token = input.token
    let RUC = input.RUC

    if (token) {
        jwt.verify(token, 'secret', function(err, token_data) {
            if (err) {
                return res.json({respuesta:"error", data:"El token no es valido"})
            }else{
                TraerConexion(req,res,function(flag,result){
                    if(flag)
                        NotaCreditoDebito(req,res)
                    else
                        return res.json({respuesta:"error", data:result}) 
                });
            }
        });
    } else {
        return res.json({respuesta:"error", data:"Es necesario el token de autorizacion"}) 
    }
}); 

function ComprobantePago(req,res){
    var input = req.body 
    ValidarDatos(input,function(flag,result){
        if(flag){
            EXEC_SQL('USP_VIS_PERIODOS_TraerPorFechaGestion',TraerGestion(), function (dataPeriodos) {
                
                var Cod_Periodo = dataPeriodos.result[0].Cod_Periodo
                var Cod_Caja = input.Cod_Caja
                var Cod_Turno = input.Cod_Turno
                
                DataCliente(input,function(flag_cliente,result_cliente){
                    if(flag_cliente){
                        var Cod_TipoDoc = input.Cod_TipoDoc
                        var Doc_Cliente = input.Doc_Cliente
                        var Nom_Cliente = input.Nom_Cliente
                        var Direccion_Cliente = input.Direccion_Cliente
                        var Flag_AplicaImpuesto = input.Flag_AplicaImpuesto?input.Flag_AplicaImpuesto:'1'
                        var Flag_Servicios = input.Flag_Servicios?input.Flag_Servicios:'0' 
                        var Flag_DetallesIncluyeIGV = input.Flag_DetallesIncluyeIGV?input.Flag_DetallesIncluyeIGV:'1' 
                        var Cod_TipoOperacion = Flag_AplicaImpuesto=='0'?'01':'02'
                        var Cod_TipoComprobante = input.Cod_TipoComprobante
                        var Nro_Ticketera = "" 
                        var FechaEmision = input.Fecha_Emision
                        var FechaVencimiento = input.Fecha_Emision
                        if(input.Cod_FormaPago=='999' && !arrayValidacion.includes(input.Nro_Dias)){
                            Date.prototype.addDays = function (days) {
                                var dat = new Date(this.valueOf());
                                dat.setDate(dat.getDate() + days);
                                return dat;
                            }
                            var FechaDiasMas = new Date(input.Fecha_Emision).addDays(parseInt(input.Nro_Dias))
                            const mes = FechaDiasMas.getMonth() + 1
                            const dia = FechaDiasMas.getDate()
                            var FechaDiasMas_ = FechaDiasMas.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
                            FechaVencimiento = FechaDiasMas_
                        } 
                        var FechaCancelacion = input.Fecha_Emision
                        var Glosa = input.Glosa?input.Glosa:'POR LA VENTA DE MERCADERIA'

                        CalcularTotal(0,input,0,0,function(Total_,Sub_Total_,Impuesto_,Otros_Cargos_){
                            var TipoCambio = input.Tipo_Cambio
                            var Flag_Anulado = '0'
                            var Flag_Despachado = '1'
                            var Cod_FormaPago = input.Cod_FormaPago
                            var Descuento_Total = input.Descuento_Global
                            var Cod_Moneda = input.Cod_Moneda
                            var Impuesto = Flag_AplicaImpuesto=='0'?Impuesto_:0
                            var Total = parseFloat(Total_).toFixed(2)
                            var Obs_Comprobante = input.Obs_Comprobante
                            var Id_GuiaRemision = input.Id_GuiaRemision?input.Id_GuiaRemision:null
                            var GuiaRemision = input.GuiaRemision?input.GuiaRemision:null
                            var id_ComprobanteRef = 0
                            var Cod_Plantilla = null
                            var Serie = input.Serie 
                            var Numero = input.Numero
                            var Cod_UsuarioVendedor = input.Cod_Usuario
                            var Cod_RegimenPercepcion = null
                            var Tasa_Percepcion = 0
                            var Placa_Vehiculo = input.Placa_Vehiculo?input.Placa_Vehiculo:''
                            var Cod_TipoDocReferencia = null
                            var Nro_DocReferencia = null
                            var Valor_Resumen = null
                            var Valor_Firma = null
                            var Cod_EstadoComprobante = 'EMI'
                            var MotivoAnulacion = null
                            var Otros_Cargos = Otros_Cargos_
                            var Otros_Tributos = input.Otros_Tributos
                            var Cod_Usuario = input.Cod_Usuario
            
                            var parametrosComprobante = [ 
                                { nom_parametro: 'Cod_Libro', valor_parametro: Cod_Libro},
                                { nom_parametro: 'Cod_Periodo', valor_parametro:Cod_Periodo},
                                { nom_parametro: 'Cod_Caja', valor_parametro: Cod_Caja},
                                { nom_parametro: 'Cod_Turno', valor_parametro: Cod_Turno},
                                { nom_parametro: 'Cod_TipoOperacion', valor_parametro: Cod_TipoOperacion},
                                { nom_parametro: 'Cod_TipoComprobante', valor_parametro: Cod_TipoComprobante},
                                { nom_parametro: 'Serie', valor_parametro: Serie},
                                { nom_parametro: 'Numero', valor_parametro: Numero,tipo_parametro:sql.VarChar}, 
                                { nom_parametro: 'Cod_TipoDoc', valor_parametro: Cod_TipoDoc},
                                { nom_parametro: 'Doc_Cliente', valor_parametro: Doc_Cliente},
                                { nom_parametro: 'Nom_Cliente', valor_parametro: Nom_Cliente},
                                { nom_parametro: 'Direccion_Cliente', valor_parametro: Direccion_Cliente},
                                { nom_parametro: 'FechaEmision', valor_parametro: FechaEmision},
                                { nom_parametro: 'FechaVencimiento', valor_parametro: FechaVencimiento},
                                { nom_parametro: 'FechaCancelacion', valor_parametro: FechaCancelacion},
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
                            
                            EXEC_SQL('USP_CAJ_COMPROBANTE_PAGO_I',parametrosComprobante, function (dataComprobante) {
                                if (dataComprobante.err){
                                    return res.json({respuesta:"error",data:dataComprobante.err})
                                } 
                                DataDetalles(0,input,Flag_DetallesIncluyeIGV,Flag_Servicios,Flag_AplicaImpuesto,function(flag,resultDetalles){
                                    if(flag){
                                        DataFormasPago(0,input,function(flag_fp, resultFP){
                                            if(flag_fp){
                                                return res.json({respuesta:"ok",data:"Registro exitoso"})
                                            }else{
                                                return res.json({respuesta:"error",data:resultFP}) 
                                            }
                                        })
                                    }else{
                                        return res.json({respuesta:"error",data:resultDetalles})
                                    }
                                }) 
                            })
                        })
                    }else{
                        return res.json({respuesta:"error", result_cliente}) 
                    }
                })
            })    
        }else{
            return res.json({respuesta:"error", result}) 
        }
    })
}

function NotaCreditoDebito(req,res){
    var input = req.body
    ValidaDatosNotas(input,function(flag,result){
        if(flag){
            let Cod_TipoComprobante = input.Cod_TipoComprobante
            let Serie = input.Serie
            let Numero = input.Numero
            let Cod_TipoDoc = input.Cod_TipoDoc
            let Doc_Cliente = input.Doc_Cliente
            let Nom_Cliente = input.Nom_Cliente
            let Direccion_Cliente = input.Direccion_Cliente
            let Fecha_Emision = input.Fecha_Emision
            let Fecha_Vencimiento = input.Fecha_Emision
            let Fecha_Cancelacion = input.Fecha_Emision
            let Tipo_Cambio = input.Tipo_Cambio
            let Flag_Anulado = false
            let Glosa = (Cod_TipoComprobante=='NCE')?jsonValidacionMotivosNotaCredito[input.Cod_MotivoNota]:jsonValidacionMotivosNotaDebito[input.Cod_MotivoNota]
            let Cod_FormaPago = '999'
            let Descuento_Total = input.Descuento_Global
            let Cod_Moneda = input.Cod_Moneda
            let Cod_Caja = input.Cod_Caja
            let Cod_Turno = input.Cod_Turno
            

        }else{
            return res.json({respuesta:"error",data:result})  
        }
    })
}   

//----------- functions notas de credito y debito
function ValidaDatosNotas(input,callback){
    let Cod_TipoDoc = input.Cod_TipoDoc 
    let Nom_Cliente = input.Nom_Cliente
    if(!arrayValidacion.includes(Cod_TipoDoc) && !arrayValidacion.includes(Nom_Cliente)){
        switch(Cod_TipoDoc){
            case '1':
                let tamanio_doc = input.Doc_Cliente?input.Doc_Cliente.toString().trim().length:0
                if(tamanio_doc==8){
                    ValidaDatosNotasSP(input,function(flag,result){
                        callback(flag,result)
                    })
                }else{
                    callback(false,"Es necesario ingresar un DNI valido")
                }
                break
            case '6':
                let RUC_ = input.Doc_Cliente?input.Doc_Cliente.toString().trim():''
                let Flag = RUCValido(RUC_)
                if(Flag){
                    ValidaDatosNotasSP(input,function(flag,result){
                        callback(flag,result)
                    })
                }else{
                    callback(false,"Es necesario ingresar un RUC valido")
                }
                break
            case '0':
                ValidaDatosNotasSP(input,function(flag,result){
                    callback(flag,result)         
                })
                break
            case '7':
                ValidaDatosNotasSP(input,function(flag,result){
                    callback(flag,result)     
                })
                break
            default:
                callback(false,"El codigo de documento del cliente no esta permitido")
                break
        }
      
    }else{
        callback(false,"Existen algunos campos vacios en los datos del cliente que son requeridos")
    }
}

function ValidaDatosNotasSP(input,callback){ 
    let Serie = input.Serie
    let SerieAfectado = input.SerieAfectado
    let Numero = input.Numero
    let NumeroAfectado = input.NumeroAfectado
    let Cod_TipoComprobante = input.Cod_TipoComprobante
    let Cod_TipoComprobanteAfectado = input.Cod_TipoComprobanteAfectado
    let Fecha_Emision = input.Fecha_Emision

    if(!arrayValidacion.includes(Serie) && !arrayValidacion.includes(Numero)){
        if(!arrayValidacion.includes(SerieAfectado) && !arrayValidacion.includes(NumeroAfectado)){
            if(arrayValidacionTipoComprobanteNotas.includes(Cod_TipoComprobante)){
                if(arrayValidacionTipoComprobante.includes(Cod_TipoComprobanteAfectado)){
                    const parametrosComprobante = [
                        {nom_parametro:'Cod_Libro',valor_parametro:Cod_Libro},
                        {nom_parametro:'Cod_TipoComprobante',valor_parametro:Cod_TipoComprobanteAfectado},
                        {nom_parametro:'Serie',valor_parametro:SerieAfectado},
                        {nom_parametro:'Numero',valor_parametro:NumeroAfectado}
                    ]
                    EXEC_SQL('USP_CAJ_COMPROBANTE_PAGO_TraerXCodLibro_CodTipo_Serie_Numero',parametrosComprobante, function (dataComprobante) {
                        if (dataComprobante.err){
                            return res.json({respuesta:"error",data:dataComprobante.err})  
                        }else{
                            let id_ComprobantePago = dataComprobante.result[0].id_ComprobantePago
                            let FechaComprobanteAfectado =dataComprobante.result[0].FechaEmision
                            let FechaInicio = new Date(Fecha_Emision) 
                            if(FechaInicio.getTime()>=FechaComprobanteAfectado.getTime()){
                                const parametros = [
                                    {nom_parametro:'id_ComprobantePago',valor_parametro:id_ComprobantePago}
                                ]
                                EXEC_SQL('USP_CAJ_COMPROBANTE_RELACION_TNotasXIdComprobante',parametros, function (dataRelacion) {
                                    if (dataRelacion.err){
                                        return res.json({respuesta:"error",data:dataRelacion.err})  
                                    }else{
                                        ValidaRelacionNotas(0,dataRelacion.result,function(flag_relacion){
                                            if(!flag_relacion){
                                                if(Cod_TipoComprobante=='NCE'){
                                                     
                                                    EXEC_SQL('USP_CAJ_COMPROBANTE_D_TraerDetallesXIdComprobante',parametros, function (dataDetalle) {
                                                        if (dataDetalle.err){
                                                            return res.json({respuesta:"error",data:dataDetalle.err})  
                                                        }else{
                                                            if(dataDetalle.result.length>0){
                                                                if(input.Cod_MotivoNota!='04'){
                                                                    callback(true)
                                                                }else{
                                                                    callback(true)
                                                                }
                                                            }else{
                                                                callback(false,"El comprobante afectado no cuenta con detalles")
                                                            }
                                                        }
                                                    })

                                                }else{
                                                    callback(true)
                                                }
                                            }else{
                                                callback(false,"El comprobante ya se encuentra afectado por una o varias notas de credito")
                                            }
                                        })
                                    }
                                })
                            }else{
                                callback(false,"La fecha del documento es menor a la fecha del comprobante afectado")
                            }
                        }
                    })
                }else{
                    callback(false,"El codigo del documento afectado no es permitido")  
                }
            }else{
                callback(false,"Solo es aceptado notas de credito y debito electronicas")  
            }
        }else{
            callback(false,"Existen campos vacios en la serie o numero del comprobante afectado")
        }
    }else{
        callback(false,"Existen campos vacios en la serie o numero del comprobante")
    }
}

function ValidaRelacionNotas(i,arregloDocumentos,callback){
    if(i<arregloDocumentos.length){
        if(arregloDocumentos[i].Cod_TipoComprobante.toString()=='07'){
            callback(true)
        }else{
            ValidaDatosNotas(i+1,arregloDocumentos,callback)
        }
    }else{
        callback(false)
    }
}

function CalcularTotalNota(){
   
}

function CalcularTotalComprobante(){

}

//----------- functions comprobante 
function DataCliente(input,callback){ 
    let Cod_TipoDoc = input.Cod_TipoDoc
    let Doc_Cliente = input.Doc_Cliente
    let Nom_Cliente = input.Nom_Cliente
    let Direccion_Cliente = input.Direccion_Cliente
 
    let parametrosCliente = [ 
        { nom_parametro: 'Cod_TipoDocumento', valor_parametro: input.Cod_TipoDoc },
        { nom_parametro: 'Nro_Documento', valor_parametro: input.Doc_Cliente },
        { nom_parametro: 'Cliente', valor_parametro: input.Nom_Cliente },
        { nom_parametro: 'Ap_Paterno', valor_parametro: '' },
        { nom_parametro: 'Ap_Materno', valor_parametro: '' },
        { nom_parametro: 'Nombres', valor_parametro: input.Nom_Cliente },
        { nom_parametro: 'DireccioN', valor_parametro: input.Direccion_Cliente },
        { nom_parametro: 'Cod_EstadoCliente', valor_parametro: '001' },
        { nom_parametro: 'Cod_CondicionCliente', valor_parametro: '01' },
        { nom_parametro: 'Cod_TipoCliente', valor_parametro: '003' },
        { nom_parametro: 'RUC_Natural', valor_parametro: '' },
        { nom_parametro: 'Foto', tipo_parametro: sql.VarBinary,valor_parametro: null },
        { nom_parametro: 'Firma', tipo_parametro: sql.VarBinary,valor_parametro: null },
        { nom_parametro: 'Cod_TipoComprobante', valor_parametro: 'TKB' },
        { nom_parametro: 'Cod_Nacionalidad', valor_parametro: '156' },
        { nom_parametro: 'Fecha_Nacimiento', valor_parametro: null },
        { nom_parametro: 'Cod_Sexo', valor_parametro: '01' },
        { nom_parametro: 'Email1', valor_parametro: '' },
        { nom_parametro: 'Email2', valor_parametro: '' },
        { nom_parametro: 'Telefono1', valor_parametro: '' },
        { nom_parametro: 'Telefono2', valor_parametro: ''},
        { nom_parametro: 'Fax', valor_parametro: '' },
        { nom_parametro: 'PaginaWeb', valor_parametro: '' },
        { nom_parametro: 'Cod_Ubigeo', valor_parametro: '080101' },
        { nom_parametro: 'Cod_FormaPago', valor_parametro: '008' },
        { nom_parametro: 'Limite_Credito', valor_parametro: 0 },
        { nom_parametro: 'Obs_Cliente', valor_parametro: null},
        { nom_parametro: 'Num_DiaCredito', valor_parametro: 0 },
        { nom_parametro: 'Cod_Usuario', valor_parametro: input.Cod_Usuario }
    ]

    EXEC_SQL('USP_PRI_CLIENTE_PROVEEDOR_I',parametrosCliente, function (dataCliente) {
        if (dataCliente.err)
            callback(false,'No se pudo registrar el cliente correctamente')  
        
        callback(true)
    })
}

function CalcularTotal(i,input,Suma,SumaExoneracion,callback){
    if(i<input.detalles.length){
        switch(input.detalles[i].Tipo){
            case 'GRA':
                Suma +=parseFloat(input.detalles[i].Sub_Total)
                break
            case 'INA':
                SumaExoneracion +=parseFloat(input.detalles[i].Sub_Total)
                break
            case 'EXO':
                SumaExoneracion+=parseFloat(input.detalles[i].Sub_Total)
                break
            case 'OTR':
                SumaExoneracion+=parseFloat(input.detalles[i].Sub_Total)
                break
            case 'NGR':
                Suma+=parseFloat(input.detalles[i].Sub_Total)
                break
            default:
                Suma+=parseFloat(input.detalles[i].Sub_Total)
                break
        }
        CalcularTotal(i+1,input,Suma,SumaExoneracion,callback)
    }else{
        let Flag_AplicaImpuesto = input.Flag_AplicaImpuesto?input.Flag_AplicaImpuesto:'0'
        var Flag_DetallesIncluyeIGV = input.Flag_DetallesIncluyeIGV?input.Flag_DetallesIncluyeIGV:'1' 
        var Flag_Servicios = input.Flag_Servicios?input.Flag_Servicios:'0' 
        let Total = 0
        let Sub_Total = 0
        let Impuesto = 0
        let Otros_Cargos = 0
        Suma+=SumaExoneracion
        if(Flag_DetallesIncluyeIGV=='1'){
            if(Flag_AplicaImpuesto=='1'){
                if(Flag_Servicios=='1'){
                    Sub_Total = Suma / (parseFloat('100.00')+parseFloat(input.Por_Impuesto)/100) 
                    Impuesto = Sub_Total * (parseFloat(input.Por_Impuesto)/100)
                    Otros_Cargos = Sub_Total * (0.1)
                }else{
                    Sub_Total = Suma / (parseFloat('100.00')+parseFloat(input.Por_Impuesto)/100) 
                    Impuesto = Sub_Total * (parseFloat(input.Por_Impuesto)/100)
                    Otros_Cargos = 0 
                }
            }else{//no se aplica IGV
                if(Flag_Servicios=='1'){
                    Sub_Total = Suma/((parseFloat('100.00')+10)/100)
                    Impuesto = 0
                    Otros_Cargos = Sub_Total * (0.1) 
                }else{
                    Sub_Total = Suma
                    Impuesto = 0
                    Otros_Cargos = 0
                }
            }
        }else{// los detalles no incluyen ningun impuesto
            if(Flag_AplicaImpuesto=='1'){
                if(Flag_Servicios){
                    Sub_Total = Suma
                    Impuesto = Sub_Total * (parseFloat(input.Por_Impuesto)/100)
                    Otros_Cargos = Sub_Total * (0.1)
                }else{
                    Sub_Total = Suma
                    Impuesto = Sub_Total * (parseFloat(input.Por_Impuesto)/100)
                    Otros_Cargos = 0
                }
            }else{
                if(Flag_Servicios){
                    Sub_Total = Suma
                    Impuesto = 0
                    Otros_Cargos = Sub_Total * (0.1)
                }else{
                    Sub_Total = Suma
                    Impuesto = 0
                    Otros_Cargos = 0
                }
            }
        }
        Total = parseFloat(Sub_Total+Otros_Cargos+Impuesto-parseFloat(input.Descuento_Global)).toFixed(2)
        callback(Total,Sub_Total,Impuesto,Otros_Cargos)
    }
}
 
function DataDetalles(i,input,flag_incluye_igv,flag_servicios,flag_aplica_impuesto,callback){
    if(i<input.detalles.length){
        DeterminarTipoIGV(input,dataDetalle,function(Cod_TipoIGV,IGV){
            let PrecioUnitario_=0
            let Sub_Total_=0
            if(flag_incluye_igv=='1'){
                PrecioUnitario_ = parseFloat(input.detalles[i].PrecioUnitario)
                Sub_Total_ = parseFloat(parseFloat(input.detalles[i].Sub_Total).toFixed(2))
            }else{
                PrecioUnitario_ = parseFloat(input.detalles[i].PrecioUnitario)*(1+parseFloat(input.Por_Impuesto)/100)
                Sub_Total_ = parseFloat(parseFloat(parseFloat(input.detalles[i].Sub_Total).toFixed(2))*(1+parseFloat(input.Por_Impuesto)/100)).toFixed(2)
            }
    
            if(flag_servicios=='1' && flag_incluye_igv=='1'){
                PrecioUnitario_ = parseFloat(input.detalles[i].PrecioUnitario)/((100+(flag_aplica_impuesto=='1'?parseFloat(input.Por_Impuesto):0)+10)/100)
                Sub_Total_ =  parseFloat(parseFloat(input.detalles[i].Cantidad)*parseFloat(input.detalles[i].PrecioUnitario)-parseFloat(input.detalles[i].Descuento)).toFixed(2)
            } 
    
    
            var parametrosComprobanteDetalles = [ 
                { nom_parametro: 'Cod_Libro', valor_parametro: Cod_Libro},
                { nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
                { nom_parametro: 'Serie', valor_parametro: input.Serie},
                { nom_parametro: 'Numero', valor_parametro: input.Numero},
                { nom_parametro: 'Cod_TipoDoc', valor_parametro: input.Cod_TipoDoc},
                { nom_parametro: 'Doc_Cliente', valor_parametro: input.Doc_Cliente},
                { nom_parametro: 'id_Detalle', valor_parametro: i+1},
                { nom_parametro: 'Id_Producto', valor_parametro:input.detalles[i].Id_Producto},
                { nom_parametro: 'Cod_Almacen', valor_parametro: input.detalles[i].Cod_Almacen},
                { nom_parametro: 'Cantidad', valor_parametro: input.detalles[i].Cantidad},
                { nom_parametro: 'Cod_UnidadMedida', valor_parametro: input.detalles[i].Cod_UnidadMedida},
                { nom_parametro: 'Despachado', valor_parametro: 1},
                { nom_parametro: 'Descripcion', valor_parametro: input.detalles[i].Descripcion},
                { nom_parametro: 'PrecioUnitario', valor_parametro:  PrecioUnitario_},
                { nom_parametro: 'Descuento', valor_parametro: input.detalles[i].Descuento},
                { nom_parametro: 'Sub_Total', valor_parametro: Sub_Total_},
                { nom_parametro: 'Tipo', valor_parametro: input.detalles[i].Tipo},
                { nom_parametro: 'Obs_ComprobanteD', valor_parametro: input.detalles[i].Obs_ComprobanteD},
                { nom_parametro: 'Cod_Manguera', valor_parametro: '001'},
                { nom_parametro: 'Flag_AplicaImpuesto', valor_parametro: parseInt(input.Flag_AplicaImpuesto?input.Flag_AplicaImpuesto:'0')},
                { nom_parametro: 'Formalizado', valor_parametro: 0},
                { nom_parametro: 'Valor_NoOneroso', valor_parametro: 0},
                { nom_parametro: 'Cod_TipoISC', valor_parametro: null},
                { nom_parametro: 'Porcentaje_ISC', valor_parametro: 0},
                { nom_parametro: 'ISC', valor_parametro: 0},
                { nom_parametro: 'Cod_TipoIGV', valor_parametro:Cod_TipoIGV},
                { nom_parametro: 'Porcentaje_IGV', valor_parametro: input.Por_Impuesto},
                { nom_parametro: 'IGV', valor_parametro:IGV},
                { nom_parametro: 'Cod_Usuario', valor_parametro: input.Cod_Usuario}
            ]
    
            EXEC_SQL('USP_CAJ_COMPROBANTE_D_I',parametrosComprobanteDetalles, function (dataComprobanteDetalle) {
                if (dataComprobanteDetalle.err){
                    callback(false,dataComprobanteDetalle.err)
                }else{
                    DataDetalles(i+1,input,flag_incluye_igv,flag_servicios,flag_aplica_impuesto,callback)
                }   
            })
        })
    }else{
        callback(true)
    }   
}

function DataFormasPago(i,input,callback){
    if(i<input.formas_pago.length){
        const parametrosFormaPago = [
            {nom_parametro: 'Cod_Libro', valor_parametro: Cod_Libro},
            {nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
            {nom_parametro: 'Serie', valor_parametro: input.Serie},
            {nom_parametro: 'Numero', valor_parametro: input.Numero},
            {nom_parametro: 'Cod_TipoDoc', valor_parametro: input.Cod_TipoDoc},
            {nom_parametro: 'Doc_Cliente', valor_parametro: input.Doc_Cliente},
            {nom_parametro:'Item',valor_parametro:i+1},
            {nom_parametro:'Des_FormaPago',valor_parametro:input.formas_pago[i].Des_FormaPago},
            {nom_parametro:'Cod_TipoFormaPago',valor_parametro:input.formas_pago[i].Cod_FormaPago},
            {nom_parametro:'Cuenta_CajaBanco',valor_parametro:''},
            {nom_parametro:'Id_Movimiento',valor_parametro:0},
            {nom_parametro:'TipoCambio',valor_parametro:input.TipoCambio},
            {nom_parametro:'Cod_Moneda',valor_parametro:input.Cod_Moneda},
            {nom_parametro:'Monto',valor_parametro:input.formas_pago[i].Monto},
            {nom_parametro:'Cod_Caja',valor_parametro:input.Cod_Caja},
            {nom_parametro:'Cod_Turno',valor_parametro:input.Cod_Turno},
            {nom_parametro:'Cod_Plantilla',valor_parametro:''},
            {nom_parametro:'Obs_FormaPago',valor_parametro:''},
            {nom_parametro:'Fecha',valor_parametro:input.Fecha_Emision},        
            {nom_parametro:'Cod_Usuario',valor_parametro: input.Cod_Usuario},
        ]

        EXEC_SQL('USP_CAJ_FORMA_PAGO_I',parametrosFormaPago, function (dataFormaPago) {
            if (dataFormaPago.err){
                callback(false,dataFormaPago.err)
            } else{
                DataFormasPago(i+1,input,callback)
            }
        })
    }else{
        callback(true)
    }
}

function ValidarDatos(input,callback){
    
    let Cod_TipoDoc = input.Cod_TipoDoc 
    let Nom_Cliente = input.Nom_Cliente
    
    if(!arrayValidacion.includes(Cod_TipoDoc) && !arrayValidacion.includes(Nom_Cliente)){
        switch(Cod_TipoDoc){
            case '1':
                let tamanio_doc = input.Doc_Cliente?input.Doc_Cliente.toString().trim().length:0
                if(tamanio_doc==8){
                   ValidarDatosSP(input,function(flag,result){
                       callback(flag,result)
                   })
                }else{
                    callback(false,"Es necesario ingresar un DNI valido")
                }
                break
            case '6':
                let RUC_ = input.Doc_Cliente?input.Doc_Cliente.toString().trim():''
                let Flag = RUCValido(RUC_)
                if(Flag){
                    ValidarDatosSP(input,function(flag,result){
                        callback(flag,result)
                    })
                }else{
                    callback(false,"Es necesario ingresar un RUC valido")
                }
                break
            case '0':
                ValidarDatosSP(input,function(flag,result){
                    callback(flag,result)
                })
                break
            case '7':
                ValidarDatosSP(input,function(flag,result){
                    callback(flag,result)
                })
                break
            default:
                callback(false,"El codigo de documento del cliente no esta permitido")
                break
        }
      
    }else{
        callback(false,"Existen algunos campos vacios en los datos del cliente que son requeridos")
    }
}

function ValidarDatosSP(input,callback){ 
    let Serie = input.Serie
    let Numero = input.Numero
    let Cod_TipoComprobante = input.Cod_TipoComprobante
    let detalles = input.detalles

    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const dia = fecha.getDate()
    var fecha_actual = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
    
    var fecha = input.Fecha_Emision
    var fechaInicio = new Date(fecha_actual).getTime();
    var fechaFin    = new Date(fecha).getTime();
    diff = fechaFin - fechaInicio;
    diff = diff/(1000*60*60*24) 

    if(!arrayValidacion.includes(Serie) && !arrayValidacion.includes(Numero)){
        if(arrayValidacionTipoComprobante.includes(Cod_TipoComprobante)){
            switch(Cod_TipoComprobante){
                case 'FE':
                    if(input.Cod_TipoDoc.toString()=='1'){
                        callback(false,"Una factura debe estar relacionada a un RUC")
                    }else{
                        let parametrosComprobante = [
                            {nom_parametro:'Cod_TipoComprobante',valor_parametro:Cod_TipoComprobante},
                            {nom_parametro:'Serie',valor_parametro:Serie},
                            {nom_parametro:'CodLibro',valor_parametro:Cod_Libro}
                        ]
                    
                        EXEC_SQL('USP_CAJ_COMPROBANTE_PAGO_NumeroXTipoSerieLibro',parametrosComprobante, function (dataComprobante) {
                            if (dataComprobante.err){
                                return res.json({respuesta:"error",data:dataComprobante.err})  
                            }else{
                                if(dataComprobante.result[0].NumeroSiguiente.toString()==Numero.toString()){
                                    if(detalles.length>0){
                                        if(diff<-7){
                                            callback(false,"Solo se puede facturar hasta 7 dias atras")
                                        }else{
                                            callback(true,"ok")
                                        }
                                    }else{
                                        callback(false,"Se debe ingresar como minimo un detalle en el Comprobante")
                                    }
                                }else{
                                    callback(false,"El numero correlativo es incorrecto")
                                }
                            }  
                        })
                    }
                    break
                case 'BE':
                    if(input.Cod_TipoDoc.toString()=='6'){ 
                        callback(false,"Una boleta debe estar relacionada a un DNI")
                    }else{
                        let parametrosComprobante = [
                            {nom_parametro:'Cod_TipoComprobante',valor_parametro:Cod_TipoComprobante},
                            {nom_parametro:'Serie',valor_parametro:Serie},
                            {nom_parametro:'CodLibro',valor_parametro:Cod_Libro}
                        ]
                    
                        EXEC_SQL('USP_CAJ_COMPROBANTE_PAGO_NumeroXTipoSerieLibro',parametrosComprobante, function (dataComprobante) {
                            if (dataComprobante.err){
                                return res.json({respuesta:"error",data:dataComprobante.err})  
                            }else{
                                if(dataComprobante.result[0].NumeroSiguiente.toString()==Numero.toString()){
                                    if(detalles.length>0){
                                        if(diff<-7){
                                            callback(false,"Solo se puede facturar hasta 7 dias atras")
                                        }else{
                                            callback(true,"ok")
                                        }
                                    }else{
                                        callback(false,"Se debe ingresar como minimo un detalle en el Comprobante")
                                    }
                                }else{
                                    callback(false,"El numero correlativo es incorrecto")
                                }
                            }  
                        })
                    }
                    break
            }
        }else{
            callback(false,"Solo es aceptado las facturas y boletas electronicas")
        }
    }else{
        callback(false,"Existen campos vacios en la serie o numero del comprobante")
    }
}

function DeterminarTipoIGV(input,dataDetalle,callback){
    let Flag_AplicaImpuesto = input.Flag_AplicaImpuesto?input.Flag_AplicaImpuesto:'0'
    if(Flag_AplicaImpuesto!='0'){
        if(dataDetalle.Tipo=='GRA'){
            dataDetalle.Cod_TipoIGV = '10'
            dataDetalle.IGV = parseFloat((parseFloat(dataDetalle.Sub_Total)/(1+parseFloat(input.Por_Impuesto)/100))*(parseFloat(input.Por_Impuesto)/100)).toFixed(2)
        }
        if(dataDetalle.Tipo=='GRT'){
            dataDetalle.Cod_TipoIGV = '13'
        }
    }else{
        if(dataDetalle.Tipo=='GRA'){
            dataDetalle.Cod_TipoIGV = '20'
        }

        if(dataDetalle.Tipo=='GRT'){
            dataDetalle.Cod_TipoIGV = '21'
        }
    }

    if(dataDetalle.Tipo=='INA'){
        dataDetalle.Cod_TipoIGV = '30'
    }

    if(dataDetalle.Tipo=='EXO'){
        dataDetalle.Cod_TipoIGV = '20'
    }

    callback(dataDetalle.Cod_TipoIGV,dataDetalle.IGV)
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