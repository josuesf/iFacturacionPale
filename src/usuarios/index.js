var page = require('page');
var empty = require('empty-element');
var title = require('title');
var navegador = require('../navegador')
var yo = require('yo-yo');
var template = require('./template')

async function getUsuarios(ctx,next){
    try {
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                TamanoPagina: '20',
                NumeroPagina:'0',
                ScripOrden:' ORDER BY Cod_Usuarios asc',
                ScripWhere : ''
            })
        }
        var res = await fetch('/usuarios_api/get_usuarios',parametros).then(req=>req.json())
        ctx.usuarios = res.respuesta =='ok'?res.data:[]
        next()
    } catch (error) {
        ctx.error = error
    }
}

page('/usuarios',navegador,getUsuarios,function (ctx, next) {
  title('iFacturacion - Usuarios');
  var main = document.getElementById('main-contenido');
  empty(main).appendChild(template(ctx.usuarios));
})
