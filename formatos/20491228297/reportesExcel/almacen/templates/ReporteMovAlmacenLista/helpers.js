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
                '<td>'+data.ComprobanteRef+'</td>'+
                '<td>'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                '<td>'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                '<td>'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                '<td>'+data.Des_Producto+'</td>'+
                '<td>'+data.CantidadF+'</td>'+
                '<td>'+data.Cantidad+'</td>'+
                '<td>'+data.PrecioF+'</td>'+
                '<td>'+data.Precio_Unitario+'</td>'+
                '<td>'+data.SubTotalF+'</td>'+
                '<td>'+parseFloat(parseFloat(data.Cantidad)*parseFloat(data.Precio_Unitario)).toFixed(2)+'</td>'+
                 '<td>'+data.Obs_AlmacenMovD+'</td>'+
                '</tr>'
    })
    
    html_fila_cuerpo = html_fila_cuerpo+ +'<tr class="row">'+ 
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td></td>'+
                '<td  style="font-weight: bold;font-size: 15px;text-align:center">TOTAL GENERAL </td>'+
                '<td>'+parseFloat(suma_cantidad_facturado).toFixed(2)+'</td>'+
                '<td>'+parseFloat(suma_cantidad_movimiento).toFixed(2)+'</td>'+
                '<td>'+parseFloat(suma_pu_facturado).toFixed(2)+'</td>'+
                '<td>'+parseFloat(suma_pu_facturado_movimiento).toFixed(2)+'</td>'+
                '<td>'+parseFloat(suma_subtotal_facturado).toFixed(2)+'</td>'+
                '<td>'+parseFloat(suma_subtotal_movimiento).toFixed(2)+'</td>'+
                 '<td></td>'+
                '</tr>'
     
    return html_fila_cuerpo;
}