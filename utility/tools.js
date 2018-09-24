//import { URL } from '../src/constantes_entorno/constantes'  
var { EXEC_SQL_DBMaster} = require('./exec_sp_sql')
var localStorage = require('localStorage')
var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
          user: 'xxxxx483333@gmail.com',
          pass: 'priena1'
      }
});


var sUnidades = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTE", "VEINTIUN", "VEINTIDOS", "VEINTITRES", "VEINTICUATRO", "VEINTICINCO", "VEINTISEIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE"];

var sDecenas = ["", "DIEZ", "VEINTE", "TREINTE", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];

var sCentenas = ["", "CIENTO", "DOCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

function Numeros(dNumAux, dFactor) {
    var dCociente = dNumAux / dFactor
    var dNumero = 0
    var iNumero = 0
    var sNumero = ""
    var sTexto = ""

    if (dCociente >= 100) {
        dNumero = dCociente / 100
        sNumero = dNumero.toString()
        iNumero = parseInt(sNumero[0].toString())
        sTexto += sCentenas[iNumero] + " "
    }

    dCociente = dCociente % 100;
    if (dCociente >= 30) {
        dNumero = dCociente / 10;
        sNumero = dNumero.toString()
        iNumero = parseInt(sNumero[0].toString())
        if (iNumero > 0)
            sTexto += sDecenas[iNumero] + " "

        dNumero = dCociente % 10;
        sNumero = dNumero.toString();
        iNumero = parseInt(sNumero[0].toString());
        if (iNumero > 0)
            sTexto += "y " + sUnidades[iNumero] + " ";
    }

    else {
        dNumero = dCociente
        sNumero = dNumero.toString()
        if (sNumero.Length > 1)
            if (sNumero[1] != '.')
                iNumero = parseInt(sNumero[0].toString() + sNumero[1].toString());
            else
                iNumero = parseInt(sNumero[0].toString());
        else
            iNumero = parseInt(sNumero[0].toString());
        sTexto += sUnidades[iNumero] + " ";
    }

    return sTexto;
}

function ConvertirCadena(sNumero) {
    var dNumero
    var dNumAux = 0
    var x
    var sAux
    var sResultado = " "
    try {
        dNumero = parseFloat(sNumero)
    } catch (e) {
        return ""
    }

    if (dNumero > 999999999999)
        return "";

    if (dNumero > 999999999) {
        dNumAux = dNumero % 1000000000000;
        sResultado += Numeros(dNumAux, 1000000000) + " MIL "
    }

    if (dNumero > 999999) {
        dNumAux = dNumero % 1000000000
        sResultado += Numeros(dNumAux, 1000000) + " MILLONES "
    }

    if (dNumero > 999) {
        dNumAux = dNumero % 1000000
        sResultado += Numeros(dNumAux, 1000) + " MIL "
    }

    dNumAux = dNumero % 1000
    sResultado += Numeros(dNumAux, 1)


    sAux = dNumero.toString()

    if (sAux.indexOf(".") >= 0)
        sResultado += ObtenerDecimales(sAux)
    sAux = sResultado
    x = sResultado[1].toString()
    sResultado = x.toString()

    for (var i = 2; i < sAux.Length; i++)
        sResultado += sAux[i].toString()
    return sResultado;
}

function ConvertirCadena(dNumero, TipoMoneda) {
    var dNumAux = 0
    var sAux
    var sResultado = " "

    if (dNumero > 999999999999)
        return ""

    if (dNumero > 999999999) {
        dNumAux = dNumero % 1000000000000
        sResultado += Numeros(dNumAux, 1000000000) + " MIL "
    }

    if (dNumero > 999999) {
        dNumAux = dNumero % 1000000000
        sResultado += Numeros(dNumAux, 1000000) + " MILLONES "
    }

    if (dNumero > 999) {
        dNumAux = dNumero % 1000000
        sResultado += Numeros(dNumAux, 1000) + " MIL "
    }

    dNumAux = dNumero % 1000
    sResultado += Numeros(dNumAux, 1)
    sAux = dNumero.toString()
    var sNumPuntos = []
    var Numero = 0

    sNumPuntos = sAux.split('.')

    try {
        Numero = parseInt(sNumPuntos[1]);
        if (sNumPuntos[1].Length == 1) {
            Numero *= 10;
        }

    } catch (e) {
        Numero = 0
    }
    sResultado += "CON "
    sResultado += Numero + "00"

    sResultado += "/100 " + TipoMoneda
    return sResultado
}

function UnObfuscateString(cadena) {
    if (cadena != null && cadena != "") {
        var sTemp = ""
        var sEnd = ""
        var sStart = ""
        var iLoop = 0
        var iLen = 0
        var iMiddle = 0
        var iRemainder = 0

        var iLen = cadena.length
        var iRemainder = iLen % 2
        var iMiddle = parseInt(iLen / 2)

        for (iLoop = iMiddle + iRemainder; iLoop >= 1; iLoop += -1) {
            if (iRemainder == 0) {
                sTemp += cadena.substr((iLoop + iMiddle) - 1, 1) //Strings.Mid(cadena, iLoop + iMiddle, 1);
            }

            sTemp += cadena.substr(iLoop - 1, 1) //Strings.Mid(cadena, iLoop, 1);
            if (iRemainder == 1 & iLoop != 1) {
                sTemp += cadena.substr((iLoop + iMiddle) - 1, 1) //Strings.Mid(cadena, iLoop + iMiddle, 1);
            }
        }
        return sTemp;
    } else {
        return "";
    }
}

function getObjectArrayJsonVentas(arrayJson, pIdTab) {
    var objects = [];
    for (var i in arrayJson) {
        if (arrayJson[i].idTab == pIdTab) {
            objects.push({
                idTab: arrayJson[i].idTab,
                Total: arrayJson[i].Total,
                TotalDescuentos: arrayJson[i].TotalDescuentos,
                TipodeCambio: arrayJson[i].TipodeCambio,
                _CantidadOriginal: arrayJson[i]._CantidadOriginal,
                SimboloMoneda: arrayJson[i].SimboloMoneda,
                SimboloMonedaExtra: arrayJson[i].SimboloMonedaExtra,
                Cliente: arrayJson[i].Cliente,
                Detalles: arrayJson[i].Detalles
            })
            break
        }

    }
    return objects;
}


function changeArrayJsonVentas(arrayJson, pIdTab, arrayCambios) {
    for (var i in global.variablesVentas) {
        if (global.variablesVentas[i].idTab == pIdTab) {
            global.variablesVentas[i].Total = (arrayCambios[0] != null) ? arrayCambios[0] : global.variablesVentas[i].Total
            global.variablesVentas[i].TotalDescuentos = (arrayCambios[1] != null) ? arrayCambios[1] : global.variablesVentas[i].TotalDescuentos
            global.variablesVentas[i].TipodeCambio = (arrayCambios[2] != null) ? arrayCambios[2] : global.variablesVentas[i].TipodeCambio
            global.variablesVentas[i]._CantidadOriginal = (arrayCambios[3] != null) ? arrayCambios[3] : global.variablesVentas[i]._CantidadOriginal
            global.variablesVentas[i].SimboloMoneda = (arrayCambios[4] != null) ? arrayCambios[4] : global.variablesVentas[i].SimboloMoneda
            global.variablesVentas[i].SimboloMonedaExtra = (arrayCambios[5] != null) ? arrayCambios[5] : global.variablesVentas[i].SimboloMonedaExtra
            global.variablesVentas[i].Cliente = (arrayCambios[6] != null) ? arrayCambios[6] : global.variablesVentas[i].Cliente
            global.variablesVentas[i].Detalles = (arrayCambios[7] != null) ? arrayCambios[7] : global.variablesVentas[i].Detalles
            break
        }

    }
}


function changeDetallesArrayJsonVentas(pIdTab, pCodigo, arrayCambios) {
    for (var i in global.variablesVentas) {
        if (global.variablesVentas[i].idTab == pIdTab) {
            for (var j in global.variablesVentas[i].Detalles) {
                if (global.variablesVentas[i].Detalles[j].Codigo == pCodigo) {
                    global.variablesVentas[i].Detalles[j].id_ComprobantePago = (arrayCambios[0] != null) ? arrayCambios[0] : global.variablesVentas[i].Detalles[j].id_ComprobantePago
                    global.variablesVentas[i].Detalles[j].id_Detalle = (arrayCambios[1] != null) ? arrayCambios[1] : global.variablesVentas[i].Detalles[j].id_Detalle
                    global.variablesVentas[i].Detalles[j].Id_Producto = (arrayCambios[2] != null) ? arrayCambios[2] : global.variablesVentas[i].Detalles[j].Id_Producto
                    global.variablesVentas[i].Detalles[j].Codigo = (arrayCambios[3] != null) ? arrayCambios[3] : global.variablesVentas[i].Detalles[j].Codigo
                    global.variablesVentas[i].Detalles[j].Descripcion = (arrayCambios[4] != null) ? arrayCambios[4] : global.variablesVentas[i].Detalles[j].Descripcion
                    global.variablesVentas[i].Detalles[j].Almacen = (arrayCambios[5] != null) ? arrayCambios[5] : global.variablesVentas[i].Detalles[j].Almacen
                    global.variablesVentas[i].Detalles[j].UM = (arrayCambios[6] != null) ? arrayCambios[6] : global.variablesVentas[i].Detalles[j].UM
                    global.variablesVentas[i].Detalles[j].Stock = (arrayCambios[7] != null) ? arrayCambios[7] : global.variablesVentas[i].Detalles[j].Stock
                    global.variablesVentas[i].Detalles[j].Cantidad = (arrayCambios[8] != null) ? arrayCambios[8] : global.variablesVentas[i].Detalles[j].Cantidad
                    global.variablesVentas[i].Detalles[j].Despachado = (arrayCambios[9] != null) ? arrayCambios[9] : global.variablesVentas[i].Detalles[j].Despachado
                    global.variablesVentas[i].Detalles[j].PU = (arrayCambios[10] != null) ? arrayCambios[10] : global.variablesVentas[i].Detalles[j].PU
                    global.variablesVentas[i].Detalles[j].Descuento = (arrayCambios[11] != null) ? arrayCambios[11] : global.variablesVentas[i].Detalles[j].Descuento
                    global.variablesVentas[i].Detalles[j].Importe = (arrayCambios[12] != null) ? arrayCambios[12] : global.variablesVentas[i].Detalles[j].Importe
                    global.variablesVentas[i].Detalles[j].Cod_Manguera = (arrayCambios[13] != null) ? arrayCambios[13] : global.variablesVentas[i].Detalles[j].Cod_Manguera
                    global.variablesVentas[i].Detalles[j].Tipo = (arrayCambios[14] != null) ? arrayCambios[14] : global.variablesVentas[i].Detalles[j].Tipo
                    global.variablesVentas[i].Detalles[j].Obs_ComprobanteD = (arrayCambios[15] != null) ? arrayCambios[15] : global.variablesVentas[i].Detalles[j].Obs_ComprobanteD
                    break
                }
            }
        }

    }
}

function deleteElementArrayJsonVentas(arrayJson, pIdTab, pCodigo) {
    for (var i in arrayJson) {
        if (arrayJson[i].idTab == pIdTab) {
            if (pCodigo != undefined) {
                for (var j in arrayJson[i].Detalles) {
                    if (arrayJson[i].Detalles[j].Codigo == pCodigo) {
                        arrayJson[i].Detalles.splice(j, 1)
                        break
                    }
                }
            } else {
                arrayJson.splice(i, 1)
                break
            }
        }
    }
}



function BloquearControles(event) {
    event.preventDefault();
    event.stopPropagation();
}

function LimpiarVariablesGlobales() {
    global.objClienteVenta = ''
    global.objProductoVentas = ''
    global.objProducto = ''
    global.objCliente = ''
    global.arraySeries = ''
    global.objComprobantePagoDetalle = ''
    global.objComprobantePago = ''
}

function LimpiarEventoModales() {
    $("#modal-proceso").off('shown.bs.modal')
    $("#modal-proceso").off('hidden.bs.modal')

    $("#modal-superior").off('shown.bs.modal')
    $("#modal-superior").off('hidden.bs.modal')
}

function CambiarCadenaConexion(cadena) {
    console.log(cadena)
    var posicionDataSource = cadena.search("Data Source=")
    var posicionInitial = cadena.search(";Initial Catalog=")
    var posicionUser = cadena.search(";user id=")
    var posicionPassword = cadena.search("; password=")

    if (cadena != null && cadena != "") {
        global.userDB = cadena.substring(posicionUser + ";user id=".length, posicionPassword)
        global.passwordDB = cadena.substring(posicionPassword + "; password=".length, cadena.length - 1)
        global.serverDB = cadena.substring(posicionDataSource + "Data Source=".length, posicionInitial).indexOf('.\\') != -1 ? 'localhost' : cadena.substring(posicionDataSource + "Data Source=".length, posicionInitial)
        global.DB = cadena.substring(posicionInitial + ";Initial Catalog=".length, posicionUser)
    } else {
        global.userDB = ''
        global.passwordDB = ''
        global.serverDB = ''
        global.DB = ''
    }

}


function TraerConexion(req, res, callback) {
    parametros = [
        { nom_parametro: 'RUC', valor_parametro: req.body.RUC },
    ]

    EXEC_SQL_DBMaster('USP_PRI_EMPRESA_TXRUC', parametros, function (m) {
        if (m.err) {
            return false;
        } else {
            if (m.result.length > 0) {
                if (m.result[0].CadenaConexion != null) {
                    CambiarCadenaConexion(UnObfuscateString(m.result[0].CadenaConexion));
                    callback(true)
                } else {
                    callback(false)
                }
            } else {
                callback(false)
            }
        }
    })
}

function VerificarDigitos(ruc) {
    //11 dígitos y empieza en 10,15,16,17 o 20
    if (!(ruc >= 1e10 && ruc < 11e9
       || ruc >= 15e9 && ruc < 18e9
       || ruc >= 2e10 && ruc < 21e9))
        return false;
    
    for (var suma = -(ruc%10<2), i = 0; i<11; i++, ruc = ruc/10|0)
        suma += (ruc % 10) * (i % 7 + (i/7|0) + 1);
    return suma % 11 === 0;
    
}

function RUCValido(ruc){
    if ((ruc = Number(ruc)) && ruc % 1 === 0
    	&& VerificarDigitos(ruc)) {
    	 return true
    } else {
        return false
    }
}

function EmailValido(valor) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)) {
        return true
    } else {
        return false
    }
}


function enviarCorreoConfirmacion(host,toEmail,ruc,callback){
   
    rand=Math.floor((Math.random() * 100) + 54) 
    link="http://"+host+"/empresa_api/verificacion_correo?id="+rand;
    var mailOptions={
      to : toEmail,
      subject : "PALERP CONSULTORES",
      html : "<img alt='PALE CONSULTORES' style='display:block; font-family:Arial, sans-serif; font-size:30px; line-height:34px; color:#000000;' src='http://palerp.com/images/logo.png'><br><h3><strong> PALE CONSULTORES le agradece su preferencia.</strong></h3><p> Para seguir con el proceso de registro necesitamos la confirmacion de su correo,<br> por favor haga click en el enlace para verificar su correo.<br><a href="+link+">CLICK AQUI PARA VERIFICAR CORREO</a></p>" 
    }
    transporter.sendMail(mailOptions, function (err, info) {
      if(err){
        callback(false)
      }
      else{ 
        localStorage.setItem(rand, JSON.stringify({email:toEmail,ruc:ruc,rand:rand}));
        callback(true)
        
      }
  });
}

function enviarCorreoRestaurarPassword(host,toEmail,ruc,callback){
   
    rand=Math.floor((Math.random() * 100) + 54) 
    link="http://"+host+"/empresa_api/cambiar_password_nueva?id="+rand;
    var mailOptions={
      to : toEmail,
      subject : "PALERP CONSULTORES",
      html : "<img alt='PALE CONSULTORES' style='display:block; font-family:Arial, sans-serif; font-size:30px; line-height:34px; color:#000000;' src='http://palerp.com/images/logo.png'><br><h3><strong> PALE CONSULTORES le agradece su preferencia.</strong></h3><p> Para seguir con el proceso de cambio de contraseña,<br> por favor haga click en el enlace <br><a href="+link+">CLICK AQUI PARA CAMBIAR PASSWORD</a></p>" 
    }
    transporter.sendMail(mailOptions, function (err, info) {
      if(err){
        callback(false)
      }
      else{ 
        localStorage.setItem(rand, JSON.stringify({email:toEmail,ruc:ruc,rand:rand}));
        callback(true)
        
      }
  });
}
 

module.exports = { ConvertirCadena, UnObfuscateString, CambiarCadenaConexion, TraerConexion, BloquearControles, getObjectArrayJsonVentas, changeArrayJsonVentas, changeDetallesArrayJsonVentas, deleteElementArrayJsonVentas, LimpiarVariablesGlobales, LimpiarEventoModales, RUCValido, EmailValido,enviarCorreoConfirmacion , enviarCorreoRestaurarPassword}
