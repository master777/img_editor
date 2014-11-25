<?php

require_once './config.php';

//// PRUEBAS
//echo $_SERVER['DOCUMENT_ROOT'];
//echo "<br/>";
//echo $config['base_dir'];
//exit();

//echo uniqid();
//echo "<br/>";
//echo date("YmdHis");
//exit();

// ===============================================

// Configuraciones Generales

error_reporting(0);

$result = array();

//$img_url = $_POST['img_url'];
if (!empty($_POST)) {
    $img_base64 = $_POST['img_base64'];    
} else {
    // Imagen codificada de prueba
    $img_base64 = 'data:image/png;base64,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';
}

//echo "Imagen Base64: <br/>";
//echo $img_base64;
//echo "<br/>";
//echo "<br/>";

// Rutas
if (!empty($config)) {
    $upload_dir = $config['base_dir'];
    $upload_url = $config['base_url'];
} else {
    $upload_dir = "upload/";
    $upload_url = preg_replace('/(upload\.php.*)/', 'upload/', $_SERVER['PHP_SELF']);
}

//echo "upload_dir:";
//echo $upload_dir;
//echo "upload_url:";
//echo $upload_url;
//echo "<br/>";

// Nombre de la imagen a guardarse
$name = date("YmdHis");

// ===============================================

// Decodifica la imagen base64 y la guarda en el servidor 

$img = str_replace('data:image/png;base64,', '', $img_base64);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$filename = $name . ".png";

$file = $upload_dir . $filename;
$success = file_put_contents($file, $data);

if ($success) {
    $result['success'] = 'File uploaded successfully' . ' -> ' . $filename;
    $result['new_img_url'] = $upload_url . $filename;
} else {
    $result['error'] = "NO SE PUEDO SUBIR LA IMAGEN!";
//    unlink($file);
}

echo json_encode($result);
exit();

//==================================================
//
//// Sube al servidor una imagen alojada en otro servidor externo
//
////$get_url = 'http://a07.t26.net/avatares/4/7/9/0/120x120_nr_4790334.jpg';
//$url = trim($img_url);
//if ($url) {
//    $file = fopen($url, "rb");
//    $upload_dir = "upload/";
//    $valid_exts = array("jpeg", "gif", "png", "jpg", "JPEG", "bmp");
//    $ext = end(explode(".", strtolower(basename($url))));
//    if (in_array($ext, $valid_exts)) {
//        $filename = "$name.$ext";
//        $newfile = fopen($upload_dir . $filename, "wb");
//        if ($newfile) {
//            while (!feof($file)) {
//                fwrite($newfile, fread($file, 1024 * 8), 1024 * 8);
//            }
//            $result['success'] = 'File uploaded successfully' . ' -> ' . $filename;
//            $result['img_name'] = $filename;
//            $result['base_url'] = preg_replace('/(upload\.php.*)/', 'userfiles/', $_SERVER['PHP_SELF']);
//            $result['base_dir'] = dirname(__FILE__) . '/' . $upload_dir;
//        } else {
//            $result['error'] = 'File does not exists';
//        }
//    } else {
//        $result['error'] = 'Invalid URL';
//    }
//} else {
//    $result['error'] = 'Please enter the URL';
//}
//
//echo json_encode($result);
//exit();


//====================================================

//# The URL for the Image to Transfer
////$imageURL = 'http://server.com/the_image.jpg';
//$imageURL = 'http://a07.t26.net/avatares/4/7/9/0/120x120_nr_4790334.jpg';
//# Folder for Temporary Files
//$tempFilename = $_SERVER['DOCUMENT_ROOT'] . '/tempFiles/';
//
//# Unique Filename
//$tempFilename .= uniqid() . '_' . basename($imageURL);
//
//# Get the Image
//if ($imgContent = @file_get_contents($imageURL)) {
//    if (@file_put_contents($tempFilename, $imgContent)) {
//
////        $facebook->setFileUploadSupport(true);
////        $args = array('message' => 'My Caption');
////        $args['image'] = '@' . realpath($tempFilename);
////
////        $data = $facebook->api('/me/photos', 'post', $args);
//
//        # Once done, delete the Temporary File
//        unlink($tempFilename);
//    } else {
//        # Failed to Save Image
//        echo "NO SE PUDO GUARDAR LA IMAGEN!!";
//    }
//} else {
//    # Failed to Get Image
//    echo "NO SE PUDO OBTENER LA IMAGEN!!";
//}