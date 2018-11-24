function recorrerArreglo(detalles,nom_impuesto) {  
    var html_general = ''
    var forma_pago_orden = null  
    var dataFormaPago = {} 
    
    detalles.forEach(function(data){
        if(forma_pago_orden == data.Des_FormaPago+'-'+data.Nom_FormaPago){
            dataFormaPago[forma_pago_orden].movimientos.push({
                "html":'<tr class="row">'+
                        '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                        '<td class="detailsTable" style="width:auto;">'+data.Comprobante+'</td>'+ 
                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Doc_Cliente+'</td>'+
                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Nom_Cliente+'</td>'+
                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Des_Moneda+'</td>'+
                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Total+'</td>'+
                    '</tr>',
                "Monto":parseFloat(data.Monto).toFixed(2)
                
            })
        }else{ 
            forma_pago_orden = data.Des_FormaPago+'-'+data.Nom_FormaPago
            if(!dataFormaPago.hasOwnProperty(forma_pago_orden)){
                dataFormaPago[forma_pago_orden]={
                    "html": 
                            '<tr class="row">'+
                                '<td style="width:auto;font-weight: bold">'+forma_pago_orden+'</td>'+
                                '<td style="width:auto"></td>'+
                                '<td style="width:auto"></td>'+
                                '<td style="width:auto;font-weight: bold">'+data.Movimiento+'</td>'+
                                '<td style="width:auto"></td>'+ 
                                '<td style="width:auto;font-weight: bold">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+' '+data.MontoMovimiento+'</td>'+
                            '</tr>'+
                            '<tr class="row">'+
                                '<td class="headerTable" style="width:auto;">Fecha</td>'+
                                '<td class="headerTable" style="width:auto;">Comprobante</td>'+
                                '<td class="headerTable" style="width:auto;">RUC/DNI</td>'+
                                '<td class="headerTable" style="width:auto;">Cliente/Proveedor</td>'+
                                '<td class="headerTable" style="width:auto;text-align:right">Facturado</td>'+
                                '<td class="headerTable" style="width:auto;text-align:right">Depositado</td>'+
                            '</tr>',
                    "movimientos":[]
                }
              
                dataFormaPago[forma_pago_orden].movimientos.push({
                    "html":'<tr class="row">'+
                            '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+data.Comprobante+'</td>'+ 
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Doc_Cliente+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Nom_Cliente+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Des_Moneda+' '+data.Total+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Monto+'</td>'+
                        '</tr>',
                    "Monto":parseFloat(data.Monto).toFixed(2)
                    
                })
            }else{
                 
                 dataFormaPago[forma_pago_orden].movimientos.push({
                    "html":'<tr class="row">'+
                            '<td class="detailsTable" style="width:auto;">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable" style="width:auto;">'+data.Comprobante+'</td>'+ 
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Doc_Cliente+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Nom_Cliente+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Des_Moneda+' '+data.Total+'</td>'+
                            '<td class="detailsTable" style="width:auto;text-align:right">'+data.Monto+'</td>'+
                        '</tr>',
                    "Monto":parseFloat(data.Monto).toFixed(2)
                    
                })
                 
            }
        }
    })
  
    for(var keyD in dataFormaPago){
        html_general = html_general + dataFormaPago[keyD].html
        let suma_movimientos = 0
        let html_forma_pago = ''
        dataFormaPago[keyD]['movimientos'].forEach(function(dataHtml,index){
            html_forma_pago = html_forma_pago + dataHtml.html
            suma_movimientos = suma_movimientos + parseFloat(dataHtml.Monto)
             if(index==(dataFormaPago[keyD]['movimientos'].length-1)){
                 html_forma_pago = html_forma_pago + '<tr class="row">'+ 
                                                                '<td></td>'+
                                                                '<td></td>'+ 
                                                                '<td></td>'+ 
                                                                '<td></td>'+ 
                                                                '<td class="tablaDetalleAlert" style="font-weight: bold">SUB-TOTAL</td>'+
                                                                '<td class="tablaDetalleAlert">'+parseFloat(suma_movimientos).toFixed(2)+'</td>'+
                                                            '</tr>'
             }
        })
        html_general = html_general + html_forma_pago 
    }
    
    
    return html_general;
}