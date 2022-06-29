window.onload = function() {
    $('.wrap').show();
/** find_id */
    // 아이디 확인 클릭시
    $('.findId_btn').click(function() {
        var firstEmail = $('input[name=emailId]').val();
        var emailDomain = $('input[name=emailDomain]').val();
        var companyName = $('input[name=companyName]').val();
        if (firstEmail == "" || emailDomain == "") {
            alert("이메일을 입력해 주세요.");
            return false;
        } else if (companyName == "") {
            alert("법인명을 입력해 주세요.");
            return false;
        } 
        var userEmail = firstEmail + "@" + emailDomain;
        var msg = {
            userEmail: userEmail,
            companyName: companyName
        }
        var callback = function(data) {
            if (data.resultCode == "0000") {
                alert(data.resultMessage);
                location.href = "/index.html";
            } else if (data.resultCode == "0501") {
                if(confirm(data.resultMessage)) {
                    location.href = "/join_agree.html";
                }
            }
        }
        doPost("FIND_ID", msg, callback);
    });
/** find_id */
/** find_pw */
    // 비밀번호 확인 클릭시
    $('.findPw_btn').click(function() {
        var userId = $('input[name=userId]').val();
        var firstEmail = $('input[name=emailId]').val();
        var emailDomain = $('input[name=emailDomain]').val();
        var companyName = $('input[name=companyName]').val();
        if (userId == "") {
            alert("아이디를 입력해 주세요.");
            return false;
        } else if (firstEmail == "" || emailDomain == "") {
            alert("이메일을 입력해 주세요.");
            return false;
        } else if (companyName == "") {
            alert("법인명을 입력해 주세요.");
            return false;
        } 
        var userEmail = firstEmail + "@" + emailDomain;
        var msg = {
            userId: userId,
            userEmail: userEmail,
            companyName: companyName
        }
        var callback = function(data) {
            if (data.resultCode == "0000") {
                alert(data.resultMessage);
                location.href = "/index.html";
            } else if (data.resultCode == "0502") {
                alert(data.resultMessage);
            }
        }
        doPost("FIND_PW", msg, callback);
    });
/** find_pw */
}