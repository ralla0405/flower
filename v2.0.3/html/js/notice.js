var serverUrl = "https://www.sinho2016.com:444";
var userId = "";
var authType = "";
var userData;
var shippingAddr = "";
var productChk = false;
var productData = "";

$(document).ready(function() {
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
        if(type == "LIST") { 
            if(title == "") {
                $("input[name=noticeTitle]").focus();
                alert("제목을 입력해주세요.");
            }
        } 
        jQuery.ajax({
            url: serverUrl+"/appapi/SET_NOTICE/appRequest.do",
            type: "POST",
            dataType: "json",
            data: {
                actionType: "INSERT",
                noticeId: new Date().getTime(),
                type: type,
                noticeTitle: title,
                noticeContent: contents,
                noticeDate: new Date().yyyymmdd()
            }
        }).done(function(data) {
            alert(data.resultMessage);
            location.href = "notice.html";
        });
    });
    // 공지사항 수정하기 버튼 클릭 시
    $("input[name=update]").click(function () {
        var id = $("input[name=noticeId]").val();
        var title = $("input[name=noticeTitle]").val();
        var contents = $("#summernote").summernote('code');
        var type = $("select[name=noticeType]").val();
        if(type == "LIST") { 
            if(title == "") {
                $("input[name=noticeTitle]").focus();
                alert("리스트 유형에선 제목을 입력해주세요.");
            }
        } 
        jQuery.ajax({
            url: serverUrl+"/appapi/SET_NOTICE/appRequest.do",
            type: "POST",
            dataType: "json",
            data: {
                actionType: "UPDATE",
                noticeId: id,
                type: type,
                noticeTitle: title,
                noticeContent: contents,
                noticeDate: new Date().yyyymmdd()
            }
        }).done(function(data) {
            alert(data.resultMessage);
            location.href = "notice.html";
        });
    });
});
// getDate
Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [this.getFullYear(),
        '-',
        (mm>9? '': '0')+ mm,
        '-',
        (dd>9? '': '0')+ dd].join('');
}