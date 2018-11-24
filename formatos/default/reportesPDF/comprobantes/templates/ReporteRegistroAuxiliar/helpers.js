 function recorrerArreglo(detalles) { 
   
    var html_fila_cuerpo = ''
    var gran_total_base_imponible = 0
    var gran_total_igv = 0
    var gran_total_total = 0
    detalles.forEach(function(data,index){
        
            gran_total_base_imponible = gran_total_base_imponible + parseFloat(data.BaseImponible)
            gran_total_igv = gran_total_igv + parseFloat(data.IGV)
            gran_total_total = gran_total_total + parseFloat(data.Total)
            
             html_fila_cuerpo = html_fila_cuerpo +'<tr class="row">'+ 
                '<td class="detailsTable">'+(index+1)+'</td>'+
                '<td class="detailsTable">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                '<td class="detailsTable">'+(data.FechaCancelacion?data.FechaCancelacion.toString().split('T')[0]:'')+'</td>'+
                '<td class="detailsTable">'+data.Nro_Ticketera+'</td>'+
                '<td class="detailsTable">'+data.Cod_TipoComprobante+'</td>'+
                '<td class="detailsTable">'+data.Serie+'</td>'+
                '<td class="detailsTable">'+data.Numero+'</td>'+
                '<td class="detailsTable">'+data.Cod_TipoDoc+'</td>'+
                '<td class="detailsTable">'+data.Doc_Cliente+'</td>'+
                '<td class="detailsTable">'+data.Nom_Cliente+'</td>'+
                '<td class="detailsTable">'+data.BaseImponible+'</td>'+
                '<td class="detailsTable">'+data.IGV+'</td>'+
                '<td class="detailsTable">'+data.Total+'</td>'+
                '<td class="detailsTable">'+data.Cod_Turno+'</td>'+
                '<td class="detailsTable">'+data.Cod_CuentaContable+'</td>'+
                '</tr>'
    })
    
    html_fila_cuerpo = html_fila_cuerpo + '<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td class="detailsTable" style="font-weight: bold;color:red;text-align:left">GRAN TOTAL : </td>'+
                '<td>'+parseFloat(gran_total_base_imponible).toFixed(2)+'</td>'+
                '<td>'+parseFloat(gran_total_igv).toFixed(2)+'</td>'+
                '<td>'+parseFloat(gran_total_total).toFixed(2)+'</td>'+
                '<td></td>'+
                '<td></td>'+
                '</tr>'
     
    return html_fila_cuerpo;
}