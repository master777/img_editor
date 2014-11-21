// Our dialog definition.
CKEDITOR.dialog.add('img_editor_dialog', function(editor) {
    return {
        // Basic properties of the dialog window: title, minimum size.
        title: 'Image Editor',
        resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
        minWidth: 500,
        minHeight: 250,
        // Dialog window content definition.
        contents: [
            {                
                id: "preview",
                label: "1111",
                elements: [{
                    type: "html",
                    id: "previewHtml",
                    html: '<iframe src="' + editor.img_editor_path + "dialogs/ImageMarkup/editor.html" + '" style="width: 100%; height: ' + 540 + 'px" hidefocus="true" frameborder="0" ' + 'id="cke_docProps_preview_iframe"></iframe>',
                    setup: function(element) {
                        console.log('this:');
                        console.log(this);
                        
                        // get the id that ckeditor generated for this element and store as an object property
                        this.elemId = this.getInputElement().getAttribute('id');
                        // now we can reference the element by the id we stored above. Hacky? Yeah probably
                        var iframe = document.getElementById(this.elemId);
                        console.log('iframe:');
                        console.log(iframe);
                        
                        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                        var img = innerDoc.getElementById('img-editable');
                                                
                        console.log('iframe img:');
                        console.log(img);
//                        img = element.src;
                    },
                }]
            }
            
//            {
//                // Definition of the Basic Settings dialog tab (page).
//                id: 'tab-basic',
//                label: 'Basic Settings',
//                // The tab content.
//                elements: [
//                    {
//                        // Text input field for the abbreviation text.
//                        type: 'text',
//                        id: 'abbr',
//                        label: 'Abbreviation',
//                        // Validation checking whether the field is not empty.
//                        validate: CKEDITOR.dialog.validate.notEmpty("Abbreviation field cannot be empty."),
//                        // Called by the main setupContent method call on dialog initialization.
//                        setup: function(element) {
//                            this.setValue(element.getText());
//                        },
//                        // Called by the main commitContent method call on dialog confirmation.
//                        commit: function(element) {
//                            element.setText(this.getValue());
//                        }
//                    },
//                    {
//                        // Text input field for the abbreviation title (explanation).
//                        type: 'text',
//                        id: 'title',
//                        label: 'Explanation',
//                        validate: CKEDITOR.dialog.validate.notEmpty("Explanation field cannot be empty."),
//                        // Called by the main setupContent method call on dialog initialization.
//                        setup: function(element) {
//                            this.setValue(element.getAttribute("title"));
//                        },
//                        // Called by the main commitContent method call on dialog confirmation.
//                        commit: function(element) {
//                            element.setAttribute("title", this.getValue());
//                        }
//                    }
//                ]
//            },
//            // Definition of the Advanced Settings dialog tab (page).
//            {
//                id: 'tab-adv',
//                label: 'Advanced Settings',
//                elements: [
//                    {
//                        // Another text field for the abbr element id.
//                        type: 'text',
//                        id: 'id',
//                        label: 'Id',
//                        // Called by the main setupContent method call on dialog initialization.
//                        setup: function(element) {
//                            this.setValue(element.getAttribute("id"));
//                        },
//                        // Called by the main commitContent method call on dialog confirmation.
//                        commit: function(element) {
//                            var id = this.getValue();
//                            if (id)
//                                element.setAttribute('id', id);
//                            else if (!this.insertMode)
//                                element.removeAttribute('id');
//                        }
//                    }
//                ]
//            }
        ],
        // Invoked when the dialog is loaded.
        onShow: function() {

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
            } else {
                this.isImage = true;
            
                // Store the reference to the <img> element in an internal property, for later use.
                this.element = element;
                
                console.log("element");
                console.log(element);

//                img = document.getElementById('img-editable');
//                console.log("img");
//                console.log(img);                
                
//                img.src = element.src;
                
                // Invoke the setup methods of all dialog window elements, so they can load the element attributes.
                this.setupContent(this.element);            
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
