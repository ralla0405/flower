var serverUrl = "https://www.sinho2016.com:444";
var userId = "";
var authType = "";
var shippingAddr = "";
var IMP;
window.onload = function(){
    // 사용자 아이디 가져오기
    var id = getCookie("USER_ID");
    if(id != null) {
        userId = window.atob(unescape(id.split('sin')[1]));
    }
    // 사용자 정보 가져오기 
    getUser("noneList");
    // 포인트 충전완료
    if (location.href.includes('point_ok')) {
        var width = window.innerWidth;
        getPointResult(width);
    }
    // 가상계좌
    if (location.href.includes('vbank')) {
        getVbank();
    }
}
// 결제결과 가져오기
function getPointResult(width) {
    var request = new Request();
    var merchant_uid = request.getParameter('merchant_uid');
    var is = request.getParameter('imp_success');
    // 모바일
    if (width <= 767) {
        var imp_uid = request.getParameter('imp_uid');
        jQuery.ajax({
            url: serverUrl+"/appapi/SET_POINT_MOBILE/appRequest.do",
            type: "POST",
            dataType: 'json',
            data: {
                imp_uid: imp_uid,
                merchant_uid: merchant_uid,
                vbank_num: "",
                vbank_name: "",
                vbank_holder: "",
                vbank_date: "",
                receipt: "",
                status: is
            }
        }).done(function(data) {
            if(data.resultCode == "0000") {
                
            }
        });
    }
    //PC
    else {
        jQuery.ajax({
            url: serverUrl+"/appapi/GET_POINT/appRequest.do",
            type: "POST",
            dataType: 'json',
            data: {
                actionType: "FINDONE",
                merchant_uid: merchant_uid
            }
        }).done(function(data) {
            var result = data.resultData;
            if (is == 'true') {
                $('.merchant_uid').html(result.merchant_uid);
                $('.chargePoint').html(setComma(result.chargePoint));
                $('.totalPoint').html(setComma(result.totalPoint));
                if (result.pay_method == "point") {
                    $('.payWay').html("카카오페이");
                    $('.payInfo').html("<a href='"+result.receipt+"' class='text-decoration-none' onClick='window.open(this.href,\"\",\"width=421,height=513\"); return false;' style='color: blue;'>영수증</a>");
                } else if (result.pay_method == "card") {
                    $('.payWay').html("신용카드");
                    $('.payInfo').html("<a href='"+result.receipt+"' class='text-decoration-none' onClick='window.open(this.href,\"\",\"width=421,height=513\"); return false;' style='color: blue;'>매출전표</a>");
                } else if (result.pay_method == "vbank") {
                    $('.payWay').html("가상계좌");
                    $('.payInfo').html(result.vbank_name+" "+result.vbank_num+"<br>"+"예금주: 농업회사법인 신호(주) <br>유효기간: "+result.vbank_date);
                }
            } else if (is == 'false') {
                $(".orderok-title h1").html("<i class='bi bi-credit-card-2-front-fill'></i> 포인트 충전실패");
                $('.merchant_uid').html(result.merchant_uid);
                $('.chargePoint').html('결제실패');
                $('.totalPoint').html(setComma(result.totalPoint));
                if (result.pay_method == "point") {
                    $('.payWay').html("카카오페이");
                } else if (result.pay_method == "card") {
                    $('.payWay').html("신용카드");
                } else if (result.pay_method == "vbank") {
                    $('.payWay').html("가상계좌");
                }
            }
            
        });
    }
}
// 가상계좌정보 가져오기
function getVbank() {
    var request = new Request();
    var merchant_uid = request.getParameter('merchant_uid');
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_POINT/appRequest.do",
        type: "POST",
        dataType: 'json',
        data: {
            actionType: "FINDONE",
            merchant_uid: merchant_uid
        }
    }).done(function(data) {
        var result = data.resultData;
        $('.vbank_name').html(result.vbank_name);
        $('.vbank_num').html(result.vbank_num);
        $('.vbank_holder').html(result.vbank_holder);
    });
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
// comma 표시
function setComma(num) {
    var len,point,str;

    num = num + "";
    point = num.length % 3;
    len = num.length;

    str = num.substring(0, point);
    while(point<len) {
        if(str != "") str += ",";
        str += num.substring(point,point+3);
        point += 3;
    }
    return str;
}