function ValidacionCampos(id_divError){
    var estaValidado = true;

    // validar campos de texto requeridos
    $("input").each(function(){
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
     $("textarea").each(function(){
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
    $("select").each(function(){
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