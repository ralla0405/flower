var serverUrl = "https://www.sinho2016.com:444";
var authType = getCookie("authType");
var fileName = "nothing";
var upload = false;
window.onload = function(){
    if(authType == 'ADMIN'){
        $(".title div").show();
    }
    //공지사항 가져오기
    GET_NOTICE();
    //전체 제품 가져오기
    GET_PRODUCT("ALL");
    //닫기 버튼 클릭시
    $(".formX").click(function(){
        $(".animationDiv").hide();
    });
    //카테고리 별 제품 가져오기
    $(".colTitle").click(function(){
        var productType = $(this).attr("value");
        //클래스 변경하여 CSS 적용
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            GET_PRODUCT("ALL");
        }else{
            $(this).parent("div").siblings().children(".colTitle").removeClass("active");
            $(this).addClass("active");
            //카테고리 별로 가져오기
            if(productType == "동양란"){
                GET_PRODUCT("orientalPlant");
            }else if(productType == "서양란"){
                GET_PRODUCT("westernPlant");
            }else if(productType == "관엽"){
                GET_PRODUCT("housePlant");
            }else if(productType == "기타"){
                GET_PRODUCT("finishedPlant");
            }
        }
    });
    //공지사항등록 폼 열기
    $(".noticeBtn").click(function(){
        $(".notice").show();
        var title = $(".noticeTitle").html();
        var content = $(".noticeContent").html();
        $(".noticeTitleInput").val(title);
        $(".noticeContentInput").val(content);
    });
    //공지사항 등록 버튼 클릭시
    $(".noticeInsertBtn").click(function(){
        //서버에 공지사항 등록
        var id = "ADMIN";
        var title = $(".noticeTitleInput").val();
        var content = $(".noticeContentInput").val();
        var msg = JSON.stringify({"actionType": "INSERT","id":id, "title":title, "content":content});
        var Url = serverUrl+"/appapi/SET_NOTICE/appRequest.do";
        var xhr = new XMLHttpRequest();
        xhr.open('POST', Url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(msg);
        xhr.onreadystatechange = processRequest;
        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.resultCode == "0000") {  //정상 처리되었습니다. 
                    alert(response.resultMessage);
                    location.reload();
                }
            }
        }
    });
    //회원가입승인 폼 열기
    $(".userBtn").click(function(){
        $(".list").empty();
        $(".userList").show();
        var msg = JSON.stringify({});
        var Url = serverUrl+"/appapi/GET_USER/appRequest.do";
        var xhr = new XMLHttpRequest();
        xhr.open('POST', Url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(msg);
        xhr.onreadystatechange = processRequest;
        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.resultCode == "0000") {  //정상 처리되었습니다. 
                    var resultData = response.resultData;
                    var nCnt = 0;
                    for(var i=0; i<resultData.length;i++){
                        if(resultData[i].flag == "N"){
                            nCnt++;
                            $(".list").append("<div class='listDiv'><b>사업자번호: </b><span id='num'>"+resultData[i].companyNumber+"</span><b> 사업자 명: </b><span>"+resultData[i].companyName+"</span><input type='checkbox' name='userCheck' value='"+resultData[i].companyNumber+"'></div>");
                        }
                    }
                    //승인할 사업자가 없을경우
                    if(nCnt == 0){
                        $(".list").append("<h3>승인할 회원이 없습니다.</h3>");
                    }
                    //회원가입승인 버튼 클릭시
                    $(".userApprovedBtn").click(function(){
                        var companyNumber = [];
                        for(var i=0; i<nCnt; i++){
                            var number = $("input:checkbox[name='userCheck']:checked").parent(".listDiv").children("#num").eq(i).text();
                            if(number){
                                companyNumber.push(number);
                                number = "";
                            } 
                        }
                        if(companyNumber.length == 0){
                            alert("체크를 확인하고 승인을 눌러주세요.");
                        }else{
                            var msg = JSON.stringify({'actionType': "APPROVE", 'companyNumber': companyNumber});
                            var Url = serverUrl+"/appapi/SET_USER_APPROVE/appRequest.do";
                            var xhr = new XMLHttpRequest();
                            xhr.open('POST', Url, true);
                            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                            xhr.send(msg);
                            xhr.onreadystatechange = processRequest;
                            function processRequest(e) {
                                if (xhr.readyState == 4 && xhr.status == 200) {
                                    var response = JSON.parse(xhr.responseText);
                                    if (response.resultCode == "0000") {  //정상 처리되었습니다. 
                                        alert(response.resultMessage);
                                        location.reload();
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
    });
    //회원정보다운 클릭 시
    $(".userListDown").click(function(){
        var msg = JSON.stringify({});
        var Url = serverUrl+"/appapi/GET_USER/appRequest.do";
        var xhr = new XMLHttpRequest();
        xhr.open('POST', Url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(msg);
        xhr.onreadystatechange = processRequest;
        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.resultCode == "0000") {  //정상 처리되었습니다. 
                    var resultData = response.resultData;
                    var cnt = 0;
                    for(var i=0; i<resultData.length;i++){
                        if(resultData[i].authType == "USER"){
                            cnt++;
                            var rowdata = "<tr>";
                            rowdata += "<th>"+cnt+"</th>";
                            rowdata += "<td>"+resultData[i].companyNumber+"</th>";
                            rowdata += "<td>"+resultData[i].companyName+"</td>";
                            rowdata += "<td>"+resultData[i].companyAddress+"</td>";
                            rowdata += "<td>"+resultData[i].email+"</td>";
                            rowdata += "<td>"+resultData[i].name+"</td>";
                            rowdata += "<td>"+resultData[i].phone+"</td>";
                            rowdata += "</tr>";
                            $(".tbody").append(rowdata);
                        }
                    }
                    excelDown('table','회원정보');
                }
            }
        }
    });
    //제품 업로드 폼 열기
    $(".imgBtn").click(function(){
        $(".upload").show();
    });
    //이미지 미리보기
    $(".productImg").change(function(e){
        loadImage(
            this.files[0],
            function(img,data){
                $('.productPreview').attr('src', img.toDataURL("image/jpeg")); 
                $(".productPreview").show();
            },
            {
                meta: true,
                canvas: true,
                orientation: true
            }
        )
    });
    //수정 이미지 미리보기
    $(".updateImg").change(function(e){
        loadImage(
            this.files[0],
            function(img,data){
                $('.updatePreview').attr('src', img.toDataURL("image/jpeg")); 
                $(".updatePreview").show();
            },
            {
                meta: true,
                canvas: true,
                orientation: true
            }
        )
    });
    //로그아웃 버튼 클릭시
    $(".logoutBtn").click(function(){
        deleteCookie("authType");
        deleteCookie("checkLogin");
        deleteCookie("companyNumber");
        location.replace("../index.html");
    });
}
//공지사항 가져오기
function GET_NOTICE(){
//서버에 공지사항 등록
    var id = "ADMIN";
    var msg = JSON.stringify({"id":id});
    var Url = serverUrl+"/appapi/GET_NOTICE/appRequest.do";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', Url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(msg);
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.resultCode == "0000") {  //정상 처리되었습니다. 
                $(".noticeTitle").html(response.resultList.title);
                $(".noticeContent").html(response.resultList.content);
            }else if(response.resultCode == "9999"){ //서버 오류입니다.
                alert(response.resultMessage);
            }
        }
    }
}
//제품 가져오기
function GET_PRODUCT(actionType){ 
    //product 전체 지우기
    $(".colContents").empty();
    var msg = JSON.stringify({'actionType' : actionType});
    var Url = serverUrl+"/appapi/GET_PRODUCT/appRequest.do";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', Url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(msg);
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.resultCode == "0000") {  //정상 처리되었습니다
                var dataLength = response.resultList.length;
                
                if(actionType == "ALL"){
                    for(var i=0; i<dataLength; i++){
                        var productId = response.resultList[i].productId;
                        var productFileName = response.resultList[i].productFileName;
                        var productType = response.resultList[i].productType;
                        var productName = response.resultList[i].productName;
                        var productInfo = response.resultList[i].productInfo;
                        var productPrice = response.resultList[i].productPrice;
                        productPrice = numberWithCommas(productPrice);

                        if(authType == "ADMIN"){
                            if(productType == "orientalPlant"){
                                $(".orientalPlant").append("<div class='product'>"
                                                          +"<img id='"+productId+"' src='/orientalPlant/"+productFileName+"'>"
                                                          +"<form method='post' action='/delete.php'>"
                                                          +"<input type='text' class='deleteName' name='deleteName' value='"+productFileName+"'>"
                                                          +"<input type='text' class='deleteType' name='deleteType' value='orientalPlant'>"
                                                          +"<input type='submit' class='deleteBtn' value='X'>"
                                                          +"</form>"
                                                          +"<span class='contentsName'>"+productName+"</span>"
                                                          +"<span class='contentInfo'>"+productInfo+"</span>"
                                                          +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                          +"</div>");
                            }else if(productType == "westernPlant"){
                                $(".westernPlant").append("<div class='product'>"
                                                         +"<img id='"+productId+"' src='/westernPlant/"+productFileName+"'>"
                                                         +"<form method='post' action='/delete.php'>"
                                                         +"<input type='text' class='deleteName' name='deleteName' value='"+productFileName+"'>"
                                                         +"<input type='text' class='deleteType' name='deleteType' value='westernPlant'>"
                                                         +"<input type='submit' class='deleteBtn' value='X'>"
                                                         +"</form>"
                                                         +"<span class='contentsName'>"+productName+"</span>"
                                                         +"<span class='contentInfo'>"+productInfo+"</span>"
                                                         +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                         +"</div>");
                            }else if(productType == "housePlant"){
                                $(".housePlant").append("<div class='product'>"
                                                       +"<img id='"+productId+"' src='/housePlant/"+productFileName+"'>"
                                                       +"<form method='post' action='/delete.php'>"
                                                       +"<input type='text' class='deleteName' name='deleteName' value='"+productFileName+"'>"
                                                       +"<input type='text' class='deleteType' name='deleteType' value='housePlant'>"
                                                       +"<input type='submit' class='deleteBtn' value='X'>"
                                                       +"</form>"
                                                       +"<span class='contentsName'>"+productName+"</span>"
                                                       +"<span class='contentInfo'>"+productInfo+"</span>"
                                                       +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                       +"</div>");
                            }else if(productType == "finishedPlant"){
                                $(".finishedPlant").append("<div class='product'>"
                                                          +"<img id='"+productId+"' src='/finishedPlant/"+productFileName+"'>"
                                                          +"<form method='post' action='/delete.php'>"
                                                          +"<input type='text' class='deleteName' name='deleteName' value='"+productFileName+"'>"
                                                          +"<input type='text' class='deleteType' name='deleteType' value='finishedPlant'>"
                                                          +"<input type='submit' class='deleteBtn' value='X'>"
                                                          +"</form>"
                                                          +"<span class='contentsName'>"+productName+"</span>"
                                                          +"<span class='contentInfo'>"+productInfo+"</span>"
                                                          +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                          +"</div>");
                            }
                        }
                        //일반 사용자일 때
                        else{
                            if(productType == "orientalPlant"){
                                $(".orientalPlant").append("<div class='product'>"
                                                          +"<img id='"+productId+"' src='/orientalPlant/"+productFileName+"'>"
                                                          +"<span class='contentsName'>"+productName+"</span>"
                                                          +"<span class='contentInfo'>"+productInfo+"</span>"
                                                          +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                          +"</div>");
                            }else if(productType == "westernPlant"){
                                $(".westernPlant").append("<div class='product'>"
                                                         +"<img id='"+productId+"' src='/westernPlant/"+productFileName+"'>"
                                                         +"<span class='contentsName'>"+productName+"</span>"
                                                         +"<span class='contentInfo'>"+productInfo+"</span>"
                                                         +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                         +"</div>");
                            }else if(productType == "housePlant"){
                                $(".housePlant").append("<div class='product'>"
                                                       +"<img id='"+productId+"' src='/housePlant/"+productFileName+"'>"
                                                       +"<span class='contentsName'>"+productName+"</span>"
                                                       +"<span class='contentInfo'>"+productInfo+"</span>"
                                                       +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                       +"</div>");
                            }else if(productType == "finishedPlant"){
                                $(".finishedPlant").append("<div class='product'>"
                                                          +"<img id='"+productId+"' src='/finishedPlant/"+productFileName+"'>"
                                                          +"<span class='contentsName'>"+productName+"</span>"
                                                          +"<span class='contentInfo'>"+productInfo+"</span>"
                                                          +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                          +"</div>");
                            }
                        } 
                    }
                }else{
                    for(var i=0; i<dataLength; i++){
                        var productId = response.resultList[i].productId;
                        var productFileName = response.resultList[i].productFileName;
                        var productType = response.resultList[i].productType;
                        var productName = response.resultList[i].productName;
                        var productInfo = response.resultList[i].productInfo;
                        var productPrice = response.resultList[i].productPrice;
                        productPrice = numberWithCommas(productPrice);
                        var index = i%4;
                        if(authType == "ADMIN"){
                            if(index == 0){
                                TYPE_SET_PRODUCT_ADMIN(".orientalPlant");
                            }else if(index == 1){
                                TYPE_SET_PRODUCT_ADMIN(".westernPlant");
                            }else if(index == 2){
                                TYPE_SET_PRODUCT_ADMIN(".housePlant");
                            }else if(index == 3){
                                TYPE_SET_PRODUCT_ADMIN(".finishedPlant");
                            }
                            function TYPE_SET_PRODUCT_ADMIN(type){
                                if(productType == "orientalPlant"){
                                    $(type).append("<div class='product'>"
                                                              +"<img id='"+productId+"' src='/orientalPlant/"+productFileName+"'>"
                                                              +"<form method='post' action='/delete.php'>"
                                                              +"<input type='text' class='deleteName' name='deleteName' value='"+productFileName+"'>"
                                                              +"<input type='text' class='deleteType' name='deleteType' value='orientalPlant'>"
                                                              +"<input type='submit' class='deleteBtn' value='X'>"
                                                              +"</form>"
                                                              +"<span class='contentsName'>"+productName+"</span>"
                                                              +"<span class='contentInfo'>"+productInfo+"</span>"
                                                              +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                              +"</div>");
                                }else if(productType == "westernPlant"){
                                    $(type).append("<div class='product'>"
                                                             +"<img id='"+productId+"' src='/westernPlant/"+productFileName+"'>"
                                                             +"<form method='post' action='/delete.php'>"
                                                             +"<input type='text' class='deleteName' name='deleteName' value='"+productFileName+"'>"
                                                             +"<input type='text' class='deleteType' name='deleteType' value='westernPlant'>"
                                                             +"<input type='submit' class='deleteBtn' value='X'>"
                                                             +"</form>"
                                                             +"<span class='contentsName'>"+productName+"</span>"
                                                             +"<span class='contentInfo'>"+productInfo+"</span>"
                                                             +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                             +"</div>");
                                }else if(productType == "housePlant"){
                                    $(type).append("<div class='product'>"
                                                           +"<img id='"+productId+"' src='/housePlant/"+productFileName+"'>"
                                                           +"<form method='post' action='/delete.php'>"
                                                           +"<input type='text' class='deleteName' name='deleteName' value='"+productFileName+"'>"
                                                           +"<input type='text' class='deleteType' name='deleteType' value='housePlant'>"
                                                           +"<input type='submit' class='deleteBtn' value='X'>"
                                                           +"</form>"
                                                           +"<span class='contentsName'>"+productName+"</span>"
                                                           +"<span class='contentInfo'>"+productInfo+"</span>"
                                                           +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                           +"</div>");
                                }else if(productType == "finishedPlant"){
                                    $(type).append("<div class='product'>"
                                                              +"<img id='"+productId+"' src='/finishedPlant/"+productFileName+"'>"
                                                              +"<form method='post' action='/delete.php'>"
                                                              +"<input type='text' class='deleteName' name='deleteName' value='"+productFileName+"'>"
                                                              +"<input type='text' class='deleteType' name='deleteType' value='finishedPlant'>"
                                                              +"<input type='submit' class='deleteBtn' value='X'>"
                                                              +"</form>"
                                                              +"<span class='contentsName'>"+productName+"</span>"
                                                              +"<span class='contentInfo'>"+productInfo+"</span>"
                                                              +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                              +"</div>");
                                }
                            }
                        }
                        //일반 사용자일 때
                        else{
                            if(index == 0){
                                TYPE_SET_PRODUCT_USER(".orientalPlant");
                            }else if(index == 1){
                                TYPE_SET_PRODUCT_USER(".westernPlant");
                            }else if(index == 2){
                                TYPE_SET_PRODUCT_USER(".housePlant");
                            }else if(index == 3){
                                TYPE_SET_PRODUCT_USER(".finishedPlant");
                            }
                            function TYPE_SET_PRODUCT_USER(type){
                                if(productType == "orientalPlant"){
                                    $(type).append("<div class='product'>"
                                                              +"<img id='"+productId+"' src='/orientalPlant/"+productFileName+"'>"
                                                              +"<span class='contentsName'>"+productName+"</span>"
                                                              +"<span class='contentInfo'>"+productInfo+"</span>"
                                                              +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                              +"</div>");
                                }else if(productType == "westernPlant"){
                                    $(type).append("<div class='product'>"
                                                             +"<img id='"+productId+"' src='/westernPlant/"+productFileName+"'>"
                                                             +"<span class='contentsName'>"+productName+"</span>"
                                                             +"<span class='contentInfo'>"+productInfo+"</span>"
                                                             +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                             +"</div>");
                                }else if(productType == "housePlant"){
                                    $(type).append("<div class='product'>"
                                                           +"<img id='"+productId+"' src='/housePlant/"+productFileName+"'>"
                                                           +"<span class='contentsName'>"+productName+"</span>"
                                                           +"<span class='contentInfo'>"+productInfo+"</span>"
                                                           +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                           +"</div>");
                                }else if(productType == "finishedPlant"){
                                    $(type).append("<div class='product'>"
                                                              +"<img id='"+productId+"' src='/finishedPlant/"+productFileName+"'>"
                                                              +"<span class='contentsName'>"+productName+"</span>"
                                                              +"<span class='contentInfo'>"+productInfo+"</span>"
                                                              +"<span class='contentPrice'>"+productPrice+" 원</span>"
                                                              +"</div>");
                                }
                            } 
                        } 
                    }
                }
                if(authType == "ADMIN"){
                    //이미지버튼 클릭시
                    $(".product img").click(function(){
                        $(".update").show();
                        var src = $(this).attr("src");
                        if(actionType == "ALL"){
                            var userViewClass = $(this).parent("div").parent("div").attr("class");
                            var userViewType = userViewClass.split(" ");
                            $(".updateType").val(userViewType[1]);
                            $(".updatePreType").val(userViewType[1]);
                        }else{
                            if(actionType == "orientalPlant"){
                                $(".updateType").val("orientalPlant");
                                $(".updatePreType").val("orientalPlant");
                            }else if(actionType == "westernPlant"){
                                $(".updateType").val("westernPlant");
                                $(".updatePreType").val("westernPlant");
                            }else if(actionType == "housePlant"){
                                $(".updateType").val("housePlant");
                                $(".updatePreType").val("housePlant");
                            }else if(actionType == "finishedPlant"){
                                $(".updateType").val("finishedPlant");
                                $(".updatePreType").val("finishedPlant");
                            }
                        }

                        var userViewName = $(this).parent("div").children(".contentsName").html();
                        var userViewInfo = $(this).parent("div").children(".contentInfo").html();
                        var price = $(this).parent("div").children(".contentPrice").html();
                        var split = price.split(",");
                        var string = "";
                        for(var i=0; i<split.length; i++){
                            string += split[i];
                        }
                        var userViewPrice = parseInt(string);
                        $(".updatePreview").attr("src",src);
                        var updatePreImg = src.split("/")[2];
                        $(".updatePreImg").val(updatePreImg);
                        $(".updateName").attr("placeholder",userViewName);
                        $(".updateName").val(userViewName);
                        $(".updateInfo").attr("placeholder",userViewInfo);
                        $(".updateInfo").val(userViewInfo);
                        $(".updatePrice").attr("placeholder",userViewPrice);
                        $(".updatePrice").val(userViewPrice);
                        if(window.outerHeight<700){
                            $(".update .formDiv").css('height',window.outerHeight-150+'px');
                         }
                    });
                }else{
                    //이미지버튼 클릭시
                    $(".product img").click(function(e){
                        var src = $(this).attr("src");
                        if(actionType == "ALL"){
                            var userViewType = $(this).parent("div").parent(".colContents").parent(".flowerCol").children(".colTitle").children("span").html();
                            $("#userViewType").html(userViewType);
                        }else{
                            if(actionType == "orientalPlant"){
                                $("#userViewType").html("동양란");
                            }else if(actionType == "westernPlant"){
                                $("#userViewType").html("서양란");
                            }else if(actionType == "housePlant"){
                                $("#userViewType").html("관엽");
                            }else if(actionType == "finishedPlant"){
                                $("#userViewType").html("기타");
                            }
                        }
                        //var userViewName = $(this).parent("div").children(".contentsName").html();
                        //var userViewInfo = $(this).parent("div").children(".contentInfo").html();
                        //var userViewPrice = $(this).parent("div").children(".contentPrice").html();
                        $(".imgView").attr("src",src);
                        //$("#userViewText").html(userViewName);
                        //$("#userViewInfo").html(userViewInfo);
                        //$("#userViewPrice").html(userViewPrice);
                        $(".userView").show();
                        if(window.outerHeight<700){
                            $(".userView .formDiv").css('height',window.outerHeight-150+'px');
                            $(".userView .userViewImg").css('width','150px');
                            $(".userView .userViewImg").css('height','250px');
                         }
                    });
                }
                $(".index").show();  
            }else if(response.resultCode == "3001"){ //등록된 제품이 없습니다
                alert(response.resultMessage);
            }
        }
    }
}
//콤마 찍기
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//엑셀 다운로드
function excelDown(id,title){
    var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
    tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';
    tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
    tab_text = tab_text + "<table border='1px'>";
    var exportTable = $('#' + id).clone();
    exportTable.find('input').each(function (index, elem) { $(elem).remove(); });
    tab_text = tab_text + exportTable.html();
    tab_text = tab_text + '</table></body></html>';
    var data_type = 'data:application/vnd.ms-excel';
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var fileName = title + '.xls';
    //Explorer 환경에서 다운로드
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        if (window.navigator.msSaveBlob) {
            var blob = new Blob([tab_text], {
                type: "application/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, fileName);
        }
    } else {
        var blob2 = new Blob([tab_text], {
            type: "application/csv;charset=utf-8;"
        });
        var filename = fileName;
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob2);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}
//쿠키가져오기
function getCookie(cookie_name){
    var value = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    return value? value[2] : null;
}
//쿠키저장하기
function setCookie(cookie_name, value, days){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + days);
    // 설정 일수만큼 현재시간에 만료값으로 지정
    var cookie_value = escape(value) + ((days === null) ? '' : ';    expires=' + exdate.toUTCString());
    document.cookie = cookie_name + '=' + cookie_value;
}
//쿠키삭제하기
function deleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
}