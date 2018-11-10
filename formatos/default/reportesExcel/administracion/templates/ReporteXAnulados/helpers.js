  function recorrerArreglo(detalles) { 
    html_fila_cuerpo = ''
    detalles.forEach(function(data,index){
        
             html_fila_cuerpo = html_fila_cuerpo +'<tr class="row">'+ 
                '<td>'+(index+1)+'</td>'+
                '<td>'+(data.FechaEmision?data.FechaEmision.toString().split('T')[0]:'')+'</td>'+
                '<td>'+data.Cod_TipoComprobante+':'+data.Serie+'-'+data.Numero+'</td>'+
                '<td>'+data.Glosa+'</td>'+
                '<td>'+data.Cod_UsuarioReg+'</td>'+
                '<td>'+(data.Fecha_Reg?data.Fecha_Reg.toString().split('T')[1]:'').split('.')[0]+'</td>'+
                '</tr>'
    })
     
    return html_fila_cuerpo;
}