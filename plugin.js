// Register the plugin within the editor.
CKEDITOR.plugins.add('img_editor', {
    // Register the icons.
    icons: 'img_editor',
    // The plugin initialization logic goes inside this method.
    init: function(editor) {
        
        // Especificamos la ruta
        editor.img_editor_path = this.path;
        
        // Define an editor command that opens our dialog window.
        editor.addCommand('img_editor', new CKEDITOR.dialogCommand('img_editor_dialog'));

        // Create a toolbar button that executes the above command.
        editor.ui.addButton('img_editor', {
            // The text part of the button (if available) and the tooltip.
            label: 'Edit Image',
            // The command to execute on click.
            command: 'img_editor',
            // The button placement in the toolbar (toolbar group name).
            toolbar: 'editing'
        });

        if (editor.contextMenu) {

            // Add a context menu group with the Edit Abbreviation item.
            editor.addMenuGroup('img_editor_group');
            editor.addMenuItem('img_editor_item', {
                label: 'Edit Image',
                icon: this.path + 'icons/img_editor.png',
                command: 'img_editor',
                group: 'img_editor_group'
            });

            editor.contextMenu.addListener(function(element) {
                if (element.getAscendant('img', true)) {
                    return {img_editor_item: CKEDITOR.TRISTATE_OFF};
                }
            });
        }

        // Register our dialog file -- this.path is the plugin folder path.
        CKEDITOR.dialog.add('img_editor_dialog', this.path + 'dialogs/img_editor.js');
        
//        CKEDITOR.on('instanceReady', function(ev) {
//            var editor = ev.editor,
//                dataProcessor = editor.dataProcessor,
//                htmlFilter = dataProcessor && dataProcessor.htmlFilter;
//
//            htmlFilter.addRules({
//                elements: {
//                    $: function(element) {
//                        if (element.name == 'img') {
//                            var imgsrc = element.attributes.src;
//
//                            element.attributes.src = imgsrc;
//                            element.attributes['data-cke-saved-src'] = imgsrc;
//                        }
//                    }
//                }
//            });
//        });
    }
});
