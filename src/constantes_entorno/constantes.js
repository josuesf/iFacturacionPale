const fs = require('fs');  
const ENV_WEB = true;
var URL=ENV_WEB?'':'http://localhost:3000';
var URL_REPORT = 'http://127.0.0.1:3000';

var GETCONFIG = function GET(ruc){
    try{
            return  {
                        'TKF': 
                            {
                                content: fs.readFileSync(require('path').join('formatos/'+ruc+'/templates/TicketFactura', 'content.handlebars'), 'utf8'),
                                recipe: "chrome-pdf",
                                engine: 'handlebars',
                                chrome: { 
                                    width: "2.2in",
                                    height: "5.5in"
                                }
                            },
                        'TKB':
                            {
                                content: fs.readFileSync(require('path').join('formatos/'+ruc+'/templates/TicketFactura', 'content.handlebars'), 'utf8'),
                                recipe: "chrome-pdf",
                                engine: 'handlebars',
                                chrome: { 
                                    width: "2.2in",
                                    height: "5.5in"
                                }
                            },
                        'FE':
                        {
                            content: fs.readFileSync(require('path').join('formatos/'+ruc+'/templates/FacturaComprobante', 'content.handlebars'), 'utf8'),
                            recipe: "chrome-pdf",
                            engine: 'handlebars',
                            chrome: { 
                                width: "8.27in",
                                height: "11.7in"
                            }
                        },
                        'BE':
                        {
                            content: fs.readFileSync(require('path').join('formatos/'+ruc+'/templates/FacturaComprobante', 'content.handlebars'), 'utf8'),
                            recipe: "chrome-pdf",
                            engine: 'handlebars',
                            chrome: { 
                                width: "8.27in",
                                height: "11.7in"
                            }
                        },
                        'FA':
                        {
                            content: fs.readFileSync(require('path').join('formatos/'+ruc+'/templates/FacturaComprobante', 'content.handlebars'), 'utf8'),
                            recipe: "chrome-pdf",
                            engine: 'handlebars',
                            chrome: { 
                                width: "8.27in",
                                height: "11.7in"
                            }
                        },
                        'BO':
                        {
                            content: fs.readFileSync(require('path').join('formatos/'+ruc+'/templates/FacturaComprobante', 'content.handlebars'), 'utf8'),
                            recipe: "chrome-pdf",
                            engine: 'handlebars',
                            chrome: { 
                                width: "8.27in",
                                height: "11.7in"
                            }
                        },
                        'NE':
                        {
                            content: fs.readFileSync(require('path').join('formatos/'+ruc+'/templates/TicketNES', 'content.handlebars'), 'utf8'),
                            recipe: "chrome-pdf",
                            engine: 'handlebars',
                            chrome: { 
                                width: "80mm",
                                height: "297mm"
                            }
                        },
                        'NS':
                        {
                            content: fs.readFileSync(require('path').join('formatos/'+ruc+'/templates/TicketNES', 'content.handlebars'), 'utf8'),
                            recipe: "chrome-pdf",
                            engine: 'handlebars',
                            chrome: { 
                                width: "80mm",
                                height: "297mm"
                            }
                        },
                        'RI':
                        {
                            content: fs.readFileSync(require('path').join('formatos/'+ruc+'/templates/TicketEI', 'content.handlebars'), 'utf8'),
                            recipe: "chrome-pdf",
                            engine: 'handlebars',
                            chrome: { 
                                width: "80mm",
                                height: "297mm"
                            }
                        },
                        'RE':
                        {
                            content: fs.readFileSync(require('path').join('formatos/'+ruc+'/templates/TicketEI', 'content.handlebars'), 'utf8'),
                            recipe: "chrome-pdf",
                            engine: 'handlebars',
                            chrome: { 
                                width: "80mm",
                                height: "297mm"
                            }
                        }
                    };
    }catch(e){
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