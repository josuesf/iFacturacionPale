 function recorrerArreglo(detalles) { 
   
    var html_fila_cuerpo = ''
    var total_general_cantidad = 0
    var total_general_subtotal = 0 
    detalles.forEach(function(data,index){
        
            total_general_cantidad = total_general_cantidad + parseFloat(data.Cantidad)
            total_general_subtotal = total_general_subtotal + parseFloat(data.Sub_Total)
            
             html_fila_cuerpo = html_fila_cuerpo +'<tr class="row">'+ 
                '<td>'+(index+1)+'</td>'+
                '<td>'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                '<td>'+(data.FechaCancelacion?data.FechaCancelacion.toString().split('T')[0]:'')+'</td>'+
                '<td>'+data.Cod_TipoComprobante+'</td>'+
                '<td>'+data.Serie+'</td>'+
                '<td>'+data.Numero+'</td>'+
                '<td>'+data.Cod_TipoDoc+'</td>'+
                '<td>'+data.Doc_Cliente+'</td>'+
                '<td>'+data.Nom_Cliente+'</td>'+
                '<td>'+data.Descripcion+'</td>'+
                '<td style="text-align:right">'+data.Cantidad+'</td>'+
                '<td style="text-align:right">'+data.PrecioUnitario+'</td>'+
                '<td style="text-align:right">'+data.Sub_Total+'</td>'+
                '<td>'+data.Cod_Turno+'</td>'+
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
                '<td style="font-weight: bold;color:red;text-align:left">TOTAL GENERAL : </td>'+
                '<td style="text-align:right">'+parseFloat(total_general_cantidad).toFixed(2)+'</td>'+
                '<td style="text-align:right"></td>'+
                '<td style="text-align:right">'+parseFloat(total_general_subtotal).toFixed(2)+'</td>'+
                '<td></td>'+
                '</tr>'
     
    return html_fila_cuerpo;
}