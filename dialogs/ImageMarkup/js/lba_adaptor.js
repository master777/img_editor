CKEDITOR = self.parent.CKEDITOR || { config: {} };

//function initialize() {
    console.log("inicializado");
    self.parent.lbaGenerateImage = function (e) {
        console.log("Reseteando Imagen...");
        console.log(document.getElementById("img-container"));
        console.log(document.getElementById("img-editable"));
        
        var default_img = { 
            currentSrc: "exam/vermeer.jpg", 
            src : "exam/vermeer.jpg", 
            height : "250", 
            width : "400", 
            alt : "Current Image" 
        };
        
        var original_img = e || default_img;
//        document.getElementById('img-editable').src = img_url.currentSrc;
        
        console.log("img_url");
        console.log(original_img);
        
        $("#img-editable").remove();
        
        console.log("Agregar : " + '<img id="img-editable" src="' + original_img.currentSrc + '" />');
//        console.log("Agregar : " + '<img id="img-editable" src="' + original_img.src + '" />');
   
        // Agregando la img
        $("#img-container").after('<img id="img-editable" src="' + original_img.src + '" />');
                
        setTimeout(function(){
            $('#img-editable').imageMarkup({ color: 'red', width: 4, opacity: .5 });            
        }, 1000);
    };
//    self.parent.lbaGenerateImage = lbaGenerateImage;
//}



