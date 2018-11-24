function recorrerArreglo(detalles) {  
    var html_general = ''
    var documento_orden = null
    var forma_pago_orden = null 
    
    var dataFormaPago = {}
    var dataDocumento = {}
    
    var suma_total_cantidad = 0
    var suma_total_precio_unitario = 0
    var suma_total_subtotal = 0
    
    detalles.forEach(function(data){
        //console.log("valor asignado "+documento_orden,"valor de la consulta "+data.Cod_TipoComprobante+':'+data.Serie)
        if(documento_orden == (data.Cod_TipoComprobante+':'+data.Serie)){
                
                if(dataDocumento[documento_orden].formas_pago.hasOwnProperty(data.Cod_FormaPago)){
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                        "html":'<tr class="row">'+
                            '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+' '+data.PrecioUnitario+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                        '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Sub_Total,
                        "Nombre_FormaPago":data.Nom_FormaPago,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago] = []
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                         "html":'<tr class="row">'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+' '+data.PrecioUnitario+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                                '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Sub_Total,
                        "Nombre_FormaPago":data.Nom_FormaPago,
                        "Documento_orden":documento_orden
                        
                    })
                }
             
         
        }else{ 
            documento_orden = data.Cod_TipoComprobante+':'+data.Serie
            if(!dataDocumento.hasOwnProperty(documento_orden)){

                documento_orden = data.Cod_TipoComprobante+':'+data.Serie
                
                dataDocumento[documento_orden]={
                    "html":'<tr class="row">'+
                                    '<td colspan="6" style="font-weight: bold;color:#4285f4"> Documento: '+data.Cod_TipoComprobante+' '+data.Nom_TipoComprobante+' Serie: '+data.Serie+'</td>'+
                            '</tr>', 
                    "formas_pago":{}
                }
            
                dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago] = []
                dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                    "html":'<tr class="row">'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+' '+data.PrecioUnitario+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                            '</tr>',
                    "Cantidad":data.Cantidad,
                    "PrecioUnitario":data.PrecioUnitario,
                    "SubTotal":data.Sub_Total,
                    "Nombre_FormaPago":data.Nom_FormaPago,
                    "Documento_orden":documento_orden
                    
                })
            }else{

                if(dataDocumento[documento_orden].formas_pago.hasOwnProperty(data.Cod_FormaPago)){
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                        "html":'<tr class="row">'+
                            '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+' '+data.PrecioUnitario+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                        '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Sub_Total,
                        "Nombre_FormaPago":data.Nom_FormaPago,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago] = []
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                         "html":'<tr class="row">'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cod_UnidadMedida+' '+data.PrecioUnitario+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                                '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Sub_Total,
                        "Nombre_FormaPago":data.Nom_FormaPago,
                        "Documento_orden":documento_orden
                        
                    })
                }

            }
        }
    })
 
    
    var html_general = ''
    
    for(var keyD in dataDocumento){
        html_general = html_general + dataDocumento[keyD].html
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
                
                if(index==(dataDocumento[keyD]['formas_pago'][keyFP].length-1)){
                      html_forma_pago = html_forma_pago +   '<tr class="row">'+ 
                                                                '<td></td>'+
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
        
    }
    
    html_general = html_general+'<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td style="font-weight: bold;color:red;text-align:left">TOTAL GENERAL : </td>'+
                '<td style="width:auto;text-align:right">'+parseFloat(suma_total_cantidad).toFixed(2)+'</td>'+
                '<td style="width:auto;text-align:right">'+parseFloat(suma_total_precio_unitario).toFixed(2)+'</td>'+
                '<td style="width:auto;text-align:right">'+parseFloat(suma_total_subtotal).toFixed(2)+'</td>'+
                '</tr>'
    
    return html_general;
}