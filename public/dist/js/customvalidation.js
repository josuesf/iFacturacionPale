function ValidacionCampos(id_divError,id_divParent){
    var estaValidado = true;

    // validar campos de texto requeridos
    $((id_divParent!= undefined?"#"+id_divParent:'')+" input").each(function(){
        if ($(this).hasClass("required")){
            if($.trim($(this).val()).length == 0){
                estaValidado = false;
                $(this).css("border-color","red");
            }else{
                $(this).css("border-color","");
            }
        }
    });

     // validar areas de textos requeridos
     $((id_divParent!= undefined?"#"+id_divParent:'')+" textarea").each(function(){
        if ($(this).hasClass("required")){
            if($.trim($(this).val()).length == 0){ 
                estaValidado = false;
                $(this).css("border-color","red");
            }else{
                $(this).css("border-color","");
            }
        }
    });

    // validar combos requeridos
    $((id_divParent!= undefined?"#"+id_divParent:'')+" select").each(function(){
        if ($(this).hasClass("required")){
            if($.trim($(this).val()).length == 0){ 
                estaValidado = false;
                $(this).focus();
                $(this).css("border-color","red");
            }else{
                $(this).css("border-color","");
            }
        }
    });

    if (!estaValidado) { 
        $('#'+(id_divError||'divErrors')).html('<p>Es necesario llenar todos los campos requeridos marcados con rojo</p>')
        $('#'+(id_divError||'divErrors')).removeClass("hidden")
    }else{
        $("#divErrors").addClass("hidden") 
    }

    return estaValidado;
 }

 window.alert = function() {};
  

 