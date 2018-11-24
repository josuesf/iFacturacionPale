function recorrerArreglo(detalles,nom_impuesto) {  
    var html_general = ''
    var documento_orden = null 
    
    var dataFormaPago = {}
    var dataDocumento = {} 
    
    detalles.forEach(function(data){
        if(documento_orden == (data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero)){
                
                 dataDocumento[documento_orden].detalles.push({
                    "html":'<tr class="row">'+
                                '<td class="detailsTable" style="width:auto;">'+data.id_Detalle+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cod_Manguera+' '+data.Nom_UnidadMedida+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cantidad+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Despachado+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.PrecioUnitario+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Descuento+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Sub_Total+'</td>'+
                            '</tr>'
                    
                })
              
        }else{ 
            documento_orden = data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero
            if(!dataDocumento.hasOwnProperty(documento_orden)){
                documento_orden = data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero
                
                dataDocumento[documento_orden]={
                    "html":'<tr class="row">'+
                                '<td style="width:auto;font-weight: bold" colspan="2">Cliente : </td>'+
                                '<td style="width:auto">'+data.Nom_Cliente+'</td>'+
                                '<td style="width:auto"></td>'+
                                '<td style="width:auto"></td>'+
                                '<td style="width:auto"></td>'+
                                '<td style="width:auto"></td>'+
                                '<td colspan="2" style="font-weight: bold;font-size: 20px;text-align:center">'+documento_orden+'</td>'+ 
                            '</tr>'+
                            '<tr class="row">'+
                                '<td style="width:auto;font-weight: bold" colspan="2">Direccion : </td>'+
                                '<td style="width:auto">'+data.Direccion_Cliente+'</td>'+
                            '</tr>'+
                            '<tr class="row">'+
                                '<td style="width:auto;font-weight: bold" >'+data.Nom_TipoDoc+'</td>'+
                                '<td style="width:auto">'+data.Doc_Cliente+'</td>'+
                                '<td></td>'+
                                '<td style="font-weight: bold">Forma Pago : '+data.Nom_FormaPago+'</td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td style="width:auto;font-weight: bold;text-align:center;border: 1px solid; width:100px">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '</tr>'+
                            '<tr class="row"><td></td></tr>'+
                            '<tr class="row">'+
                                '<td class="headerTable" style="width:auto;">N</td>'+
                                '<td class="headerTable" style="width:auto;">Producto</td>'+
                                '<td class="headerTable" style="width:auto;">UM</td>'+
                                '<td class="headerTable" style="width:auto;">Cantidad</td>'+
                                '<td class="headerTable" style="width:auto;">Mercaderia Entregada.</td>'+
                                '<td class="headerTable" style="width:auto;text-align:right">Precio</td>'+
                                '<td class="headerTable" style="width:auto;text-align:right">Descuento</td>'+
                                '<td class="headerTable" style="width:auto;text-align:right">Total</td>'+
                            '</tr>',
                    "total":data.Total,
                    "glosa":data.Glosa,
                    "impuesto":data.Impuesto,
                    "detalles":[]
                }
             
                dataDocumento[documento_orden].detalles.push({
                    "html":'<tr class="row">'+
                                '<td class="detailsTable" style="width:auto;">'+data.id_Detalle+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cod_Manguera+' '+data.Nom_UnidadMedida+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cantidad+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Despachado+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.PrecioUnitario+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Descuento+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Sub_Total+'</td>'+
                            '</tr>'
                    
                })
            }else{
                 dataDocumento[documento_orden].detalles.push({
                    "html":'<tr class="row">'+
                                '<td class="detailsTable" style="width:auto;">'+data.id_Detalle+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Descripcion+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cod_Manguera+' '+data.Nom_UnidadMedida+'</td>'+
                                '<td class="detailsTable" style="width:auto;">'+data.Cantidad+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Despachado+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Simbolo+' '+data.PrecioUnitario+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Descuento+'</td>'+
                                '<td class="detailsTable" style="width:auto;text-align:right">'+data.Sub_Total+'</td>'+
                            '</tr>'
                    
                })

            }
        }
    })
 
    
    var html_general = ''
    var suma_subtotal = 0
    var suma_impuesto = 0
    var suma_total = 0
    
    for(var keyD in dataDocumento){
        let html_detalles = ''
        html_general = html_general + dataDocumento[keyD].html
        let total = parseFloat(parseFloat(dataDocumento[keyD].total).toFixed(2))
        let impuesto = parseFloat(parseFloat(dataDocumento[keyD].impuesto).toFixed(2))
        let glosa = dataDocumento[keyD].glosa
        suma_impuesto = suma_impuesto + parseFloat(impuesto)
        suma_subtotal = suma_subtotal + parseFloat(parseFloat(total-impuesto).toFixed(2))
        suma_total = suma_total + parseFloat(total)
        dataDocumento[keyD].detalles.forEach(function(dataHtml,index){
            html_detalles = html_detalles + dataHtml['html']
            if(index==(dataDocumento[keyD].detalles.length-1)){
              html_detalles = html_detalles +   '<tr class="row">'+ 
                                                        '<td></td>'+
                                                        '<td style="font-weight: bold">Glosa Contable</td>'+
                                                        '<td></td>'+
                                                        '<td></td>'+
                                                        '<td></td>'+
                                                        '<td></td>'+
                                                        '<td colspan="2" class="tablaDetalleAlert" style="font-weight: bold">SUB-TOTAL : '+parseFloat(total-impuesto).toFixed(2)+'</td>'+
                                                '</tr>'+
                                                '<tr class="row">'+ 
                                                        '<td></td>'+
                                                        '<td>'+glosa+'</td>'+
                                                        '<td></td>'+
                                                        '<td></td>'+
                                                        '<td></td>'+
                                                        '<td></td>'+
                                                        '<td colspan="2">'+nom_impuesto+' '+impuesto+'</td>'+
                                                '</tr>'+
                                                '<tr class="row">'+ 
                                                        '<td></td>'+
                                                        '<td></td>'+
                                                        '<td></td>'+
                                                        '<td></td>'+
                                                        '<td></td>'+
                                                        '<td></td>'+
                                                        '<td colspan="2" style="font-weight: bold">TOTAL : '+total+'</td>'+
                                                '</tr>'+'<tr class="row"><td></td></tr>'
                                                 
            }
        })
        html_general = html_general +html_detalles
       
    }
    
    html_general = html_general+'<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td class="tablaDetalleAlert" style="font-weight: bold">SUB-TOTAL</td>'+
                '<td style="border:1px solid;">'+nom_impuesto+'</td>'+
                '<td style="border:1px solid;">TOTAL</td>'+
                '</tr>'+
                '<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td style="border:1px solid;">'+suma_subtotal+'</td>'+
                '<td style="border:1px solid;">'+suma_impuesto+'</td>'+
                '<td style="border:1px solid;">'+suma_total+'</td>'+
                '</tr>'
    
    return html_general;
}