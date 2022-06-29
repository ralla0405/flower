<?php
    header('Content-Type: text/html; charset=UTF-8');
    $file_NAME = $_POST['deleteName'];
    $img_ID = explode('.',$file_NAME)[0];
    $file_TYPE = $_POST['deleteType'];
    $file_DEST = "./".$file_TYPE."/".$file_NAME;
    //요청 서버 URL 세팅
    $url = "http://13.125.13.189:1880/appapi/SET_PRODUCT/appRequest.do";
    //헤더값 세팅
    $headers = array(
        "Content-Type: application/json"
    );
    //POST 방식으로 보낼 JSON 데이터 생성
    $arr_data = array(
        'actionType' => "DELETE",
        'productId' => $img_ID
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
        unlink($file_DEST);
        Header("Location:./index.html");
    }
?>