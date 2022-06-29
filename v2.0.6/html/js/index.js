window.onload = function() {
    checkAutoLogin();
    // 로그인 이벤트
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
        var msg = {
            actionType: "LOGIN",
            userId: userId,
            userPw: userPw
        }
        var callback = function(data) {
            if (data.resultCode == "0000") {
                if(saveCheck) {
                    setCookie("AUTO_LOGIN", true, 365);
                }
                setCookie("USER_AT", "sin" + btoa(data.authType), 365);
                setCookie("USER_ID", "sin" + btoa(userId), 365);
                setCookie("USER_TP", "sin" + btoa(data.userType), 365);
                location.replace('/main.html');
            } else {  
                alert(data.resultMessage);
            }
        }
        doPost("GET_LOGIN", msg, callback);
    });
}