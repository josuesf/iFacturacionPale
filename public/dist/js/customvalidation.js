function ValidacionCampos(){
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

    // validar combos requeridos
    $("select").each(function(){
        if ($(this).hasClass("required")){
            if($.trim($(this).val()).length == 0){ 
                estaValidado = false;
                $(this).focus();
                $(this).css("border-color","red");
            }
        }
    });

    if (!estaValidado) { 
        $("#divErrors").removeClass("hidden")
    }else{
        $("#divErrors").addClass("hidden") 
    }

    return estaValidado;
 } 