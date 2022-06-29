var serverUrl = "https://www.sinho2016.com:444";
var isIdCheck = false;
var isEmailCheck = false;
var isNumberCheck = false;
var userId = "";
window.onload = function(){
    // 자동로그인 체크
    var autoLogin = getCookie("AUTO_LOGIN");
    if(autoLogin){
        location.replace('/main.html');
    } else {
        $('.wrap').show();
    }
    // 비밀번호 변경
    if(location.href.includes('pw_change.html')) {
        var request = new Request();
        var pwToken = decodeURIComponent(unescape(request.getParameter('pwToken'), "UTF-8"));
        jQuery.ajax({
            url: serverUrl+"/appapi/GET_TOKEN/appRequest.do",
            type: "POST",
            dataType: "json",
            data: {
                pwToken: pwToken
            }
        }).done(function(data) {
            var code = data.resultCode;
            var msg = data.resultMessage;
            if (code == "0000") {
                $('.main-agree').show();
                var userId = data.userId;
                // 비밀번호 수정 클릭시
                $('.changePw_btn').click(function() {
                    var newPw = $('input[name=newPw]').val();
                    var newPw2 = $('input[name=newPw2]').val();
                    if (newPw == "" || newPw2 == "") {
                        alert("비밀번호를 입력해주세요.");
                        return;
                    } else {
                        if (newPw != newPw2) {
                            alert('비밀번호가 일치하지 않습니다.');
                            return;
                        } else {
                            jQuery.ajax({
                                url: serverUrl+"/appapi/SET_TOKEN/appRequest.do",
                                type: "POST",
                                dataType: "json",
                                data: {
                                    userId: userId,
                                    pwToken: pwToken,
                                    newPw: newPw
                                }
                            }).done(function(data2) {
                                var code2 = data2.resultCode;
                                var msg2 = data2.resultMessage;
                                if (code2 == "0000") {
                                    alert(msg2);
                                    location.replace("/index.html");
                                } else {
                                    alert(msg2);
                                }
                            });
                        }
                    }
                });
            } else if (code == "0106"){
                alert(msg);
                location.replace('/');
            }
        });
    }
    // 로그인
    $('.login-btn').click(function(){
        var userId = $("input[name='loginUserId']").val();
        var userPw = $("input[name='loginUserPw']").val();
        var saveCheck = $("input[name='userIdSaveCheck']").is(":checked");
        if(userId == "") {
            alert("아이디를 입력해주세요.");
            return;
        }else if(userPw == ""){
            alert("비밀번호를 입력해주세요.");
            return;
        }
        var msg = JSON.stringify({"actionType": "LOGIN", "userId": userId, "userPw": userPw});
        var Url = serverUrl+"/appapi/GET_LOGIN/appRequest.do";
        var xhr = new XMLHttpRequest();
        xhr.open('POST', Url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(msg);
        xhr.onreadystatechange = processRequest;
        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.resultCode == "0000") {  // 정상처리 되었습니다.
                    // 로그인 후처리
                    if(saveCheck) {
                        setCookie("AUTO_LOGIN",true,365);
                    }
                    setCookie("USER_AT", "sin"+btoa(response.authType),365);
                    setCookie("USER_ID", "sin"+btoa(userId),365);
                    setCookie("USER_TP", "sin"+btoa(response.userType),365);
                    location.replace('/main.html');
                } else {  
                    alert(response.resultMessage);
                }
            }
        }
    });
    // 회원가입 약관 동의
    $('.cklabel.ck_terms').click(function() {
        if($(this).hasClass('on')){
            $(this).removeClass('on');
        }else{
            $(this).addClass('on');
        }
        return false;
    });
    // 개인정보 수집/이용약관 동의
    $('.cklabel.ck_personal').click(function() {
        if($(this).hasClass('on')){
            $(this).removeClass('on');
        }else{
            $(this).addClass('on');
        }
        return false;
    });
    // 모든 약관 동의
    $('.cklabel.ck_both').click(function(){
        if($(this).hasClass('on')){
            $(this).removeClass('on');
            $('.ck_terms, .ck_personal').removeClass('on');
        }else{
            $(this).addClass('on');
            $('.ck_terms, .ck_personal').addClass('on');
        }
        return false;
    });
    // 이용약관동의 다음버튼
    $('.agree-btn').click(function(){
        if(!$('.cklabel.ck_terms').hasClass('on')){
            alert("회원가입 약관에 동의해 주세요.");
        }else if(!$('.cklabel.ck_personal').hasClass('on')){
            alert("개인정보취급방침에 동의해 주세요.");
        }else{
            location.href="join_form.html";
        }
    });
    // 아이디 중복확인
    $('.idCheck').click(function(){
        var userId = $(this).parent("td").find("input[name='userId']").val();
        if(userId == "") {
            alert("아이디를 입력해주세요.");
            return;
        }
        var msg = JSON.stringify({"userId": userId});
        var Url = serverUrl+"/appapi/CHECK_ID/appRequest.do";
        var xhr = new XMLHttpRequest();
        xhr.open('POST', Url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(msg);
        xhr.onreadystatechange = processRequest;
        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.resultCode == "0201") {  // 사용하실 수 있는 아이디 입니다.
                    isIdCheck = true;
                    alert(response.resultMessage);
                } else if(response.resultCode == "0202") {  // 중복된 아이디가 존재합니다.
                    alert(response.resultMessage);
                    isIdCheck = false;
                }
            }
        }
    });
    // 이메일 중복확인
    $('.emailCheck').click(function(){
        var userEmail = $(this).parent("td").find("input[name='userEmail']").val() + "@" + $(this).parent("td").find("input[name='emailDomain']").val();
        if($(this).parent("td").find("input[name='userEmail']").val() == "" || $(this).parent("td").find("input[name='emailDomain']").val() == "") {
            alert("이메일을 입력하시는 경우 정확히 입력해주세요.");
            return;
        }
        var msg = JSON.stringify({"userEmail": userEmail});
        var Url = serverUrl+"/appapi/CHECK_EMAIL/appRequest.do";
        var xhr = new XMLHttpRequest();
        xhr.open('POST', Url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(msg);
        xhr.onreadystatechange = processRequest;
        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.resultCode == "0301") {  // 사용하실 수 있는 이메일 입니다.
                    alert(response.resultMessage);
                    isEmailCheck = true;
                } else if(response.resultCode == "0302") {  // 중복된 이메일이 존재합니다.
                    alert(response.resultMessage);
                    isEmailCheck = false;
                }
            }
        }
    });
    // 사업자번호 유효성확인
    $('.comNumCheck').click(function(){
        var companyNumber = $(this).parent("td").find("input[name='comNumber']").val();
        var checkSum = 0;
        var checkID = [1,3,7,1,3,7,1,3,5];
        if(companyNumber == "") {
            alert("사업자번호를 입력해주세요.");
            return false;
        }
        if((companyNumber = (companyNumber+'').match(/\d{1}/g)).length != 10) {
            alert("사업자 등록 번호가 올바르게 입력되었는지 확인해주세요.");
            return false;
        }
        for(var i=0;i<9;i++){
            checkSum += checkID[i]*Number(companyNumber[i]);
        }
        if(10 - ((checkSum + Math.floor(checkID[8]*Number(companyNumber[8])/10)) %10) != Number(companyNumber[9])) {
            alert("사업자 등록 번호가 올바르게 입력되었는지 확인해주세요.");
            return false;
        }
        alert("사용하실 수 있는 사업자번호입니다.");
        isNumberCheck = true;
    });
    // 뒤로가기
    $('.bi-chevron-left').click(function() {
        window.history.back();
    });
    // 회원가입
    $('.setUser').click(function(){
        var width = window.innerWidth;
        if (width < 800) {
            setUser('mobile');
        } else {
            setUser('pc');
        }
    });
    // 아이디 찾기
    $('.findId').click(function(){
        location.href = "find_id.html";
    });
    // 비밀번호 찾기
    $('.findPw').click(function(){
        location.href = "find_pw.html";
    });
    // 아이디 확인 클릭시
    $('.findId_btn').click(function() {
        var firstEmail = $('input[name=emailId]').val();
        var emailDomain = $('input[name=emailDomain]').val();
        var companyName = $('input[name=companyName]').val();
        if (firstEmail == "" || emailDomain == "") {
            alert("이메일을 입력해 주세요.");
        } else if (companyName == "") {
            alert("법인명을 입력해 주세요.");
        } else {
            var userEamil = firstEmail + "@" + emailDomain;
            jQuery.ajax({
                url: serverUrl+"/appapi/FIND_ID/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    userEmail: userEamil,
                    companyName: companyName
                }
            }).done(function(data) {
                var code = data.resultCode;
                var msg = data.resultMessage;
                if (code == "0000") {
                    alert(msg);
                    location.href = "/index.html";
                } else if (code == "0104") {
                    if(confirm(msg)) {
                        location.href = "/join_agree.html";
                    } else {
                        location.href = "/index.html";
                    }
                }
            });
        }
    });
    // 비밀번호 확인 클릭시
    $('.findPw_btn').click(function() {
        var userId = $('input[name=userId]').val();
        var firstEmail = $('input[name=emailId]').val();
        var emailDomain = $('input[name=emailDomain]').val();
        var companyName = $('input[name=companyName]').val();
        if (userId == "") {
            alert("아이디를 입력해 주세요.");
        } else if (firstEmail == "" || emailDomain == "") {
            alert("이메일을 입력해 주세요.");
        } else if (companyName == "") {
            alert("법인명을 입력해 주세요.");
        } else {
            var userEamil = firstEmail + "@" + emailDomain;
            jQuery.ajax({
                url: serverUrl+"/appapi/FIND_PW/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    userId: userId,
                    userEmail: userEamil,
                    companyName: companyName
                }
            }).done(function(data) {
                var code = data.resultCode;
                var msg = data.resultMessage;
                if (code == "0000") {
                    alert(msg);
                    location.href = "/index.html";
                } else if (code == "0105") {
                    alert(msg);
                }
            });
        }
    });
    // 취소 클릭시 
    $('.cancle').click(function() {
        window.history.back();
    });
}
// 핸드폰번호 '-' 자동입력
function inputPhoneNumber(obj) {
    var number = obj.value.replace(/[^0-9]/g, "");
    var phone = "";

    if(number.length < 4) {
        return number;
    } else if(number.length < 7) {
        phone += number.substr(0, 3);
        phone += "-";
        phone += number.substr(3);
    } else if(number.length < 11) {
        phone += number.substr(0, 3);
        phone += "-";
        phone += number.substr(3, 3);
        phone += "-";
        phone += number.substr(6);
    } else {
        phone += number.substr(0, 3);
        phone += "-";
        phone += number.substr(3, 4);
        phone += "-";
        phone += number.substr(7);
    }
    obj.value = phone;
}
// 사업자번호 '-' 자동입력
function inputComNumber(obj) {
    var number = obj.value.replace(/[^0-9]/g, "");
    if(number == "") {
        $("input[name='comNumber']").val("");
    }
    var companyNumber = "";

    if(number.length < 4) {
        return number;
    } else if(number.length < 6) {
        companyNumber += number.substr(0, 3);
        companyNumber += "-";
        companyNumber += number.substr(3);
    } else {
        companyNumber += number.substr(0, 3);
        companyNumber += "-";
        companyNumber += number.substr(3, 2);
        companyNumber += "-";
        companyNumber += number.substr(5);
    }
    obj.value = companyNumber;
}
// 유선번호 '-' 자동입력
function inputComFax(obj) {
    var number = obj.value.replace(/[^0-9]/g, "");
    var companyNumber = "";
    if(number.substr(1,1) == "2") {
        if(number.length < 3) {
            return number;
        } else if(number.length < 6) {
            companyNumber += number.substr(0, 2);
            companyNumber += "-";
            companyNumber += number.substr(2);
        } else if(number.length < 10) {
            companyNumber += number.substr(0, 2);
            companyNumber += "-";
            companyNumber += number.substr(2, 3);
            companyNumber += "-";
            companyNumber += number.substr(5);
        }else {
            companyNumber += number.substr(0, 2);
            companyNumber += "-";
            companyNumber += number.substr(2, 4);
            companyNumber += "-";
            companyNumber += number.substr(6);
        }
    } else {
        if(number.length < 4) {
            return number;
        } else if(number.length < 7) {
            companyNumber += number.substr(0, 3);
            companyNumber += "-";
            companyNumber += number.substr(3);
        } else if(number.length < 11){
            companyNumber += number.substr(0, 3);
            companyNumber += "-";
            companyNumber += number.substr(3, 3);
            companyNumber += "-";
            companyNumber += number.substr(6);
        } else{
            companyNumber += number.substr(0, 3);
            companyNumber += "-";
            companyNumber += number.substr(3, 4);
            companyNumber += "-";
            companyNumber += number.substr(7);
        }
    }
    obj.value = companyNumber;
}
// 이메일 도메인 체크
function checkEmailDomain(obj) {
    var domain = $(obj).val();
    if(domain == "직접입력"){
        $("input[name='emailDomain']").val("");
        $("input[name='emailDomain']").attr("readonly",false);
    }else{
        $("input[name='emailDomain']").val(domain);
        $("input[name='emailDomain']").attr("readonly",true);
    }
}
// 회원가입 완료
function setUser(type) {
    if (type == "mobile") {
        var companyName = $(".mobile input[name='comName']").val();
        var ceoName = $(".mobile input[name='ceoName']").val();
        var userId = $(".mobile input[name='userId']").val();
        var userPw = $(".mobile input[name='userPw']").val();
        var userRePw = $(".mobile input[name='userRePw']").val();
        var userPhone = $(".mobile input[name='userMobile']").val();
        var beforeEmail = $(".mobile input[name='userEmail']").val();
        var afterEmail =  $(".mobile input[name='emailDomain']").val();
        var userEmail = beforeEmail + "@" + afterEmail;
        var userTel = $(".mobile input[name='userTel']").val();
        var companyNumber = $(".mobile input[name='comNumber']").val();
        var userFax = $(".mobile input[name='userFax']").val();
        var preAddress = $(".mobile input[name='post']").val();
        var companyAddress = preAddress + "/"+ $(".mobile input[name='addr']").val() + "/" + $(".mobile input[name='extraAddr']").val();
        var companyExtraAddress = $(".mobile input[name='extraAddr']").val();
    } else {
        var companyName = $("input[name='comName']").val();
        var ceoName = $("input[name='ceoName']").val();
        var userId = $("input[name='userId']").val();
        var userPw = $("input[name='userPw']").val();
        var userRePw = $("input[name='userRePw']").val();
        var userPhone = $("input[name='userMobile']").val();
        var userEmail = $("input[name='userEmail']").val() + "@" + $("input[name='emailDomain']").val();
        var userTel = $("input[name='userTel']").val();
        var companyNumber = $("input[name='comNumber']").val();
        var userFax = $("input[name='userFax']").val();
        var companyAddress = $("input[name='post']").val() + "/"+ $("input[name='addr']").val() + "/" + $("input[name='extraAddr']").val();
        var companyExtraAddress = $("input[name='extraAddr']").val();
    }
    if(companyName == '') {
        alert('업체명을 입력해주세요.');
        $("input[name='comName']").focus();
        return false;
    }else if(ceoName == '') {
        alert('대표자명을 입력해주세요.');
        $("input[name='ceoName']").focus();
        return false;
    }else if(userId == '') {
        alert('아이디를 입력해주세요.');
        $("input[name='userId']").focus();
        return false;
    }else if(!isIdCheck) {
        alert('아이디 중복확인을 해주세요.');
        return false;
    }else if(userPw == '') {
        alert('비밀번호를 입력해주세요.');
        $("input[name='userPw']").focus();
        return false;
    }else if(userPw != userRePw) {
        alert('비밀번호가 일치하지 않습니다.');
        $("input[name='userRePw']").focus();
        return false;
    }else if(!validatePassword(userPw)){
        alert('비밀번호의 조합을 확인해주세요.');
        $("input[name='userPw']").focus();
        return false;
    }else if(userPhone == '') {
        alert('휴대폰 번호를를 입력해주세요.');
        $("input[name='userMobile']").focus();
        return false;
    }else if(beforeEmail == '' || afterEmail == '') {
        alert('이메일주소를 입력해주세요.');
        $("input[name='userEmail']").focus();
        return false;
    }else if(!isEmailCheck) {
        alert('이메일 중복확인을 해주세요.');
        return false;
    }else if(companyNumber == ''){
        alert('사업자번호를 입력해주세요.');
        $("input[name='comNumber']").focus();
        return false;
    }else if(!isNumberCheck) {
        alert('사업자번호 유효성확인을 해주세요.');
        return false;
    }else if(preAddress == '') {
        alert('사업장 주소를 입력해주세요.');
        return false;
    }else if(companyExtraAddress == '') {
        alert('상세주소를 입력해주세요.');
        $("input[name='extraAddr']").focus();
        return false;
    }
    jQuery.ajax({
        url: serverUrl+"/appapi/SET_USER/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "INSERT",
            userId: userId,
            companyName: companyName,
            ceoName: ceoName,
            userPw: userPw,
            userPhone: userPhone,
            userEmail: userEmail,
            userTel: userTel,
            companyNumber: companyNumber,
            userFax: userFax,
            companyAddress: companyAddress
        }
    }).done(function(data) {
        if(data.resultCode == "0701") {
            alert(data.resultMessage);
            location.replace('/');
        } else {
            alert("서버문제입니다.");
            location.replace('/');
        }
    });
}
// 사업장 주소검색
function openNewAddr() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var roadAddr = data.roadAddress; // 도로명 주소 변수
                var extraRoadAddr = ''; // 참고 항목 변수
                var finalAddr = '';
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraRoadAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                   extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraRoadAddr !== ''){
                    extraRoadAddr = ' (' + extraRoadAddr + ')';
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                $("input[name='post']").val(data.zonecode);
                
                
                // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
                finalAddr = roadAddr +" ("+ data.jibunAddress +")"+ extraRoadAddr;
                $("input[name='addr']").val(finalAddr);
                $("input[name='extraAddr']").focus();
        }
    }).open();
}
// 최소 4자리 비밀번호
function validatePassword(character) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{4,}$/.test(character)
}
// 쿠키가져오기
function getCookie(cookie_name){
    var value = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    return value? value[2] : null;
}
// 쿠키저장하기
function setCookie(cookie_name, value, days){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + days);
    // 설정 일수만큼 현재시간에 만료값으로 지정
    var cookie_value = escape(value) + ((days === null) ? '' : ';    expires=' + exdate.toUTCString());
    document.cookie = cookie_name + '=' + cookie_value;
}
// URL 파라미터 가져오기
var Request = function() {
    this.getParameter = function(name) {
        var rtnval = '';
        var nowAddress = unescape(location.href);
        var parameters = (nowAddress.slice(nowAddress.indexOf('?') + 1, nowAddress.lenth)).split('&');
        for (var i=0; i< parameters.length; i++) {
            var varName = parameters[i].split('=')[0];
            if (varName.toUpperCase() == name.toUpperCase()) {
                rtnval = parameters[i].split('=')[1];
                break;
            }
        }
        return rtnval;
    }
}