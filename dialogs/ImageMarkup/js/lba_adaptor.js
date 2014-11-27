CKEDITOR = self.parent.CKEDITOR || { config: {} };

var default_img = { 
    currentSrc: "exam/image_not_found.png", 
    src : "exam/image_not_found.png"
};
var current_img;

$(document).ready(function(){
    
    console.log("--- Cargando configuraciones ---");
    current_img = CKEDITOR.config.img_editor_current_img || default_img;
    console.log("current_img");
    console.log(current_img);
    document.getElementById('img-editable').src = current_img.src;

    var markup = $('.img-container img').imageMarkup({ color: 'red', width: 4, opacity: .5 });

    self.parent.descargarImg = function descargarImg(success_function){
        // Recuperamos la instancia utilizada en el image-markup.js
        var markup = window.current_image_markup;
        markup.custom_download(success_function);
    };
    console.log("--- Fin de la carga ---");
});

//
////function initialize() {
//    console.log("inicializado");
//    self.parent.lbaGenerateImage = function (e) {
//        console.log("Reseteando Imagen...");
//        console.log(document.getElementById("img-container"));
//        console.log(document.getElementById("img-editable"));
//        
//        var default_img = { 
//            currentSrc: "exam/vermeer.jpg", 
//            src : "exam/vermeer.jpg", 
//            height : "250", 
//            width : "400", 
//            alt : "Current Image" 
//        };
//        
//        var original_img = e || default_img;
////        document.getElementById('img-editable').src = img_url.currentSrc;
//        
//        console.log("img_url");
//        console.log(original_img);
//        
//        $("#img-editable").remove();
//        
//        console.log("Agregar : " + '<img id="img-editable" src="' + original_img.currentSrc + '" />');
////        console.log("Agregar : " + '<img id="img-editable" src="' + original_img.src + '" />');
//   
//        // Agregando la img
//        $("#img-container").after('<img id="img-editable" src="' + original_img.src + '" />');
//                
//        setTimeout(function(){
//            $('#img-editable').imageMarkup({ color: 'red', width: 4, opacity: .5 });            
//        }, 1000);
//    };
////    self.parent.lbaGenerateImage = lbaGenerateImage;
////}