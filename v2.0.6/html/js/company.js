$(function() {
    if (getUserId() != null) {
        startMain();
        getNoticeNumber();
    }
})
window.onload = function() {
/** company.html */
    if (location.href.includes('company_list.html')) {
        getCompany();
        // 등록하기 이벤트
        $('.companyInsert').click(function() {
            $('.companyList').removeClass('on');
            $('.companyInsert').addClass('on');
            $('.tbl-cont').remove();
            $('.bottom').remove();
            $('.body-content.company').append("<div class='bottom'><input type='button' value='등록' name='insert' class='btn'></div>")
            var html = "<tr class='tbl-cont'>";
            html += "<td>자동</td>";
            html += "<td><input type='text' name='companyName' class='form-control'></td>";
            html += "<td><input type='text' name='companyTel' class='form-control'></td>";
            html += "<td class='plusTd'><input type='button' name='insertPlus' class='form-control' value='추가' onclick='plusCompany();' style='width:150px; margin:0 auto;'></td>";
            html += "</tr>"
            $('.result-table tbody').append(html);
            // 등록버튼 클릭시
            $("input[name='insert']").click(function() {
                var html = $('.tbl-cont');
                var ajsonArray = new Array();
                for (var i = 0; i < html.length; i++) {
                    var ajson = new Object();
                    ajson.companyName =  html.eq(i).children().children("input[name='companyName']").val();
                    ajson.companyTel = html.eq(i).children().children("input[name='companyTel']").val();
                    ajsonArray.push(ajson);
                }
                var msg = {
                    actionType: "INSERT",
                    data: ajsonArray
                }
                var callback = function(data) {
                    if (data.resultCode == "0000") {
                        alert("등록되었습니다.");
                        $('.bottom').remove();
                        location.reload();
                    } else {
                        alert("서버 오류입니다.");
                    }
                }
                doPost("SET_COMPANY", msg, callback);
            });
        });
    }
/** company.html */
}
// 업체관리 가져오기
function getCompany() {
    $('.companyInsert').removeClass('on');
    $('.companyList').addClass('on');
    $('.tbl-cont').remove();
    var msg = {
        actionType: "ALL"
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var result = data.resultData;
            var resultLen = result.length;
            $('.companyList').html("업체목록(" + resultLen + ")");
            for (var i = 0; i < resultLen; i++) {
                var html = "";
                html += "<tr class='tbl-cont'>";
                html += "<td class='companyId' name='" + result[i].companyId + "'>" + (i + 1) + "</td>";
                html += "<td class='companyName'>" + result[i].companyName + "</td>";
                html += "<td class='companyTel'>" + result[i].companyTel + "</td>";
                html += "<td class='process'><input type='button' value='수정' name='update' class='btn'></td>";
                html += "</tr>"
                $('.result-table tbody').append(html);
            }
            // 수정하기
            $("input[name='update']").click(function() {
                $(this).parent("td").parent("tr").addClass('update');
                $("input[name='confirm']").remove();
                var companyName = $(this).parent("td").parent("tr").children(".companyName").html();
                var companyTel = $(this).parent("td").parent("tr").children(".companyTel").html();
                $(this).parent("td").parent("tr").children('.companyName').html("<input type='text' value='" + companyName + "' name='companyName' class='form-control'>");
                $(this).parent("td").parent("tr").children('.companyTel').html("<input type='text' value='" + companyTel + "' name='companyTel' class='form-control'>");
                $(this).parent("td").parent("tr").children('.process').html("<input type='button' value='확인' name='confirm' class='btn'><input type='button' value='삭제' name='delete' class='btn'>");
                // 수정 확인 버튼
                $("input[name='confirm']").click(function() {
                    $(".spinner-wrap").show();
                    var html = $('.tbl-cont.update');
                    var ajsonArray = new Array();
                    for (i = 0; i < html.length; i++) {
                        var ajson = new Object();
                        ajson.companyId = html.eq(i).children(".companyId").attr('name');
                        ajson.companyName = html.eq(i).children().children("input[name='companyName']").val();
                        ajson.companyTel =  html.eq(i).children().children("input[name='companyTel']").val();
                        ajsonArray.push(ajson);
                    }
                    var updateMsg = {
                        actionType: "UPDATE",
                        data: ajsonArray
                    }
                    var updateCallback = function(updateData) {
                        $(".spinner-wrap").hide();
                        if (updateData.resultCode == "0000") {
                            alert("수정되었습니다.");
                        } else {
                            alert("서버오류입니다.");
                        }
                        location.reload();
                    }
                    doPost("SET_COMPANY", updateMsg, updateCallback);
                });
                // 삭제하기
                $("input[name='delete']").click(function() {
                    if (confirm("해당 업체를 정말 삭제하시겠습니까?")) {
                        var updateMsg = {
                            actionType: "DELETE",
                            companyId: $(this).parent("td").parent("tr").children(".companyId").attr('name')
                        }
                        var updateCallback = function(updateData) {
                            if (updateData.resultCode == "0000") {
                                location.reload();
                            } else {
                                alert("서버오류입니다.");
                            }
                        }
                        doPost("SET_COMPANY", updateMsg, updateCallback);
                    }
                });
            });
        }
    }
    doPost("GET_COMPANY", msg, callback);
}
// 업체관리 추가하기
function plusCompany() {
    $('.plusTd').empty();
    var html = "<tr class='tbl-cont'>";
    html += "<td>자동</td>";
    html += "<td><input type='text' name='companyName' class='form-control'></td>";
    html += "<td><input type='text' name='companyTel' class='form-control'></td>";
    html += "<td class='plusTd'><input type='button' name='insertPlus' class='form-control' value='추가' onclick='plusCompany();' style='width:100px; margin:0 auto;'></td>";
    html += "</tr>"
    $('.result-table tbody').append(html);
}