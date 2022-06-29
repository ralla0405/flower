// 메인 메뉴 처리
function startMain() {
    // 로그인 유저 데이터 가져오기
    var type = getCookie("USER_AT");
    if (type != "") {
        authType = window.atob(unescape(type.split('sin')[1]));
    }
    var uType = getCookie("USER_TP");
    if (uType != "") {
        userType = window.atob(unescape(uType.split('sin')[1]));
    }
    var msg = {
        actionType: "FINDONE",
        userId: userId
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            userData = data.resultData;
            getPrice();
            if (authType == "ADMIN") {
                $('.nav-logout').addClass('d-none');
                $('.nav-admin').removeClass('d-none');
                getOrderAndUserCount();
            } else if (authType == "USER") {
                $(".point-value").html("<b>" + setCommaWon(userData.point).split('원')[0] + "</b>");
                $(".point-val").html(setCommaWon(userData.point).split('원')[0]);
                $('.nav-logout').addClass('d-none');
                $('.nav-login').removeClass('d-none');
                $('.nav-login .user-c-name').html(userData.companyName + " 님");
            }
        } else {  
            alert(data.resultMessage);
        }
    }
    doPost("GET_USER", msg, callback);
}
// 사용자 아이디 가져오기
function getUserId() {
    var id = getCookie("USER_ID");
    if(id != null) {
        userId = window.atob(unescape(id.split('sin')[1]));
    }
    return id;
}
// 상품 금액 퍼센트 가져오기
function getPrice() {
    var msg = {
        actionType: "price"
    }
    var callback = function(data) {
        pricePercent.company = data.resultData.company;
        pricePercent.consumer = data.resultData.consumer;
        pricePercent.advanced = data.resultData.advanced;
        pricePercent.highend = data.resultData.highend;
        $("input[name=companyPercent]").val(pricePercent.company);
        $("input[name=consumerPercent]").val(pricePercent.consumer);
        $("input[name=advanced]").val(pricePercent.advanced);
        $("input[name=highend]").val(pricePercent.highend);
    }
    doPost("GET_PRICE", msg, callback);
}
// 자동로그인 체크
function checkAutoLogin() {
    var autoLogin = getCookie("AUTO_LOGIN");
    var id = getCookie("USER_ID");
    if(autoLogin && id != null){
        location.replace('/main.html');
    } else {
        deleteCookie("USER_ID");
        $('.wrap').show();
    }
}
// 공지사항 개수 가져오기
function getNoticeNumber() {
    var msg = {
        actionType: "ALL"
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            resultData = data.resultData;
            resultLen = resultData.length;  
            var listCnt = 0;
            for ( var i = 0; i < resultLen; i ++ ) {
                if (resultData[i].type == "LIST") {
                    listCnt++;
                } 
            }
            // 공지사항 개수 표시
            $('.notice-cnt').html(listCnt);
        } else {  
            alert(data.resultMessage);
        }
    }
    doPost("GET_NOTICE", msg, callback);
}
// 뒤로가기
function goBack() {
    window.history.back();
}
// 홈으로가기
function goHome() {
    location.href = '/main.html';
}
// 로그아웃
function logout() {
    deleteCookie('AUTO_LOGIN');
    deleteCookie('USER_ID');
    deleteCookie('USER_AT');
    deleteCookie('USER_TP');
    deleteCookie('LOGIN');
    deleteCookie('CHECK');
    location.replace("/index.html");
}
// class 토글
function toggleClass(obj, className) {
    if ($(obj).hasClass(className)) {
        $(obj).removeClass('on');
    } else {
        $(obj).addClass('on');
    }
}
// 사업장 주소검색
function openNewAddr() {
    new daum.Postcode({
        oncomplete: function(data) {
            var roadAddr = data.roadAddress; // 도로명 주소 변수
            var extraRoadAddr = ''; // 참고 항목 변수
            var finalAddr = ''; // 최종 주소 변수

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
// 수주 수 회원 수 가져오기
function getOrderAndUserCount() {
    // 처리해야 할 수주 수
    var msg = {
        actionType: "ALL"
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            $('.orders-cnt').html(data.resultData.length);
        } else {  
            alert(data.resultMessage);
        }
    }
    doPost("GET_ORDER", msg, callback);
    // 승인요청 사용자 수
    var msg = {
        actionType: "ALL"
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var userCnt = 0;
            for (var i = 0; i < data.resultData.length; i++) {
                if (data.resultData[i].flag == "N") {
                    userCnt += 1;
                }
            }
            $('.join-cnt').html(userCnt);
        } else {  
            alert(data.resultMessage);
        }
    }
    doPost("GET_USER", msg, callback);
}
// 쿠키가져오기
function getCookie(cookie_name) {
    var value = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    return value? value[2] : null;
}
// 쿠키저장하기
function setCookie(cookie_name, value, days) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + days);
    var cookie_value = escape(value) + ((days === null) ? '' : ';    expires=' + exdate.toUTCString());
    document.cookie = cookie_name + '=' + cookie_value;
}
// 쿠키삭제하기
function deleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
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
// , 표시
function setComma(num) {
    var len,point,str;
    num = num + "";
    point = num.length % 3;
    len = num.length;

    str = num.substring(0, point);
    while (point<len) {
        if(str != "") str += ",";
        str += num.substring(point, point + 3);
        point += 3;
    }
    return str;
}
// , 원 표시
function setCommaWon(num) {
    var len,point,str;
    num = num + "";
    point = num.length % 3;
    len = num.length;

    str = num.substring(0, point);
    while (point<len) {
        if(str != "") str += ",";
        str += num.substring(point, point + 3);
        point += 3;
    }
    return str + "원";
}
// , 원 제거
function setNumber(str) {
    var len,point,num;
    
    len = str.length;
    point = 0;
    num = str.substring(0,point);
    while (point < len) {
        if (str.substring(point, point + 1) != ",") {
            num += str.substring(point, point + 1);
        }
        point += 1;
    }
    return Number(num.split('원')[0]);
}
// 현재 날짜 변환
Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [this.getFullYear(),
        '-',
        (mm>9? '': '0')+ mm,
        '-',
        (dd>9? '': '0')+ dd].join('');
}
// 현재 시간 변환
Date.prototype.hhmmss = function() {
    var hh = this.getHours();
    var mm = this.getMinutes();
    var ss = this.getSeconds();
    return [(hh > 9 ? '' : '0') + hh,
            ':',
            (mm > 9 ? '' : '0') + mm,
            ':',
            (ss > 9 ? '' : '0') + ss].join('');
}
// 현재 날짜 시간 변환
Date.prototype.fullDate = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();
    var hh = this.getHours();
    var m = this.getMinutes();

    return [this.getFullYear(),
        '-',
        (mm > 9 ? '' : '0') + mm,
        '-',
        (dd > 9 ? '' : '0') + dd,
        ' ',
        (hh > 9 ? '' : '0') + hh,
        ':',
        (m > 9 ? '' : '0') + m].join('');
}