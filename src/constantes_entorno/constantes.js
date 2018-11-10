const fs = require('fs');  
const ENV_WEB = true;
var URL=ENV_WEB?'':'http://127.0.0.1:3000'//'http://200.60.135.180:3000'
var URL_REPORT = 'http://127.0.0.1:3000'//'http://200.60.135.180:3000';

var GETCONFIG = function GET(ruc){
    try{
        return  {
                // inicio path de los recibos y tickets
                'TKF': 
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/recibos_tickets/templates/TicketFactura', 'content.handlebars'), 'utf8'),
                        recipe: "chrome-pdf",
                        engine: 'handlebars',
                        chrome: { 
                            width: "2.2in",
                            height: "5.5in"
                        }
                    },
                'TKB':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/recibos_tickets/templates/TicketFactura', 'content.handlebars'), 'utf8'),
                        recipe: "chrome-pdf",
                        engine: 'handlebars',
                        chrome: { 
                            width: "2.2in",
                            height: "5.5in"
                        }
                    },
                'FE':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/recibos_tickets/templates/FacturaComprobante', 'content.handlebars'), 'utf8'),
                        recipe: "chrome-pdf",
                        engine: 'handlebars',
                        chrome: { 
                            width: "8.27in",
                            height: "11.7in"
                        }
                    },
                'BE':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/recibos_tickets/templates/FacturaComprobante', 'content.handlebars'), 'utf8'),
                        recipe: "chrome-pdf",
                        engine: 'handlebars',
                        chrome: { 
                            width: "8.27in",
                            height: "11.7in"
                        }
                    },
                'FA':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/recibos_tickets/templates/FacturaComprobante', 'content.handlebars'), 'utf8'),
                        recipe: "chrome-pdf",
                        engine: 'handlebars',
                        chrome: { 
                            width: "8.27in",
                            height: "11.7in"
                        }
                    },
                'BO':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/recibos_tickets/templates/FacturaComprobante', 'content.handlebars'), 'utf8'),
                        recipe: "chrome-pdf",
                        engine: 'handlebars',
                        chrome: { 
                            width: "8.27in",
                            height: "11.7in"
                        }
                    },
                'NE':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/recibos_tickets/templates/TicketNES', 'content.handlebars'), 'utf8'),
                        recipe: "chrome-pdf",
                        engine: 'handlebars',
                        chrome: { 
                            width: "80mm",
                            height: "297mm"
                        }
                    },
                'NS':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/recibos_tickets/templates/TicketNES', 'content.handlebars'), 'utf8'),
                        recipe: "chrome-pdf",
                        engine: 'handlebars',
                        chrome: { 
                            width: "80mm",
                            height: "297mm"
                        }
                    },
                'RI':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/recibos_tickets/templates/TicketEI', 'content.handlebars'), 'utf8'),
                        recipe: "chrome-pdf",
                        engine: 'handlebars',
                        chrome: { 
                            width: "80mm",
                            height: "297mm"
                        }
                    },
                'RE':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/recibos_tickets/templates/TicketEI', 'content.handlebars'), 'utf8'),
                        recipe: "chrome-pdf",
                        engine: 'handlebars',
                        chrome: { 
                            width: "80mm",
                            height: "297mm"
                        }
                    },
                // fin path de los recibos y tickets

                // inicio path reportes ventas
                'ReportePlanillaDiaria':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReportePlanillaDiaria', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReportePlanillaDiaria', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXTotalCliente':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXTotalCliente', 'content.html'), 'utf8'), 
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXTotalCliente', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXTotalDocumento':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXTotalDocumento', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXTotalDocumento', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXTotalProducto':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXTotalProducto', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXTotalProducto', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXDocumento':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXDocumento', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXDocumento', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXProducto':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXProducto', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXProducto', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXCliente':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXCliente', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXCliente', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXAnulados':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXAnulados', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteXAnulados', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliar':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteRegistroAuxiliar', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteRegistroAuxiliar', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliarDetallado':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteRegistroAuxiliarDetallado', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteRegistroAuxiliarDetallado', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliarDetalladoFormaPago':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteRegistroAuxiliarDetalladoFormaPago', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/ventas/templates/ReporteRegistroAuxiliarDetalladoFormaPago', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                // fin path reportes
            };
    }catch(e){
        console.log("error",e)
        return {} 
    }
}
module.exports = GETCONFIG;
module.exports.ENV_WEB = ENV_WEB;
module.exports.URL = URL;
module.exports.URL_REPORT = URL_REPORT;

/*const fs = require('fs');  
const ENV_WEB = true;
var URL=ENV_WEB?'':'http://localhost:3000';
var URL_REPORT = 'http://127.0.0.1:3000';*/
/*var NOMBRES_DOC=[
    {'TKF':fs.readFileSync(require('path').join(__dirname, 'formatos/'+DIRECCIONPATH+'/templates/TicketFactura', 'content.handlebars'), 'utf8'),'ancho':'2.00in','alto':'5.5in'},
    {'TKB':'TicketBoleta'},
    {'FE':'Factura'},
    {'BE':'Boleta'}
]*/
                
//export { GETCONFIG,ENV_WEB,URL,URL_REPORT}