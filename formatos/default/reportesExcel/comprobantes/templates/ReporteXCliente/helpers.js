function recorrerArreglo(detalles,nom_impuesto) {  
    var html_general = ''
    var cliente_orden = null  
    var dataDocumento = {} 
    
    detalles.forEach(function(data){
        if(cliente_orden == data.Id_Cliente){
             if(dataDocumento[cliente_orden].formas_pago.hasOwnProperty(data.Cod_FormaPago)){
                    dataDocumento[cliente_orden].formas_pago[data.Cod_FormaPago].push({
                        "html":'<tr class="row">'+
                            '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+ 
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+' '+data.PrecioUnitario+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                        '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Sub_Total,
                        "Nombre_FormaPago":data.Nom_FormaPago
                    })
                }else{
                    dataDocumento[cliente_orden].formas_pago[data.Cod_FormaPago] = []
                    dataDocumento[cliente_orden].formas_pago[data.Cod_FormaPago].push({
                        "html":'<tr class="row">'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+' '+data.PrecioUnitario+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                                '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Sub_Total,
                        "Nombre_FormaPago":data.Nom_FormaPago
                        
                    })
                }
                
        }else{ 
            cliente_orden = data.Id_Cliente
            if(!dataDocumento.hasOwnProperty(cliente_orden)){
                dataDocumento[cliente_orden]={
                    "html":'<tr class="row">'+
                                '<td style="width:auto;font-weight: bold">Cliente : </td>'+
                                '<td style="width:auto">'+data.Nom_Cliente+'</td>'+
                                '<td style="width:auto"></td>'+
                                '<td style="width:auto"></td>'+
                                '<td style="width:auto;font-weight: bold">'+data.Nom_TipoDoc+'</td>'+
                                '<td style="width:auto">'+data.Doc_Cliente+'</td>'+
                            '</tr>'+
                            '<tr class="row">'+
                                '<td style="width:auto;font-weight: bold">Direccion : </td>'+
                                '<td style="width:auto">'+data.Direccion_Cliente+'</td>'+
                            '</tr>'+
                            '<tr class="row"><td></td></tr>'+
                            '<tr class="row">'+
                                '<td class="headerTable" style="width:auto;">Documento</td>'+
                                '<td class="headerTable" style="width:auto;">Fecha</td>'+
                                '<td class="headerTable" style="width:auto;">Producto</td>'+
                                '<td class="headerTable" style="width:auto;">Cantidad</td>'+
                                '<td class="headerTable" style="width:auto;text-align:right">Precio</td>'+
                                '<td class="headerTable" style="width:auto;text-align:right">Total</td>'+
                            '</tr>',
                    "formas_pago":{}
                }
             
                dataDocumento[cliente_orden].formas_pago[data.Cod_FormaPago] = []
                dataDocumento[cliente_orden].formas_pago[data.Cod_FormaPago].push({
                    "html":'<tr class="row">'+
                            '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+ 
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+' '+data.PrecioUnitario+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                        '</tr>',
                    "Cantidad":data.Cantidad,
                    "PrecioUnitario":data.PrecioUnitario,
                    "SubTotal":data.Sub_Total,
                    "Nombre_FormaPago":data.Nom_FormaPago
                    
                })
            }else{
                 
                 if(dataDocumento[cliente_orden].formas_pago.hasOwnProperty(data.Cod_FormaPago)){
                    dataDocumento[cliente_orden].formas_pago[data.Cod_FormaPago].push({
                        "html":'<tr class="row">'+
                            '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+ 
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+' '+data.PrecioUnitario+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                        '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Sub_Total,
                        "Nombre_FormaPago":data.Nom_FormaPago
                    })
                }else{
                    dataDocumento[cliente_orden].formas_pago[data.Cod_FormaPago] = []
                    dataDocumento[cliente_orden].formas_pago[data.Cod_FormaPago].push({
                        "html":'<tr class="row">'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+' '+data.PrecioUnitario+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                                '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Sub_Total,
                        "Nombre_FormaPago":data.Nom_FormaPago
                        
                    })
                }
                 
            }
        }
    })
 
    
    var html_general = '' 
    
    var suma_total_cantidad = 0
    var suma_total_precio_unitario = 0
    var suma_total_subtotal = 0
    var suma_general = 0
    
    for(var keyD in dataDocumento){
        html_general = html_general + dataDocumento[keyD].html
        let suma_formas_pago = 0
        for (var keyFP in dataDocumento[keyD]['formas_pago']){
            let html_forma_pago = ''
            let suma_cantidad = 0
            let suma_precio_promedio = 0
            let cantidad_items = 0
            let suma_subtotal = 0
            dataDocumento[keyD]['formas_pago'][keyFP].forEach(function(dataHtml,index){
                cantidad_items++
                html_forma_pago = html_forma_pago + dataHtml['html']
                suma_cantidad = suma_cantidad + parseFloat(dataHtml['Cantidad'])
                suma_precio_promedio = suma_precio_promedio + parseFloat(dataHtml['PrecioUnitario'])
                suma_subtotal = suma_subtotal+parseFloat(dataHtml['SubTotal']) 
                  
                suma_total_cantidad = suma_total_cantidad + parseFloat(dataHtml['Cantidad'])
                suma_total_precio_unitario = suma_total_precio_unitario + parseFloat(dataHtml['PrecioUnitario'])
                suma_total_subtotal = suma_total_subtotal+parseFloat(dataHtml['SubTotal']) 
                
                suma_formas_pago = suma_formas_pago + parseFloat(dataHtml['SubTotal'])
                
                if(index==(dataDocumento[keyD]['formas_pago'][keyFP].length-1)){
                      html_forma_pago = '<tr class="row">'+ 
                                            '<td style="font-weight: bold">'+keyFP+'</td>'+
                                            '<td></td>'+ 
                                            '<td></td>'+
                                            '<td></td>'+
                                            '<td></td>'+
                                            '<td></td>'+
                                        '</tr>'+
                                        html_forma_pago +   '<tr class="row">'+ 
                                                                '<td></td>'+
                                                                '<td></td>'+ 
                                                                '<td class="tablaDetalleAlert" style="font-weight: bold">SUB-TOTAL ('+dataHtml['Nombre_FormaPago']+')</td>'+
                                                                '<td style="width:auto;text-align:right">'+parseFloat(suma_cantidad).toFixed(2)+'</td>'+
                                                                '<td style="width:auto;text-align:right">'+parseFloat((suma_precio_promedio)/cantidad_items).toFixed(2)+'</td>'+
                                                                '<td style="width:auto;text-align:right">'+parseFloat(suma_subtotal).toFixed(2)+'</td>'+
                                                            '</tr>'
                  }
            })
            html_general = html_general +html_forma_pago 
        }
        html_general = html_general + '<tr class="row">'+ 
                                            '<td></td>'+
                                            '<td></td>'+ 
                                            '<td></td>'+
                                            '<td></td>'+
                                            '<td style="font-weight: bold">Total</td>'+
                                            '<td style="width:auto;text-align:right">'+parseFloat(suma_formas_pago).toFixed(2)+'</td>'+
                                        '</tr><tr class="row"><td></td></tr>'
        suma_general = suma_general + suma_formas_pago
    }
    
    html_general = html_general+'<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+ 
                '<td></td>'+ 
                '<td></td>'+ 
                '<td style="font-weight: bold;color:red;text-align:left">TOTAL GENERAL : </td>'+
                '<td style="width:auto;text-align:right">'+parseFloat(suma_general).toFixed(2)+'</td>'+
                '</tr>'
    
    return html_general;
}