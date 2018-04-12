var page = require('page');
var empty = require('empty-element');
var title = require('title');
var navegador = require('../navegador')
var yo = require('yo-yo');

var el = yo``
page('/',navegador, function (ctx, next) {
  title('iFacturacion');
  // var main = document.getElementById('contenido');
  // empty(main).appendChild(el);
})
