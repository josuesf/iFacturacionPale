  function recorrerArreglo(detalles) { 
    var html_general = '' 
    var html_fila_cuerpo = '' 
    var fecha_orden = null
    var forma_pago_orden = null
    
    var suma_total_cantidad = 0
    var suma_total_precio_unitario = 0
    var suma_total_subtotal = 0
    
    var dataFormaPago = {}
    
    detalles.forEach(function(data){
        if(fecha_orden==null){
            fecha_orden = data.FechaEmision?data.FechaEmision.toString().split('T')[0]:''
            
             html_fila_cuerpo = '<tr class="row">'+ 
                '<td style="font-weight: bold;text-align:left">Fecha : '+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '</tr>'
             html_fila_cuerpo = html_fila_cuerpo 
            
                dataFormaPago[data.Cod_FormaPago]=[]
                dataFormaPago[data.Cod_FormaPago].push({
                    "html": '<tr class="row">'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Nom_FormaPago+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.PrecioUnitario+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                            '</tr>',
                    "Cantidad":data.Cantidad,
                    "PrecioUnitario":data.PrecioUnitario,
                    "SubTotal":data.Sub_Total,
                    "Nombre_FormaPago":data.Nom_FormaPago
                    
                })
                forma_pago_orden = data.Cod_FormaPago 
            
        }else{
            if(fecha_orden == (data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')){
                
                if(forma_pago_orden == data.Cod_FormaPago){
                    
                    dataFormaPago[data.Cod_FormaPago].push({
                        "html": '<tr class="row">'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                                    '<td class="detailsTable" style="width:auto;">'+data.Nom_FormaPago+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.PrecioUnitario+'</td>'+
                                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                                '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Sub_Total,
                        "Nombre_FormaPago":data.Nom_FormaPago
                    })
                    
                }else{
                    if(dataFormaPago.hasOwnProperty(data.Cod_FormaPago)){
                        dataFormaPago[data.Cod_FormaPago].push({
                            "html": '<tr class="row">'+
                                        '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                        '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                                        '<td class="detailsTable" style="width:auto;">'+data.Nom_FormaPago+'</td>'+
                                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.PrecioUnitario+'</td>'+
                                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                                    '</tr>',
                            "Cantidad":data.Cantidad,
                            "PrecioUnitario":data.PrecioUnitario,
                            "SubTotal":data.Sub_Total,
                            "Nombre_FormaPago":data.Nom_FormaPago
                        })
                    }else{
                        dataFormaPago[data.Cod_FormaPago]=[]
                        dataFormaPago[data.Cod_FormaPago].push({
                            "html": '<tr class="row">'+
                                        '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                        '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                                        '<td class="detailsTable" style="width:auto;">'+data.Nom_FormaPago+'</td>'+
                                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.PrecioUnitario+'</td>'+
                                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                                    '</tr>',
                            "Cantidad":data.Cantidad,
                            "PrecioUnitario":data.PrecioUnitario,
                            "SubTotal":data.Sub_Total,
                            "Nombre_FormaPago":data.Nom_FormaPago
                        })
                    }
                    forma_pago_orden = data.Cod_FormaPago 
                }
                 
             
            }else{
                
              for(var key in dataFormaPago) {
                  let html_forma_pago = ''
                  let suma_cantidad = 0
                  let suma_precio_promedio = 0
                  let suma_subtotal = 0
                  
                  dataFormaPago[key].forEach(function(dataHtml,index){
                      
                      suma_total_cantidad = suma_total_cantidad + parseFloat(dataHtml['Cantidad'])
                      suma_total_precio_unitario = suma_total_precio_unitario + parseFloat(dataHtml['PrecioUnitario'])
                      suma_total_subtotal = suma_total_subtotal + parseFloat(dataHtml['SubTotal'])
                      
                      html_forma_pago = html_forma_pago + dataHtml['html']
                      suma_cantidad = suma_cantidad + parseFloat(dataHtml['Cantidad'])
                      suma_precio_promedio = suma_precio_promedio + parseFloat(dataHtml['PrecioUnitario'])
                      suma_subtotal = suma_subtotal+parseFloat(dataHtml['SubTotal'])
                      if(index==(dataFormaPago[key].length-1)){
                          html_forma_pago = html_forma_pago +   '<tr class="row">'+ 
                                                                    '<td></td>'+
                                                                    '<td></td>'+
                                                                    '<td style="color:red;text-align:left">'+dataHtml['Nombre_FormaPago']+'</td>'+
                                                                    '<td style="width:auto;text-align:right">'+parseFloat(suma_cantidad).toFixed(2)+'</td>'+
                                                                    '<td style="width:auto;text-align:right">'+parseFloat((suma_precio_promedio)/dataFormaPago[key].length).toFixed(2)+'</td>'+
                                                                    '<td style="width:auto;text-align:right">'+parseFloat(suma_subtotal).toFixed()+'</td>'+
                                                                '</tr>'
                      }
                  })
                  html_fila_cuerpo = html_fila_cuerpo + html_forma_pago
              }
              
              html_general = html_general + html_fila_cuerpo
              fecha_orden = (data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')
              
              html_fila_cuerpo = '<tr class="row">'+ 
                '<td style="font-weight: bold;text-align:left">Fecha : '+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '</tr>'
              html_fila_cuerpo = html_fila_cuerpo
              dataFormaPago = {}
              forma_pago_orden = data.Cod_FormaPago 
              dataFormaPago[data.Cod_FormaPago]=[]
              dataFormaPago[data.Cod_FormaPago].push({
                    "html": '<tr class="row">'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Nom_Cliente+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Nom_FormaPago+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cantidad+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.PrecioUnitario+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.Sub_Total+'</td>'+
                            '</tr>',
                    "Cantidad":data.Cantidad,
                    "PrecioUnitario":data.PrecioUnitario,
                    "SubTotal":data.Sub_Total,
                    "Nombre_FormaPago":data.Nom_FormaPago
                })
                
            }
        }
    })
    
    
    for(var key in dataFormaPago) {
          let html_forma_pago = ''
          let suma_cantidad = 0
          let suma_precio_promedio = 0
          let suma_subtotal = 0
          
          dataFormaPago[key].forEach(function(dataHtml,index){
              
              suma_total_cantidad = suma_total_cantidad + parseFloat(dataHtml['Cantidad'])
              suma_total_precio_unitario = suma_total_precio_unitario + parseFloat(dataHtml['PrecioUnitario'])
              suma_total_subtotal = suma_total_subtotal + parseFloat(dataHtml['SubTotal'])
              
              html_forma_pago = html_forma_pago + dataHtml['html']
              suma_cantidad = suma_cantidad + parseFloat(dataHtml['Cantidad'])
              suma_precio_promedio = suma_precio_promedio + parseFloat(dataHtml['PrecioUnitario'])
              suma_subtotal = suma_subtotal+parseFloat(dataHtml['SubTotal'])
              if(index==(dataFormaPago[key].length-1)){
                  html_forma_pago = html_forma_pago +   '<tr class="row">'+ 
                                                            '<td></td>'+
                                                            '<td></td>'+
                                                            '<td style="color:red;text-align:left">'+dataHtml['Nombre_FormaPago']+'</td>'+
                                                            '<td style="width:auto;text-align:right">'+parseFloat(suma_cantidad).toFixed(2)+'</td>'+
                                                            '<td style="width:auto;text-align:right">'+parseFloat((suma_precio_promedio)/dataFormaPago[key].length).toFixed(2)+'</td>'+
                                                            '<td style="width:auto;text-align:right">'+parseFloat(suma_subtotal).toFixed()+'</td>'+
                                                        '</tr>'
              }
          })
          html_fila_cuerpo = html_fila_cuerpo + html_forma_pago
      }
    
    html_general = html_general+html_fila_cuerpo+'<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td style="font-weight: bold;color:red;text-align:left">TOTAL GENERAL : </td>'+
                '<td style="width:auto;text-align:right">'+parseFloat(suma_total_cantidad).toFixed(2)+'</td>'+
                '<td style="width:auto;text-align:right">'+parseFloat(suma_total_precio_unitario/detalles.length).toFixed(2)+'</td>'+
                '<td style="width:auto;text-align:right">'+parseFloat(suma_total_subtotal).toFixed(2)+'</td>'+
                '</tr>'
    
    return html_general;
}