CKEDITOR = self.parent.CKEDITOR || { config: {} };

var default_img = { 
    src : "img/image_not_found.png"
};
var current_img = null;
var markup = null;
var color = null;
var is_locked = true;

$(document).ready(function() {    
//        console.log("--- Cargando configuraciones ---");

        if (!CKEDITOR.config.img_editor_current_img) {
//            console.log("recargando");
            document.location.href = document.location.href;
        } else {
            current_img = CKEDITOR.config.img_editor_current_img || default_img;

//            console.log("current_img");
//            console.log(current_img);

            $('#img-editable').attr("src", current_img.src);
            $('#img-editable').css('border', "solid 1px rgba(0,0,0,0.3)");            
        }
        
        $("#toolbar").show();
        $("#custom-color").spectrum({
            showPaletteOnly: true,
            showPalette: true,
            hideAfterPaletteSelect:true,
            color: 'red',
            palette: [
                ['black', 'white', 'blanchedalmond',
                'rgb(255, 128, 0);', 'hsv 100 70 50'],
                ['red', 'yellow', 'green', 'blue', 'violet']
            ]
        });

        color = $("#custom-color").spectrum('get');

        $("#custom-color").on("change.color", function(event, chosen_color){
            color = chosen_color;
            markup.setPenColor(chosen_color.toHexString());
        });

        $(".img-tool").click(function(){
            if (!is_locked) {
//                console.log('tool selected');
                $(".img-tool").removeClass('active-tool');
                $(this).addClass('active-tool');                
            }
        });
        
        markup = $('.img-container img').imageMarkup({ color: color.toHexString(), width: 4, opacity: 1 });

        self.parent.downloadCustomImg = function(success_function) {
            markup.custom_download(success_function);
        };
        
        is_locked = false;
//        console.log("--- Fin de la carga ---");
});


// === Funciones del ToolBar ===

function tb_undo() {
    if (!is_locked) {
//        console.log("UNDO presionado");

        CommandManager.undo();            
        paper.view.draw();        
    }
}
function tb_redo() {
    if (!is_locked) {
//        console.log("UNDO presionado");

        CommandManager.redo();            
        paper.view.draw();        
    }
}
function tb_text() {
    if (!is_locked) {
//        console.log("TEXT presionado");
        markup.setText();

        paper.view.draw();        
    }
}
function tb_select() {
    if (!is_locked) {
        markup.current_tool = "select";
        markup.setSelectIcon();        
    }
}
function tb_pen() {
    if (!is_locked) {
        markup.current_tool = "pen";
        var color = $("#custom-color").spectrum('get');
        markup.setPenColor(color.toHexString());        
    }
}
function tb_ellipse(){
    if (!is_locked) {
        markup.current_tool = "ellipse";
        markup.setPenIcon();        
    }
}
function tb_line(){
    if (!is_locked) {
        markup.current_tool = "line";
        markup.setPenIcon();        
    }
}
function tb_rectangle(){
    if (!is_locked) {
        markup.current_tool = "rectangle";
        markup.setPenIcon();        
    }
}
function tb_erase(){
    if (!is_locked) {
        markup.current_tool = "erase";
        markup.setEraserIcon();        
    }
}
function tb_clear_all(){
    if (!is_locked) {
        markup.erase_all();        
    }
}
function tb_save_as(){
    if (!is_locked) {
        markup.download();        
    }
}
function tb_arrow(){
    if (!is_locked) {
        markup.current_tool = "arrow";
        markup.setArrowIcon();        
    }
}