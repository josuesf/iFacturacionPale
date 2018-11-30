 function recorrerArreglo(detalles) { 
   
    var html_fila_cuerpo =  '<tr class="row">'+
                                '<td class="headerTable" colspan="4"></td>'+
                                '<td class="headerTable" colspan="2">SOLES</td>'+
                                '<td class="headerTable" colspan="2">DOLARES</td>'+
                            '</tr>'+  
                            '<tr class="row">'+
                                '<td class="headerTable">DOCUMENTO</td>'+
                                '<td class="headerTable">CLIENTE</td>'+
                                '<td class="headerTable">MOVIMIENTO</td>'+
                                '<td class="headerTable">FECHA</td>'+
                                '<td class="headerTable">INGRESO</td>'+
                                '<td class="headerTable">EGRESO</td>'+
                                '<td class="headerTable">INGRESO</td>'+
                                '<td class="headerTable">EGRESO</td>'+
                            '</tr>'
    var sub_total_soles_i = 0
    var sub_total_soles_e = 0
    var sub_total_dolares_i = 0
    var sub_total_dolares_e = 0
    var total_total = 0
    detalles.forEach(function(data){
        
            sub_total_soles_i = sub_total_soles_i + parseFloat(data.IngresoSoles)
            sub_total_soles_e = sub_total_soles_e + parseFloat(data.EgresoSoles)
            sub_total_dolares_i = sub_total_dolares_i + parseFloat(data.IngresoDolares)
            sub_total_dolares_e = sub_total_dolares_e + parseFloat(data.EgresoDolares)
            
             html_fila_cuerpo = html_fila_cuerpo +'<tr class="row">'+ 
                '<td class="detailsTable">'+data.Documento+'</td>'+
                '<td class="detailsTable">'+data.Cliente+'</td>'+
                '<td class="detailsTable">'+data.Movimiento+'</td>'+
                '<td class="detailsTable">'+(data.Fecha?data.Fecha.toString().split(' ')[0]:'')+'</td>'+
                '<td class="detailsTable">'+(data.IngresoSoles?data.IngresoSoles:0)+'</td>'+
                '<td class="detailsTable">'+(data.EgresoSoles?data.EgresoSoles:0)+'</td>'+
                '<td class="detailsTable">'+(data.IngresoDolares?data.IngresoDolares:0)+'</td>'+
                '<td class="detailsTable">'+(data.EgresoDolares?data.EgresoDolares:0)+'</td>'+
                '</tr>'
    })
    
    html_fila_cuerpo = html_fila_cuerpo + '<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td class="detailsTable">SUB TOTAL  </td>'+
                '<td class="detailsTable">'+parseFloat(sub_total_soles_i).toFixed(2)+'</td>'+
                '<td class="detailsTable">'+parseFloat(sub_total_soles_e).toFixed(2)+'</td>'+
                '<td class="detailsTable">'+parseFloat(sub_total_dolares_i).toFixed(2)+'</td>'+
                '<td class="detailsTable">'+parseFloat(sub_total_dolares_e).toFixed(2)+'</td>'+
                '</tr>'+
                '<tr class="row">'+
                '<td></td>'+
                '</tr>'+
                '<tr class="row">'+
                '<td colspan="4" class="detailsTable">SALDO DISPONIBLE</td>'+
                '<td colspan="2" class="detailsTable">'+(sub_total_soles_i-sub_total_soles_e)+'</td>'+
                '<td colspan="2" class="detailsTable">'+(sub_total_dolares_i-sub_total_dolares_e)+'</td>'+
                '</tr>'
    return html_fila_cuerpo;
}