# IMG_EDITOR

Plugin para el [CKEditor](http://ckeditor.com/) (v4 y superiores) que permite editar y guardar una imagen. 

# Instalacion
(Los siguientes pasos sirven para instalar cualquier plugin del ckeditor)

En el ckeditor, ir a la carpeta "plugins" y colocar allí una carpeta "img_editor" con todos los archivos del repositorio.
Luego en config.js del ckeditor agregar "img_editor" a la linea de codigo correspondiente a la carga de plugins:
```javascript
config.extraPlugins = 'img_editor';
```
# Uso
Click derecho sobre la imagen a editar y seleccionar __"Edit Image"__.

Se desplegará un editor con varias herramientas que permitiran realizar muchas acciones sobre la imagen, como ser: dibujar una linea, un rectangulo, un circulo o ingresar texto. 
Cada edicion es creada como una "capa" y puede ser movida o removida independientemente del resto. Tambien se cuenta con una seleccion de colores disponibles para realizar los trazos.

Cuando se quiera finalizar la edicion, se proporciona la opcion de exportar la imagen editada como una nueva imagen PNG (boton "Guardar" en la barra de herramientas), o tambien reemplazar la imagen original con la editada (boton "Save and Replace").

_OJO: La imagen puede ser reemplazada siempre y cuando la imagen original este almacenada en el servidor._
