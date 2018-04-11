var page = require('page');
var empty = require('empty-element');
var title = require('title');
var header = require('../header');
var navegador = require('../navegador')

page('/',navegador,header, function (ctx, next) {
  title('iFacturacion');
  //var main = document.getElementById('main-container');

  //empty(main).appendChild(template(ctx.pictures));
})
