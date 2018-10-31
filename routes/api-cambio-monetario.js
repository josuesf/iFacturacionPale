var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos} = require('../utility/exec_sp_sql')
var {Ejecutar_Procedimientos, EXEC_SQL, EXEC_SQL_OUTPUT} = require('../utility/exec_sp_sql')
// define the home page routeq
router.post('/get_cambios', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Fecha',valor_parametro:input.Anio+'-'+input.Mes+'-01'},
        {nom_parametro:'Fecha2',valor_parametro:input.Anio+'-'+(input.Mes+1)+'-01'}
    ]
    procedimientos =[
    {nom_respuesta:'cambios',sp_name:'USP_CAJ_TIPOCAMBIO_Traer_intervalo_fechas',parametros}
]
Ejecutar_Procedimientos(req,res,procedimientos)
});
router.post('/buscar_cambios', function (req, res) {
    input = req.body
    if(input.Dia == '')
    {
        parametros = [
            {nom_parametro:'Fecha',valor_parametro:input.Anio+'-'+input.Mes+'-01'},
            {nom_parametro:'Fecha2',valor_parametro:input.Anio+'-'+(input.Mes+1)+'-01'}
        ]
        procedimientos =[
        {nom_respuesta:'cambios',sp_name:'USP_CAJ_TIPOCAMBIO_Traer_intervalo_fechas',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
    }
    else
    {
        parametros = [
            {nom_parametro:'Fecha',valor_parametro:input.Anio+'-'+input.Mes+'-'+input.Dia}
        ]
        procedimientos =[
        {nom_respuesta:'cambios',sp_name:'USP_CAJ_TIPOCAMBIO_TraerXFecha',parametros}
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
    }
})
router.post('/guardar_cambios', function (req, res) {
    input = req.body
    var Data = input.table
    console.log(Data)
    if(Data.length > 0)
    {
        for (var i in Data) {
            var fecha = Data[i].AÑO+'-'+Data[i].MES+'-'+Data[i].DIA
            parametros = [
                {nom_parametro:'FechaHora',valor_parametro:fecha},
                {nom_parametro:'Cod_Moneda',valor_parametro:'USD'},
                {nom_parametro:'SunatCompra',valor_parametro:Data[i].SUNAT_COMPRA},
                {nom_parametro:'SunatVenta',valor_parametro:Data[i].SUNAT_VENTA},
                {nom_parametro:'Compra',valor_parametro:Data[i].COMPRA},
                {nom_parametro:'Venta',valor_parametro:Data[i].VENTA},
                {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
            ]
            EXEC_SQL_OUTPUT('USP_CAJ_TIPOCAMBIO_I', parametros , function (dataMov) {
               
            })
        }
        res.json({respuesta :'ok',data:[]})
    }
    else
    {
        res.json({respuesta :'error',data:[]})
    }
});

router.post('/extraer_cambio', function (req, res){
    input = req.body
    if(input.Dia == '')
    {
        extraer_data(input.Mes,input.Anio,function(resultado){
            res.json({respuesta :resultado})
        })
    }
    else
    {
        llenarDiaCambio(0,input.Dia,input.Mes,input.Anio,res,function(resultado){
            res.json({respuesta :resultado})
        }) 
    }
})
function recorrerArreglo(indice,arreglo,result,callback){
    if(indice<arreglo.length){
        if (arreglo[indice]){
            result.push(arreglo[indice])
            recorrerArreglo(indice+1,arreglo,result,callback)
        }else{
            recorrerArreglo(indice+1,arreglo,result,callback)
        }
    }else{
        callback(result)
    }
}
function unirArreglo(indice,arregloDias,arregloCompra,arregloVentaFinal,arregloResultado,callback){
    if(indice<arregloDias.length){
        arregloResultado.push({
            dias:arregloDias[indice],
            compra:arregloCompra[indice],
            venta:arregloVentaFinal[indice]
        })
        unirArreglo(indice+1,arregloDias,arregloCompra,arregloVentaFinal,arregloResultado,callback)
    }else{
        callback(arregloResultado)
    }
}
function extraer_data(mes,anio,callback)
{
    var url = 'http://www.sunat.gob.pe/cl-at-ittipcam/tcS01Alias?mes='+mes+'&anho='+anio; 
    request(url,function(err, resp,html) {
            if (!err){
            const $ = cheerio.load(html);
            var data_ini = 0;
            
            var dias = [];
            var venta = [];
            var compra = [];
            var venta_final = [];

                $('.H3').each(function(i, elem) {
                dias[i] = Number($(this).text());
                compra[i]= parseFloat($(this).nextUntil('.H3').text());
            
                });
                $('.tne10').each(function(i, elem) {
                    data_ini =parseFloat($(this).nextUntil('.H3').text());
                    if(!isNaN(data_ini))
                    {
                        venta[i]= data_ini;
                    
                    }
                });
                if(venta.length>0){
                    recorrerArreglo(0,venta,venta_final,function(venta_final_){
                        unirArreglo(0,dias,compra,venta_final_,[],function(resultado){
                            callback(resultado)
                        })
                    })
                }else{
                    callback([]);
                }  
        }
        else
        {
            callback([])
        }
        
    });
}
function encontrarItem(indice,item,arreglo,result,callback)
{
    
            if (indice<arreglo.length) {
               if(arreglo[indice].dias==item)
               { 
                    callback([arreglo[indice]])
               }
               else
               {
                encontrarItem(indice+1,item,arreglo,result,callback)
               }
            }
            else
            {
                callback([])
            }
}
function diasEnUnMes(mes,anio) {
	return new Date(anio,mes,0).getDate();
}
function extraer_mes(string)
{
        var fecha = new Date(string);
        return fecha.getMonth() + 1;
}
function llenarDiaCambio(intentos,dia,mes,anio,result,callback)
{
    if(intentos < 100)
    {
        extraer_data(mes,anio,function(data_ini){
            encontrarItem(0,dia,data_ini,result,function(resultado){
                if(resultado.length == 1)
                {
                    callback(resultado)
                }
                else
                {
                    if(dia === 1)
                    {
                        
                        if(mes === 1)
                        {
                          dia = 31
                          mes = 12
                          anio = anio-1
                          llenarDiaCambio(intentos +1,dia,mes,anio,[],callback)
                        }
                        else
                        {
                            
                            dia = diasEnUnMes(mes-1,anio)
                            llenarDiaCambio(intentos +1,dia,mes-1,anio,[],callback)
                        }
                    
                    }
                    else
                    {
                        llenarDiaCambio(intentos+1,dia-1,mes,anio,[],callback)
                    }
                }
                
            })
        })
    }
    else
    {
       callback([])
    }
    
}
module.exports = router;