/// <reference path="jquery-1.9.1.min.js" />
/// <reference path="paper-core.js" />
/// <reference path="paper-core.min.js" />
/// <reference path="paper-full.js" />
/// <reference path="paper-full.min.js" />
/// <reference path="CommandManager.js" />

var generateUUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

(function ($) {

    var defaults = { color: 'red', width: 4, opacity: .5, current_tool: 'pen' };

    $.fn.imageMarkup = function (options) {
        var settings = $.extend({}, defaults, options || {});

        var self = this;
        // Guardamos la instancia en una variable global
        window.current_image_markup = self;
        
        // Obtenemos la herramienta actual
        self.current_tool = settings.current_tool;

        this.setOptions = function (options) {
            settings = $.extend(settings, options);
        };

        this.removeLastPath = function () {
            if (self.paths.length > 0) {
                localStorage.clear();
                paper.projects[0].clear();
                self.paths.pop();
                savePaths();
                self.paths = [];
                renderPaths();
            }
        };

        window.onkeydown = function (e) {
            return !(e.keyCode == 32);
        };

        window.onload = function () {

            $(self).each(function (eachIndex, eachItem) {
                self.paths = [];

                var img = eachItem;

                // Get a reference to the canvas object
                //var canvas = $('#myCanvas')[0];
				
                var canvas = $('<canvas>')
                    .attr({
                        width: $(img).width(),
                        height: $(img).height()
                    })
                    .addClass('image-markup-canvas')
                    .css({
                        position: 'absolute',
                        top: '0px',
                        left: '0px'
                    });

                $(img).after(canvas);

                $(img).data('paths', []);

                // Create an empty project and a view for the canvas:
                paper.setup(canvas[0]);

                $(canvas).mouseenter(function () {
                    paper.projects[eachIndex].activate();
                });
                // Create a simple drawing tool:
                var tool = new paper.Tool();
                var offsetX = 0;
                var offsetY = 0;

                tool.onMouseMove = function(event) {

                    if (!$('.context-menu-list').is(':visible')) {

                        //position = event.point;
                        position = [offsetX, offsetY];

//                        console.log('point' + position);

                        paper.project.activeLayer.selected = false;

//                        if (self.current_tool == "pen") {
//                            self.setPenColor(settings.color);
//                        }
//
//                        if (self.current_tool == "select") {
//                            self.setSelectIcon();
//                        }

                        if ((self.current_tool == "select" 
                                || self.current_tool == "erase") 
                                && event.item) {
                            event.item.selected = true;
                            selectedItem = event.item;
//                            self.setCursorHandOpen();
                        } else {
                            selectedItem = null;
                        }
//                        console.log(selectedItem);
                    }
                };

                tool.onMouseDown = function (event) {

                    switch (event.event.button) {
                        // leftclick
                        case 0:
                            console.log("mousedown");
                            // If we produced a path before, deselect it:
                            if (path) {
                                path.selected = false;
                            }
                            
                            if (self.current_tool == "pen") {
                                path = new paper.Path();
                                path.data.id = generateUUID();
                                path.strokeColor = settings.color;
                                path.strokeWidth = settings.width;
                                path.opacity = settings.opacity;                                
                            } else if (self.current_tool == "ellipse") {
                                // Implementado en el evento onMouseUp

                            } else if (self.current_tool == "rectangle") {
                                // Implementado en el evento onMouseUp
                                
                            } else if (self.current_tool == "line") {
                                path = new paper.Path();
                                path.data.id = generateUUID();
                                path.strokeColor = settings.color;
                                path.strokeWidth = settings.width;
                                path.opacity = settings.opacity;
                                path.add(event.point);
                            }
                            
                            break;
                            // rightclick
                        case 2:
                            break;
                    }
                };

                tool.onMouseDrag = function (event) {
                    switch (event.event.button) {
                        // leftclick
                        case 0:
                            console.log("mousedrag");
                            // Every drag event, add a point to the path at the current
                            // position of the mouse:
                            
                            if (selectedItem) {
                                if (self.current_tool == "select") {
                                    if (!mouseDownPoint)
                                        mouseDownPoint = selectedItem.position;

    //                                self.setCursorHandClose();
                                    selectedItem.position = new paper.Point(
                                        selectedItem.position.x + event.delta.x,
                                        selectedItem.position.y + event.delta.y
                                    );                                    
                                }
                            } else if (path) {
                                if (self.current_tool == "pen") {
                                    path.add(event.point);
                                } else if (self.current_tool == "ellipse") {

                                } else if (self.current_tool == "rectangle") {

                                } else if (self.current_tool == "line") {
                                    
                                }
                            }
                            break;
                            // rightclick
                        case 2:
                            break;
                    }
                };

                tool.onMouseUp = function (event) {
                    console.log("MouseUp");
                    console.log(event.downPoint);
                    console.log(event.point);
                    console.log(event.delta);
                    
                    switch (event.event.button) {
                        // leftclick
                        case 0:
                            if (selectedItem) {
//                                console.log("... Seleccionado");
                                if (self.current_tool == "select") {
                                    if (mouseDownPoint) {
                                        var selectedItemId = selectedItem.id;
                                        var draggingStartPoint = { x: mouseDownPoint.x, y: mouseDownPoint.y };
                                        CommandManager.execute({
                                            execute: function () {
                                                //item was already moved, so do nothing
                                            },
                                            unexecute: function () {
                                                $(paper.project.activeLayer.children).each(function (index, item) {
                                                    if (item.id == selectedItemId) {
                                                        if (item.segments) {
                                                            var middlePoint = new paper.Point(
                                                                    ((item.segments[item.segments.length - 1].point.x) - item.segments[0].point.x) / 2,
                                                                    ((item.segments[item.segments.length - 1].point.y) - item.segments[0].point.y) / 2
                                                                );
                                                            item.position =
                                                                new paper.Point(draggingStartPoint.x, draggingStartPoint.y);
                                                        }
                                                        else {
                                                            item.position = draggingStartPoint;
                                                        }
                                                        return false;
                                                    }
                                                });
                                            }
                                        });
                                        mouseDownPoint = null;
                                    }
                                } else if (self.current_tool == "erase") {
//                                    console.log("Borrar el elemento:");
//                                    console.log(selectedItem);
                                    self.erase(selectedItem);
                                }
                            } else {
//                                console.log("... No seleccionado");
                                
                                if (self.current_tool == "pen") {
                                    // When the mouse is released, simplify it:
                                    path.simplify();
                                    path.remove();
                                    var strPath = path.exportJSON({ asString: true });
                                    var uid = generateUUID();
                                    CommandManager.execute({
                                        execute: function () {
                                                path = new paper.Path();
                                                path.importJSON(strPath);
                                                path.data.uid = uid;                                                
                                        },
                                        unexecute: function () {
                                            $(paper.project.activeLayer.children).each(function (index, item) {
                                                if (item.data && item.data.uid) {
                                                    if (item.data.uid == uid) {
                                                        item.remove();
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    
                                } else if (self.current_tool == "ellipse") {
                                    console.log("ellipse");
                                    
                                    path = new paper.Path.Ellipse({
                                        center: event.middlePoint,
                                        radius: [Math.abs(event.delta.x / 2), Math.abs(event.delta.y / 2)]
                                    });
                                    path.strokeColor = settings.color;
                                    path.strokeWidth = settings.width;
                                    path.opacity = settings.opacity;
                                    path.data.id = generateUUID();
                                    path.remove();
                                    
                                    // Procedemos a apilar los cambios para el UNDO y REDO con el CommandManager
                                    var strPath = path.exportJSON({ asString: true });
                                    var uid = generateUUID();
                                    CommandManager.execute({
                                        execute: function () {
//                                            if (!path || !path.data.uid || path.data.uid != uid) {
                                                path = new paper.Path();
                                                path.importJSON(strPath);
                                                path.data.uid = uid;                                                
//                                            }
                                        },
                                        unexecute: function () {
//                                            console.log("<<< UNDO >>>");
                                            $(paper.project.activeLayer.children).each(function (index, item) {
                                                if (item.data && item.data.uid) {
                                                    if (item.data.uid == uid) {
                                                        item.remove();
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    
                                } else if (self.current_tool == "rectangle") {
                                    path = new paper.Path.Rectangle(event.downPoint, event.point);
                                    path.strokeColor = settings.color;
                                    path.strokeWidth = settings.width;
                                    path.opacity = settings.opacity;
                                    
                                    path.data.id = generateUUID();
                                    path.remove();
                                    
                                    // Procedemos a apilar los cambios para el UNDO y REDO con el CommandManager
                                    var strPath = path.exportJSON({ asString: true });
                                    var uid = generateUUID();
                                    CommandManager.execute({
                                        execute: function () {
                                            path = new paper.Path();
                                            path.importJSON(strPath);
                                            path.data.uid = uid;
                                        },
                                        unexecute: function () {
                                            $(paper.project.activeLayer.children).each(function (index, item) {
                                                if (item.data && item.data.uid) {
                                                    if (item.data.uid == uid) {
                                                        item.remove();
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    
                                } else if (self.current_tool == "line") {
                                    path.add(event.point);                                    
                                    path.remove();
                                    
                                    // Procedemos a apilar los cambios para el UNDO y REDO con el CommandManager
                                    var strPath = path.exportJSON({ asString: true });
                                    var uid = generateUUID();
                                    CommandManager.execute({
                                        execute: function () {
                                            path = new paper.Path();
                                            path.importJSON(strPath);
                                            path.data.uid = uid;
                                        },
                                        unexecute: function () {
                                            $(paper.project.activeLayer.children).each(function (index, item) {
                                                if (item.data && item.data.uid) {
                                                    if (item.data.uid == uid) {
                                                        item.remove();
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            break;
                            // rightclick
                        case 2:
                            contextPoint = event.point;
                            contextSelectedItemId = selectedItem ? selectedItem.data.id : '';
                            break;
                    }
                };

                tool.onKeyUp = function (event) {
                    if (selectedItem) {
                        // When a key is released, set the content of the text item:
                        console.log(' event key 1');
						
                        if (selectedItem.content) {
                            if (event.key == 'backspace')
                                selectedItem.content = selectedItem.content.slice(0, -1);
                            else {
                                selectedItem.content = selectedItem.content.replace('<some text>', '');
                                if (event.key == 'space') {
                                    selectedItem.content += ' ';
                                } else if (event.key.length == 1){
                                    selectedItem.content += event.key;									
                                }
                            }
                        }
                    }
                };

                // Draw the view now:
                paper.view.draw();
            });
        };

        var path;
        var position;
        var contextPoint;
        var contextSelectedItemId;
        var selectedItem;
        var mouseDownPoint;

//        this.erase = function () {
//            var strPathArray = new Array();
//            $(paper.project.activeLayer.children).each(function (index, item) {
//                if (contextSelectedItemId) {
//                    if (contextSelectedItemId.length == 0 || item.data.id == contextSelectedItemId) {
//                        var strPath = item.exportJSON({ asString: true });
//                        strPathArray.push(strPath);
//                    }
//                }
//            });
//            
//            CommandManager.execute({
//                execute: function () {
//                    $(paper.project.activeLayer.children).each(function (index, item) {
//                        if (contextSelectedItemId) {
//                            if (contextSelectedItemId.length == 0 || item.data.id == contextSelectedItemId) {
//                                item.remove();
//                            }
//                        }
//                    });
//                },
//                unexecute: function () {
//                    $(strPathArray).each(function (index, strPath) {
//                        path = new paper.Path();
//                        path.importJSON(strPath);
//                    });
//                }
//            });
//        };

        this.erase = function (element) {
            if (element && element.data.id) {
                var clone_element = null;
                $(paper.project.activeLayer.children).each(function (index, item) {
                    if (element.data.id == item.data.id) {
                        clone_element = item.exportJSON({ asString: true });
                    }
                });
                CommandManager.execute({
                    execute: function () {
                        $(paper.project.activeLayer.children).each(function (index, item) {
                            if (element.data.id == item.data.id) {
                                item.remove();
                                console.log("Item Eliminado!!!");
                            }
                        });
                    },
                    unexecute: function () {
                        path = new paper.Path();
                        path.importJSON(clone_element);
                    }
                });
            } else {
                console.log("Ninguna accion realizada!");
            }
        };

        this.downloadCanvas = function (canvas, filename) {

            /// create an "off-screen" anchor tag
            var lnk = document.createElement('a'),
                e;

            /// the key here is to set the download attribute of the a tag
            lnk.download = filename;

            /// convert canvas content to data-uri for link. When download
            /// attribute is set the content pointed to by link will be
            /// pushed as "download" in HTML5 capable browsers
            lnk.href = canvas.toDataURL();

            /// create a "fake" click-event to trigger the download
            if (document.createEvent) {

                e = document.createEvent("MouseEvents");
                e.initMouseEvent("click", true, true, window,
                                 0, 0, 0, 0, 0, false, false, false,
                                 false, 0, null);

                lnk.dispatchEvent(e);

            } else if (lnk.fireEvent) {

                lnk.fireEvent("onclick");
            }
        };

        this.download = function () {
            var canvas = paper.project.activeLayer.view.element;
            var img = $(canvas).parent().find('img')[0];
            var mergeCanvas = $('<canvas>')
            .attr({
                width: $(img).width(),
                height: $(img).height()
            });

            var mergedContext = mergeCanvas[0].getContext('2d');
            mergedContext.clearRect(0, 0, $(img).width(), $(img).height());
            mergedContext.drawImage(img, 0, 0);

            mergedContext.drawImage(canvas, 0, 0);

            self.downloadCanvas(mergeCanvas[0], "image-markup.png");
        };
        
        this.custom_downloadCanvas = function (canvas, success_function) {
            console.log("canvas");
            console.log(canvas);
            
            var dataURL = canvas.toDataURL("image/png");
            
            console.log("toDateURL");
            console.log(dataURL);
            
            var result = null;
            
            $.ajax({
                type: "POST",
                url: "php/upload.php",
                async: false,
                dataType: "json",
                data: { 
                    img_base64: dataURL
                },
                beforeSend: function() {
                    // agregar mensaje de "loading"
                    $("#img_editor_loading").html("<span class='wait'>... saving changes ...</span>");
                },
                complete: function() {
                    // remove loading
                    $("#img_editor_loading").html("");
                },
                success: function(data) {
                    console.log("data");
                    console.log(data);
                    
                    if (!data['error'] && data['new_img_url']) {
                        result = data['new_img_url'];
                    }
                    success_function(result);
                    
                },
                error: function(xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        };
        
        this.custom_download = function (success_function) {
            var canvas = paper.project.activeLayer.view.element;
            var img = $(canvas).parent().find('img')[0];
            var mergeCanvas = $('<canvas>')
            .attr({
                width: $(img).width(),
                height: $(img).height()
            });

            var mergedContext = mergeCanvas[0].getContext('2d');
            mergedContext.clearRect(0, 0, $(img).width(), $(img).height());
            mergedContext.drawImage(img, 0, 0);

            mergedContext.drawImage(canvas, 0, 0);

            self.custom_downloadCanvas(mergeCanvas[0], success_function);
        };

        this.setText = function () {
            var uid = generateUUID();
//            var pos = contextPoint;
            var pos = {x: 0, y: 30};
            
            CommandManager.execute({
                execute: function () {
                    var TXT_DBL_CLICK = '[ Edit me ]';// "<<double click to edit>>";
                    var txt = TXT_DBL_CLICK;
                    var text = new paper.PointText(pos);
                    text.content = txt;
                    text.fillColor = settings.color;
                    text.fontSize = 18;
                    text.fontFamily = 'Verdana';
                    text.data.uid = uid;
                    text.opacity = settings.opacity;

                    text.onDoubleClick = function (event) {
                        if (this.className == 'PointText') {
                            var txt = prompt("Type in your text", this.content.replace(TXT_DBL_CLICK, ''));
                            if (txt && txt.length > 0)
                                this.content = txt;
                        }
                    }
                },
                unexecute: function () {
                    $(paper.project.activeLayer.children).each(function (index, item) {
                        if (item.data && item.data.uid) {
                            if (item.data.uid == uid) {
                                item.remove();
                            }
                        }
                    });
                }
            });

        };
        
        this.setSelectIcon = function () {
            $('.image-markup-canvas').css('cursor', "url(img/layer-select.png) 12 12, auto");
        };

        this.setPenColor = function (color) {
            self.setOptions({ color: color });
//            $('.image-markup-canvas').css('cursor', "url(img/" + color + "-pen.png) 14 50, auto");
            $('.image-markup-canvas').css('cursor', "url(img/layer-pen.png) 2 23, auto");
        };
        
        this.setPenIcon = function () {
            $('.image-markup-canvas').css('cursor', "url(img/layer-pen.png) 2 23, auto");
        };
        
        this.setEraserIcon = function () {
            $('.image-markup-canvas').css('cursor', "url(img/layer-eraser.png) 2 23, auto");
        };

        this.setCursorHandOpen = function () {
            $('.image-markup-canvas').css('cursor', "url(img/hand-open.png) 25 25, auto");
        };

        this.setCursorHandClose = function () {
            $('.image-markup-canvas').css('cursor', "url(img/hand-close.png) 25 25, auto");
        };

        $.contextMenu({
            selector: '.image-markup-canvas',
            callback: function (key, options) {
                switch (key) {
                    //COMMANDS
                    case 'undo':
                        CommandManager.undo();
                        break;
                    case 'redo':
                        CommandManager.redo();
                        break;
                    case 'erase':
                        self.erase();
                        break;
                    case 'download':
                        self.download();
                        break;
                        //TOOLS
                    case 'text':
                        self.setText();
                        break;
                        //PENS
                    case 'blackPen':
                        self.setPenColor('black');
                        break;
                    case 'redPen':
                        self.setPenColor('red');
                        break;
                    case 'greenPen':
                        self.setPenColor('green');
                        break;
                    case 'bluePen':
                        self.setPenColor('blue');
                        break;
                    case 'yellowPen':
                        self.setPenColor('yellow');
                        break;
                }
            },
            items: {
                "undo": { name: "Undo", icon: "undo" },
                "redo": { name: "Redo", icon: "redo" },
                "erase": { name: "Erase", icon: "erase" },
                "download": { name: "Download", icon: "download" },
                "sep1": "---------",
                "text": { name: "Text", icon: "text" },
                "sep2": "---------",
                "blackPen": { name: "Black Pen", icon: "blackpen" },
                "redPen": { name: "Red Pen", icon: "redpen" },
                "greenPen": { name: "Green Pen", icon: "greenpen" },
                "bluePen": { name: "Blue Pen", icon: "bluepen" },
                "yellowPen": { name: "Yellow Pen", icon: "yellowpen" },
            }
        });
        
        return self;
    };
}(jQuery));