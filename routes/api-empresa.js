var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var {Ejecutar_Procedimientos,EXEC_SQL_DBMaster} = require('../utility/exec_sp_sql')
var { UnObfuscateString, CambiarCadenaConexion } = require('../utility/tools')
// define the home page route
router.post('/get_unica_empresa', function (req, res) {
    input = req.body
    parametros = []
    procedimientos =[
        {nom_respuesta:'empresa',sp_name:'USP_PRI_EMPRESA_TraerUnicaEmpresa',parametros},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
router.post('/get_empresa', function (req, res) {
    input = req.body
    parametros = [{nom_parametro:'Cod_Empresa',valor_parametro:input.Cod_Empresa},]
    procedimientos =[
        {nom_respuesta:'empresa_actual',sp_name:'usp_PRI_EMPRESA_TXPK',parametros},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});
router.post('/guardar_modulo', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Modulo',valor_parametro:input.Cod_Modulo},
        {nom_parametro:'Des_Modulo',valor_parametro:input.Des_Modulo},
        {nom_parametro:'Padre_Modulo',valor_parametro:input.Padre_Modulo},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
    ]
    procedimientos =[
        {nom_respuesta:'modulo',sp_name:'USP_PRI_MODULO_G',parametros},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/get_periodos_by_gestion', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro: 'Gestion', valor_parametro:input.Gestion}
    ]
    procedimientos =[
        {nom_respuesta:'periodos',sp_name:'USP_VIS_PERIODOS_TraerPorGestion',parametros},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});

router.post('/get_turnos_by_periodo', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Periodo', valor_parametro:input.Cod_Periodo}
    ]
    procedimientos =[
        {nom_respuesta:'turnos',sp_name:'USP_CAJ_TURNO_ATENCION_TXCodPeriodo',parametros},
    ]
    Ejecutar_Procedimientos(res,procedimientos)
});


router.post('/change_ruc', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro: 'RUC', valor_parametro:input.RUC}
    ]
    EXEC_SQL_DBMaster('USP_PRI_EMPRESA_TXRUC', parametros, function (dataEmpresa) {
        if (dataEmpresa.error) {
            return res.json({respuesta:"error"})
        }else{
            CambiarCadenaConexion(UnObfuscateString(null)) 
            if(dataEmpresa.result.length>0){
                if(dataEmpresa.result[0].CadenaConexion!=null){
                    CambiarCadenaConexion(UnObfuscateString(dataEmpresa.result[0].CadenaConexion)) 
                    return res.json({respuesta:"ok"})
                }else{
                    return res.json({respuesta:"error"})
                }
            }else{
                return res.json({respuesta:"error"})
            }
        }
    })
});



module.exports = router;