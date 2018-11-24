
function recorrerArreglo(detalles) {  
    var html_general = ''
    var documento_orden = null
    var dataDocumento = {}
    
    var total_suma_total_pagar = 0
    var total_suma_total_amortizado = 0
    var total_suma_total_falta_pagar = 0
    
    detalles.forEach(function(data){
      
        if(documento_orden == (data.Cod_TipoComprobante+':'+data.Doc_Cliente)){
                
                if(dataDocumento[documento_orden].formas_pago.hasOwnProperty(data.Cod_FormaPago)){
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                        "html":'<tr class="row">'+
                            '<td class="detailsTable">'+data.Des_Caja+'</td>'+
                            '<td class="detailsTable">'+data.Cod_TipoComprobante+': '+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable">'+(data.FechaVencimiento?data.FechaVencimiento.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable">'+data.Total+'</td>'+
                            '<td class="detailsTable">'+data.Amortizado+'</td>'+
                            '<td class="detailsTable">'+data.PorCancelar+'</td>'+
                        '</tr>',
                        "Total":data.Total,
                        "Amortizado":data.Amortizado,
                        "PorCancelar":data.PorCancelar,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago] = []
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                         "html":'<tr class="row">'+
                                    '<td class="detailsTable">'+data.Des_Caja+'</td>'+
                                    '<td class="detailsTable">'+data.Cod_TipoComprobante+': '+data.Serie+'-'+data.Numero+'</td>'+
                                    '<td class="detailsTable">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                    '<td class="detailsTable">'+(data.FechaVencimiento?data.FechaVencimiento.toString().split('T')[0]:'')+'</td>'+
                                    '<td class="detailsTable">'+data.Total+'</td>'+
                                    '<td class="detailsTable">'+data.Amortizado+'</td>'+
                                    '<td class="detailsTable">'+data.PorCancelar+'</td>'+
                                '</tr>',
                        "Total":data.Total,
                        "Amortizado":data.Amortizado,
                        "PorCancelar":data.PorCancelar,
                        "Documento_orden":documento_orden
                        
                    })
                }
             
         
        }else{ 
            documento_orden = data.Cod_TipoComprobante+':'+data.Doc_Cliente
            if(!dataDocumento.hasOwnProperty(documento_orden)){

                documento_orden = data.Cod_TipoComprobante+':'+data.Doc_Cliente
                dataDocumento[documento_orden]={
                    "html":'<tr class="row">'+
                            '<td></td>'+
                            '</tr>'+
                    '<tr class="row_border">'+
                                    '<td colspan="3" class="tituloCabeceraTabla textoNegrita"> '+data.Nom_TipoDoc+': '+data.Doc_Cliente+
                                    '<td colspan="5"></td>'+
                            '</tr>'+
                            '<tr class="row">'+
                                    '<td colspan="3" class="tituloCabeceraTabla textoNegrita"> RAZON SOCIAL: '+data.Cliente+
                                    '<td colspan="5"></td>'+
                            '</tr>'+
                            '<tr class="row">'+
                                    '<td colspan="3" class="tituloCabeceraTabla textoNegrita"> DIRECCION: '+data.Direccion_Cliente+
                                    '<td colspan="5"></td>'+
                            '</tr>'+
                                '<tr class="row">'+
                                '<td class="headerTable">Caja</td>'+
                                '<td class="headerTable">Comprobante</td>'+
                                '<td class="headerTable">Emision</td>'+
                                '<td class="headerTable">Vencimiento</td>'+
                                '<td class="headerTable">Total</td>'+
                                '<td class="headerTable">Amortizado</td>'+
                                '<td class="headerTable">Por Cancelar</td>'+
                             '</tr>', 
                    "formas_pago":{}
                }
            
                dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago] = []
                dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                    "html":'<tr class="row">'+
                                '<td class="detailsTable">'+data.Des_Caja+'</td>'+
                                '<td class="detailsTable">'+data.Cod_TipoComprobante+': '+data.Serie+'-'+data.Numero+'</td>'+
                                '<td class="detailsTable">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                                '<td class="detailsTable">'+(data.FechaVencimiento?data.FechaVencimiento.toString().split('T')[0]:'')+'</td>'+
                                '<td class="detailsTable">'+data.Total+'</td>'+
                                '<td class="detailsTable">'+data.Amortizado+'</td>'+
                                '<td class="detailsTable">'+data.PorCancelar+'</td>'+
                            '</tr>',
                     "Total":data.Total,
                     "Amortizado":data.Amortizado,
                     "PorCancelar":data.PorCancelar,
                     "Documento_orden":documento_orden
                    
                })
            }else{

                if(dataDocumento[documento_orden].formas_pago.hasOwnProperty(data.Cod_FormaPago)){
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                        "html":'<tr class="row">'+
                            '<td class="detailsTable">'+data.Des_Caja+'</td>'+
                            '<td class="detailsTable">'+data.Cod_TipoComprobante+': '+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable">'+(data.FechaVencimiento?data.FechaVencimiento.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable">'+data.Total+'</td>'+
                            '<td class="detailsTable">'+data.Amortizado+'</td>'+
                            '<td class="detailsTable">'+data.PorCancelar+'</td>'+
                        '</tr>',
                        "Total":data.Total,
                        "Amortizado":data.Amortizado,
                        "PorCancelar":data.PorCancelar,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago] = []
                    dataDocumento[documento_orden].formas_pago[data.Cod_FormaPago].push({
                         "html":'<tr class="row">'+
                            '<td class="detailsTable">'+data.Des_Caja+'</td>'+
                            '<td class="detailsTable">'+data.Cod_TipoComprobante+': '+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable">'+(data.FechaVencimiento?data.FechaVencimiento.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable">'+data.Total+'</td>'+
                            '<td class="detailsTable">'+data.Amortizado+'</td>'+
                            '<td class="detailsTable">'+data.PorCancelar+'</td>'+
                                '</tr>',
                        "Total":data.Total,
                        "Amortizado":data.Amortizado,
                        "PorCancelar":data.PorCancelar,
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
            let cantidad_items = 0
            let suma_total_pagar = 0
            let suma_total_amortizado = 0
            let suma_total_falta_pagar = 0
            dataDocumento[keyD]['formas_pago'][keyFP].forEach(function(dataHtml,index){
                cantidad_items++
                html_forma_pago = html_forma_pago + dataHtml['html']
                suma_total_pagar = suma_total_pagar + parseFloat(dataHtml['Total'])
                suma_total_amortizado = suma_total_amortizado + parseFloat(dataHtml['Amortizado'])
                suma_total_falta_pagar = suma_total_falta_pagar+parseFloat(dataHtml['PorCancelar']) 
                
                
                total_suma_total_pagar = total_suma_total_pagar + parseFloat(dataHtml['Total'])
                total_suma_total_amortizado = total_suma_total_amortizado + parseFloat(dataHtml['Amortizado'])
                total_suma_total_falta_pagar = total_suma_total_falta_pagar+parseFloat(dataHtml['PorCancelar']) 
                
                if(index==(dataDocumento[keyD]['formas_pago'][keyFP].length-1)){
                      html_forma_pago = html_forma_pago +   '<tr class="row">'+ 
                                                                '<td></td>'+
                                                                '<td></td>'+
                                                                '<td></td>'+
                                                                '<td class="tablaDetalleSusses textoWarning">SUB TOTAL</td>'+
                                                                '<td class="tablaDetalleSusses">'+parseFloat(suma_total_pagar).toFixed(2)+'</td>'+
                                                                '<td class="tablaDetalleSusses">'+parseFloat(suma_total_amortizado).toFixed(2)+'</td>'+
                                                                '<td class="tablaDetalleSusses">'+parseFloat(suma_total_falta_pagar).toFixed(2)+'</td>'+
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
                '<td class="tablaDetallePrimary textoNegrita">TOTAL GENERAL </td>'+
                '<td class="tablaDetallePrimary textoNegrita">'+parseFloat(total_suma_total_pagar).toFixed(2)+'</td>'+
                '<td class="tablaDetallePrimary textoNegrita">'+parseFloat(total_suma_total_amortizado).toFixed(2)+'</td>'+
                '<td class="tablaDetallePrimary textoNegrita">'+parseFloat(total_suma_total_falta_pagar).toFixed(2)+'</td>'+
                '</tr>'
    
    return html_general;
}