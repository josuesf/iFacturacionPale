  function recorrerArreglo(detalles) { 
    let suma_cantidad_facturado = 0
    let suma_cantidad_movimiento = 0
    let suma_pu_facturado = 0
    let suma_pu_facturado_movimiento = 0
    let suma_subtotal_facturado = 0
    let suma_subtotal_movimiento = 0
    let html_fila_cuerpo = ''
    detalles.forEach(function(data,index){
            suma_cantidad_facturado = suma_cantidad_facturado + parseFloat(data.CantidadF)
            suma_cantidad_movimiento = suma_cantidad_movimiento + parseFloat(data.Cantidad)
            suma_pu_facturado = suma_pu_facturado + parseFloat(data.PrecioF)
            suma_pu_facturado_movimiento = suma_pu_facturado_movimiento + parseFloat(data.Precio_Unitario)
            suma_subtotal_facturado = suma_subtotal_facturado + parseFloat(data.SubTotalF)
            suma_subtotal_movimiento = suma_subtotal_movimiento + parseFloat(parseFloat(parseFloat(data.Cantidad)*parseFloat(data.Precio_Unitario)).toFixed(2))
             html_fila_cuerpo = html_fila_cuerpo +'<tr class="row">'+ 
                '<td class="detailsTable">'+data.ComprobanteRef+'</td>'+
                '<td class="detailsTable">'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                '<td class="detailsTable">'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                '<td class="detailsTable">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                '<td class="detailsTable">'+data.Des_Producto+'</td>'+
                '<td class="detailsTable">'+data.CantidadF+'</td>'+
                '<td class="detailsTable">'+data.Cantidad+'</td>'+
                '<td class="detailsTable">'+data.PrecioF+'</td>'+
                '<td class="detailsTable">'+data.Precio_Unitario+'</td>'+
                '<td class="detailsTable">'+data.SubTotalF+'</td>'+
                '<td class="detailsTable">'+parseFloat(parseFloat(data.Cantidad)*parseFloat(data.Precio_Unitario)).toFixed(2)+'</td>'+
                 '<td class="detailsTable">'+data.Obs_AlmacenMovD+'</td>'+
                '</tr>'
    })
    
    html_fila_cuerpo = html_fila_cuerpo +'<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td class="tablaDetalleAlert" style="font-weight: bold">TOTAL GENERAL </td>'+
                '<td class="tablaDetalleAlert">'+parseFloat(suma_cantidad_facturado).toFixed(2)+'</td>'+
                '<td class="tablaDetalleAlert">'+parseFloat(suma_cantidad_movimiento).toFixed(2)+'</td>'+
                '<td class="tablaDetalleAlert">'+parseFloat(suma_pu_facturado).toFixed(2)+'</td>'+
                '<td class="tablaDetalleAlert">'+parseFloat(suma_pu_facturado_movimiento).toFixed(2)+'</td>'+
                '<td class="tablaDetalleAlert">'+parseFloat(suma_subtotal_facturado).toFixed(2)+'</td>'+
                '<td class="tablaDetalleAlert">'+parseFloat(suma_subtotal_movimiento).toFixed(2)+'</td>'+
                 '<td></td>'+
                '</tr>'
     
    return html_fila_cuerpo;
}