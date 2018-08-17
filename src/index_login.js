require('babel-polyfill');
import {URL} from './constantes_entorno/constantes'

$(document).ready(function(){
    CambioRUC("0")

    $('#repeatpassword').keyup(function(e){
        //get values 
        var pass = $('#password').val();
        var confpass = $(this).val();
        
        //check the strings
        if(pass == confpass){
            //if both are same remove the error and allow to submit
            $('#divError').css("display","none")
            $('#textError').text('');
        }else{
            //if not matching show error and not allow to submit
            $('#divError').css("display","block")
            $('#textError').text('Las contraseñas no coinciden');
        }
    });

    $("#RUC").change(function(){
        CambioRUC("1")
    })
    $("#Gestion").keypress(function(){
        TraerPeriodos()
    })
    $("#Gestion").change(function(){
        TraerPeriodos()
    })
    $("#Periodo").change(function(){
        TraerTurnos()
    })

    $("#btnTurnoSiguiente").click(function(){
        CrearTurnoSiguiente()
    })
})

function CrearTurnoSiguiente(){
    var Cod_Usuario = 'MIGRACION'
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Usuario
        })
    }
    fetch(URL +'/empresa_api/crear_siguiente_turno', parametros)
        .then(req => req.json())
        .then(res => {
            TraerTurnos()
        })
}

function TraerPeriodos(){
    run_waitMe($('#Periodo'), 3, "ios","cargando");
    var Gestion = $("#Gestion").val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Gestion
        })
    }
    fetch(URL +'/empresa_api/get_periodos_by_gestion', parametros)
        .then(req => req.json())
        .then(res => {
            LlenarPeriodo(res.data.periodos,'Periodo')
            TraerTurnos()
        })
}

function TraerTurnos(){
    run_waitMe($('#Turno'), 3, "ios","cargando");
    var Cod_Periodo = $("#Periodo").val()
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Periodo
        })
    }
    fetch(URL +'/empresa_api/get_turnos_by_periodo', parametros)
        .then(req => req.json())
        .then(res => { 
            LlenarTurnos(res.data.turnos,'Turno')
        })
}

function LlenarPeriodo(periodos,idSelect){
    var html = ''
    for(var i=0; i<periodos.length; i++){
        html = html+'<option value="'+periodos[i].Cod_Periodo+'">'+periodos[i].Nom_Periodo+'</option>'
    }
     
    $("#"+idSelect).html('')
    $("#"+idSelect).html(html) 
    const fecha = new Date()
    const mes = fecha.getMonth() + 1 
    var periodo = fecha.getFullYear() + '-' + (mes > 9 ? mes : '0' + mes)
    $("#"+idSelect).val(periodo) 
}

function LlenarTurnos(turnos,idSelect){
    var html = ''
    for(var i=0; i<turnos.length; i++){
        html = html+'<option value="'+turnos[i].Cod_Turno+'">'+turnos[i].Des_Turno+'</option>'
    }

    $("#"+idSelect).html('')
    $("#"+idSelect).html(html)
    $("#"+idSelect+" option:last").attr("selected", "selected"); 
}


function CambioRUC(flag){
    run_waitMe($('#empresa'), 3, "ios","cargando");
    if(flag=="1"){
        var RUC = $("#empresa").val()
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                RUC
            })
        }
        fetch(URL +'/empresa_api/change_ruc', parametros)
            .then(req => req.json())
            .then(res => {
                if(res.respuesta=="ok"){
                
                    $("#divError").css("display","none")
                    $("#textError").text("")
                    TraerPeriodos()
                }else{
                    $("#divError").css("display","block")
                    $("#textError").text("Ocurrio un error. Es necesario configurar la cadena de conexion para esta empresa, seleccione otra empresa")
                    $("#Turno").html('')
                    $("#Periodo").html('') 
                }
            })
    }else{
        var RUC = $("#empresa").val()
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                RUC
            })
        }
        fetch(URL +'/empresa_api/change_ruc', parametros)
            .then(req => req.json())
            .then(res => {
                if(res.respuesta=="ok"){ 
                    TraerPeriodos()
                }else{
                    $("#Turno").html('')
                    $("#Periodo").html('') 
                }
            })
    }
} 

function obtenerDatosSUNAT(ruc) {
    //Init
    var url = "https://cors-anywhere.herokuapp.com/wmtechnology.org/Consultar-RUC/?modo=1&btnBuscar=Buscar&nruc=" + ruc,
        existente = document.getElementById("existente"),
        xhr = false;
    if (window.XMLHttpRequest) //Crear XHR
        xhr = new XMLHttpRequest();
    else if (window.ActiveXObject)
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    else return false;
    //handler para respuesta
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) { //200 OK
            var doc = document.implementation.createHTMLDocument()
                .documentElement,
                res = "",
                txt, campos,
                ok = false;

            doc.innerHTML = xhr.responseText;
            //Sólo el texto de las clases que nos interesa
            campos = doc.querySelectorAll(".list-group-item");
            if (campos.length) {
                for (txt of campos)
                    res += txt.innerText + "\n";
                //eliminar blancos por demás
                res = res.replace(/^\s+\n*|(:) *\n| +$/gm, "$1");
                //buscar si está el texto "ACTIVO" en el estado
                ok = /^Estado: *ACTIVO *$/m.test(res);
            } else
                res = "RUC: " + ruc + "\nNo existe.";

            //mostrar el texto formateado
            if (ok)
                existente.classList.add("ok");
            else
                existente.classList.remove("ok");
            existente.innerText = res;
        }
    } //falta verificar errores en conexión
    xhr.open("POST", url, true);
    xhr.send(null);
}

