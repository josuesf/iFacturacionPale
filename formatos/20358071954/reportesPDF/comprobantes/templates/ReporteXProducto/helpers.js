function recorrerArreglo(detalles) {  
    var html_general = ''
    var producto_orden = null 

    var dataDocumento = {} 
    
    detalles.forEach(function(data){
        if(producto_orden == (data.Id_Producto?data.Id_Producto:'')){
                
                 dataDocumento[producto_orden].detalles.push({
                    "html":'<tr class="row">'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cantidad+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.PrecioUnitario+'</td>'+ 
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Sub_Total+'</td>'+
                            '</tr>',
                     "Cantidad":data.Cantidad,
                    "PrecioUnitario":data.PrecioUnitario,
                    "SubTotal":data.Sub_Total,
                })
              
        }else{ 
            producto_orden = data.Id_Producto
            if(!dataDocumento.hasOwnProperty(producto_orden)){
                producto_orden = data.Id_Producto
                
                dataDocumento[producto_orden]={
                    "html":'<tr class="row">'+
                                '<td colspan="7" style="width:auto;font-weight: bold;font-size: 15px">Producto : '+data.Id_Producto+' '+data.Nom_Producto+' Categoria : '+data.Des_Categoria+'</td>'+
                            '</tr>', 
                    "detalles":[]
                }
             
                dataDocumento[producto_orden].detalles.push({
                   "html":'<tr class="row">'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cantidad+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.PrecioUnitario+'</td>'+ 
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Sub_Total+'</td>'+
                            '</tr>',
                     "Cantidad":data.Cantidad,
                    "PrecioUnitario":data.PrecioUnitario,
                    "SubTotal":data.Sub_Total,
                })
            }else{
                 dataDocumento[producto_orden].detalles.push({
                     "html":'<tr class="row">'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cantidad+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.PrecioUnitario+'</td>'+ 
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Sub_Total+'</td>'+
                            '</tr>',
                     "Cantidad":data.Cantidad,
                    "PrecioUnitario":data.PrecioUnitario,
                    "SubTotal":data.Sub_Total,
                    
                })

            }
        }
    })
 
    
    var html_general = ''
    var suma_cantidad = 0
    var suma_preciounitario = 0
    var suma_subtotal = 0
    
    for(var keyD in dataDocumento){
        html_general = html_general + dataDocumento[keyD].html
        let html_detalles = ''
        let subtotal_cantidad = 0
        let subtotal_precio = 0
        let subtotal_subtotal = 0
        let cantidad_items = 0
        dataDocumento[keyD].detalles.forEach(function(dataHtml,index){
            cantidad_items++
            html_detalles = html_detalles + dataHtml['html']
            subtotal_cantidad = subtotal_cantidad + parseFloat(dataHtml['Cantidad'])
            subtotal_precio = subtotal_precio + parseFloat(dataHtml['PrecioUnitario'])
            subtotal_subtotal = subtotal_subtotal + parseFloat(dataHtml['SubTotal'])
            
            suma_cantidad = suma_cantidad + parseFloat(dataHtml['Cantidad'])
            suma_preciounitario = suma_preciounitario + parseFloat(dataHtml['PrecioUnitario'])
            suma_subtotal = suma_subtotal + parseFloat(dataHtml['SubTotal'])
            
            if(index==(dataDocumento[keyD].detalles.length-1)){
              html_detalles = html_detalles +   '<tr class="row">'+ 
                                                        '<td></td>'+
                                                        '<td></td>'+ 
                                                        '<td class="tablaDetalleAlert" style="font-weight: bold">SUB-TOTAL</td>'+
                                                        '<td style="width:auto;text-align:right">'+parseFloat(subtotal_cantidad).toFixed(2)+'</td>'+
                                                        '<td></td>'+ 
                                                        '<td style="width:auto;text-align:right">'+parseFloat(subtotal_precio/cantidad_items).toFixed(2)+'</td>'+
                                                        '<td style="width:auto;text-align:right">'+parseFloat(subtotal_subtotal).toFixed(2)+'</td>'+
                                                '</tr><tr class="row"><td></td></tr>'
                                                 
            }
        })
        html_general = html_general +html_detalles
       
    }
    
    html_general = html_general+'<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td style="font-weight: bold;color:red;text-align:left">TOTAL GENERAL : </td>'+
                '<td style="width:auto;text-align:right">'+parseFloat(suma_cantidad).toFixed(2)+'</td>'+
                '<td></td>'+ 
                '<td style="width:auto;text-align:right">'+parseFloat(suma_preciounitario/detalles.length).toFixed(2)+'</td>'+
                '<td style="width:auto;text-align:right">'+parseFloat(suma_subtotal).toFixed(2)+'</td>'+
                '</tr>'
    
    return html_general;
}