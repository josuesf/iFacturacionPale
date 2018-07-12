var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var { Ejecutar_Procedimientos } = require('../utility/exec_sp_sql')
// define the home page route
router.post('/get_usuarios', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'TamañoPagina', valor_parametro: input.TamanoPagina },
        { nom_parametro: 'NumeroPagina', valor_parametro: input.NumeroPagina },
        { nom_parametro: 'ScripOrden', valor_parametro: input.ScripOrden },
        { nom_parametro: 'ScripWhere', tipo_parametro: sql.NVarChar, valor_parametro: input.ScripWhere }
    ]
    procedimientos = [
        { nom_respuesta: 'usuarios', sp_name: 'usp_PRI_USUARIO_TP', parametros },
        { nom_respuesta: 'num_filas', sp_name: 'usp_PRI_USUARIO_TNF', parametros: [{ nom_parametro: 'ScripWhere', valor_parametro: input.ScripWhere }] },
        { nom_respuesta: 'perfiles', sp_name: 'usp_PRI_PERFIL_TT', parametros: [] },
        { nom_respuesta: 'estados', sp_name: 'USP_VIS_ESTADO_TRABAJADOR_TT', parametros: [] },
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
});
router.post('/guardar_usuario', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Cod_Usuarios', valor_parametro: input.Cod_Usuarios },
        { nom_parametro: 'Nick', valor_parametro: input.Nick },
        { nom_parametro: 'Contrasena', valor_parametro: input.EsNuevo?md5(input.Contrasena):input.Contrasena },
        { nom_parametro: 'Foto', tipo_parametro: sql.Binary, valor_parametro: null },
        { nom_parametro: 'Pregunta', valor_parametro: input.Pregunta },
        { nom_parametro: 'Respuesta', valor_parametro: input.Respuesta },
        { nom_parametro: 'Cod_Estado', valor_parametro: input.Cod_Estado },
        { nom_parametro: 'Cod_Perfil', valor_parametro: input.Cod_Perfil },
        { nom_parametro: 'Cod_Usuario', valor_parametro: req.session.username }
    ]
    procedimientos = [
        { nom_respuesta: 'usuario', sp_name: 'USP_PRI_USUARIO_G', parametros },
    ]
    const Cajas = input.Cajas
    for (var i = 0; i < Cajas.length; i++) {
        procedimientos.push({
            nom_respuesta: 'caja', sp_name: 'USP_VIS_USUARIOS_CAJA_G',
            parametros: [
                { nom_parametro: 'Cod_Usuario', valor_parametro: input.Cod_Usuarios },
                { nom_parametro: 'Cod_Caja', valor_parametro: Cajas[i].Cod_Caja },
                { nom_parametro: 'Flag', valor_parametro: Cajas[i].Relacion }
            ]
        })
    }
    Ejecutar_Procedimientos(req,res, procedimientos)
});

router.post('/eliminar_usuario', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Cod_Usuarios', valor_parametro: input.Cod_Usuarios }
    ]
    procedimientos = [
        { nom_respuesta: 'usuario', sp_name: 'usp_PRI_USUARIO_E', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})
router.post('/get_cajas_usuario', function (req, res) {
    input = req.body
    parametros = [
        { nom_parametro: 'Cod_Usuario', valor_parametro: input.Cod_Usuarios }
    ]
    procedimientos = [
        { nom_respuesta: 'cajas', sp_name: 'USP_CAJ_CAJAS_TraerCajasXCodUsuario', parametros }
    ]
    Ejecutar_Procedimientos(req,res, procedimientos)
})

module.exports = router;