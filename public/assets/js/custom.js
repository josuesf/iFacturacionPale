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

 function run_waitMe(el, num, effect,ptext){
    text = ptext!=undefined?ptext:"Espere un momento, estamos cargando los datos...";
    fontSize = '';
    switch (num) {
        case 1:
        maxSize = '';
        textPos = 'vertical';
        break;
        case 2: 
        maxSize = 30;
        textPos = 'vertical';
        break;
        case 3:
        maxSize = 30;
        textPos = 'horizontal';
        fontSize = '18px';
        break;
    }
    el.waitMe({
        effect: effect,
        text: text,
        bg: 'rgba(255,255,255,0.7)',
        color: '#000',
        maxSize: maxSize,
        waitTime : -1,
        textPos: textPos,
        fontSize: fontSize,
        onClose: function(el) {}
    });
}
 

$(document).on('hidden.bs.modal', function (event) { 
    if ($('.modal:visible').length) {
      $('body').addClass('modal-open');
    }
});
 

 window.alert = function() {};
  

 