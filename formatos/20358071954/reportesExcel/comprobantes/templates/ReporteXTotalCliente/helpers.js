 function recorrerArreglo(detalles) { 
    var html_general = '' 
    var html_fila_cuerpo = '' 
    var Id_Inicial = null
    var suma_subtotal = 0
    var suma_total = 0
    detalles.forEach(function(data){
        if(Id_Inicial==null){
            Id_Inicial = data.Id_Cliente
            html_fila_cuerpo = '<tr class="row">'+
                '<td class="detailsTable" style="width:auto;">'+data.Nom_TipoDoc+'</td>'+
                '<td class="detailsTable" style="width:auto;">'+data.Doc_Cliente+'</td>'+
                '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                '<td class="detailsTable" style="width:auto;">'+data.Direccion_Cliente+'</td>'+
                '<td class="detailsTable" style="width:auto;text-align:left">'+data.Sub_Total+'</td>'+
                '<td class="detailsTable" style="width:auto;text-align:left">'+data.Sub_Total+'</td>'+
            '</tr>'
            suma_subtotal = parseFloat(data.Sub_Total)
            suma_total = parseFloat(data.Sub_Total)
        }else{
            if(Id_Inicial == data.Id_Cliente){
                  html_fila_cuerpo = html_fila_cuerpo+ '<tr class="row">'+
                '<td class="detailsTable" style="width:auto;">'+data.Nom_TipoDoc+'</td>'+
                '<td class="detailsTable" style="width:auto;">'+data.Doc_Cliente+'</td>'+
                '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                '<td class="detailsTable" style="width:auto;">'+data.Direccion_Cliente+'</td>'+
                '<td class="detailsTable" style="width:auto;text-align:left">'+data.Sub_Total+'</td>'+
                '<td class="detailsTable" style="width:auto;text-align:left">'+data.Sub_Total+'</td>'+
            '</tr>'
             suma_subtotal = suma_subtotal + parseFloat(data.Sub_Total)
             suma_total = suma_total + parseFloat(data.Sub_Total)
            }else{
               html_fila_cuerpo = html_fila_cuerpo+ '<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td class="tablaDetalleAlert" style="font-weight: bold">SUB-TOTAL : </td>'+
                '<td style="text-align:right">'+parseFloat(suma_subtotal).toFixed(2)+'</td>'+
                '</tr>'
                
              html_general = html_general + html_fila_cuerpo
              Id_Inicial = data.Id_Cliente
              
              html_fila_cuerpo = '<tr class="row">'+
                '<td class="detailsTable" style="width:auto;">'+data.Nom_TipoDoc+'</td>'+
                '<td class="detailsTable" style="width:auto;">'+data.Doc_Cliente+'</td>'+
                '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                '<td class="detailsTable" style="width:auto;">'+data.Direccion_Cliente+'</td>'+
                '<td class="detailsTable" style="width:auto;text-align:left">'+data.Sub_Total+'</td>'+
                '<td class="detailsTable" style="width:auto;text-align:left">'+data.Sub_Total+'</td>'+
            '</tr>'
             suma_subtotal = parseFloat(data.Sub_Total)
             suma_total = suma_total + parseFloat(data.Sub_Total)
            }
        }
    })
    html_general = html_general+html_fila_cuerpo+'<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td class="tablaDetalleAlert" style="font-weight: bold">SUB-TOTAL : </td>'+
                '<td style="text-align:right">'+parseFloat(suma_subtotal).toFixed(2)+'</td>'+
                '</tr>'+
                '<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td style="font-weight: bold;color:red;text-align:left">TOTAL : </td>'+
                '<td style="text-align:right">'+parseFloat(suma_total).toFixed(2)+'</td>'+
                '</tr>'
    
    return html_general;
}