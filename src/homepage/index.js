var page = require('page');
var empty = require('empty-element');
var title = require('title');
var navegador = require('../navegador')
var consulta_movimientos = require('../sis_procesos/movimientos_caja/listar')
var yo = require('yo-yo');

var el = yo``
page('/consultas',consulta_movimientos,navegador, function (ctx, next) {
  title('iFacturacion');
  // var main = document.getElementById('contenido');
  // empty(main).appendChild(el);
})
