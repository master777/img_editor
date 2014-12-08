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
                                
                                path = new paper.Path.Ellipse({
                                    center: event.point,
                                    radius: [0, 0]
                                });
                                path.strokeColor = settings.color;
                                path.strokeWidth = settings.width;
                                path.opacity = settings.opacity;

                            } else if (self.current_tool == "rectangle") {
                                // Implementado en el evento onMouseUp
                                
                                path = new paper.Path.Rectangle(event.point, event.point);
                                path.strokeColor = settings.color;
                                path.strokeWidth = settings.width;
                                path.opacity = settings.opacity;
                                
                            } else if (self.current_tool == "line") {
                                path = new paper.Path();
                                path.data.id = generateUUID();
                                path.strokeColor = settings.color;
                                path.strokeWidth = settings.width;
                                path.opacity = settings.opacity;
                                path.add(event.point);
                                
                            } else if (self.current_tool == "arrow") {
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
                            } else {
                                if (self.current_tool == "pen") {
                                    if (path) {
                                        path.add(event.point);                                        
                                    }
                                } else if (self.current_tool == "ellipse") {
                                    if (path) {
                                        path.remove() ;
                                    } 
                                    path = new paper.Path.Rectangle(event.downPoint, event.point);
                                    path.strokeColor = settings.color;
                                    path.strokeWidth = 1;
                                    path.strokeCap = 'round';
                                    path.opacity = settings.opacity;
                                    path.dashArray = [10, 4];
                                    
                                } else if (self.current_tool == "rectangle") {
                                    if (path) {
                                        path.remove();
                                    }
                                    path = new paper.Path.Rectangle(event.downPoint, event.point);
                                    path.strokeColor = settings.color;
                                    path.strokeWidth = settings.width;
                                    path.opacity = settings.opacity;
                                    
                                } else if (self.current_tool == "line") {
                                    if (path) {
                                        if (!path.segments[1]) {
                                            path.add(event.point);
                                        } else {
                                            path.segments[1].point = event.point;
                                        }                                        
                                    }
                                } else if (self.current_tool == "arrow") {
                                    if (path) {
                                        if (!path.segments[1]) {
                                            path.add(event.point);
                                        } else {
                                            path.segments[1].point = event.point;
                                        }                                        
                                    }
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
                                    
                                    if (path) {
                                        path.remove();
                                    }
                                    
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
                                    
                                } else if (self.current_tool == "rectangle") {
                                    if (path) {
                                        path.remove();
                                    }
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
                                    if (!path.segments[1]) {
                                        path.segments[1].point = event.point;
                                    } else {
                                        path.add(event.point);                                        
                                    }
                                    
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
                                } else if (self.current_tool == "arrow") {
                                    if (!path.segments[1]) {
                                        path.segments[1].point = event.point;
                                    } else {
                                        path.add(event.point);                                        
                                    }                                    
                                    
                                    var line_start = new paper.Point(path.segments[0].point);
                                    var line_end = new paper.Point(path.segments[1].point);
                                    
                                    var arrow_start = new paper.Point(event.delta);
                                    arrow_start.x = arrow_start.x / 7;
                                    arrow_start.y = arrow_start.y / 7;
                                    
                                    console.log("inicio: " + line_start);
                                    console.log("fin: " + line_end);
                                    console.log("medio: " + arrow_start);
                                    
                                    // Primer extremo de la fecha
                                    var first_end = new paper.Point();
                                    first_end.x = line_end.x + arrow_start.rotate(135).x;
                                    first_end.y = line_end.y + arrow_start.rotate(135).y;
                                    // Segundo extremo de la fecha
                                    var second_end = new paper.Point();
                                    second_end.x = line_end.x + arrow_start.rotate(-135).x;
                                    second_end.y = line_end.y + arrow_start.rotate(-135).y;
                                                                        
                                    var arrow = new paper.Path([
                                        first_end,
                                        line_end,
                                        second_end
                                    ]);
                                    arrow.data.id = path.data.id;
                                    arrow.strokeWidth = settings.width;
                                    arrow.strokeColor = settings.color;
                                    
                                    // Flecha en su totalidad
                                    var complete_arrow = new paper.Group({
                                        children: [path, arrow]
                                    });
                                    complete_arrow.strokeWidth = settings.width;
                                    complete_arrow.strokeColor = settings.color;
                                    complete_arrow.opacity = settings.opacity;
                                    complete_arrow.data.id = path.data.id;
                                    complete_arrow.remove();
                                                                                                            
                                    // Procedemos a apilar los cambios para el UNDO y REDO con el CommandManager
                                    var strPath = complete_arrow.exportJSON({ asString: true });
                                    var uid = generateUUID();
                                    CommandManager.execute({
                                        execute: function () {
                                            path = new paper.Group();
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
            paper.view.draw();
        };
        
        this.erase_all = function () {
            var all_elements = new Array();
            $(paper.project.activeLayer.children).each(function (index, item) {                
                var clone_element = item.exportJSON({ asString: true });
                all_elements.push(clone_element);
            });
            CommandManager.execute({
                execute: function () {
                    // Removemos todos los elementos Path
                    $(paper.project.activeLayer.children).each(function (index, item) {                        
                        item.remove();
                        console.log("Item eliminado...");                        
                    });
                },
                unexecute: function () {
                    // Recuperamos todos los elementos Path borrados
                    $(all_elements).each(function (index, element) {
                        path = new paper.Path();
                        path.importJSON(element);
                    });                    
                }
            });
            paper.view.draw();
        };

        this.downloadCanvas = function (canvas, filename) {

            /// create an "off-screen" anchor tag
            var lnk = document.createElement('a'),
                e;

            /// the key here is to set the download attribute of the a tag
            lnk.download = filename;
            
            try {                
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
            } catch(error) {
                alert("Sorry, it was not possible download the image!");
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

            self.downloadCanvas(mergeCanvas[0], "my_edited_image.png");
        };
        
        this.custom_downloadCanvas = function (canvas, success_function) {
            console.log("canvas");
            console.log(canvas);
            
            try {
                var dataURL = canvas.toDataURL("image/png");

                console.log("toDateURL");
                console.log(dataURL);

                var result = null;
                $("#img-container").hide();
//                $("#toolbar").hide();
                $("#img-loading").show();

//                $("#img-container").css('display','none'); 
//                $("#img-loading").css('display','block'); 
                
                $.ajax({
                    type: "POST",
                    url: "php/upload.php",
//                    async: false,
                    async: true,
                    dataType: "json",
                    data: { 
                        img_base64: dataURL
                    },
                    beforeSend: function() {
                        // agregar mensaje de "loading"
//                        $("#img_editor_loading").html("<span class='wait'>... saving changes ...</span>");

    //                    $("body").append('<div id="img_editor_wait_screen" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5);"><div id="doksoft_easy_image_panel" style="position: absolute; border: 1px solid black; top: 50%; left: 50%; width: 300px; height: 40px; margin: -20px 0 0 -150px; background: #fff; padding: 10px;">'
    //                        + '<center><span>Please wait...</span></center>'
    //                        + '</div></div>');
                    },
                    complete: function() {
                        // remove loading
//                        $("#img_editor_loading").html("");
    //                    $("#img_editor_wait_loading").remove();
                        is_locked = false;
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
    //                    var err = eval("(" + xhr.responseText + ")");
    //                    alert(err.Message);
                        alert("An unexpected error occurred on the server. Please try later!");
                    }
                });
            } catch(error) {
                alert("Sorry, it was not possible save the image!");
            }            
        };
        
        this.custom_download = function (success_function) {
            is_locked = true;
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
                    text.data.id = uid;
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
            $('.image-markup-canvas').css('cursor', "url(img/layer-pen.png) 2 23, auto");
        };
        
        this.setPenIcon = function () {
            $('.image-markup-canvas').css('cursor', "url(img/layer-pen.png) 2 23, auto");
        };
        
        this.setArrowIcon = function () {
            $('.image-markup-canvas').css('cursor', "url(img/layer-arrow2.png) 2 23, auto");
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
        
        return self;
    };
}(jQuery));