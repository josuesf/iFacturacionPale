var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos, EXEC_SQL } = require('../utility/exec_sp_sql')

router.post('/get_variables_ventas', function (req, res) {
    input = req.body

    parametros = [
        { nom_parametro: 'Cod_Caja', valor_parametro: req.app.locals.caja[0].Cod_Caja }, 
    ]
     
    procedimientos = [
        { nom_respuesta: 'almacenes', sp_name: 'USP_CAJ_CAJA_ALMACEN_TXCaja', parametros },
        { nom_respuesta: 'precios', sp_name: 'USP_VIS_PRECIOS_TT', parametros: [] },
        { nom_respuesta: 'monedas', sp_name: 'USP_VIS_MONEDAS_TT', parametros: [] },
        { nom_respuesta: 'documentos', sp_name: 'USP_VIS_TIPO_DOCUMENTOS_TT',parametros: [] },
        { nom_respuesta: 'formaspago', sp_name: 'USP_VIS_FORMAS_PAGO_TT',parametros: [] },
        { nom_respuesta: 'favoritos', sp_name: 'USP_VIS_FAVORITOS_TXCaja',parametros },
        { nom_respuesta: 'categorias', sp_name: 'USP_PRI_CATEGORIA_TArbol',parametros:[] },
    ]  
    Ejecutar_Procedimientos(res, procedimientos)
         
});

router.post('/get_comprobante_by_tipo', function (req, res) {
    
    input = req.body 

    parametros = [
        {nom_parametro: 'Cod_TipoComprobante', valor_parametro: input.Cod_TipoComprobante},
        {nom_parametro: 'Serie', valor_parametro: input.Serie},
        {nom_parametro: 'Numero', valor_parametro: input.Numero},
    ]
     
    procedimientos = [
        { nom_respuesta: 'comprobante', sp_name: 'USP_CAJ_COMPROBANTE_PAGO_TXTipoSerieNumero', parametros}
        
    ]  
    Ejecutar_Procedimientos(res, procedimientos)
});

 
 
 
module.exports = router;