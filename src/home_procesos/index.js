var page = require('page');
var empty = require('empty-element');
var title = require('title');
var navegador = require('../navegador_procesos')
var movimientos_caja = require('../sis_procesos/movimientos_caja')
var yo = require('yo-yo');

var el = yo``
page('/',movimientos_caja,navegador, function (ctx, next) {
  title('iFacturacion - Procesos');
  // var main = document.getElementById('contenido');
  // empty(main).appendChild(el);
})
