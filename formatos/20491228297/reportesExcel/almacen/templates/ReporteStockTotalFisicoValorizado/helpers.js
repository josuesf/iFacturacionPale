
function recorrerArreglo(detalles) {  
    var html_general = ''
    var documento_orden = null
    var transaccion_orden = null 
    
    var dataTransaccion = {}
    var dataDocumento = {}
    
    var suma_total_stock_cantidad = 0
    var suma_total_stock_compra = 0
    var suma_total_stock_valorizado= 0
    
    detalles.forEach(function(data){
        if(documento_orden == (data.Cod_TipoAlmacen+':'+data.Cod_Categoria)){
                
                if(dataDocumento[documento_orden].clase_almacen.hasOwnProperty(data.Cod_TipoAlmacen)){
                
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen].push({
                     "html":'<tr class="row">'+
                            '<td colspan="1"class="detailsTable">'+data.Cod_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_UnidadMedida+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Stock_Act+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Precio_Compra+'</td>'+
                            '<td colspan="1"class="detailsTable">('+(data.Precio_Venta-data.Precio_Compra)+')</td>'+
                        '</tr>',
                        "SubTotal_Stock_cantidad":data.Stock_Act,
                        "SubTotal_Stock_compra":data.Precio_Compra,
                        "SubTotal_Stock_valorizado":(data.Precio_Venta-data.Precio_Compra),
                        "Concepto":data.Des_Categoria,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen] = []
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen].push({
                        "html":'<tr class="row">'+
                            '<td colspan="1"class="detailsTable">'+data.Cod_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_UnidadMedida+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Stock_Act+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Precio_Compra+'</td>'+
                            '<td colspan="1"class="detailsTable">('+(data.Precio_Venta-data.Precio_Compra)+')</td>'+
                        '</tr>',
                        "SubTotal_Stock_cantidad":data.Stock_Act,
                        "SubTotal_Stock_compra":data.Precio_Compra,
                        "SubTotal_Stock_valorizado":(data.Precio_Venta-data.Precio_Compra),
                        "Concepto":data.Des_Categoria,
                        "Documento_orden":documento_orden
                        
                    })
                }
             
         
        }else{ 
            documento_orden = data.Cod_TipoAlmacen+':'+data.Cod_Categoria
            if(!dataDocumento.hasOwnProperty(documento_orden)){

                documento_orden = data.Cod_TipoAlmacen+':'+data.Cod_Categoria
                
                dataDocumento[documento_orden]={
                    "html":' <tr class="row">'+
                                '<td class="headerPage_left" colspan="4">'+data.Nom_TipoAlmacen+'  .:.  '+data.Cod_TipoAlmacen+'</td>'+
                                '<td colspan="4"></td>'+
                            '</tr>'+
                            '<tr class="row">'+
                                '<td class="headerPage_left" colspan="4">CATEGORIA '+data.Des_Categoria+'</td>'+
                                '<td colspan="2"></td>'+
                                '<td colspan="2"></td>'+
                            '</tr>'+  
                            '<tr class="row">'+
                                '<td colspan="1" class="headerTable">COD PRODUCTO</td>'+
                                '<td colspan="2" class="headerTable">NOMBRE</td>'+
                                '<td colspan="2" class="headerTable">U.M.</td>'+
                                '<td colspan="1" class="headerTable">CANTIDAD</td>'+
                                '<td colspan="1" class="headerTable">P.U. COMPRA</td>'+
                                '<td colspan="1" class="headerTable">VALORIZADO</td>'+
                            '</tr>', 
                    "clase_almacen":{}
                }
            
                dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen] = []
                dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen].push({
                     "html":'<tr class="row">'+
                            '<td colspan="1"class="detailsTable">'+data.Cod_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_UnidadMedida+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Stock_Act+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Precio_Compra+'</td>'+
                            '<td colspan="1"class="detailsTable">('+(data.Precio_Venta-data.Precio_Compra)+')</td>'+
                        '</tr>',
                        "SubTotal_Stock_cantidad":data.Stock_Act,
                        "SubTotal_Stock_compra":data.Precio_Compra,
                        "SubTotal_Stock_valorizado":(data.Precio_Venta-data.Precio_Compra),
                        "Concepto":data.Des_Categoria,
                        "Documento_orden":documento_orden
                    
                })
            }else{

                if(dataDocumento[documento_orden].clase_almacen.hasOwnProperty(data.Cod_TipoAlmacen)){
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen].push({
                         "html":'<tr class="row">'+
                            '<td colspan="1"class="detailsTable">'+data.Cod_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_UnidadMedida+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Stock_Act+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Precio_Compra+'</td>'+
                            '<td colspan="1"class="detailsTable">('+(data.Precio_Venta-data.Precio_Compra)+')</td>'+
                        '</tr>',
                        "SubTotal_Stock_cantidad":data.Stock_Act,
                        "SubTotal_Stock_compra":data.Precio_Compra,
                        "SubTotal_Stock_valorizado":(data.Precio_Venta-data.Precio_Compra),
                        "Concepto":data.Des_Categoria,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen] = []
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen].push({
                         "html":'<tr class="row">'+
                            '<td colspan="1"class="detailsTable">'+data.Cod_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_UnidadMedida+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Stock_Act+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Precio_Compra+'</td>'+
                            '<td colspan="1"class="detailsTable">('+(data.Precio_Venta-data.Precio_Compra)+')</td>'+
                        '</tr>',
                        "SubTotal_Stock_cantidad":data.Stock_Act,
                        "SubTotal_Stock_compra":data.Precio_Compra,
                        "SubTotal_Stock_valorizado":(data.Precio_Venta-data.Precio_Compra),
                        "Concepto":data.Des_Categoria,
                        "Documento_orden":documento_orden
                        
                    })
                }

            }
        }
    })
 
    
    var html_general = ''
    
    for(var keyD in dataDocumento){
        html_general = html_general + dataDocumento[keyD].html
        for (var keyFP in dataDocumento[keyD]['clase_almacen']){
          
            let html_movimientos_caja = ''
            let cantidad_items = 0
            let suma_subtotal_stock_cantidad = 0
            let suma_subtotal_stock_compra= 0
            let suma_subtotal_stock_valorizado= 0
            
            dataDocumento[keyD]['clase_almacen'][keyFP].forEach(function(dataHtml,index){
                cantidad_items++
                html_movimientos_caja = html_movimientos_caja + dataHtml['html']
   
                suma_subtotal_stock_cantidad= suma_subtotal_stock_cantidad+parseFloat(dataHtml['SubTotal_Stock_cantidad']) 
                suma_subtotal_stock_compra = suma_subtotal_stock_compra+parseFloat(dataHtml['SubTotal_Stock_compra']) 
                suma_subtotal_stock_valorizado = suma_subtotal_stock_valorizado+parseFloat(dataHtml['SubTotal_Stock_valorizado']) 
               
               
                suma_total_stock_cantidad = suma_total_stock_cantidad+parseFloat(dataHtml['SubTotal_Stock_cantidad'])
                suma_total_stock_compra = suma_total_stock_compra+parseFloat(dataHtml['SubTotal_Stock_compra']) 
                suma_total_stock_valorizado = suma_total_stock_valorizado+parseFloat(dataHtml['SubTotal_Stock_valorizado']) 
             
                if(index==(dataDocumento[keyD]['clase_almacen'][keyFP].length-1)){
                     html_movimientos_caja = html_movimientos_caja +   '<tr class="row">'+ 
                                                                '<td></td>'+
                                                                '<td></td>'+
                                                                '<td></td>'+
                                                                '<td class="tablaDetalleSusses textoWarning">SUB TOTAL</td>'+
                                                                '<td class="tablaDetalleSusses"></td>'+
                                                                '<td class="tablaDetalleSusses">'+parseFloat(suma_subtotal_stock_cantidad).toFixed(2)+'</td>'+
                                                                '<td class="tablaDetalleSusses">'+parseFloat(suma_subtotal_stock_compra).toFixed(2)+'</td>'+
                                                                '<td class="tablaDetalleSusses">'+parseFloat(suma_subtotal_stock_valorizado).toFixed(2)+'</td>'+
                                                            '</tr>'+
                                                            '<tr class="row"><td></td></tr>'
                  }
            })
            html_general = html_general +html_movimientos_caja
        }
        
    }
    
    html_general = html_general+'<tr class="row">'+
                                '<td></td>'+
                                '</tr>'+  
                                '<tr class="row">'+ 
                                '<td colspan="2"></td>'+
                                '<td class="tablaDetallePrimary textoWarning textoNegrita" colspan="4">TOTAL GENERAL STOCK CALCULADO : </td>'+
                                '<td class="tablaDetallePrimary textoNegrita" colspan="2">'+parseFloat(suma_total_stock_cantidad).toFixed(2)+'</td>'+
                                '</tr>'+
                                '<tr class="row">'+ 
                                '<td colspan="2"></td>'+
                                '<td class="tablaDetallePrimary textoWarning textoNegrita" colspan="4">TOTAL GENERAL PRECIO DE COPMPRA : </td>'+
                                '<td class="tablaDetallePrimary textoNegrita" colspan="2">'+parseFloat(suma_total_stock_compra).toFixed(2)+'</td>'+
                                '</tr>'+
                                '<tr class="row">'+ 
                                '<td colspan="2"></td>'+
                                '<td class="tablaDetallePrimary textoWarning textoNegrita" colspan="4">TOTAL GENERAL VALORIZADO : </td>'+
                                '<td class="tablaDetallePrimary textoNegrita" colspan="2">'+parseFloat(suma_total_stock_valorizado).toFixed(2)+'</td>'+
                                '</tr>'
                                
    
    return html_general;
}