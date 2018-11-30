function recorrerArreglo(detalles,nom_impuesto) {  
    var html_general = ''
    var cliente_orden = null   
    var dataClientes = {} 
    
    detalles.forEach(function(data){
        
        cliente_orden = data.Doc_Cliente 
        if(!dataClientes.hasOwnProperty(cliente_orden)){
            dataClientes[cliente_orden]={
                "html": '<tr class="row">'+
                            '<td style="width:auto;font-weight: bold">Documento : </td>'+
                            '<td style="width:auto">'+data.Doc_Cliente+'</td>'+
                        '</tr>'+
                        '<tr class="row">'+
                            '<td style="width:auto;font-weight: bold">Razon Social : </td>'+
                            '<td style="width:auto">'+data.Nom_Cliente+'</td>'+
                        '</tr>'+
                        '<tr class="row"><td></td></tr>'+
                        '<tr class="row">'+
                            '<td class="headerTable" style="width:auto;">Fecha</td>'+
                            '<td class="headerTable" style="width:auto;">Forma</td>'+
                            '<td class="headerTable" style="width:auto;">Movimiento</td>'+
                            '<td class="headerTable" style="width:auto;">Detalle</td>'+
                            '<td class="headerTable" style="width:auto;text-align:right">Total</td>'+
                        '</tr>',
                "comprobantes":{}
            }
            dataClientes[cliente_orden].comprobantes[data.id_ComprobantePago]=[] 
          
            dataClientes[cliente_orden].comprobantes[data.id_ComprobantePago].push({
                "html":'<tr class="row">'+
                    '<td class="detailsTable" style="width:auto;">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                    '<td class="detailsTable" style="width:auto;">'+data.Des_FormaPago+'</td>'+ 
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Movimiento+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cuenta_CajaBanco+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Des_Moneda+' '+data.Monto+'</td>'+ 
                '</tr>',
                "FechaEmision":(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:''),
                "Comprobante":data.Comprobante,
                "Total": data.Total,
                "Monto":parseFloat(data.Monto).toFixed(2)
                
            })
        }else{
             
             if(!dataClientes[cliente_orden].comprobantes.hasOwnProperty(data.id_ComprobantePago)){
                 
                dataClientes[cliente_orden].comprobantes[data.id_ComprobantePago]=[] 
          
                dataClientes[cliente_orden].comprobantes[data.id_ComprobantePago].push({
                    "html":'<tr class="row">'+
                        '<td class="detailsTable" style="width:auto;">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                        '<td class="detailsTable" style="width:auto;">'+data.Des_FormaPago+'</td>'+ 
                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Movimiento+'</td>'+
                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cuenta_CajaBanco+'</td>'+
                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Des_Moneda+' '+data.Monto+'</td>'+ 
                    '</tr>',
                    "FechaEmision":(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:''),
                    "Comprobante":data.Comprobante,
                    "Total": data.Total,
                    "Monto":parseFloat(data.Monto).toFixed(2)
                    
                })
                 
             }else{
                dataClientes[cliente_orden].comprobantes[data.id_ComprobantePago].push({
                    "html":'<tr class="row">'+
                        '<td class="detailsTable" style="width:auto;">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                        '<td class="detailsTable" style="width:auto;">'+data.Des_FormaPago+'</td>'+ 
                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Movimiento+'</td>'+
                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Cuenta_CajaBanco+'</td>'+
                        '<td class="detailsTable" style="width:auto;text-align:right">'+data.Des_Moneda+' '+data.Monto+'</td>'+ 
                    '</tr>',
                    "FechaEmision":(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:''),
                    "Comprobante":data.Comprobante,
                    "Total": data.Total,
                    "Monto":parseFloat(data.Monto).toFixed(2)
                    
                })
             }
        }
    })
    
  
    for(var keyD in dataClientes){
        html_general = html_general + dataClientes[keyD].html 
        let html_comprobante = ''
        for(var keyComprobante in dataClientes[keyD].comprobantes){
            let sumaComprobante = 0
            dataClientes[keyD].comprobantes[keyComprobante].forEach(function(dataHtml,index){
                if(index==0){
                    html_comprobante = html_comprobante + '<tr class="row">'+ 
                                            '<td>'+dataHtml.FechaEmision+'</td>'+
                                            '<td>'+dataHtml.Comprobante+'</td>'+ 
                                            '<td></td>'+  
                                            '<td></td>'+
                                            '<td>'+parseFloat(dataHtml.Total).toFixed(2)+'</td>'
                                        '</tr>'
                }
                html_comprobante = html_comprobante + dataHtml.html
                //html_general = html_general + dataHtml.html
                sumaComprobante = sumaComprobante + parseFloat(dataHtml.Monto)
                if(index==(dataClientes[keyD].comprobantes[keyComprobante].length-1)){
                    if(parseFloat(dataHtml.Total)-sumaComprobante>0){
                         html_comprobante = html_comprobante + 
                                            '<tr class="row">'+ 
                                                '<td></td>'+
                                                '<td></td>'+ 
                                                '<td></td>'+  
                                                '<td class="tablaDetalleAlert" style="font-weight: bold">SUB-TOTAL</td>'+
                                                '<td class="tablaDetalleAlert">'+parseFloat(sumaComprobante).toFixed(2)+'</td>'+
                                            '</tr>'+
                                            '<tr class="row">'+ 
                                                '<td></td>'+
                                                '<td></td>'+ 
                                                '<td></td>'+  
                                                '<td class="tablaDetalleWarning" style="font-weight: bold">SALDO</td>'+
                                                '<td class="tablaDetalleWarning">'+parseFloat(parseFloat(dataHtml.Total)-sumaComprobante).toFixed(2)+'</td>'+
                                            '</tr>'
                    }else{
                         html_comprobante = html_comprobante + 
                                            '<tr class="row">'+ 
                                                '<td></td>'+
                                                '<td></td>'+ 
                                                '<td></td>'+  
                                                '<td class="tablaDetalleAlert" style="font-weight: bold">SUB-TOTAL</td>'+
                                                '<td class="tablaDetalleAlert">'+parseFloat(sumaComprobante).toFixed(2)+'</td>'+
                                            '</tr>'+
                                            '<tr class="row">'+ 
                                                '<td></td>'+
                                                '<td></td>'+ 
                                                '<td></td>'+  
                                                '<td class="tablaDetalleAlert" style="font-weight: bold">SALDO</td>'+
                                                '<td class="tablaDetalleAlert">'+parseFloat(parseFloat(dataHtml.Total)-sumaComprobante).toFixed(2)+'</td>'+
                                            '</tr>'
                    }
                }
            })
        }
        html_general = html_general+html_comprobante
    }
    
    
    return html_general;
}