var page = require('page');
var empty = require('empty-element');
var title = require('title');
var navegador = require('../navegador')
var consulta_movimientos = require('../sis_procesos/mod_consultas/comprobantes_pago')
var yo = require('yo-yo');

var el = yo``
page('/consultas',consulta_movimientos,navegador, function (ctx, next) {
  title('iFacturacion');
  // var main = document.getElementById('contenido');
  // empty(main).appendChild(el);
})
