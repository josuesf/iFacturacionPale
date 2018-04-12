var express = require('express');
var router = express.Router();
var sql = require("mssql");
var {Ejecutar_SP_SQL} = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_usuarios', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'TamañoPagina',valor_parametro:input.TamanoPagina},
        {nom_parametro:'NumeroPagina',valor_parametro:input.NumeroPagina},
        {nom_parametro:'ScripOrden',valor_parametro:input.ScripOrden},
        {nom_parametro:'ScripWhere',tipo_parametro:sql.NVarChar,valor_parametro:input.ScripWhere}
    ]
    Ejecutar_SP_SQL(res,'usp_PRI_USUARIO_TP',parametros)
});

module.exports = router;