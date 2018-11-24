
function recorrerArreglo(detalles) {  
    var html_general = ''
    var documento_orden = null
    var transaccion_orden = null 
    
    var dataTransaccion = {}
    var dataDocumento = {}
    
    var suma_total_subtotal_soles_e = 0
    var suma_total_subtotal_dolares_e = 0
    var suma_total_subtotal_soles_i = 0
    var suma_total_subtotal_dolares_i = 0
    
    detalles.forEach(function(data){
        if(documento_orden == (data.Cod_ClaseConcepto+':'+data.Cod_Caja+':'+data.Cod_ClaseConcepto)){
                
                if(dataDocumento[documento_orden].clase_concepto.hasOwnProperty(data.Cod_ClaseConcepto)){
                
                    dataDocumento[documento_orden].clase_concepto[data.Cod_ClaseConcepto].push({
                     "html":'<tr class="row">'+
                            '<td class="detailsTable">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable">'+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable">'+data.Cliente+'</td>'+
                            '<td class="detailsTable">'+data.Des_Concepto+'</td>'+
                            '<td class="detailsTable">'+(data.Ingreso != "0" && data.Cod_MonedaIng == "PEN" ?data.Ingreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Egreso != "0" && data.Cod_MonedaEgr == "PEN" ?data.Egreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Ingreso != "0" && data.Cod_MonedaIng == "USD" ?data.Ingreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Egreso != "0" && data.Cod_MonedaEgr == "USD" ?data.Egreso:"")+'</td>'+
                        '</tr>',
                        "SubTotal_Soles_i":data.Ingreso != "0" && data.Cod_MonedaIng == "PEN" ?data.Ingreso:0,
                        "SubTotal_Dolares_i":data.Ingreso != "0" && data.Cod_MonedaIng == "USD" ?data.Ingreso:0,
                        "SubTotal_Soles_e":data.Egreso != "0" && data.Cod_MonedaEgr == "PEN" ?data.Egreso:0,
                        "SubTotal_Dolares_e":data.Egreso != "0" && data.Cod_MonedaEgr == "USD" ?data.Egreso:0,
                        "Concepto":data.Nom_TipoConcepto,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].clase_concepto[data.Cod_ClaseConcepto] = []
                    dataDocumento[documento_orden].clase_concepto[data.Cod_ClaseConcepto].push({
                        "html":'<tr class="row">'+
                            '<td class="detailsTable">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable">'+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable">'+data.Cliente+'</td>'+
                            '<td class="detailsTable">'+data.Des_Concepto+'</td>'+
                            '<td class="detailsTable">'+(data.Ingreso != "0" && data.Cod_MonedaIng == "PEN" ?data.Ingreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Egreso != "0" && data.Cod_MonedaEgr == "PEN" ?data.Egreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Ingreso != "0" && data.Cod_MonedaIng == "USD" ?data.Ingreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Egreso != "0" && data.Cod_MonedaEgr == "USD" ?data.Egreso:"")+'</td>'+
                        '</tr>',
                       "SubTotal_Soles_i":data.Ingreso != "0" && data.Cod_MonedaIng == "PEN" ?data.Ingreso:0,
                        "SubTotal_Dolares_i":data.Ingreso != "0" && data.Cod_MonedaIng == "USD" ?data.Ingreso:0,
                        "SubTotal_Soles_e":data.Egreso != "0" && data.Cod_MonedaEgr == "PEN" ?data.Egreso:0,
                        "SubTotal_Dolares_e":data.Egreso != "0" && data.Cod_MonedaEgr == "USD" ?data.Egreso:0,
                        "Concepto":data.Nom_TipoConcepto,
                        "Documento_orden":documento_orden
                        
                    })
                }
             
         
        }else{ 
            documento_orden = data.Cod_ClaseConcepto+':'+data.Cod_Caja+':'+data.Cod_ClaseConcepto
            if(!dataDocumento.hasOwnProperty(documento_orden)){

                documento_orden = data.Cod_ClaseConcepto+':'+data.Cod_Caja+':'+data.Cod_ClaseConcepto
                
                dataDocumento[documento_orden]={
                    "html":' <tr class="row">'+
                                '<td class="headerPage_left" colspan="4">'+data.Des_Caja+'  Cod: '+data.Cod_Caja+'</td>'+
                                '<td colspan="4"></td>'+
                            '</tr>'+
                            '<tr class="row">'+
                                '<td class="headerPage_left" colspan="4">RECIBO DE '+data.Nom_TipoConcepto+'</td>'+
                                '<td class="headerTable" colspan="2">SOLES</td>'+
                                '<td class="headerTable" colspan="2">DOLARES</td>'+
                            '</tr>'+  
                            '<tr class="row">'+
                                '<td class="headerTable">Fecha</td>'+
                                '<td class="headerTable">Numero</td>'+
                                '<td class="headerTable">Cliente</td>'+
                                '<td class="headerTable">Movimiento</td>'+
                                '<td class="headerTable">Ingreso</td>'+
                                '<td class="headerTable">Egreso</td>'+
                                '<td class="headerTable">Ingreso</td>'+
                                '<td class="headerTable">Egreso</td>'+
                            '</tr>', 
                    "clase_concepto":{}
                }
            
                dataDocumento[documento_orden].clase_concepto[data.Cod_ClaseConcepto] = []
                dataDocumento[documento_orden].clase_concepto[data.Cod_ClaseConcepto].push({
                   "html":'<tr class="row">'+
                            '<td class="detailsTable">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable">'+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable">'+data.Cliente+'</td>'+
                            '<td class="detailsTable">'+data.Des_Concepto+'</td>'+
                            '<td class="detailsTable">'+(data.Ingreso != "0" && data.Cod_MonedaIng == "PEN" ?data.Ingreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Egreso != "0" && data.Cod_MonedaEgr == "PEN" ?data.Egreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Ingreso != "0" && data.Cod_MonedaIng == "USD" ?data.Ingreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Egreso != "0" && data.Cod_MonedaEgr == "USD" ?data.Egreso:"")+'</td>'+
                        '</tr>',
               
                        "SubTotal_Soles_i":data.Ingreso != "0" && data.Cod_MonedaIng== "PEN" ?data.Ingreso:0,
                        "SubTotal_Dolares_i":data.Ingreso != "0" && data.Cod_MonedaIng == "USD" ?data.Ingreso:0,
                        "SubTotal_Soles_e":data.Egreso != "0" && data.Cod_MonedaEgr == "PEN" ?data.Egreso:0,
                        "SubTotal_Dolares_e":data.Egreso != "0" && data.Cod_MonedaEgr == "USD" ?data.Egreso:0,
                        "Concepto":data.Nom_TipoConcepto,
                        "Documento_orden":documento_orden
                    
                })
            }else{

                if(dataDocumento[documento_orden].clase_concepto.hasOwnProperty(data.Cod_ClaseConcepto)){
                    dataDocumento[documento_orden].clase_concepto[data.Cod_ClaseConcepto].push({
                       "html":'<tr class="row">'+
                            '<td class="detailsTable">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable">'+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable">'+data.Cliente+'</td>'+
                            '<td class="detailsTable">'+data.Des_Concepto+'</td>'+
                            '<td class="detailsTable">'+(data.Ingreso != "0" && data.Cod_MonedaIng == "PEN" ?data.Ingreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Egreso != "0" && data.Cod_MonedaEgr == "PEN" ?data.Egreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Ingreso != "0" && data.Cod_MonedaIng == "USD" ?data.Ingreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Egreso != "0" && data.Cod_MonedaEgr == "USD" ?data.Egreso:"")+'</td>'+
                        '</tr>',
                        "SubTotal_Soles_i":data.Ingreso != "0" && data.Cod_MonedaIng== "PEN" ?data.Ingreso:0,
                        "SubTotal_Dolares_i":data.Ingreso != "0" && data.Cod_MonedaIng == "USD" ?data.Ingreso:0,
                        "SubTotal_Soles_e":data.Egreso != "0" && data.Cod_MonedaEgr == "PEN" ?data.Egreso:0,
                        "SubTotal_Dolares_e":data.Egreso != "0" && data.Cod_MonedaEgr == "USD" ?data.Egreso:0,
                        "Concepto":data.Nom_TipoConcepto,
                        "Documento_orden":documento_orden
                    })
                }else{
                    dataDocumento[documento_orden].clase_concepto[data.Cod_ClaseConcepto] = []
                    dataDocumento[documento_orden].clase_concepto[data.Cod_ClaseConcepto].push({
                        "html":'<tr class="row">'+
                            '<td class="detailsTable">'+(data.Fecha?data.Fecha.toString().split('T')[0]:'')+'</td>'+
                            '<td class="detailsTable">'+data.Serie+'-'+data.Numero+'</td>'+
                            '<td class="detailsTable">'+data.Cliente+'</td>'+
                            '<td class="detailsTable">'+data.Des_Concepto+'</td>'+
                            '<td class="detailsTable">'+(data.Ingreso != "0" && data.Cod_MonedaIng == "PEN" ?data.Ingreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Egreso != "0" && data.Cod_MonedaEgr == "PEN" ?data.Egreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Ingreso != "0" && data.Cod_MonedaIng == "USD" ?data.Ingreso:"")+'</td>'+
                            '<td class="detailsTable">'+(data.Egreso != "0" && data.Cod_MonedaEgr == "USD" ?data.Egreso:"")+'</td>'+
                        '</tr>',
                        "SubTotal_Soles_i":data.Ingreso != "0" && data.Cod_MonedaIng== "PEN" ?data.Ingreso:0,
                        "SubTotal_Dolares_i":data.Ingreso != "0" && data.Cod_MonedaIng == "USD" ?data.Ingreso:0,
                        "SubTotal_Soles_e":data.Egreso != "0" && data.Cod_MonedaEgr == "PEN" ?data.Egreso:0,
                        "SubTotal_Dolares_e":data.Egreso != "0" && data.Cod_MonedaEgr == "USD" ?data.Egreso:0,
                        "Concepto":data.Nom_TipoConcepto,
                        "Documento_orden":documento_orden
                        
                    })
                }

            }
        }
    })
 
    
    var html_general = ''
    
    for(var keyD in dataDocumento){
        html_general = html_general + dataDocumento[keyD].html
        for (var keyFP in dataDocumento[keyD]['clase_concepto']){
          
            let html_movimientos_caja = ''
            let cantidad_items = 0
            let suma_subtotal_soles_ingreso = 0
            let suma_subtotal_dolares_ingreso = 0
            let suma_subtotal_soles_egreso = 0
            let suma_subtotal_dolares_egreso = 0
            dataDocumento[keyD]['clase_concepto'][keyFP].forEach(function(dataHtml,index){
                cantidad_items++
                html_movimientos_caja = html_movimientos_caja + dataHtml['html']
                
                suma_subtotal_soles_ingreso = suma_subtotal_soles_ingreso+parseFloat(dataHtml['SubTotal_Soles_i']) 
                suma_subtotal_dolares_ingreso = suma_subtotal_dolares_ingreso+parseFloat(dataHtml['SubTotal_Dolares_i'])
                
                suma_subtotal_soles_egreso = suma_subtotal_soles_egreso+parseFloat(dataHtml['SubTotal_Soles_e']) 
                suma_subtotal_dolares_egreso = suma_subtotal_dolares_egreso+parseFloat(dataHtml['SubTotal_Dolares_e']) 

                suma_total_subtotal_soles_i = suma_total_subtotal_soles_i+parseFloat(dataHtml['SubTotal_Soles_i']) 
                suma_total_subtotal_dolares_i = suma_total_subtotal_dolares_i+parseFloat(dataHtml['SubTotal_Dolares_i'])
                suma_total_subtotal_soles_e = suma_total_subtotal_soles_e+parseFloat(dataHtml['SubTotal_Soles_e']) 
                suma_total_subtotal_dolares_e = suma_total_subtotal_dolares_e+parseFloat(dataHtml['SubTotal_Dolares_e']) 
                
                if(index==(dataDocumento[keyD]['clase_concepto'][keyFP].length-1)){
                     html_movimientos_caja = html_movimientos_caja +   '<tr class="row">'+ 
                                                                '<td></td>'+
                                                                '<td></td>'+
                                                                '<td></td>'+
                                                                '<td class="tablaDetalleAlert">SUB TOTAL</td>'+
                                                                '<td class="tablaDetalleAlert">'+parseFloat(suma_subtotal_soles_ingreso).toFixed(2)+'</td>'+
                                                           
                                                                '<td class="tablaDetalleAlert">'+parseFloat(suma_subtotal_soles_egreso).toFixed(2)+'</td>'+
                                                           
                                                                '<td class="tablaDetalleAlert">'+parseFloat(suma_subtotal_dolares_ingreso).toFixed(2)+'</td>'+
                                                             
                                                                '<td class="tablaDetalleAlert">'+parseFloat(suma_subtotal_dolares_egreso).toFixed(2)+'</td>'+
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
                                '<td class="tablaDetalleAlert" colspan="4">TOTAL GENERAL INGRESOS EN SOLES : </td>'+
                                '<td class="tablaDetalleAlert" colspan="2">'+parseFloat(suma_total_subtotal_soles_i).toFixed(2)+'</td>'+
                                '</tr>'+
                                '<tr class="row">'+ 
                                '<td colspan="2"></td>'+
                                '<td class="tablaDetalleAlert" colspan="4">TOTAL GENERAL EGRESOS EN SOLES : </td>'+
                                '<td class="tablaDetalleAlert" colspan="2">'+parseFloat(suma_total_subtotal_soles_e).toFixed(2)+'</td>'+
                                '</tr>'+
                                '<tr class="row">'+ 
                                '<td colspan="2"></td>'+
                                '<td class="tablaDetalleAlert" colspan="4">TOTAL GENERAL INGRESOS EN DOLARES : </td>'+
                                '<td class="tablaDetalleAlert" colspan="2">'+parseFloat(suma_total_subtotal_dolares_i).toFixed(2)+'</td>'+
                                '</tr>'+
                                '<tr class="row">'+ 
                                '<td colspan="2"></td>'+
                                '<td class="tablaDetalleAlert" colspan="4">TOTAL GENERAL EGRESOS EN DOLARES : </td>'+
                                '<td class="tablaDetalleAlert" colspan="2">'+parseFloat(suma_total_subtotal_dolares_e).toFixed(2)+'</td>'+
                                '</tr>'
    
    return html_general;
}