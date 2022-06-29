<?php
    header('Content-Type: text/html; charset=UTF-8');
    $img_FILE = $_FILES['updateImg']['tmp_name'];
    $name = $_FILES['updateImg']['name'];
    $ext = strtolower(pathinfo($name,PATHINFO_EXTENSION));
    $img_PRENAME = $_POST['updatePreImg'];
    $img_ID = explode('.',$img_PRENAME)[0];
    $img_FILENAME = $img_ID.".".$ext;
    $img_TYPE = $_POST['updateType'];
    $img_NAME = $_POST['updateName'];
    $img_INFO = $_POST['updateInfo'];
    $img_PRICE = $_POST['updatePrice'];
    // 기존 경로 설정
    $img_PRETYPE = $_POST['updatePreType'];
    $img_PRENAME = $_POST['updatePreImg'];
    $delete_DEST = "./".$img_PRETYPE."/".$img_PRENAME;
    echo "<script>console.log('".$img_DEST."')</script>";
    //요청 서버 URL 세팅
    $url = "http://13.125.13.189:1880/appapi/SET_PRODUCT/appRequest.do";
    //헤더값 세팅
    $headers = array(
        "Content-Type: application/json"
    );
    //POST 방식으로 보낼 JSON 데이터 생성
    $arr_data = array(
        'actionType' => "UPDATE",
        'productId' => $img_ID,
        'productFileName' => $img_PRENAME,
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
        //이미지가 변경될 경우에만 업로드
        if($img_FILE){
            //기존 이미지 삭제
            unlink($delete_DEST);
            //이미지 업로드
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
        }else{
            $img_DEST = "./".$img_TYPE."/".$img_PRENAME;
            rename($delete_DEST,$img_DEST);
        }
        Header("Location:/dashboard/dashboard.html");
    }
?>