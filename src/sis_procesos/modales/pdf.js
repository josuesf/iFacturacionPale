
var empty = require('empty-element');
var yo = require('yo-yo');

function CargarPDFModal(titulo,subtitulo,subtitulo_extra,callback){
    var el = yo`
    
        <div class="modal-dialog" style="height: 90%;">
            <div class="modal-content modal-lg" style="height: 100%;">
                <div class="modal-header text-center">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h3 class="modal-title"><strong>${titulo}</strong></h3>
                    <h4 class="modal-title"><strong>${subtitulo}</strong></h4>
                    <h4 class="modal-title"><strong>${subtitulo_extra}</strong></h4>
                </div>
                <div class="modal-body text-center" id="divPDF" style="height: 80%;">
                    <i class="fa fa-file-pdf-o fa-5x"></i>
                    <br/><br/>
                    <i class="fa fa-refresh fa-spin fa-5x"></i><br/><br/>
                    <label>Cargando vista previa....</label>
                </div>
                <div class="modal-footer">
                    <div class="btn-toolbar pull-right">
                        <div class="btn-group">
                            <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button> 
                        </div>
                    </div>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>`


    var modal_proceso = document.getElementById('modal-alerta');
    empty(modal_proceso).appendChild(el); 

    if($('#modal-alerta').hasClass('in')){
        callback(true)
    }else{

        $('#modal-alerta').modal()
        $("#modal-alerta").off('shown.bs.modal').on("shown.bs.modal", function () {
            callback(true)
        });
    }
}

export { CargarPDFModal }
