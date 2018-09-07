require('babel-polyfill');
import {URL} from './constantes_entorno/constantes'

$(document).ready(function(){
    /*CambioRUC("0")
 
    $("#RUC").change(function(){
        CambioRUC("1")
    })*/ 
    //TraerPeriodos()
    CrearTurnoSiguiente()

    $("#Caja").change(function(){
        TraerTurnos()
    })
    /*$("#Gestion").keypress(function(){
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
    })*/
})

function CrearTurnoSiguiente(){ 
    run_waitMe($('#select-turno'), 2, "ios","");
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
            //$('#divError').css("display","none")
            //$('#textError').text(''); 
            TraerTurnos()
            $('#select-turno').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            $('#select-turno').waitMe('hide');
            //$('#divError').css("display","block")
            //$('#textError').text('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e); 
        });
}

function TraerTurnos(){
    run_waitMe($('#select-turno'), 2, "ios","");
    var Cod_Caja = $("#Caja").val() 
    const parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Caja
        })
    }
    fetch(URL +'/empresa_api/get_turnos_by_cod_caja', parametros)
        .then(req => req.json())
        .then(res => { 
            LlenarTurnos(res.data.turnos,'Turno')
        }).catch(function (e) {  
            console.log(e)
            $('#select-turno').waitMe('hide');
        })
}

function LlenarTurnos(turnos,idSelect){
    var html = ''
    for(var i=0; i<turnos.length; i++){
        html = html+'<option value="'+turnos[i].Cod_Turno+'">'+turnos[i].Des_Turno+'</option>'
    }

    $("#"+idSelect).html('')
    $("#"+idSelect).html(html)
    $("#"+idSelect+" option:last").attr("selected", "selected"); 
    $('#select-turno').waitMe('hide');
}

/*function TraerPeriodos(){
    run_waitMe($('#select-periodo'), 2, "ios","");
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
        }).catch(function (e) {  
            console.log(e)
            $('#select-periodo').waitMe('hide');
        })
}

function TraerTurnos(){
    run_waitMe($('#select-turno'), 2, "ios","");
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
        }).catch(function (e) {  
            console.log(e)
            $('#select-turno').waitMe('hide');
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
    $('#select-periodo').waitMe('hide');
}

function LlenarTurnos(turnos,idSelect){
    var html = ''
    for(var i=0; i<turnos.length; i++){
        html = html+'<option value="'+turnos[i].Cod_Turno+'">'+turnos[i].Des_Turno+'</option>'
    }

    $("#"+idSelect).html('')
    $("#"+idSelect).html(html)
    $("#"+idSelect+" option:last").attr("selected", "selected"); 
    $('#select-turno').waitMe('hide');
}*/


/*function CambioRUC(flag){
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
                $('#divError').css("display","none")
                $('#textError').text('');
            }).catch(function (e) {
                console.log(e);
                $('#divError').css("display","block")
                $('#textError').text('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e); 
            });
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
                $('#divError').css("display","none")
                $('#textError').text(''); 
            }).catch(function (e) {
                console.log(e);
                $('#divError').css("display","block")
                $('#textError').text('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e); 
            });
    }
} */
 