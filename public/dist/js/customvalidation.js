function ValidacionCampos(){
    var estaValidado = true;

    // validar campos de texto requeridos
    $("input").each(function(){
        if ($(this).hasClass("required")){
            if($.trim($(this).val()).length == 0){ 
                estaValidado = false;
                $(this).css("border-color","red");
            }
        }
    });

    // validar combos requeridos
    $("select").each(function(){
        if ($(this).hasClass("required")){
            if($.trim($(this).val()).length == 0){ 
                estaValidado = false;
                $(this).focus();
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