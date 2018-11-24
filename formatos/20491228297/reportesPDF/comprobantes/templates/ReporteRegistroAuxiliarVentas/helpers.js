 function recorrerArreglo(detalles) { 
   
    var html_fila_cuerpo = ''
    var gran_gravadas = 0
    var gran_exoneradas = 0
    var gran_inafectas = 0
    var gran_gratuitas = 0
    var gran_otros_tributos = 0
    var gran_igv = 0
    var gran_total = 0
    detalles.forEach(function(data,index){
        
            gran_gravadas = gran_gravadas + parseFloat(data.Gravadas)
            gran_exoneradas = gran_exoneradas + parseFloat(data.Exoneradas)
            gran_inafectas = gran_inafectas + parseFloat(data.Inafectas)
            gran_gratuitas = gran_gratuitas + parseFloat(data.Gratuitas)
            gran_otros_tributos = gran_otros_tributos + parseFloat(data.Otros_Cargos)
            gran_igv = gran_igv + parseFloat(data.IGV)
            gran_total = gran_total + parseFloat(data.Total)
            
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
                '<td class="detailsTable">'+data.Gravadas+'</td>'+
                '<td class="detailsTable">'+data.Exoneradas+'</td>'+
                '<td class="detailsTable">'+data.Inafectas+'</td>'+
                '<td class="detailsTable">'+data.Gratuitas+'</td>'+ 
                '<td class="detailsTable">'+data.Otros_Cargos+'</td>'+ 
                '<td class="detailsTable">'+data.IGV+'</td>'+
                '<td class="detailsTable">'+data.Total+'</td>'+
                '<td class="detailsTable">'+data.Otros_Tributos+'</td>'+
                '<td class="detailsTable">'+data.TipoCambio+'</td>'+ 
                '<td class="detailsTable">'+data.Placa_Vehiculo+'</td>'+ 
                '<td class="detailsTable">'+(data.FechaRef?data.FechaRef.toString().split('T')[0]:'')+'</td>'+
                '<td class="detailsTable">'+data.Cod_TipoComprobanteRef+'</td>'+
                '<td class="detailsTable">'+data.Serie_Ref+'</td>'+
                '<td class="detailsTable">'+data.Numero_Ref+'</td>'+
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
                '<td style="font-weight: bold;color:red;text-align:left">TOTALES : </td>'+
                '<td>'+parseFloat(gran_gravadas).toFixed(2)+'</td>'+
                '<td>'+parseFloat(gran_exoneradas).toFixed(2)+'</td>'+
                '<td>'+parseFloat(gran_inafectas).toFixed(2)+'</td>'+
                '<td>'+parseFloat(gran_gratuitas).toFixed(2)+'</td>'+  
                '<td>'+parseFloat(gran_otros_tributos).toFixed(2)+'</td>'+
                '<td>'+parseFloat(gran_igv).toFixed(2)+'</td>'+
                '<td>'+parseFloat(gran_total).toFixed(2)+'</td>'+
                '</tr>'
     
    return html_fila_cuerpo;
}