var serverUrl = "https://www.sinho2016.com:444";
var userId = "";
var authType = "";
var shippingAddr = "";
var IMP;
window.onload = function(){
    // 보내는분 선택 시
    $(".fromContents").click(function() {
        console.log($(this).html());
        $("input[name='orderFrom']").val($(this).html());
        //window.close();
    });
}