 

TraerPeriodos() 

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


 