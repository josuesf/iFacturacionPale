 
CambioRUC("0")

function TraerPeriodos(){
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
    fetch('/empresa_api/get_periodos_by_gestion', parametros)
        .then(req => req.json())
        .then(res => {
            LlenarPeriodo(res.data.periodos,'Periodo')
            TraerTurnos()
        })
}

function TraerTurnos(){
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
    fetch('/empresa_api/get_turnos_by_periodo', parametros)
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
}

function LlenarTurnos(turnos,idSelect){
    var html = ''
    for(var i=0; i<turnos.length; i++){
        html = html+'<option value="'+turnos[i].Cod_Turno+'">'+turnos[i].Des_Turno+'</option>'
    }

    $("#"+idSelect).html('')
    $("#"+idSelect).html(html) 
}


function CambioRUC(flag){
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
        fetch('/empresa_api/change_ruc', parametros)
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
        fetch('/empresa_api/change_ruc', parametros)
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



 