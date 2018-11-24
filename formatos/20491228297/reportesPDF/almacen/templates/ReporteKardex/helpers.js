  function recorrerArreglo(detalles) {  
    let html_fila_cuerpo = ''
    let cod_producto_orden = ''
    let dataProductos = {} 
    detalles.forEach(function(data,index){
        cod_producto_orden = data.Cod_Producto
        if(!dataProductos.hasOwnProperty(cod_producto_orden)){
            dataProductos[cod_producto_orden]={
                "html": '<tr class="row">'+
                            '<td style="width:auto;font-weight: bold" colspan="2">CODIGO : </td>'+
                            '<td style="width:auto" colspan="5">'+data.Cod_Producto+'</td>'+ 
                            '<td style="width:auto;font-weight: bold"" colspan="2">CATEGORIA</td>'+
                            '<td style="width:auto" colspan="5">'+data.Des_Categoria+'</td>'+
                        '</tr>'+
                        '<tr class="row">'+
                            '<td style="width:auto;font-weight: bold" colspan="3">PRODUCTO : </td>'+
                            '<td style="width:auto" colspan="4">'+data.Nom_Producto+'</td>'+
                            '<td style="width:auto;font-weight: bold" colspan="2">UNIDAD DE MEDIDA</td>'+
                            '<td style="width:auto" colspan="5">'+data.UnidadMedida+'</td>'+
                        '</tr>'+
                        '<tr class="row"><td></td></tr>'+
                        '<tr class="row">'+ 
                            '<td class="headerTable" style="width:auto;" colspan="4">Comprobante de Pago</td>'+
                            '<td   style="width:auto;" colspan="1"></td>'+
                            '<td class="headerTable" style="width:auto;" colspan="3">Entradas</td>' +
                            '<td class="headerTable" style="width:auto;" colspan="3">Salidas</td>'+
                            '<td class="headerTable" style="width:auto;" colspan="3">Saldo Final</td>'+
                        '</tr>'+  
                        '<tr class="row">'+
                            '<td class="headerTable" style="width:auto;">Fecha</td>'+
                            '<td class="headerTable" style="width:auto;">Tipo</td>'+
                            '<td class="headerTable" style="width:auto;">Serie</td>'+
                            '<td class="headerTable" style="width:auto;">Numero</td>'+
                            '<td class="headerTable" style="width:auto;">Tipo de Operacion</td>'+
                            '<td class="headerTable" style="width:auto;">Cantidad</td>'+
                            '<td class="headerTable" style="width:auto;">Costo Unitario</td>'+
                            '<td class="headerTable" style="width:auto;">Costo Total</td>'+
                            '<td class="headerTable" style="width:auto;">Cantidad</td>'+
                            '<td class="headerTable" style="width:auto;">Costo Unitario</td>'+
                            '<td class="headerTable" style="width:auto;">Costo Total</td>'+
                            '<td class="headerTable" style="width:auto;">Cantidad</td>'+
                            '<td class="headerTable" style="width:auto;">Costo Unitario</td>'+
                            '<td class="headerTable" style="width:auto;">Costo Total</td>'+
                         '</tr>',
                "detalles":[]
            } 
            dataProductos[cod_producto_orden].detalles.push({
                "html":'<tr class="row">'+
                    '<td class="detailsTable" style="width:auto;">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                    '<td class="detailsTable" style="width:auto;">'+data.TipoComprobante+'</td>'+ 
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Serie+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Numero+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Detalle+'</td>'+ 
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.CantidadEntrada+'</td>'+ 
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.PrecioEntrada+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.MontoEntrada+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.CantidadSalida+'</td>'+ 
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.PrecioSalida+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.MontoSalida+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.CantidadSaldo+'</td>'+ 
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.PrecioSaldo+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.MontoSaldo+'</td>'+
                '</tr>',
                "CantidadEntrada":data.CantidadEntrada,
                "MontoEntrada": data.MontoEntrada,
                "CantidadSalida":data.CantidadSalida,
                "MontoSalida":data.MontoSalida
                
            })
        }else{
            dataProductos[cod_producto_orden].detalles.push({
                "html":'<tr class="row">'+
                    '<td class="detailsTable" style="width:auto;">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                    '<td class="detailsTable" style="width:auto;">'+data.TipoComprobante+'</td>'+ 
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Serie+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Numero+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.Detalle+'</td>'+ 
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.CantidadEntrada+'</td>'+ 
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.PrecioEntrada+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.MontoEntrada+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.CantidadSalida+'</td>'+ 
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.PrecioSalida+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.MontoSalida+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.CantidadSaldo+'</td>'+ 
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.PrecioSaldo+'</td>'+
                    '<td class="detailsTable" style="width:auto;text-align:right">'+data.MontoSaldo+'</td>'+
                '</tr>',
                "CantidadEntrada":data.CantidadEntrada,
                "MontoEntrada": data.MontoEntrada,
                "CantidadSalida":data.CantidadSalida,
                "MontoSalida":data.MontoSalida
                
            })
           
        }  
    })
    
    for(var keyD in dataProductos){
        html_fila_cuerpo = html_fila_cuerpo + dataProductos[keyD].html 
        let html_comprobante = ''
        let suma_cantidadentrada = 0
        let suma_montoentrada = 0
        let suma_cantidadsalida = 0
        let suma_montosalida = 0
        dataProductos[keyD].detalles.forEach(function(dataHtml,index){
          html_comprobante = html_comprobante + dataHtml.html
          suma_cantidadentrada = suma_cantidadentrada + parseFloat(dataHtml.CantidadEntrada)
          suma_montoentrada = suma_montoentrada + parseFloat(dataHtml.MontoEntrada)
          suma_cantidadsalida = suma_cantidadsalida + parseFloat(dataHtml.CantidadSalida)
          suma_montosalida = suma_montosalida + parseFloat(dataHtml.MontoSalida)
          
          if(index==(dataProductos[keyD].detalles.length-1)){
              html_comprobante = html_comprobante +
                                '<tr class="row">'+
                                    '<td class="" style="width:auto;"></td>'+
                                    '<td class="" style="width:auto;"></td>'+ 
                                    '<td class="" style="width:auto;text-align:right"></td>'+
                                    '<td class="" style="width:auto;text-align:right"></td>'+
                                    '<td class="tablaDetalleAlert" style="width:auto;text-align:right">TOTAL GENERAL</td>'+ 
                                    '<td class="tablaDetalleAlert" style="width:auto;text-align:right">'+parseFloat(suma_cantidadentrada).toFixed(2)+'</td>'+ 
                                    '<td class="" style="width:auto;text-align:right"></td>'+
                                    '<td class="tablaDetalleAlert" style="width:auto;text-align:right">'+parseFloat(suma_montoentrada).toFixed(2)+'</td>'+
                                    '<td class="tablaDetalleAlert" style="width:auto;text-align:right">'+parseFloat(suma_cantidadsalida).toFixed(2)+'</td>'+ 
                                    '<td class="" style="width:auto;text-align:right"></td>'+
                                    '<td class="tablaDetalleAlert" style="width:auto;text-align:right">'+parseFloat(suma_montosalida).toFixed(2)+'</td>'+
                                    '<td class="" style="width:auto;text-align:right"></td>'+ 
                                    '<td class="" style="width:auto;text-align:right"></td>'+
                                    '<td class="" style="width:auto;text-align:right"></td>'+
                                '</tr>'
                                '<tr class="row"><td></td></tr>'
          }
        })
        html_fila_cuerpo = html_fila_cuerpo + html_comprobante
    }
    
     
    return html_fila_cuerpo;
}