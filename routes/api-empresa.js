var express = require('express');
var router = express.Router();
var sql = require("mssql");
var md5 = require('md5')
var localStorage = require('localStorage')
var {Ejecutar_Procedimientos,EXEC_SQL_DBMaster,EXEC_QUERY_DBMaster,EXEC_QUERY} = require('../utility/exec_sp_sql')
var { UnObfuscateString, CambiarCadenaConexion, RUCValido, EmailValido,enviarCorreoConfirmacion,enviarCorreoRestaurarPassword } = require('../utility/tools')
// define the home page route
router.post('/get_unica_empresa', function (req, res) {
    input = req.body
    parametros = []
    procedimientos =[
        {nom_respuesta:'empresa',sp_name:'USP_PRI_EMPRESA_TraerUnicaEmpresa',parametros},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});
router.post('/get_empresa', function (req, res) {
    input = req.body
    parametros = [{nom_parametro:'Cod_Empresa',valor_parametro:input.Cod_Empresa},]
    procedimientos =[
        {nom_respuesta:'empresa_actual',sp_name:'usp_PRI_EMPRESA_TXPK',parametros},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});
router.post('/guardar_modulo', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro:'Cod_Modulo',valor_parametro:input.Cod_Modulo},
        {nom_parametro:'Des_Modulo',valor_parametro:input.Des_Modulo},
        {nom_parametro:'Padre_Modulo',valor_parametro:input.Padre_Modulo},
        {nom_parametro:'Cod_Usuario',valor_parametro:req.session.username}
    ]
    procedimientos =[
        {nom_respuesta:'modulo',sp_name:'USP_PRI_MODULO_G',parametros},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_periodos_by_gestion', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro: 'Gestion', valor_parametro:input.Gestion}
    ]
    procedimientos =[
        {nom_respuesta:'periodos',sp_name:'USP_VIS_PERIODOS_TraerPorGestion',parametros},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_turnos_by_periodo', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Periodo', valor_parametro:input.Cod_Periodo}
    ]
    procedimientos =[
        {nom_respuesta:'turnos',sp_name:'USP_CAJ_TURNO_ATENCION_TXCodPeriodo',parametros},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});

router.post('/get_turnos_by_cod_caja', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Caja', valor_parametro:input.Cod_Caja}
    ]
    procedimientos =[
        {nom_respuesta:'turnos',sp_name:'USP_CAJ_TURNO_ATENCION_TXCAJA',parametros},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});




router.post('/crear_siguiente_turno', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro: 'Cod_Usuario', valor_parametro:input.Cod_Usuario}
    ]
    procedimientos =[
        {nom_respuesta:'turnos',sp_name:'USP_CAJ_TURNO_ATENCION_GSIGUIENTE',parametros},
    ]
    Ejecutar_Procedimientos(req,res,procedimientos)
});


router.post('/change_ruc', function (req, res) {
    input = req.body
    parametros = [
        {nom_parametro: 'RUC', valor_parametro:input.RUC}
    ]
    EXEC_SQL_DBMaster('USP_PRI_EMPRESA_TXRUC', parametros, function (dataEmpresa) {
        if (dataEmpresa.error) {
            return res.json({respuesta:"error"})
        }else{
            CambiarCadenaConexion(UnObfuscateString(null)) 
            if(dataEmpresa.result.length>0){
                if(dataEmpresa.result[0].CadenaConexion!=null){
                    CambiarCadenaConexion(UnObfuscateString(dataEmpresa.result[0].CadenaConexion)) 
                    return res.json({respuesta:"ok"})
                }else{
                    return res.json({respuesta:"error"})
                }
            }else{
                return res.json({respuesta:"error"})
            }
        }
    })
});

/* functions private change password new */


router.get('/cambiar_password',function(req,res){
    res.render('cambiar_password.ejs');
})

router.post('/cambiar_password',function(req,res){
    var input = req.body 
    console.log(input)
    if(!RUCValido(input.ruc)){
      res.render('cambiar_password.ejs', {err:'El RUC es inválido'});
    }else{
      if(!EmailValido(input.email)){
        res.render('cambiar_password.ejs', {err:'El email es inválido'});
      }else{
         
        if(input.ruc!='' && input.email!=''){
  
            enviarCorreoRestaurarPassword(req.get('host'),input.email,input.ruc,function(flag){
            if(flag){
              res.render('cambiar_password.ejs', {success:'Se envio el correo de verificacion a su correo. Para proceder a cambiar su contraseña es necesario verificar su correo.'});
            }else{
              res.render('cambiar_password.ejs', {err:'No se pudo enviar el correo de verificacion. Intentelo mas tarde'});
            }
          })
  
        }else{
          res.render('cambiar_password.ejs', {err:'Existe campos vacios'});
        }
        
      }
    } 
})


router.get('/cambiar_password_nueva',function(req,res){  
    jsonData = localStorage.getItem(req.query.id); 
    if(jsonData!=null){
      //localStorage.removeItem(req.query.id)    
      res.render('cambiar_password_nueva.ejs',{id:req.query.id})
    }else{ 
      localStorage.removeItem(req.query.id) 
      res.end('<div id="topcontainer" class="bodycontainer clearfix uk-scrollspy-init-inview uk-scrollspy-inview uk-animation-fade"  style="margin: 0 auto;width: 100%;max-width: 1000px;text-align: center;">'+
      '<p class="logo"><img src="http://palerp.com/images/logo.png" class="center"></p><h3><span>El tiempo del validez del enlace ya caduco. Reenvie de nuevo el correo de verificacion</span></h3></div>')
    }
});

router.post('/cambiar_password_nueva',function(req,res){ 
    var input = req.body 
    jsonData = localStorage.getItem(input.id); 
    if(jsonData!=null){ 
        res.render('cambiar_password_nueva.ejs',{success:"Se cambio correctamente la contraseña, ahora puede iniciar sesion normalmente con la nueva contraseña"})
    }else{ 
      localStorage.removeItem(req.query.id) 
      res.end('<div id="topcontainer" class="bodycontainer clearfix uk-scrollspy-init-inview uk-scrollspy-inview uk-animation-fade"  style="margin: 0 auto;width: 100%;max-width: 1000px;text-align: center;">'+
      '<p class="logo"><img src="http://palerp.com/images/logo.png" class="center"></p><h3><span>El tiempo del validez del enlace ya caduco. Reenvie de nuevo el correo de verificacion</span></h3></div>')
    }
});





/* functions private register new */


router.get('/register',function(req,res){
    res.render('register.ejs', { });
})

router.get('/verificacion_correo',function(req,res){  
    jsonData = localStorage.getItem(req.query.id); 
    if(jsonData!=null){
      localStorage.removeItem(req.query.id) 
      res.end('<div id="topcontainer" class="bodycontainer clearfix uk-scrollspy-init-inview uk-scrollspy-inview uk-animation-fade"  style="margin: 0 auto;width: 100%;max-width: 1000px;text-align: center;">'+
              '<p class="logo"><img src="http://palerp.com/images/logo.png" class="center"></p><h3><span>Su correo ha sido verificado exitosamente. En breves momentos nos comunicaremos con usted a traves del numero telefonico brindado para generarle un usuario y password para que pueda ingresar al sistema</span></h3></div>')
    }else{ 
      localStorage.removeItem(req.query.id) 
      res.end('<div id="topcontainer" class="bodycontainer clearfix uk-scrollspy-init-inview uk-scrollspy-inview uk-animation-fade"  style="margin: 0 auto;width: 100%;max-width: 1000px;text-align: center;">'+
      '<p class="logo"><img src="http://palerp.com/images/logo.png" class="center"></p><h3><span>El tiempo del validez del enlace ya caduco. Reenvie de nuevo el correo de verificacion</span></h3></div>')
    }
});



router.post('/register',function(req,res){
    var input = req.body 
    if(!RUCValido(input.ruc)){
      res.render('register.ejs', {err:'El RUC es inválido'});
    }else{
      if(!EmailValido(input.email)){
        res.render('register.ejs', {err:'El email es inválido'});
      }else{
         
        if(input.razon!='' && input.ruc!='' && input.celular.trim()!='' && input.direccion.trim()!='' && input.email!=''){
            const fecha = new Date()
            const mes = fecha.getMonth() + 1
            const dia = fecha.getDate()
            var fecha_format = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes) + '-' + (dia > 9 ? dia : '0' + dia)
 
            EXEC_QUERY_DBMaster("INSERT INTO PRI_EMPRESA(Cod_Empresa,RUC,RazonSocial, Direccion,CadenaPublico,Cod_UsuarioReg,Fecha_Reg) VALUES ('W"+input.ruc+"','"+input.ruc+"','"+input.razon+"','"+input.direccion+"','"+input.celular+"','MIGRACION','"+fecha_format+"')", [], function (o) {
                if (o.err){ 
                    res.render('register.ejs', {err:'No se pudo registrar la informacion de la empresa.'});
                }
                else{
                    enviarCorreoConfirmacion(req.get('host'),input.email,input.ruc,function(flag){
                        if(flag){
                          res.render('register.ejs', {success:'Se envio el correo de verificacion a su correo. Para completar su registro es necesario verificar su correo.'});
                        }else{
                          res.render('register.ejs', {err:'No se pudo enviar el correo de verificacion. Intentelo mas tarde'});
                        }
                    })
                }
                
            })
   
        }else{
          res.render('register.ejs', {err:'Existe campos vacios'});
        }
        
      }
    } 
})

module.exports = router;