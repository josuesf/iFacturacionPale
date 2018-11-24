const fs = require('fs');  
const ENV_WEB = true;
var URL=ENV_WEB?'':'http://192.168.1.40:3000'//'http://200.60.135.180:3000'
var URL_REPORT = 'http://192.168.1.40:3000'//'http://200.60.135.180:3000';

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
            //========= comprobantes ventas y compras =================================
                // EXCEL
                'ReportePlanillaDiaria_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReportePlanillaDiaria', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReportePlanillaDiaria', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXTotalCliente_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXTotalCliente', 'content.html'), 'utf8'), 
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXTotalCliente', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXTotalDocumento_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXTotalDocumento', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXTotalDocumento', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXTotalProducto_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXTotalProducto', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXTotalProducto', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXDocumento_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXDocumento', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXDocumento', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXProducto_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXProducto', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXProducto', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXCliente_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXCliente', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXCliente', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXAnulados_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXAnulados', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteXAnulados', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliar_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteRegistroAuxiliar', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteRegistroAuxiliar', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliarCompra_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteRegistroAuxiliarCompras', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteRegistroAuxiliarCompras', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliarVenta_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteRegistroAuxiliarVentas', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteRegistroAuxiliarVentas', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    }, 
                'ReporteRegistroAuxiliarDetallado_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteRegistroAuxiliarDetallado', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteRegistroAuxiliarDetallado', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliarDetalladoFormaPago_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteRegistroAuxiliarDetalladoFormaPago', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/comprobantes/templates/ReporteRegistroAuxiliarDetalladoFormaPago', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
               
                
                // PDF
                'ReportePlanillaDiaria_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReportePlanillaDiaria', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReportePlanillaDiaria', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXTotalCliente_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXTotalCliente', 'content.html'), 'utf8'), 
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXTotalCliente', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXTotalDocumento_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXTotalDocumento', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXTotalDocumento', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXTotalProducto_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXTotalProducto', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXTotalProducto', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXDocumento_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXDocumento', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXDocumento', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXProducto_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXProducto', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXProducto', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXCliente_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXCliente', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXCliente', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteXAnulados_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXAnulados', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteXAnulados', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliar_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteRegistroAuxiliar', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteRegistroAuxiliar', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliarCompra_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteRegistroAuxiliarCompras', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteRegistroAuxiliarCompras', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliarVenta_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteRegistroAuxiliarVentas', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteRegistroAuxiliarVentas', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliarDetallado_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteRegistroAuxiliarDetallado', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteRegistroAuxiliarDetallado', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteRegistroAuxiliarDetalladoFormaPago_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteRegistroAuxiliarDetalladoFormaPago', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/comprobantes/templates/ReporteRegistroAuxiliarDetalladoFormaPago', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                 
            //========= formas de pago ventas y compras =================================
                // EXCEL
                'ReporteFormaPagoXMov_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/formas_pago/templates/FormaPagoXMov', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/formas_pago/templates/FormaPagoXMov', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'FormaPagoXClienteDoc_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/formas_pago/templates/FormaPagoXClienteDoc', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/formas_pago/templates/FormaPagoXClienteDoc', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },    
                // PDF
                'ReporteFormaPagoXMov_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/formas_pago/templates/FormaPagoXMov', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/formas_pago/templates/FormaPagoXMov', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'FormaPagoXClienteDoc_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/formas_pago/templates/FormaPagoXClienteDoc', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/formas_pago/templates/FormaPagoXClienteDoc', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
            
            
            //========= administracion ===================
                // EXCEL
                'ReporteCuentasXCobrar_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/administracion/templates/ReporteCuentasXCobrar', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/administracion/templates/ReporteCuentasXCobrar', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'MovimientosXcaja_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/administracion/templates/MovimientosXcaja', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/administracion/templates/MovimientosXcaja', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteResumenCaja_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/administracion/templates/ReporteResumenCaja', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/administracion/templates/ReporteResumenCaja', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
         
                // PDF
                'ReporteCuentasXCobrar_PDF':
                  {
                      content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/administracion/templates/ReporteCuentasPorCobrarPdfs', 'content.html'), 'utf8'),
                      recipe: "chrome-pdf",
                      helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/administracion/templates/ReporteCuentasPorCobrarPdfs', 'helpers.js'), 'utf8'),
                      engine: 'jsrender',
                      options: { "timeout": 60000 }
                   },
                'ReporteResumenCaja_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/administracion/templates/ReporteResumenCajaPdfs', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/administracion/templates/ReporteResumenCajaPdfs', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
              
                'MovimientosXcaja_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/administracion/templates/MovimientosXcajaPdfs', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/administracion/templates/MovimientosXcajaPdfs', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                
                  //fin resportes de administracion
        

            //========= movimientos almacen =================================
                // EXCEL
                'ReporteMovAlmacenLista_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/almacen/templates/ReporteMovAlmacenLista', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/almacen/templates/ReporteMovAlmacenLista', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteKardex_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/almacen/templates/ReporteKardex', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/almacen/templates/ReporteKardex', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteStockFisico_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/almacen/templates/ReporteStockFisico', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/almacen/templates/ReporteStockFisico', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteStockFisicoValorizado_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/almacen/templates/ReporteStockFisicoValorizado', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/almacen/templates/ReporteStockFisicoValorizado', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteStockTotalFisicoValorizado_Excel':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/almacen/templates/ReporteStockTotalFisicoValorizado', 'content.html'), 'utf8'),
                        recipe: "html-to-xlsx",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesExcel/almacen/templates/ReporteStockTotalFisicoValorizado', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
          
                // PDF
                'ReporteMovAlmacenLista_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/almacen/templates/ReporteMovAlmacenLista', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/almacen/templates/ReporteMovAlmacenLista', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteKardex_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/almacen/templates/ReporteKardex', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/almacen/templates/ReporteKardex', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteStockFisico_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/almacen/templates/ReporteStockFisicoPdfs', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/almacen/templates/ReporteStockFisicoPdfs', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteStockFisicoValorizado_PDF':
                    {
                        content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/almacen/templates/ReporteStockFisicoValorizadoPdfs', 'content.html'), 'utf8'),
                        recipe: "chrome-pdf",
                        helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/almacen/templates/ReporteStockFisicoValorizadoPdfs', 'helpers.js'), 'utf8'),
                        engine: 'jsrender',
                        options: { "timeout": 60000 }
                    },
                'ReporteStockTotalFisicoValorizado_PDF':
                  {
                      content: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/almacen/templates/ReporteStockTotalFisicoValorizadoPdfs', 'content.html'), 'utf8'),
                      recipe: "chrome-pdf",
                      helpers: fs.readFileSync(require('path').join('formatos/'+ruc+'/reportesPDF/almacen/templates/ReporteStockTotalFisicoValorizadoPdfs', 'helpers.js'), 'utf8'),
                      engine: 'jsrender',
                      options: { "timeout": 60000 }
                  },
            
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