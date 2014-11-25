<?php

// Ruta absoluta donde se guardaran las imagenes modificadas con el Image Markup.
// Ejemplo:
// $config['base_dir'] = 'D:\xampp\htdocs\ckeditor\ckeditor\plugins\img_editor\dialogs\ImageMarkup\php/upload/'
$config['base_dir'] = dirname(__FILE__) . '/upload/'; // (Default Value)
//$config['base_dir'] = 'D:\xampp\htdocs\ckeditor\z-upload/';

// URL absoluta correspondiente a la ruta anterior.
// Ejemplo:
// $config['base_url'] = 'http://localhost/ckeditor/ckeditor/plugins/img_editor/dialogs/ImageMarkup/php/upload/';
$config['base_url'] = preg_replace('/(upload\.php.*)/', 'upload/', $_SERVER['PHP_SELF']); // (Default Value)
//$config['base_url'] = 'http://localhost/ckeditor/z-upload/';
