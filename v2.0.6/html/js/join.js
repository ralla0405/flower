var isIdCheck = false;
var isEmailCheck = false;

window.onload = function() {
/** join_agree */
    // 회원가입 약관 동의
    $('.cklabel.ck_terms').click(function() {
        toggleClass(this, 'on');
        return false;
    });
    // 개인정보 수집/이용약관 동의 이벤트
    $('.cklabel.ck_personal').click(function() {
        toggleClass(this, 'on');
        return false;
    });
    // 모든 약관 동의 이벤트
    $('.cklabel.ck_both').click(function() {
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
            $('.ck_terms, .ck_personal').removeClass('on');
        } else {
            $(this).addClass('on');
            $('.ck_terms, .ck_personal').addClass('on');
        }
        return false;
    });
    // 약관동의 다음버튼 이벤트
    $('.agree-btn').click(function() {
        var agree = getCookie("AGREE");
        if(agree != null) {
            deleteCookie("AGREE");
        }
        if (!$('.cklabel.ck_terms').hasClass('on')) {
            alert("회원가입 약관에 동의해 주세요.");
        } else if (!$('.cklabel.ck_personal').hasClass('on')) {
            alert("개인정보취급방침에 동의해 주세요.");
        } else {
            setCookie("AGREE", "sin" + btoa("Y"), 1);
            location.href = "join_form.html";
        }
    });
/** join_agree */
/** join_form */
    // 아이디 중복확인
    $('.idCheck').click(function() {
        var userId = $(this).parent("td").find("input[name='userId']").val();
        if(userId == "") {
            alert("아이디를 입력해주세요.");
            return;
        }
        var msg = {
            userId: userId,
        }
        var callback = function(data) {
            if (data.resultCode == "0201") {
                isIdCheck = true;
                alert(data.resultMessage);
            } else if(data.resultCode == "0202"){  
                isIdCheck = false;
                alert(data.resultMessage);
            }
        }
        doPost("CHECK_ID", msg, callback);
    });
    // 이메일 중복확인
    $('.emailCheck').click(function() {
        if ($(this).parent("td").find("input[name='userEmail']").val() == "" || $(this).parent("td").find("input[name='emailDomain']").val() == "") {
            alert("이메일을 정확히 입력해주세요.");
            return;
        }
        var userEmail = $(this).parent("td").find("input[name='userEmail']").val() + "@" + $(this).parent("td").find("input[name='emailDomain']").val();
        var msg = {
            userEmail: userEmail,
        }
        var callback = function(data) {
            if (data.resultCode == "0301") {
                isEmailCheck = true;
                alert(data.resultMessage);
            } else if(data.resultCode == "0302") {  
                isEmailCheck = false;
                alert(data.resultMessage);
            }
        }
        doPost("CHECK_EMAIL", msg, callback);
    });
    // 사업자번호 유효성확인
    $('.comNumCheck').click(function() {
        var companyNumber = $(this).parent("td").find("input[name='comNumber']").val();
        var checkSum = 0;
        var checkID = [1, 3, 7, 1, 3, 7, 1, 3, 5];
        if (companyNumber == "") {
            alert("사업자번호를 입력해주세요.");
            return false;
        }
        if ((companyNumber = (companyNumber+'').match(/\d{1}/g)).length != 10) {
            alert("사업자 등록 번호가 올바르게 입력되었는지 확인해주세요.");
            return false;
        }
        for (var i=0; i<9; i++) {
            checkSum += checkID[i]*Number(companyNumber[i]);
        }
        if (10 - ((checkSum + Math.floor(checkID[8]*Number(companyNumber[8])/10)) %10) != Number(companyNumber[9])) {
            alert("사업자 등록 번호가 올바르게 입력되었는지 확인해주세요.");
            return false;
        }
        isNumberCheck = true;
        alert("사용하실 수 있는 사업자번호입니다.");
    });
    // 회원가입
    $('.setUser').click(function(){
        var agree = getCookie("AGREE");
        if(agree != null) {
            var width = window.innerWidth;
        if (width < 800) {
            var companyName = $(".mobile input[name='comName']").val();
            var ceoName = $(".mobile input[name='ceoName']").val();
            var userId = $(".mobile input[name='userId']").val();
            var userPw = $(".mobile input[name='userPw']").val();
            var userRePw = $(".mobile input[name='userRePw']").val();
            var userPhone = $(".mobile input[name='userMobile']").val();
            var beforeEmail = $(".mobile input[name='userEmail']").val();
            var afterEmail =  $(".mobile input[name='emailDomain']").val();
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
            var beforeEmail = $("input[name='userEmail']").val();
            var afterEmail =  $("input[name='emailDomain']").val();
            var userTel = $("input[name='userTel']").val();
            var companyNumber = $("input[name='comNumber']").val();
            var userFax = $("input[name='userFax']").val();
            var preAddress = $("input[name='post']").val();
            var companyAddress = preAddress + "/"+ $("input[name='addr']").val() + "/" + $("input[name='extraAddr']").val();
            var companyExtraAddress = $("input[name='extraAddr']").val();
        }
        var userEmail = beforeEmail + "@" + afterEmail;
        if (companyName == '') {
            alert('업체명을 입력해주세요.');
            return false;
        } else if (ceoName == '') {
            alert('대표자명을 입력해주세요.');
            return false;
        } else if (userId == '') {
            alert('아이디를 입력해주세요.');
            return false;
        } else if (!isIdCheck) {
            alert('아이디 중복확인을 해주세요.');
            return false;
        } else if (userPw == '') {
            alert('비밀번호를 입력해주세요.');
            return false;
        } else if (userPw != userRePw) {
            alert('비밀번호가 일치하지 않습니다.');
            return false;
        } else if (!validatePassword(userPw)) {
            alert('비밀번호의 조합을 확인해주세요.');
            return false;
        } else if (userPhone == '') {
            alert('휴대폰 번호를를 입력해주세요.');
            return false;
        } else if (beforeEmail == '' || afterEmail == '') {
            alert('이메일주소를 입력해주세요.');
            return false;
        } else if (!isEmailCheck) {
            alert('이메일 중복확인을 해주세요.');
            return false;
        } else if (preAddress == '') {
            alert('사업장 주소를 입력해주세요.');
            return false;
        } else if (companyExtraAddress == '') {
            alert('상세주소를 입력해주세요.');
            return false;
        }
        var msg = {
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
        var callback = function(data) {
            deleteCookie('AGREE');
            if(data.resultCode == "0401") {
                alert(data.resultMessage);
                location.replace('/');
            } else {
                alert("서버문제입니다.\n문의바랍니다.");
                location.replace('/');
            }
        }
        doPost("SET_USER", msg, callback);
        } else {
            alert("회원가입 약관동의를 해주세요.");
            location.replace("/join_agree.html");
        }
    });
/** join_form */
}