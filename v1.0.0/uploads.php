<?php
    header('Content-Type: text/html; charset=UTF-8');
    $img_FILE = $_FILES['productImg']['tmp_name'];
    $name = $_FILES['productImg']['name'];
    $ext = strtolower(pathinfo($name,PATHINFO_EXTENSION));
    $img_TYPE = $_POST['productType'];
    $img_NAME = $_POST['productName'];
    $img_INFO = $_POST['productInfo'];
    $img_PRICE = $_POST['productPrice'];
    $time = mktime();
    $img_ID = date("ymdHis",$time+60*60*9);
    $img_FILENAME = $img_ID.".".$ext;
    echo "<script>console.log('".$img_ID.",".$img_FILENAME.",".$img_TYPE.",".$img_NAME.",".$img_INFO.",".$img_PRICE."')</script>";
    //요청 서버 URL 세팅
    $url = "http://13.125.13.189:1880/appapi/SET_PRODUCT/appRequest.do";
    //헤더값 세팅
    $headers = array(
        "Content-Type: application/json"
    );
    //POST 방식으로 보낼 JSON 데이터 생성
    $arr_data = array(
        'actionType' => "INSERT",
        'productId' => $img_ID,
        'productFileName' => $img_FILENAME,
        'productType' => $img_TYPE,
        'productName' => $img_NAME,
        'productInfo' => $img_INFO,
        'productPrice' => $img_PRICE
    );
    //배열을 JSON 데이터로 생성
    $post_data = json_encode($arr_data);
    //CURL 함수 사용
    $ch = curl_init();
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($ch,CURLOPT_URL,$url);
    curl_setopt($ch,CURLOPT_HTTPHEADER, $headers);
    //POST 방식
    curl_setopt($ch,CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch,CURLOPT_POST,true);
    //POST 방식으로 넘길 JSON 데이터
    curl_setopt($ch,CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch,CURLOPT_TIMEOUT,3);

    $response = curl_exec($ch);
    $err = curl_error($ch);

    if($err){
        $curl_data = null; 
    }else { 
        $curl_data = $response; 
    } 
    curl_close($ch);

    // 받은 JSON데이터를 배열로 만듬 
    $json_data = json_decode($curl_data,true); 
    // 응답제어 
    if($json_data["resultCode"] == "0000"){
        error_reporting(E_ALL);
        ini_set("display_errors", 1);
        //echo "success";
        $EXIF = exif_read_data($img_FILE);
        $IMG = imagecreateFromjpeg($img_FILE) or die('Error opening file '.$img_FILE);
        if(!empty($EXIF['Orientation'])){
            switch($EXIF['Orientation']) {
                case 8:
                    $IMG = imagerotate($IMG,90,0);
                    break;
                case 3:
                    $IMG = imagerotate($IMG,180,0);
                    break;
                case 6:
                    $IMG = imagerotate($IMG,-90,0);
                    break;
            }    
        }
        imagejpeg($IMG,$img_FILE);
        $img_DEST = "./".$img_TYPE."/".$img_FILENAME;
        move_uploaded_file($img_FILE,$img_DEST);
        //echo "<script>console.log('".$img_DEST."')</script>";
        Header("Location:/dashboard/dashboard.html");
    }
?>