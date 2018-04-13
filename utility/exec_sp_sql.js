var sql = require("mssql");
var dbConfig = require('./conexion_sql').dbConfig
//Procedimientos Almacenados
var Ejecutar_Procedimientos = function (res, procedimientos) {
    Ejecutar_SP_SQL(res,procedimientos,0)
}
var Ejecutar_SP_SQL = function (res,procedimientos, posicion) {
    var dbConn = new sql.Connection(dbConfig);
    dbConn.connect(function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            return res.json({ respuesta: 'error' })
        }
        // creacion Request object
        var request = new sql.Request(dbConn);
        // parametros para procedimiento
        const param = procedimientos[posicion].parametros
        for (i = 0; i < param.length; i++) {
            request.input(param[i].nom_parametro, param[i].tipo_parametro || sql.NVarChar, param[i].valor_parametro)
        }

        request.execute(procedimientos[posicion].sp_name, function (err, result) {
            dbConn.close()
            if (err) {
                console.log("Error while querying database :- " + err);
                return res.json({ respuesta: 'error',detalle_error:err })
            }
            procedimientos[posicion].data =  result[0]
            if(posicion+1<procedimientos.length)
                Ejecutar_SP_SQL(res,procedimientos,posicion+1)
            else{
                data = {}
                for(j=0;j<procedimientos.length;j++){
                    data[procedimientos[j].nom_respuesta] = procedimientos[j].data
                }
                res.json({ respuesta: 'ok', data }
            )}
        });

    });
}
// var Ejecutar_SP_SQL = function (res, store_procedure, param) {
//     var dbConn = new sql.Connection(dbConfig);
//     dbConn.connect(function (err) {
//         if (err) {
//             console.log("Error while connecting database :- " + err);
//             return res.json({ respuesta: 'error' })
//         }
//         // creacion Request object
//         var request = new sql.Request(dbConn);
//         // parametros para procedimiento
//         for (i = 0; i < param.length; i++) {
//             request.input(param[i].nom_parametro, param[i].tipo_parametro || sql.NVarChar, param[i].valor_parametro)
//         }

//         request.execute(store_procedure, function (err, result) {
//             dbConn.close()
//             if (err) {
//                 console.log("Error while querying database :- " + err);
//                 return res.json({ respuesta: 'error',detalle_error:err })
//             }
//             data = result[0]
//             res.json({ respuesta: 'ok', data })
//         });

//     });
// }

module.exports = { Ejecutar_Procedimientos }