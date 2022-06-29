window.onload = function(){
    getUserId();
    // 보내는분 불러오기
    getFrom();
    // 보내는분 등록
    $("input[name='fromTxtBtn']").click(function() {
        var fromTxt = $("input[name='fromTxt']").val();
        if (fromTxt == "") {
            alert("보내는분은 입력해주세요.");
            $("intput[name='fromTxt']").focus();
        } else {
            var msg = {
                actionType: "INSERT",
                userId: userId,
                fromId: fromTxt
            }
            var callback = function(data) {
                location.reload();
            }
            doPost("SET_FROM", msg, callback);
        }
    });
}
// 보내는분 가져오기
function getFrom() {
    var msg = {
        userId: userId
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var resultData = data.resultData;
            var resultLen = resultData.length;
            for (var i = 0; i < resultLen; i ++) {
                var html = "<tr>";
                html += "<td>" + (i + 1) + "</td>";
                html += "<td class='fromContents'>" + resultData[i].fromId + "</td>";
                html += "<td><input type='button' class='btn' name='delete' value='삭제'></td>" 
                html += "</tr>";
                $("table tbody").append(html);
            }
            // 삭제하기
            $("input[name='delete']").click(function() {
                var setMsg = {
                    actionType: "DELETE",
                    userId: userId,
                    fromId: $(this).parent().parent().find(".fromContents").html()
                }
                var setCallback = function(data) {
                    if (data.resultCode == "0000") {
                        location.reload();
                    } else {
                        alert(data.resultMessage);
                    }
                }
                doPost("SET_FROM", setMsg, setCallback);
            });
            // 보내는분 선택 시
            $(".fromContents").click(function() {
                var fromTxt = $(this).html()
                $("input[name='orderFrom']",opener.document).val(fromTxt);
                top.window.close();
            });
        } else {
            alert(data.resultMessage);
        }
    }
    doPost("GET_FROM", msg, callback);
}