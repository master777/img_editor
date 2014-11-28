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