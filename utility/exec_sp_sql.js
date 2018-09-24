var sql = require("mssql");
var md5 = require("md5")

var { dbConfig, dbMaster } = require('./conexion_sql')


//var dbConfig = require('./conexion_sql').dbConfig()
//var dbMaster = require('./conexion_sql').dbMaster()

//Procedimientos Almacenados

var Ejecutar_Procedimientos_DBMaster = function (res, procedimientos,respuesta_previa) {
    Ejecutar_SP_SQL_DBMaster(res,procedimientos,0,respuesta_previa)
}
var Ejecutar_SP_SQL_DBMaster = function (res,procedimientos, posicion,respuesta_previa) {
    var dbConn = new sql.Connection(dbMaster());
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
                Ejecutar_SP_SQL(res,procedimientos,posicion+1,respuesta_previa)
            else{
                data = {}
                for(j=0;j<procedimientos.length;j++){
                    data[procedimientos[j].nom_respuesta] = procedimientos[j].data
                }
                if(respuesta_previa){
                    for(i=0;i<respuesta_previa.length;i++){
                        data[respuesta_previa[i].nombre] = respuesta_previa[i].valor
                    }
                }
                res.json({ respuesta: 'ok', data }
            )}
        });

    });
}


var EXEC_SQL_DBMaster = function (sp_name, parametros, next) {
    var dbConn = new sql.Connection(dbMaster());
    dbConn.connect(function (err) {
        if (err) {
            return next({err})
        }
        var request = new sql.Request(dbConn);
        const param = parametros
        for (i = 0; i < param.length; i++) {
            request.input(param[i].nom_parametro, param[i].tipo_parametro || sql.NVarChar, param[i].valor_parametro)
        }
        request.execute(sp_name, function (err, result) {
            dbConn.close()
            if (err) {
                return next({err})
            }
            next({result:result[0]})
        });

    });
}

var EXEC_QUERY_DBMaster = function (query, parametros, next) {
    var dbConn = new sql.Connection(dbMaster());
    dbConn.connect(function (err) {
        if (err) {
            return next({err})
        }
        var request = new sql.Request(dbConn);
        const param = parametros
        for (i = 0; i < param.length; i++) {
            request.input(param[i].nom_parametro, param[i].tipo_parametro || sql.NVarChar, param[i].valor_parametro)
        }
        request.query(query, function (err, result) {
            dbConn.close()
            if (err) {
                return next({err})
            }
            next({result:result})
        });

    });
}


var Ejecutar_Procedimientos = function (req,res, procedimientos,respuesta_previa) {
    Ejecutar_SP_SQL(req,res,procedimientos,0,respuesta_previa)
}
var Ejecutar_SP_SQL = function (req,res,procedimientos, posicion,respuesta_previa) { 
    var dbConn = new sql.Connection(dbConfig());
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
                Ejecutar_SP_SQL(req,res,procedimientos,posicion+1,respuesta_previa)
            else{
                data = {}
                for(j=0;j<procedimientos.length;j++){
                    data[procedimientos[j].nom_respuesta] = procedimientos[j].data
                }
                if(respuesta_previa){
                    for(i=0;i<respuesta_previa.length;i++){
                        data[respuesta_previa[i].nombre] = respuesta_previa[i].valor
                    }
                }
                return res.json({ respuesta: 'ok',arqueo:req.app.locals.arqueo?req.app.locals.arqueo[0]:null,empresa:req.app.locals.empresa?req.app.locals.empresa[0]:null,caja:req.app.locals.caja?req.app.locals.caja[0]:null,turno:req.app.locals.turno?req.app.locals.turno[0]:null, data }
            )}
        });

    });
}
var LOGIN_SQL = function (Cod_Usuarios, Contrasena, next) {
    var dbConn = new sql.Connection(dbConfig());
    dbConn.connect(function (err) {
        if (err) {
            return next({err})
        }
        var request = new sql.Request(dbConn);
        request.input('Cod_Usuarios',Cod_Usuarios.toUpperCase())
        request.execute('usp_PRI_USUARIO_TXPK', function (err, result) {
            dbConn.close()
            if (err) {
                return next({err:"Ocurrio un error en el servidor comuniquese con el administrador."})
            }
            Contrasena = md5(Contrasena)
            usuario =  result[0]
            if(usuario.length==0) return next({err:'Revise sus datos ingresados'})
            if(usuario.length>0 && usuario[0].Contrasena!=Contrasena) return next({err:'Revise sus datos ingresados'})
            next({Cod_Usuarios:usuario[0].Cod_Usuarios,Nick:usuario[0].Nick})
        });

    });
}

var EXEC_QUERY = function (query, parametros, next) {
    var dbConn = new sql.Connection(dbConfig());
    dbConn.connect(function (err) {
        if (err) {
            return next({err})
        }
        var request = new sql.Request(dbConn);
        const param = parametros
        for (i = 0; i < param.length; i++) {
            request.input(param[i].nom_parametro, param[i].tipo_parametro || sql.NVarChar, param[i].valor_parametro)
        }
        request.query(query, function (err, result) {
            dbConn.close()
            if (err) {
                return next({err})
            }
            next({result:result})
        });

    });
}


var EXEC_SQL = function (sp_name, parametros, next) {
    //console.log(dbConfig())
    var dbConn = new sql.Connection(dbConfig());
    dbConn.connect(function (err) {
        if (err) {
            return next({err})
        }
        var request = new sql.Request(dbConn);
        const param = parametros
        for (i = 0; i < param.length; i++) {
            request.input(param[i].nom_parametro, param[i].tipo_parametro || sql.NVarChar, param[i].valor_parametro)
        }
        request.execute(sp_name, function (err, result) {
            dbConn.close()
            if (err) {
                return next({err})
            } 
            next({result: result[0]})
        });

    });
}


var EXEC_SQL_OUTPUT  = function (sp_name, parametros, next) {
    var arrayParamOutPut = []
    var arrayResulOutPut = []
    var dbConn = new sql.Connection(dbConfig());
    dbConn.connect(function (err) {
        if (err) {
            return next({err})
        }
        var request = new sql.Request(dbConn);
        const param = parametros
        for (i = 0; i < param.length; i++) {
            if(param[i].tipo){
                request.output(param[i].nom_parametro, param[i].tipo_parametro || sql.Int, param[i].valor_parametro)
                arrayParamOutPut.push({parametro:param[i].nom_parametro})
                //paramOutPut = param[i].nom_parametro
            }
            else
                request.input(param[i].nom_parametro, param[i].tipo_parametro || sql.NVarChar, param[i].valor_parametro)
        } 
        request.execute(sp_name, function (err, result) {
            
            dbConn.close() 
            if (err) {
                return next({err})
            } 
            LlenarArregloOutPut(0,arrayResulOutPut,arrayParamOutPut,request,function(arrayResult){
                
                return next({result:arrayResult})
            })

            //return next({result:request.parameters[paramOutPut].value})
        });

    });
}


function LlenarArregloOutPut(i,arrayResulOutPut,arrayParamOutPut,request,callback){
    if(i<arrayParamOutPut.length){
        arrayResulOutPut.push({
            valor:request.parameters[arrayParamOutPut[i].parametro].value
        })
        LlenarArregloOutPut(i+1,arrayResulOutPut,arrayParamOutPut,request,callback)
    }else{
        callback(arrayResulOutPut)
    }
}

module.exports = { Ejecutar_Procedimientos,LOGIN_SQL,EXEC_SQL,EXEC_SQL_OUTPUT, Ejecutar_Procedimientos_DBMaster, EXEC_SQL_DBMaster, EXEC_QUERY_DBMaster, EXEC_QUERY }