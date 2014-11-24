<?php

//echo $_SERVER['DOCUMENT_ROOT'];
//
//exit();

//====================================================


error_reporting(0);

$result = array();

//$get_url = $_POST["url"];
$get_url = $_GET['img_url'];
//$get_url = 'http://a07.t26.net/avatares/4/7/9/0/120x120_nr_4790334.jpg';
$url = trim($get_url);
if ($url) {
    $file = fopen($url, "rb");
    $directory = "upload/";
//    $valid_exts = array("php", "jpeg", "gif", "png", "doc", "docx", "jpg", "html", "asp", "xml", "JPEG", "bmp");
    $valid_exts = array("jpeg", "gif", "png", "jpg", "JPEG", "bmp");
    $ext = end(explode(".", strtolower(basename($url))));
    if (in_array($ext, $valid_exts)) {
        $rand = rand(1000, 9999);
        $filename = "$rand.$ext";
        $newfile = fopen($directory . $filename, "wb");
        if ($newfile) {
            while (!feof($file)) {
                fwrite($newfile, fread($file, 1024 * 8), 1024 * 8);
            }
            $result['success'] = 'File uploaded successfully' . ' -> ' . $filename;
            $result['img_name'] = $filename;
            $result['base_url'] = preg_replace('/(upload\.php.*)/', 'userfiles/', $_SERVER['PHP_SELF']);
            $result['base_dir'] = dirname(__FILE__) . '/' . $directory;
        } else {
            $result['error'] = 'File does not exists';
        }
    } else {
        $result['error'] = 'Invalid URL';
    }
} else {
    $result['error'] = 'Please enter the URL';
}

echo json_encode($result);
exit();


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