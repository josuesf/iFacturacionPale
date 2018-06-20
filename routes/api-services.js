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

    EXEC_SQL_DBMaster('USP_PRI_EMPRESA_TXRUC', parametros, function (m) {
        if (m.error) {
            return res.json({respuesta:"error"})
        }else{
            if(m.result.length>0){
                if(m.result[0].CadenaConexion!=null){
                    CambiarCadenaConexion(UnObfuscateString(m.result[0].CadenaConexion))
                    LOGIN_SQL(input.usuario, input.password, function (dataLogin) {
                        if (dataLogin.err) {
                            return res.json({respuesta:"error"}) 
                        }else{
                            return res.json({respuesta:"ok",data:{Cod_Usuario:dataLogin.Cod_Usuarios,Nick:dataLogin.Nick}})
                        }
                    })
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