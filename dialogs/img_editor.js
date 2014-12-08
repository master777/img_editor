// Our dialog definition.
CKEDITOR.dialog.add('img_editor_dialog', function(editor) {
    return {
        // Basic properties of the dialog window: title, minimum size.
        title: 'Image Editor',
//        resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        minWidth: 700,
        minHeight: 400,
        width: 700,
        height: 400,
        // Dialog window content definition.
        contents: [
            {
                id: "preview",
                label: "Image Editor",
                elements: [{
                    type: "html",
                    id: "previewHtml",
                    html: '<iframe src="' + editor.img_editor_path + "dialogs/ImageMarkup/editor.html" + '" style="width: 100%; height: 400px" hidefocus="true" frameborder="0" ' + 'id="cke_lba_img_editor_iframe"></iframe>'
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
                alert("First you must select an image!");
                
                CKEDITOR.config.img_editor_current_img = null;
            } else {
                // Store the reference to the <img> element in an internal property, for later use.
                this.element = element;

                CKEDITOR.config.img_editor_current_img = this.element.$;                
                
                if (!lba_initiated) {
                    lba_initiated = true;
                } else {
                    // Recargamos el iframe
                    document.getElementById('cke_lba_img_editor_iframe').contentWindow.location.reload();
                }
            }
        },
        buttons: [
            {
                id: 'img_editor_save_replace',
                type: 'button',
                label: 'Save and Replace',
                title: 'Save the edited image and replaces the original',
                accessKey: 'C',
                disabled: false,
                onClick: function() {
                    console.log("Saving image...");
                    
                    // The context of this function is the dialog object itself.
                    // http://docs.ckeditor.com/#!/api/CKEDITOR.dialog
                    var dialog = CKEDITOR.dialog.getCurrent();
                    var save_button = this;
                    save_button.disable();
                    
                    // Obtenemos el elemento <img> original
                    var img = CKEDITOR.config.img_editor_current_img;
                    console.log("OK - img");
                    console.log(img);

                    uploadCompleted = function(result){
                        var error_txt = "";
                        
                        console.log("result");
                        console.log(result);
                        
                        // Actualizamos la ruta de la imagen actual
                        if (result) {
                            if (result['new_img_url'] && !result['error']) {
                                console.log("==========================");
                                console.log("Reemplazando SRC");
                                
                                img.src = result['new_img_url'];

                                console.log(img.src);
                                console.log("==========================");                                
                            } else if (result['error']) {
                                error_txt = result['error'];
                            } else {
                                error_txt = "Sorry, it was not possible save the image!";
                            }
                        } else {
                            error_txt = "Sorry, it was not possible save the image!";
                        }
                        
                        if (error_txt !== "") {
                            alert(error_txt);
                        }
                        
                        save_button.enable();
                        dialog.hide();
                    };

                    // Guardamos en el servidor la imagen modificada en el editor
                    downloadCustomImg(uploadCompleted);
                }
            },
            CKEDITOR.dialog.cancelButton
        ]
    };
});