
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
      
        if(documento_orden == (data.Cod_TipoComprobante+':'+data.Doc_Cliente)){
                
                if(dataDocumento[documento_orden].formas_pago.hasOwnProperty(data.Cod_FormaPago)){
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                        "html":'<tr class="row">'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+data.Des_Caja+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+data.Cod_TipoComprobante+': '+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+(data.FechaEmision?data.FechaVenciminento.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Total+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Amortizado+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Por_Cancelar+'</td>'+
                        '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Total,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago] = []
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                         "html":'<tr class="row">'+
                                    '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+data.Des_Caja+'</td>'+
                                    '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+data.Cod_TipoComprobante+': '+data.Serie+'-'+data.Numero+'</td>'+
                                    '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                    '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+(data.FechaEmision?data.FechaVenciminento.toString().split('T')[0]:'')+'</td>'+
                                    '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Total+'</td>'+
                                    '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Amortizado+'</td>'+
                                    '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Por_Cancelar+'</td>'+
                                '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Total,
                        "Documento_orden":documento_orden
                        
                    })
                }
             
         
        }else{ 
            documento_orden = data.Cod_TipoComprobante+':'+data.Doc_Cliente
            if(!dataDocumento.hasOwnProperty(documento_orden)){

                documento_orden = data.Cod_TipoComprobante+':'+data.Doc_Cliente
                dataDocumento[documento_orden]={
                    "html":'<tr class="row">'+
                                    '<td colspan="8" style="font-weight: bold;font-size: 14px;text-align:left"> SIN: '+data.Doc_Cliente+
                                   
                            '</tr>'+
                            '<tr class="row">'+
                                    '<td colspan="8" style="font-weight: bold;font-size: 14px;text-align:left"> Razon Social: '+data.Cliente+
                                   
                            '</tr>'+
                            '<tr class="row">'+
                                    '<td colspan="8" style="font-weight: bold;font-size: 14px;text-align:left"> Razon Direccion: '+data.Direccion_Cliente+
                                  
                            '</tr>'+
                                '<tr class="row">'+
                                '<td class="headerTable" style="width:auto;background: rgb(181, 181, 181);">Caja</td>'+
                                '<td class="headerTable" style="width:auto;background: rgb(181, 181, 181);">Comprobante</td>'+
                                '<td class="headerTable" style="width:auto;background: rgb(181, 181, 181);">Emision</td>'+
                                '<td class="headerTable" style="width:auto;background: rgb(181, 181, 181);">Vencimiento</td>'+
                                '<td class="headerTable" style="width:auto;background: rgb(181, 181, 181);text-align:right">Total</td>'+
                                '<td class="headerTable" style="width:auto;background: rgb(181, 181, 181);text-align:right">Amortizado</td>'+
                                '<td class="headerTable" style="width:auto;background: rgb(181, 181, 181);text-align:right">Por Cancelar</td>'+
                             '</tr>', 
                    "formas_pago":{}
                }
            
                dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago] = []
                dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                    "html":'<tr class="row">'+
                                '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+data.Des_Caja+'</td>'+
                                '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+data.Cod_TipoComprobante+': '+data.Serie+'-'+data.Numero+'</td>'+
                                '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+(data.FechaEmision?data.FechaVenciminento.toString().split('T')[0]:'')+'</td>'+
                                '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Total+'</td>'+
                                '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Amortizado+'</td>'+
                                '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Por_Cancelar+'</td>'+
                            '</tr>',
                    "Cantidad":data.Cantidad,
                    "PrecioUnitario":data.PrecioUnitario,
                    "SubTotal":data.Total,
                    "Documento_orden":documento_orden
                    
                })
            }else{

                if(dataDocumento[documento_orden].formas_pago.hasOwnProperty(data.Cod_FormaPago)){
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                        "html":'<tr class="row">'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+data.Des_Caja+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+data.Cod_TipoComprobante+': '+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+(data.FechaEmision?data.FechaVenciminento.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Total+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Amortizado+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Por_Cancelar+'</td>'+
                        '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Total,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago] = []
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                         "html":'<tr class="row">'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+data.Des_Caja+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+data.Cod_TipoComprobante+': '+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);">'+(data.FechaEmision?data.FechaVenciminento.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Total+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Amortizado+'</td>'+
                            '<td class="detailsTable" style="width:auto;background: rgb(246, 248, 248);text-align:right">'+data.Por_Cancelar+'</td>'+
                                '</tr>',
                        "Cantidad":data.Cantidad,
                        "PrecioUnitario":data.PrecioUnitario,
                        "SubTotal":data.Total,
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
                                                                '<td style="color:blue;background: #eaf2ff;text-align:left">TOTAL DEUDA</td>'+
                                                                '<td style="width:auto;background: #eaf2ff;background: #eaf2ff;background: #eaf2ff;text-align:right">'+parseFloat(suma_cantidad).toFixed(2)+'</td>'+
                                                                '<td style="width:auto;background: #eaf2ff;background: #eaf2ff;text-align:right">'+parseFloat((suma_precio_promedio)/cantidad_items).toFixed(2)+'</td>'+
                                                                '<td style="width:auto;background: #eaf2ff;text-align:right">'+parseFloat(suma_subtotal).toFixed(2)+'</td>'+
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
                '<td style="font-weight: bold;background: #eaf2ff;background: #eaf2ff;background: #eaf2ff;background: #eaf2ff;color:blue;text-align:left">TOTAL GENERAL : </td>'+
                '<td style="background: #eaf2ff;background: #eaf2ff;background: #eaf2ff;width:auto;text-align:right">'+parseFloat(suma_total_cantidad).toFixed(2)+'</td>'+
                '<td style="background: #eaf2ff;background: #eaf2ff;width:auto;text-align:right">'+parseFloat(suma_total_precio_unitario).toFixed(2)+'</td>'+
                '<td style="background: #eaf2ff;width:auto;text-align:right">'+parseFloat(suma_total_subtotal).toFixed(2)+'</td>'+
                '</tr>'
    
    return html_general;
}