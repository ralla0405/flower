var serverUrl = "https://www.sinho2016.com:444";
window.onload = function(){
    var checkLogin = getCookie('checkLogin');
    if(checkLogin == "Y"){
        location.href="/dashboard/dashboard.html";
    }else{
        deleteCookie('checkLogin');
        $('body').show();
    }
    // 로그인 버튼 클릭 시 
    $(".goLoginBtn").click(function(){
        var companyNumber = $(".inputCompanyNumber").val();
        var psw = $(".inputPw").val();
        if(!companyNumber){
            $(".inputCompanyNumber").focus();
            alert("사업자 번호를 입력해주세요");
        }else if(!psw){
            $(".inputPw").focus();
            alert("비밀번호를 입력해주세요");
        }else{
            var msg = JSON.stringify({"actionType": "LOGIN", "companyNumber": companyNumber, "psw": psw});
            var Url = serverUrl+"/appapi/GET_LOGIN/appRequest.do";
            var xhr = new XMLHttpRequest();
            xhr.open('POST', Url, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(msg);
            xhr.onreadystatechange = processRequest;
            function processRequest(e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.resultCode == "0000") {  //정상 처리되었습니다.
                        if(response.resultData.flag == "Y"){
                            setCookie('companyNumber',companyNumber,365);
                            setCookie('checkLogin','Y',365);
                            setCookie('authType',response.resultData.authType,365); 
                            location.replace("/dashboard/dashboard.html");
                        }else if(response.resultData.flag == "N"){
                            alert("관리자가 승인할때까지 기다려 주세요.");
                        }
                    }else if(response.resultCode == "0201"){  //존재하지 않는 사업자등록번호 입니다.
                        alert(response.resultMessage);
                    }else if(response.resultCode == "0202"){  //비밀번호가 틀렸습니다.
                        alert(response.resultMessage);
                    }
                }
            }
        } 
    });
    // 회원가입 버튼 클릭 시 
    $(".joinBtn").click(function(){
        $(".login").hide();
        $(".join").show();
    });
    // 회원가입하기 버튼 클릭 시 
    $(".goJoinBtn").click(function(){
        var joinCompanyNumber = $(".inputJoinCompanyNumber").val();
        var joinPw = $(".inputJoinPw").val();
        var joinPWCheck = $(".inputJoinPwCheck").val();
        var joinCompanyName = $(".inputJoinCompanyName").val();
        var joinCompanyAddress = $(".inputJoinCompanyAddress").val();
        var joinEmail = $(".inputJoinEmail").val();
        var joinName = $(".inputJoinName").val();
        var joinPhone = $(".inputJoinPhone").val();
        if(!joinCompanyNumber){
            $(".inputJoingCompanyNumber").focus();
            alert("사업자 번호를 입력해주세요");
        }else if(!joinPw){
            $(".inputJoinPw").focus();
            alert("비밀번호를 입력해주세요");
        }else{
            if(joinPw != joinPWCheck){
                $(".inputJoinPwCheck").focus();
                alert("비밀번호를 확인을 입력해주세요");
            }else{
                if(!joinCompanyName){
                    $(".inputJoinCompanyName").focus();
                    alert("사업자 명을 입력해주세요");
                }else if(!joinCompanyAddress){
                    $(".inputJoinCompanyAddress").focus();
                    alert("사업자 주소를 입력해주세요");
                }else if(!joinEmail){
                    $(".inputJoinEmail").focus();
                    alert("이메일을 입력해주세요");
                }else if(!joinName){
                    $(".inputJoinName").focus();
                    alert("대표자 성함을 입력해주세요");
                }else if(!joinPhone){
                    $(".inputJoinPhone").focus();
                    alert("대표자 연락처를 입력해주세요");
                }else{
                    var msg = JSON.stringify({"actionType": "JOIN", "companyNumber": joinCompanyNumber, "psw": joinPw, "companyName": joinCompanyName, "companyAddress": joinCompanyAddress, "email": joinEmail, "name": joinName, "phone": joinPhone});
                    var Url = serverUrl+"/appapi/SET_USER/appRequest.do";
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', Url, true);
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xhr.send(msg);
                    xhr.onreadystatechange = processRequest;
                    function processRequest(e) {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var response = JSON.parse(xhr.responseText);
                            if (response.resultCode == "0000") {  //정상 처리되었습니다. 
                                alert("회원가입 요청이 완료되었습니다.");
                                location.reload();
                            }else if(response.resultCode == "0301"){  //이미 등록된 사업자등록번호 입니다.
                                alert(response.resultMessage);
                            }
                        }
                    }
                }
            }
        }
    });
    // 사업자번호 하이픈 자동입력
    $(".inputCompanyNumber, .inputJoinCompanyNumber").on('keyup',function(){
        $(this).val($(this).val().replace(/[^0-9]/g, "").replace(/([0-9]{3})[-]?([0-9]{2})[-]?([0-9]{5})$/,"$1-$2-$3").replace("--","-"));
    });
    // 연락처 하이픈 자동입력
    $(document).on("keyup", ".inputJoinPhone", function() { 
        $(this).val( $(this).val().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-") ); 
    });
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