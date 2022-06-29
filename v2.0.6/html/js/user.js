$(function() {
    if (getUserId() != null) {
        startMain();
    }
})
window.onload = function(){
/** user_update */
    if (location.href.includes('user_update.html')) {
        var msg = {
            actionType: "FINDONE",
            userId: userId
        }
        var callback = function(data) {
            if(data.resultCode == "0000") {
                var result = data.resultData;
                $("input[name=comName]").val(result.companyName);
                $("input[name=ceoName]").val(result.ceoName);
                $(".userId").html(result.userId);
                $("input[name=userPw]").val("");
                $("input[name=userMobile]").val(result.userPhone);
                $("input[name=userEmail]").val(result.userEmail.split('@')[0]);
                $("input[name=emailDomain]").val(result.userEmail.split('@')[1]);
                $("input[name=userTel]").val(result.userTel);
                $("input[name=comNumber]").val(result.companyNumber);
                $("input[name=userFax]").val(result.userFax);
                $("input[name=post]").val(result.companyAddress.split("/")[0]);
                $("input[name=addr]").val(result.companyAddress.split("/")[1]);
                $("input[name=extraAddr]").val(result.companyAddress.split("/")[2]);
            } else {
                alert("서버 오류입니다.");
            }
        }
        doPost("GET_USER", msg, callback);
        // 사용자 정보 변경 이벤트
        $('.changeUser').click(function(){
            var width = window.innerWidth;
            if (width < 800) {
                updateUser('mobile');
            } else {
                updateUser('pc');
            }
        });
    }
/** user_update */
/** user_list */
    if (location.href.includes("user_list.html")) {
        getUser('noneList');
    }
/** user_list */
/** pw_change */
    if (location.href.includes("pw_change.html")) {
        var request = new Request();
        var pwToken = decodeURIComponent(unescape(request.getParameter('pwToken'), "UTF-8"));
        var msg = {
            pwToken: pwToken
        }
        var callback = function(data) {
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
                            var setMsg = {
                                userId: userId,
                                pwToken: pwToken,
                                newPw: newPw
                            }
                            var setCallback = function(setData) {
                                var code2 = setData.resultCode;
                                var msg2 = setData.resultMessage;
                                if (code2 == "0000") {
                                    alert(msg2);
                                    location.replace("/index.html");
                                } else {
                                    alert(msg2);
                                }
                            }
                            doPost("SET_TOKEN", setMsg, setCallback);
                        }
                    }
                });
            } else if (code == "0106") {
                alert(msg);
                location.replace('/');
            } else {
                alert(msg);
            }
        }
        doPost("GET_TOKEN", msg, callback);
    }
/** pw_change */
}
// 사용자 정보 변경 
function updateUser(type) {
    if (type == 'mobile') {
        var userId = $(".mobile .userId").html();
        var companyName = $(".mobile input[name=comName]").val();
        var ceoName = $(".mobile input[name=ceoName]").val();
        var userPw = $(".mobile input[name=userPw]").val();
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
        var userId = $(".userId").html();
        var companyName = $("input[name=comName]").val();
        var ceoName = $("input[name=ceoName]").val();
        var userPw = $("input[name=userPw]").val();
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
    }if(userPhone == '') {
        alert('휴대폰 번호를를 입력해주세요.');
        $("input[name='userMobile']").focus();
        return false;
    }else if(beforeEmail == '' || afterEmail == '') {
        alert('이메일주소를 입력해주세요.');
        $("input[name='userEmail']").focus();
        return false;
    }else if(companyNumber == ''){
        alert('사업자번호를 입력해주세요.');
        $("input[name='comNumber']").focus();
        return false;
    }else if(preAddress == '') {
        alert('사업장 주소를 입력해주세요.');
        return false;
    }else if(companyExtraAddress == '') {
        alert('상세주소를 입력해주세요.');
        $("input[name='extraAddr']").focus();
        return false;
    }
    var msg = {
        actionType: "UPDATE",
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
        if (data.resultCode == "0000") {
            alert(data.resultMessage);
            location.replace('/dashboard.html');
        } else {
            alert("서버 오류입니다.");
        }
    }
    doPost("SET_USER", msg, callback);
}
// 회원 정보 가져오기
function getUser(kind) {
    var msg = {
        actionType: "ALL"
    }
    var callback = function(data) {
        if(data.resultCode == "0000") {
            var resultData = data.resultData;
            var resultLen = resultData.length;
            var noUserLen = 0;
            $('.tbl-cont').remove();
            for (var i = 0; i < resultLen; i++) {
                if (resultData[i].flag == "N") {
                    noUserLen += 1;
                }
                for (var j = 0; j < $('.tab li').length; j++) {
                    if ($('.tab li').eq(j).hasClass(kind)) {
                        $('.tab li').eq(j).addClass('on');
                    } else {
                        $('.tab li').eq(j).removeClass('on');
                    }
                }
                if (resultData[i].authType == "USER") {
                    if (kind == 'noneList') {
                        if (resultData[i].flag == "N") {
                            var html = "<tr class='tbl-cont'>";
                            html += "<td class='none'>미처리</td>";
                            html += "<td>"+resultData[i].companyName+"</td>";
                            html += "<td>"+resultData[i].ceoName+"</td>";
                            html += "<td>"+resultData[i].userId+"</td>";
                            html += "<td>"+resultData[i].userPhone+"</td>";
                            html += "<td>"+resultData[i].userEmail+"</td>";
                            html += "<td>"+resultData[i].userTel+"</td>";
                            html += "<td>"+resultData[i].companyNumber+"</td>";
                            html += "<td>"+resultData[i].userFax+"</td>";
                            html += "<td>"+resultData[i].companyAddress+"</td>";
                            html += "<td><select name='userType'>";
                            html += "<option value='NORMAL'>일반소비자</option>";
                            html += "<option value='COMPANY'>기업</option>";
                            html += "<option value='FLOWER'>도매직발주</option>";
                            html += "</select></td>";
                            html += "<td><input type='button' value='승인' name='approval' class='btn'></td>";
                            html += "</tr>"
                            $('.result-table tbody').append(html);
                        }
                    } else if (kind == 'userList') {
                        if (resultData[i].flag == "Y") {
                            var html = "<tr class='tbl-cont'>";
                            html += "<td class='done'>승인완료</td>";
                            html += "<td>"+resultData[i].companyName+"</td>";
                            html += "<td>"+resultData[i].ceoName+"</td>";
                            html += "<td>"+resultData[i].userId+"</td>";
                            html += "<td>"+resultData[i].userPhone+"</td>";
                            html += "<td>"+resultData[i].userEmail+"</td>";
                            html += "<td>"+resultData[i].userTel+"</td>";
                            html += "<td>"+resultData[i].companyNumber+"</td>";
                            html += "<td>"+resultData[i].userFax+"</td>";
                            html += "<td>"+resultData[i].companyAddress+"</td>";
                            html += "<td><select name='userType'>";
                            if (resultData[i].userType == "NORMAL") {
                                html += "<option value='NORMAL' selected>일반소비자</option>";
                                html += "<option value='COMPANY'>기업</option>";
                                html += "<option value='FLOWER'>도매직발주</option>";
                            } else if(resultData[i].userType == "COMPANY") {
                                html += "<option value='NORMAL'>일반소비자</option>";
                                html += "<option value='COMPANY' selected>기업</option>";
                                html += "<option value='FLOWER'>도매직발주</option>";
                            } else if(resultData[i].userType == "FLOWER") {
                                html += "<option value='NORMAL'>일반소비자</option>";
                                html += "<option value='COMPANY'>기업</option>";
                                html += "<option value='FLOWER' selected>도매직발주</option>";
                            }
                            html += "</select></td>";
                            html += "<td><input type='button' value='수정' name='userUpdate' class='btn'></td>";
                            html += "</tr>"
                            $('.result-table tbody').append(html);
                        }
                    }
                }
            }
            $(".noneList").html("미처리(" + noUserLen + ")");
            $(".userList").html("회원목록(" + (resultLen - 1 - noUserLen) + ")");
            $('.join-cnt').html(noUserLen);
            // 회원 승인처리
            $("input[name='approval']").click(function() {
                var id = $(this).parent().parent().children('td').eq(3).html();
                var type = $(this).parent().parent().find("select[name=userType]").val();
                var updateMsg = {
                    actionType: "TYPE",
                    userId: id,
                    userType: type
                }
                var updateCallback = function(updateData) {
                    if (updateData.resultCode == "0000") {
                        alert("승인 되었습니다.");
                        location.reload();
                    } else {
                        alert("서버 오류입니다.");
                    }
                }
                doPost("SET_USER", updateMsg, updateCallback);
            });
            // 회원 수정처리
            $("input[name='userUpdate']").click(function() {
                var id = $(this).parent().parent().children('td').eq(3).html();
                var type = $(this).parent().parent().find("select[name=userType]").val();
                var updateMsg = {
                    actionType: "TYPE",
                    userId: id,
                    userType: type
                }
                var updateCallback = function(updateData) {
                    if (updateData.resultCode == "0000") {
                        alert("수정 되었습니다.");
                        location.reload();
                    } else {
                        alert("서버 오류입니다.");
                    }
                }
                doPost("SET_USER", updateMsg, updateCallback);
            });
        }
    }
    doPost("GET_USER", msg, callback);
}