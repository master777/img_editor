CKEDITOR = self.parent.CKEDITOR || { config: {} };

var default_img = { 
    src : "img/image_not_found.png"
};
var current_img = null;
var markup = null;
var color = null;


$(document).ready(function(){
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
            console.log('tool selected');
            $(".img-tool").removeClass('active-tool');
            $(this).addClass('active-tool');
        });

        console.log("--- Cargando configuraciones ---");

        if (!CKEDITOR.config.img_editor_current_img) {
//            document.location.href = document.location.href;                
        }

        current_img = CKEDITOR.config.img_editor_current_img || default_img;

        console.log("current_img");
        console.log(current_img);

        document.getElementById('img-editable').src = current_img.src;

        markup = $('.img-container img').imageMarkup({ color: color.toHexString(), width: 4, opacity: 0.7 });
        console.log("markup");
        console.log(markup);

        self.parent.downloadCustomImg = function(success_function) {
            markup.custom_download(success_function);
        };
        console.log("--- Fin de la carga ---");                

});


// === Funciones del ToolBar ===

function tb_undo() {
    console.log("UNDO presionado");

    CommandManager.undo();            
    paper.view.draw();
}
function tb_redo() {
    console.log("UNDO presionado");

    CommandManager.redo();            
    paper.view.draw();
}
function tb_text() {
    console.log("TEXT presionado");
    markup.setText();

    paper.view.draw();
}
function tb_select() {
    markup.current_tool = "select";
    markup.setSelectIcon();
}
function tb_pen() {
    markup.current_tool = "pen";
    var color = $("#custom-color").spectrum('get');
    markup.setPenColor(color.toHexString());
}
function tb_ellipse(){
    markup.current_tool = "ellipse";
    markup.setPenIcon();
}
function tb_line(){
    markup.current_tool = "line";
    markup.setPenIcon();
}
function tb_rectangle(){
    markup.current_tool = "rectangle";
    markup.setPenIcon();
}
function tb_erase(){
    markup.current_tool = "erase";
    markup.setEraserIcon();
}
function tb_clear_all(){
    markup.erase_all();
}
function tb_save_as(){
    markup.download();
}
function tb_arrow(){
    markup.current_tool = "arrow";
    markup.setArrowIcon();
}