const ENV_WEB = true
var URL=ENV_WEB?'':'http://localhost:3000'
var URL_REPORT = 'http://127.0.0.1:3000'
var NOMBRES_DOC=[
    {'TKF':'TicketFactura','ancho':'2.00in','alto':'5.5in'},
    {'TKB':'TicketBoleta'},
    {'FE':'Factura'},
    {'BE':'Boleta'}
]
export {ENV_WEB,URL,URL_REPORT,NOMBRES_DOC}