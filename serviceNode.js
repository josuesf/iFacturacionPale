var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
  name:'service-ifacturacion',
  description: 'Servicio para ifacturacion',
  script: 'C:\\Users\\Desarrollo04\\Documents\\GitHub\\AppReact\\iFacturacionPale\\server.js'
});
 
// Listen for the 'install' event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
// install the service
svc.install();