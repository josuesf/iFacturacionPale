const express = require('express');
const app = express();
 


var cors = require('cors')
app.use(cors())
 

app.post('/api/report', function(req, res) { 
 
    console.log(req.body)
    return res.json({respuesta:'error'})
    /*req.body.data['URL_LOGO'] = ''
    req.body.data['FLAG'] = false
    req.body.data['NOMBRE'] = req.body.razonsocial
    req.body.data['DIRECCION'] = req.body.direccion
    req.body.data['RUC'] = req.body.ruc
    req.body.data['USUARIO'] = req.body.username
    req.body.data['FLAG_ANULADO'] = req.body.data['FLAG_ANULADO']=='true'?true:false
  
    var request = {
      template: req.body.template,
      data: req.body.data
    }; 
  
    console.log(request) 
    
    jsreport.render(request).then(function (o) {  
      o.result.pipe(res);
    }).catch(function (e) { 
      console.error(e)
      return res.json({respuesta:'error'})
    })*/
    
  });

const reportingApp = express();
app.use('/reporting', reportingApp);

const server = app.listen(4000);

const jsreport = require('jsreport')({
  extensions: {
      express: { app: reportingApp, server: server },
  },
  appPath: "/reporting"
});

jsreport.init().then(() => {
  console.log('jsreport server started')
}).catch((e) => {
  console.error(e);
});

/*app.post('/api/report', function(req, res) { 
   

  req.body.data['URL_LOGO'] = ''
  req.body.data['FLAG'] = false
  req.body.data['NOMBRE'] = req.body.razonsocial
  req.body.data['DIRECCION'] = req.body.direccion
  req.body.data['RUC'] = req.body.ruc
  req.body.data['USUARIO'] = req.body.username
  req.body.data['FLAG_ANULADO'] = req.body.data['FLAG_ANULADO']=='true'?true:false

  var request = {
    template: req.body.template,
    data: req.body.data
  }; 

  console.log(request) 
  
  jsreport.render(request).then(function (o) {  
    o.result.pipe(res);
  }).catch(function (e) { 
    console.error(e)
    return res.json({respuesta:'error'})
  })
  
});*/
/*  
app.use('/reporting', reportingApp);


jsreportInstance = jsreport({
  express: { app :reportingApp, server: server },
  appPath: "/reporting"
});

jsreportInstance.init().catch(function (e) {
  console.error('error initializing jsreport:', e);
});*/
 