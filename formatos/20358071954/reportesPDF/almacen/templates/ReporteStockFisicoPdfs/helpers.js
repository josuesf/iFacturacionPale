
function recorrerArreglo(detalles) {  
    var html_general = ''
    var documento_orden = null
    var transaccion_orden = null 
    
    var dataTransaccion = {}
    var dataDocumento = {}
    
    var suma_total_stock_actual = 0
    var suma_total_stock_calculado = 0
    
    detalles.forEach(function(data){
        if(documento_orden == (data.Cod_TipoAlmacen+':'+data.Cod_Categoria)){
                
                if(dataDocumento[documento_orden].clase_almacen.hasOwnProperty(data.Cod_TipoAlmacen)){
                
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen].push({
                     "html":'<tr class="row">'+
                            '<td colspan="1"class="detailsTable">'+data.Cod_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Cod_Fabricante+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_Producto+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Nom_UnidadMedida+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.StockCalculado+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Stock_Act+'</td>'+
                        '</tr>',
                        "SubTotal_Stock_calculado":data.StockCalculado,
                        "SubTotal_Stock_Actual":data.Stock_Act,
                        "Concepto":data.Des_Categoria,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen] = []
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen].push({
                        "html":'<tr class="row">'+
                           '<td colspan="1"class="detailsTable">'+data.Cod_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Cod_Fabricante+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_Producto+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Nom_UnidadMedida+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.StockCalculado+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Stock_Act+'</td>'+
                        '</tr>',
                        "SubTotal_Stock_calculado":data.StockCalculado,
                        "SubTotal_Stock_Actual":data.Stock_Act,
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
                                '<td colspan="2" class="headerTable">FABRICANTE</td>'+
                                '<td colspan="2" class="headerTable">NOMBRE</td>'+
                                '<td colspan="1" class="headerTable">UNDIDAD</td>'+
                                '<td colspan="1" class="headerTable">STOCK CALCULADO</td>'+
                                '<td colspan="1" class="headerTable">STOCK ACTUAL</td>'+
                            '</tr>', 
                    "clase_almacen":{}
                }
            
                dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen] = []
                dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen].push({
                   "html":'<tr class="row">'+
                            '<td colspan="1"class="detailsTable">'+data.Cod_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Cod_Fabricante+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_Producto+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Nom_UnidadMedida+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.StockCalculado+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Stock_Act+'</td>'+
                        '</tr>',
                        "SubTotal_Stock_calculado":data.StockCalculado,
                        "SubTotal_Stock_Actual":data.Stock_Act,
                        "Concepto":data.Des_Categoria,
                        "Documento_orden":documento_orden
                    
                })
            }else{

                if(dataDocumento[documento_orden].clase_almacen.hasOwnProperty(data.Cod_TipoAlmacen)){
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen].push({
                       "html":'<tr class="row">'+
                           '<td colspan="1"class="detailsTable">'+data.Cod_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Cod_Fabricante+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_Producto+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Nom_UnidadMedida+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.StockCalculado+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Stock_Act+'</td>'+
                        '</tr>',
                        "SubTotal_Stock_calculado":data.StockCalculado,
                        "SubTotal_Stock_Actual":data.Stock_Act,
                        "Concepto":data.Des_Categoria,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen] = []
                    dataDocumento[documento_orden].clase_almacen[data.Cod_TipoAlmacen].push({
                        "html":'<tr class="row">'+
                            '<td colspan="1"class="detailsTable">'+data.Cod_Producto+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Cod_Fabricante+'</td>'+
                            '<td colspan="2"class="detailsTable">'+data.Nom_Producto+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Nom_UnidadMedida+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.StockCalculado+'</td>'+
                            '<td colspan="1"class="detailsTable">'+data.Stock_Act+'</td>'+
                        '</tr>',
                        "SubTotal_Stock_calculado":data.StockCalculado,
                        "SubTotal_Stock_Actual":data.Stock_Act,
                        "Concepto":data.Des_Categoria,
                        "Documento_orden":documento_orden
                        
                    })
                }

            }
        }
    }) 
    
    for(var keyD in dataDocumento){
        html_general = html_general + dataDocumento[keyD].html
        for (var keyFP in dataDocumento[keyD].clase_almacen){
          
            let html_movimientos_caja = ''
            let cantidad_items = 0
            let suma_subtotal_stock_actual = 0
            let suma_subtotal_stock_calculado= 0
            
            dataDocumento[keyD].clase_almacen[keyFP].forEach(function(dataHtml,index){
                cantidad_items++
                html_movimientos_caja = html_movimientos_caja + dataHtml['html']
   
                suma_subtotal_stock_actual = suma_subtotal_stock_actual+parseFloat(dataHtml['SubTotal_Stock_Actual']) 
                suma_subtotal_stock_calculado = suma_subtotal_stock_calculado+parseFloat(dataHtml['SubTotal_Stock_calculado']) 

                suma_total_stock_actual = suma_total_stock_actual+parseFloat(dataHtml['SubTotal_Stock_Actual']) 
                suma_total_stock_calculado = suma_total_stock_calculado+parseFloat(dataHtml['SubTotal_Stock_calculado'])
             
                if(index==(dataDocumento[keyD]['clase_almacen'][keyFP].length-1)){
                     html_movimientos_caja = html_movimientos_caja +   '<tr class="row">'+ 
                                                                '<td></td>'+
                                                                '<td></td>'+
                                                                '<td></td>'+
                                                                '<td class="tablaDetalleAlert" colspan="3">SUB TOTAL</td>'+
                                                                '<td class="tablaDetalleAlert">'+parseFloat(suma_subtotal_stock_actual).toFixed(2)+'</td>'+
                                                                '<td class="tablaDetalleAlert">'+parseFloat(suma_subtotal_stock_calculado).toFixed(2)+'</td>'+
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
                                '<td class="tablaDetalleAlert" colspan="4">TOTAL GENERAL STOCK CALCULADO : </td>'+
                                '<td class="tablaDetalleAlert" colspan="2">'+parseFloat(suma_total_stock_actual).toFixed(2)+'</td>'+
                                '</tr>'+
                                '<tr class="row">'+ 
                                '<td colspan="2"></td>'+
                                '<td class="tablaDetalleAlert" colspan="4">TOTAL GENERAL STOCK ACTUAL : </td>'+
                                '<td class="tablaDetalleAlert" colspan="2">'+parseFloat(suma_total_stock_calculado).toFixed(2)+'</td>'+
                                '</tr>'
    
    return html_general;
}