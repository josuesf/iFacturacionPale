var { Ejecutar_Procedimientos_DBMaster, EXEC_SQL_DBMaster, EXEC_QUERY_DBMaster } = require('../utility/exec_sp_sql')
var empresa = function () {
    parametros = []
    EXEC_QUERY_DBMaster('SELECT * FROM PRI_EMPRESA', parametros, function (o) {
        if (o.error) return null 
        p = [
            { nom_parametro: 'RUC', valor_parametro: o.result.RUC }
        ]

        EXEC_SQL_DBMaster('USP_PRI_EMPRESA_TXRUC', p, function (m) {
            return m.result
        })
    })
}

module.exports = { empresa }
