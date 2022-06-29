$(function() {
    if (getUserId() != null) {
        startMain();
        getNoticeNumber();
    }
})
$(document).ready(function() {
/** notice.html */
    if (location.href.includes("notice.html")) {
        getNotices();
    }
/** notice.html */
/** notice_content.html */
    if (location.href.includes("notice_cont.html")) {
        var request = new Request();
        var noticeId = decodeURIComponent(unescape(request.getParameter('id'), "UTF-8"));
        var msg = {
            actionType: "FINDONE",
            noticeId: noticeId
        }
        var callback = function(data) {
            if (data.resultCode == "0000") {
                var result = data.resultData;
                if (authType == "ADMIN") {
                    $(".admin").show();
                    $(".user").hide();
                    $(".nav-title-mobile").html(result.noticeTitle);
                    $("input[name=noticeTitle]").val(result.noticeTitle);
                    $("input[name=noticeId]").val(result.noticeId);
                    $("select[name=noticeType]").val(result.type).prop('selected', true);
                    $(".day").html("작성일 : " + result.noticeDate);
                    $(".hits").html("조회수 : " + result.noticeCnt);
                    $("#summernote").summernote({
                        height: 400
                    });
                    $("#summernote").summernote("code", result.noticeContent);
                    // 공지사항 수정하기 버튼 클릭 시
                    $("input[name=update]").click(function () {
                        var id = $("input[name=noticeId]").val();
                        var title = $("input[name=noticeTitle]").val();
                        var contents = $("#summernote").summernote('code');
                        var type = $("select[name=noticeType]").val();
                        if (type == "LIST") { 
                            if (title == "") {
                                $("input[name=noticeTitle]").focus();
                                alert("리스트 유형에선 제목을 입력해주세요.");
                            }
                        } 
                        var updateMsg = {
                            actionType: "UPDATE",
                            noticeId: id,
                            type: type,
                            noticeTitle: title,
                            noticeContent: contents,
                            noticeDate: new Date().yyyymmdd()
                        }
                        var updateCallback = function(updateData) {
                            if (updateData.resultCode == "0000") {
                                alert(updateData.resultMessage);
                                location.href = "notice.html";
                            } else {
                                alert("서버 오류입니다.");
                            }
                        }
                        doPost("SET_NOTICE", updateMsg, updateCallback);
                    });
                } else if (authType == "USER") {
                    $(".admin").hide();
                    $(".user").show();
                    $(".nav-title-mobile").html(result.noticeTitle);
                    $(".noticeTitle").html(result.noticeTitle);
                    $(".day").html("작성일 : " + result.noticeDate);
                    $(".hits").html("조회수 : " + result.noticeCnt);
                    $(".noticeContent").html(result.noticeContent);
                }
            } else {
                alert("서버 오류입니다.");
            }
        }
        doPost("GET_NOTICE", msg, callback);
    }
/** notice_content.html */
/** notice_insert.html */
    if (location.href.includes("notice_insert.html")) {
        // 공지사항 게시글 실행
        $('#summernote').summernote({
            height: 400,
            focus: true,
            lang: 'ko-KR',
            toolbar: [
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['style', ['bold', 'italic', 'underline','strikethrough', 'clear']],
                ['color', ['forecolor','color']],
                ['table', ['table']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert',['picture','link','video']],
                ['view', ['fullscreen', 'help']]
            ],
            placeholder: '내용을 입력해주세요.',
            fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New','맑은 고딕','궁서','굴림체','굴림','돋움체','바탕체'],
            fontSizes: ['8','9','10','11','12','14','16','18','20','22','24','28','30','36','50','72'],
            maximumImageFileSize: 500*1024*7
        });
        // 공지사항 등록하기 버튼 클릭 시
        $("input[name=insert]").click(function () {
            var title = $("input[name=noticeTitle]").val();
            var contents = $("#summernote").summernote('code');
            var type = $("select[name=noticeType]").val();
            if (type == "LIST") { 
                if (title == "") {
                    $("input[name=noticeTitle]").focus();
                    alert("제목을 입력해주세요.");
                }
            } 
            var insertMsg = {
                actionType: "INSERT",
                noticeId: new Date().getTime(),
                type: type,
                noticeTitle: title,
                noticeContent: contents,
                noticeDate: new Date().yyyymmdd()
            }
            var insertCallback = function(insertData) {
                if (insertData.resultCode == "0000") {
                    alert(insertData.resultMessage);
                    location.href = "notice.html";
                } else {
                    alert("서버 오류입니다.");
                }
            }
            doPost("SET_NOTICE", insertMsg, insertCallback);
        });
    }
/** notice_insert.html */
});
// 공지사항 조회
function getNotices() {
    var msg = {
        actionType: "ALL"
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var result = data.resultData;
            var resultLen = result.length;
            $(".admin").hide();
            var listCnt = 0;
            if (authType == "ADMIN") {
                for (var i = 0; i < resultLen; i++) {
                    listCnt ++;
                    var html = "<tr>";
                    html += "<td><label><input type='checkbox' name='nList'><span></span></label></td>";
                    html += "<th scope='row'>";
                    html += listCnt + "</th>";
                    html += "<td class='noticeType'>"
                    if (result[i].type == "LIST") {
                        html += "리스트";
                    } else if (result[i].type == "POPUP") {
                        html += "팝업";
                    }
                    html += "</td>";
                    html += "<td class='noticeTitle'>";
                    html += result[i].noticeTitle + "</td>";
                    html += "<td class='noticeDate'>";
                    html += result[i].noticeDate + "</td>";
                    html += "<td class='noticeCnt'>";
                    html += result[i].noticeCnt + "</td>";
                    html += "<input type='hidden' name='noticeId' value='" + result[i].noticeId + "'>";
                    html += "</tr>";
                    $('.table tbody').append(html);
                }
                $(".admin").show();
                var html = "";
                html += "<div class='notice-insert'>";
                html += "<input type='button' class='btn' name='deleteNotice' value='삭제' style='background: red; color: white; margin-right: 10px;'>";
                html += "<input type='button' class='btn' name='insertNotice' value='글쓰기'>";
                html += "</div>";
                $(".body-content").append(html);
                // 공지사항 제목 클릭 시
                $(".noticeTitle").click(function() {
                    var noticeId = $(this).parent().find("input[name=noticeId]").val();
                    var url = "notice_cont.html";
                    url += "?id=" + escape(encodeURIComponent(noticeId),"UTF-8");
                    location.href = url;
                });
                // 공지사항 삭제 클릭 시
                $("input[name=deleteNotice]").click(function() {
                    var html = $("input[name='nList']:checked");
                    var len = html.length;
                    if (len == 0) {
                        alert("선택된 공지사항이 없습니다.\n삭제할 공지사항을 선택해주세요.");
                    } else {
                        if (confirm("선택한 공지사항을 \n정말 삭제하시겠습니까?")) {
                            var noticeId = [];
                            for (var i = 0; i < len; i++) {
                                noticeId.push(html.eq(i).parent("label").parent("td").parent("tr").find("input[name=noticeId]").val());
                            }
                            var deleteMsg = {
                                actionType: "DELETE",
                                noticeId: noticeId
                            }
                            var deleteCallback = function(data) {
                                if (data.resultCode == "0000") {
                                    alert(data.resultMessage);
                                    location.reload();
                                } else {
                                    alert("서버 오류입니다.");
                                }
                            }
                            doPost("SET_NOTICE", deleteMsg, deleteCallback);
                        }
                    }
                });
                // 공지사항 글쓰기 클릭 시
                $("input[name=insertNotice]").click(function() {
                    location.href = "notice_insert.html";
                });
            } else if (authType == "USER") {
                for (var i = 0; i < resultLen; i++) {
                    if (result[i].type == "LIST" ) {
                        listCnt++;
                        var html = "<tr>";
                        html += "<th scope='row'>";
                        html += listCnt + "</th>";
                        html += "<td class='noticeTitle'>";
                        html += result[i].noticeTitle + "</td>";
                        html += "<td class='noticeDate'>";
                        html += result[i].noticeDate + "</td>";
                        html += "<td class='noticeCnt'>";
                        html += result[i].noticeCnt + "</td>";
                        html += "<input type='hidden' name='noticeId' value='" + result[i].noticeId + "'>";
                        html += "</tr>";
                        $('.table tbody').append(html);
                    }
                }
                // 공지사항 제목 클릭 시
                $(".noticeTitle").click(function() {
                    var noticeId = $(this).parent().find("input[name=noticeId]").val();
                    var viewMsg = {
                        noticeId: noticeId
                    }
                    var viewCallback = function(data) {
                        if (data.resultCode == "0000") {
                            var url = "notice_cont.html";
                            url += "?id=" + escape(encodeURIComponent(noticeId),"UTF-8");
                            location.href = url;
                        } else {
                            alert("서버 오류입니다.");
                        }
                    }
                    doPost("SET_NOTICE_VIEW", viewMsg, viewCallback);
                });
            }
            
        } else {
            alert("서버 오류입니다.");
        }
    }
    doPost("GET_NOTICE", msg, callback);
}
// 공지사항 목록으로 가기 notice
function goList() {
    location.href = "notice.html";
}