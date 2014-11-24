// Our dialog definition.
CKEDITOR.dialog.add('img_editor_dialog', function(editor) {
    return {
        // Basic properties of the dialog window: title, minimum size.
        title: 'Image Editor',
        resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
        minWidth: 500,
        minHeight: 350,
        // Dialog window content definition.
        contents: [
            {
                id: "preview",
                label: "1111",
                elements: [{
                    type: "html",
                    id: "previewHtml",
                    html: '<iframe src="' + editor.img_editor_path + "dialogs/ImageMarkup/editor.html" + '" style="width: 100%; height: ' + 540 + 'px" hidefocus="true" frameborder="0" ' + 'id="cke_lba_img_editor_iframe"></iframe>'
                }]
            }
        ],
        // Invoked when the dialog is loaded.
        onShow: function() {
            if (typeof(lba_initiated) === 'undefined') {
                lba_initiated = false;                
            }
            
            // Get the selection from the editor.
            var selection = editor.getSelection();

            // Get the element at the start of the selection.
            var element = selection.getStartElement();

            // Get the <img> element closest to the selection, if it exists.
            if (element)
                element = element.getAscendant('img', true);

            // Si no existe imagen a la cual editar
            if (!element || element.getName() != 'img') {
                // Cerramos la ventana y mostramos una alerta al usuario
                CKEDITOR.dialog.getCurrent().hide();
                console.log("SALIR");
                alert("¡¡Primero tenés que seleccionar una imagen, PEDAZO DE BOLUDO!!");

                // Flag the insertion mode for later use.
                this.isImage = false;
                
                CKEDITOR.config.img_editor_current_img = null;
            } else {            
                // Store the reference to the <img> element in an internal property, for later use.
                this.element = element;
                CKEDITOR.config.img_editor_current_img = this.element.$;
//                console.log("element");
//                console.log(element);
                
                document.getElementById('cke_lba_img_editor_iframe').contentWindow.location.reload();
                
//                if (!lba_initiated) {
//                    setTimeout(function(){
//                        console.log("LLAMANDO a generateImage()");
////                        try {
//                            lbaGenerateImage(this.element.$);
////                        } catch (ex) {
////                            console.log("ERROR: " + ex.messsage);
////                        }
//
//                        lba_initiated = true;
//                    }, 1000);                    
//                } else {
//                    console.log("LLAMANDO a generateImage() SIN TIEMPO DE ESPERA");
////                    try {
//                        lbaGenerateImage(this.element.$);
////                    } catch (ex) {
////                        console.log("ERROR: " + ex.messsage);
////                    }
//
//                    lba_initiated = true;
//                }                
                
                this.isImage = true;

                // Invoke the setup methods of all dialog window elements, so they can load the element attributes.
//                this.setupContent(this.element);            
            }
        },
        // This method is invoked once a user clicks the OK button, confirming the dialog.
        onOk: function() {

            // The context of this function is the dialog object itself.
            // http://docs.ckeditor.com/#!/api/CKEDITOR.dialog
            var dialog = this;

            // Create a new <img> element.
            var img = this.element;

            // Invoke the commit methods of all dialog window elements, so the <img> element gets modified.
            this.commitContent(img);
        }
    };
});
