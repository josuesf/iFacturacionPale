
var { EXEC_SQL_DBMaster} = require('./exec_sp_sql')

var sUnidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiún", "veintidos", "veintitres", "veinticuatro", "veinticinco", "veintiseis", "veintisiete", "veintiocho", "veintinueve"];

var sDecenas = [ "", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa" ];

var sCentenas = [ "", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos" ];

function Numeros(dNumAux,dFactor){
    var dCociente = dNumAux / dFactor
    var dNumero = 0
    var iNumero = 0
    var sNumero = ""
    var sTexto = ""

    if (dCociente >= 100)
    {
        dNumero = dCociente / 100
        sNumero = dNumero.toString()
        iNumero = parseInt(sNumero[0].toString())
        sTexto += sCentenas[iNumero] + " "
    }

    dCociente = dCociente % 100;
    if (dCociente >= 30)
    {
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

    else
    {
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

function ConvertirCadena(sNumero){
    var dNumero
    var dNumAux = 0
    var x
    var sAux
    var sResultado = " "
    try{
        dNumero =  parseFloat(sNumero)
    }catch(e){
        return ""
    }

    if (dNumero > 999999999999)
        return "";

    if (dNumero > 999999999){
        dNumAux = dNumero % 1000000000000;
        sResultado += Numeros(dNumAux, 1000000000) + " mil "
    }

    if (dNumero > 999999)
    {
        dNumAux = dNumero % 1000000000
        sResultado += Numeros(dNumAux, 1000000) + " millones "
    }

    if (dNumero > 999)
    {
        dNumAux = dNumero % 1000000
        sResultado += Numeros(dNumAux, 1000) + " mil "
    }

    dNumAux = dNumero % 1000
    sResultado += Numeros(dNumAux, 1)


    //Enseguida verificamos si contiene punto, si es así, los convertimos a texto.
    sAux = dNumero.toString()

    if (sAux.indexOf(".") >= 0)
        sResultado += ObtenerDecimales(sAux)
        //Las siguientes líneas convierten el primer caracter a mayúscula.
        sAux = sResultado
        x = sResultado[1].toString()
        sResultado = x.toString()

        for (var i = 2; i < sAux.Length; i++)
            sResultado += sAux[i].toString()
            return sResultado;
}

function ConvertirCadena(dNumero, TipoMoneda){
    var dNumAux = 0
    var sAux
    var sResultado = " "

    if (dNumero > 999999999999)
        return ""

    if (dNumero > 999999999){
        dNumAux = dNumero % 1000000000000
        sResultado += Numeros(dNumAux, 1000000000) + " mil "
    }

    if (dNumero > 999999){
        dNumAux = dNumero % 1000000000
        sResultado += Numeros(dNumAux, 1000000) + " millones "
    }

    if (dNumero > 999){
        dNumAux = dNumero % 1000000
        sResultado += Numeros(dNumAux, 1000) + " mil "
    }

    dNumAux = dNumero % 1000
    sResultado += Numeros(dNumAux, 1)


    ////Enseguida verificamos si contiene punto, si es así, los convertimos a texto.
    //sAux = dNumero.toString();

    //if (sAux.IndexOf(".") >= 0)
    //    sResultado += ObtenerDecimales(sAux);

    ////Las siguientes líneas convierten el primer caracter a mayúscula.
    //sAux = sResultado;
    //x = char.ToUpper(sResultado[1]);
    //sResultado = x.toString();

    //for (int i = 2; i < sAux.Length; i++)
    //    sResultado += sAux[i].toString();
    sAux = dNumero.toString()
    var sNumPuntos = []
    var Numero = 0

    sNumPuntos = sAux.split('.')

    try{
        Numero = parseInt(sNumPuntos[1]);
        if (sNumPuntos[1].Length == 1)
        {
            Numero *= 10;
        }

    }catch(e)
    {
        Numero = 0
    }
    sResultado += "con "
    sResultado += Numero + "00"

    sResultado += "/100 " + TipoMoneda
    return sResultado
}

function UnObfuscateString(cadena){
    if(cadena!=null && cadena!=""){ 
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

        for (iLoop = iMiddle + iRemainder; iLoop >= 1; iLoop += -1){ 
            if (iRemainder == 0){
                sTemp += cadena.substr( (iLoop + iMiddle)-1 ,1) //Strings.Mid(cadena, iLoop + iMiddle, 1);
            }
        
            sTemp += cadena.substr(iLoop-1,1) //Strings.Mid(cadena, iLoop, 1);
            if (iRemainder == 1 & iLoop != 1){
                sTemp += cadena.substr((iLoop+iMiddle)-1,1) //Strings.Mid(cadena, iLoop + iMiddle, 1);
            }
        }
        return sTemp;
    }else{
        return "";
    }
}

function CambiarCadenaConexion(cadena){
    console.log(cadena)
    /*
        user: process.env.user_database || 'sa', // update me
        password: process.env.password_database || 'paleC0nsult0res', // update me
        server: process.env.server_database || 'localhost',
        database: process.env.name_database || 'PALERPmisky'
    */
    if(cadena!=null && cadena!=""){
        global.userDB = 'sa'
        global.passwordDB = 'paleC0nsult0res'
        global.serverDB = 'localhost'
        global.DB = 'PALERPmisky'
    }else{
        global.userDB = ''
        global.passwordDB = ''
        global.serverDB = ''
        global.DB = ''
    }
    
}

 
function TraerConexion(req, res){
    parametros = [
        { nom_parametro: 'RUC', valor_parametro: req.body.RUC },
    ] 

    EXEC_SQL_DBMaster('USP_PRI_EMPRESA_TXRUC', parametros, function (m) {
        if (m.err) {
            return false;
        }else{
            if(m.result.length>0){
                if(m.result[0].CadenaConexion!=null){
                    CambiarCadenaConexion(UnObfuscateString(m.result[0].CadenaConexion));
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }
    }) 
}


module.exports = { ConvertirCadena , UnObfuscateString,TraerConexion }