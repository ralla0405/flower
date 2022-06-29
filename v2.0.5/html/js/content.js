var serverUrl = "https://www.sinho2016.com:444";
var userId = "";
var authType = "";
var userData;
var shippingAddr = "";
var productId = "";
window.onload = function(){
    // 사용자 아이디 가져오기
    var id = getCookie("USER_ID");
    if(id != null) {
        userId = window.atob(unescape(id.split('sin')[1]));
    }
    // 주소 가져오기
    var addr = getCookie("SHIP_ADDR");
    if(addr != null) {
        shippingAddr = decodeURIComponent(escape(window.atob(unescape(addr.split('kfpn')[1]))));
        $("input[name='search-address']").val(shippingAddr);
    }
    // 사용자 정보 가져오기 
    getUser("noneList");
    // 내용넣기
    pushData();
    // 최종금액
    calPrice();
    // 주문하기
    $('.order-btn').click(function(){
        // 주문페이지 넘어가기
        if (productId != "999999") { 
            if(userId == "") {
                alert("로그인 후 주문이 가능합니다.")
                location.href="/index.html";
            }else{
                var productCnt = $("input[name='productCnt']").val();
                var finalOrderPrice = $('.sumPrice').html();
                var quality = $("input[name=quality]:checked").val();
                setCookie('PDCT',btoa(productCnt+"kirin"));
                setCookie('ODPC',btoa(unescape(encodeURIComponent(finalOrderPrice+"kirin"))));
                setCookie('PDQL',btoa(unescape(encodeURIComponent(quality+"kirin"))));
                location.href="/order.html";
            }
        } else {
            var productCnt = $("input[name='productCnt']").val();
            var userName = $("input[name=requestUserName]").val();
            var userPhone = $("input[name=requestUserPhone]").val();
            var productName = $("input[name=requestProduct]").val();
            var productPrice = $("input[name=requestPrice]").val();
            var quality = $("input[name=quality]:checked").val();
            var finalOrderPrice = $('.sumPrice').html();
            if (userName == "") {
                alert("주문자 성함을 적어주세요.");
                $("input[name=requestUserName]").focus();
                return false;
            } else if (userPhone == "") {
                alert("주문자 핸드폰 번호를 적어주세요.");
                $("input[name=requestUserPhone]").focus();
                return false;
            } else if (productName == "") {
                alert("구매하시고자 하는 상품을 적어주세요.");
                $("input[name=requestProduct]").focus();
                return false;
            } else if (productPrice == "") {
                alert("구매하시고자 하는 상품의 금액을 적어주세요.");
                $("input[name=requestPrice]").focus();
                return false;
            }
            setCookie('PDCT',btoa(productCnt+"kirin"));
            setCookie('RQUN',btoa(unescape(encodeURIComponent(userName+"kirin"))));
            setCookie('RQUP',btoa(unescape(encodeURIComponent(userPhone+"kirin"))));
            setCookie('ODPC',btoa(unescape(encodeURIComponent(finalOrderPrice+"kirin"))));
            setCookie('PDQL',btoa(unescape(encodeURIComponent(quality+"kirin"))));
            setCookie('PDQR',btoa(unescape(encodeURIComponent("0kirin"))));
            setCookie('PDPC',btoa(unescape(encodeURIComponent(productPrice+"kirin"))));
            setCookie('PDSS',btoa(unescape(encodeURIComponent("truekirin"))));
            location.href="/order.html";
        }
    });
    // 로그아웃
    $('.logout-btn').click(function(){
        deleteCookie('AUTO_LOGIN');
        deleteCookie('USER_ID');
        deleteCookie('SHIP_ADDR');
        location.replace("/");
    });
    // 품질 변경시
    $("input[name=quality]").change(function() {
        var quality = $(this).val();
        var productPrice = decodeURIComponent(escape(window.atob(unescape(getCookie('PDPC'))))).split('kirin')[0];
        jQuery.ajax({
            url: serverUrl+"/appapi/GET_PRICE/appRequest.do",
            type: "POST",
            dataType: "json",
            data: {
                actionType: "price"
            }
        }).done(function(data) {
            var result = data.resultData;
            var calPri = 0;
            switch (quality) {
                case "normal":
                    $('.order-info').find(".pri").html(productPrice);
                    break;
                case "advanced":
                    calPri = Math.ceil((setNumber(productPrice) * (1 + Number(result.advanced) / 100 )) / 1000) * 1000;
                    $('.order-info').find(".pri").html(setCommaWon(calPri));
                    setCookie('PDQR',btoa(unescape(encodeURIComponent(result.advanced+"kirin"))));
                    break;
                case "highend":
                    calPri = Math.ceil((setNumber(productPrice) * (1 + Number(result.highend) / 100 )) / 1000) * 1000;
                    $('.order-info').find(".pri").html(setCommaWon(calPri));
                    setCookie('PDQR',btoa(unescape(encodeURIComponent(result.highend+"kirin"))));
                    break;
            }
            // 최종금액
            calPrice();
        });
    });
    // 뒤로가기
    $('.bi-chevron-left').click(function() {
        window.history.back();
    });
}
// 내용넣기
function pushData() {
    productId = window.atob(unescape(getCookie('PDID'))).split('kirin')[0];
    var productName = decodeURIComponent(escape(window.atob(unescape(getCookie('PDNM'))))).split('kirin')[0];
    var productInfo = decodeURIComponent(escape(window.atob(unescape(getCookie('PDIF'))))).split('kirin')[0];
    var productSrc = decodeURIComponent(escape(window.atob(unescape(getCookie('PDSC'))))).split('kirin')[0];
    $('.nav-title-mobile').html(productName);
    if (productId != "999999") {
        var productType = window.atob(unescape(getCookie('PDTP'))).split('kirin')[0];
        var productCate = window.atob(unescape(getCookie('PDCA'))).split('kirin')[0];
        var productPrice = decodeURIComponent(escape(window.atob(unescape(getCookie('PDPC'))))).split('kirin')[0];
        var shippingPrice = 0;
        var shipState = decodeURIComponent(escape(window.atob(unescape(getCookie('PDSS'))))).split('kirin')[0];
        var plusShippingPrice = window.atob(unescape(getCookie('PSPC'))).split('kirin')[0];
        setCookie('PDQR',btoa(unescape(encodeURIComponent("0kirin"))));
        $(".order-info input[name='productId']").val(productId);
        $(".order-info input[name='productType']").val(productType);
        $(".order-info input[name='productCate']").val(productCate);
        $('.presentName').html(productName);
        $('.order-info .infoName').html(productName);
        $('.product-detail').find('div.detailProductName').html(productName);
        $('.product-detail').find('div.detailProductInfo').html(productInfo);
        $('.product-detail').find('img').attr('src',productSrc);
        $('.order-info').find('.pri').html(productPrice);
        $('.order-info').find('.shippingPri').html(shippingPrice);
        $('.order-info').find("input[name='plusShipping']").val(plusShippingPrice);
        $('.order-info').find("input[name=shipState]").val(shipState);
    } else {
        $(".normalOrder").hide();
        $(".requestOrder").show();
        $(".priTh").html("요청금액");
        $(".priTd").append("<input type='text' name='requestPrice' oninput='checkPrice(this)'>");
        $('.presentName').html(productName);
        $('.product-detail').find('div.detailProductName').html(productName);
        $('.product-detail').find('div.detailProductInfo').html(productInfo);
        $('.product-detail').find('img').attr('src',productSrc);
        setCookie('PDQR',btoa(unescape(encodeURIComponent("0kirin"))));
        // 요청금액 작성 후
        $("input[name=requestPrice]").bind("blur",function() {
            var price = $("input[name=requestPrice]").val();
            $(".pri").html(setCommaWon(price));
            calPrice();
        });
    }
}
// 요청금액 숫자만 입력
function checkPrice(obj) {
    obj.value = obj.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
}
// 개수 증감
function plusMinus(ob) {
    var type = ob.getAttribute("class");
    var cnt = Number($("input[name='productCnt']").val());
    if(type == "btn-plus") {
        cnt += 1;
    }else if(type == "btn-minus") {
        cnt -= 1;
        if(cnt < 1) {
            cnt = 1;
            alert("최소 1개 이상 수량을 선택하십시오.");
        }
    }
    $("input[name='productCnt']").val(cnt);
    calPrice();
}
// 최종금액 계산
function calPrice() {
    // 구매수량
    var cnt = $("input[name='productCnt']").val();
    var priceText = $('.order-info').find('p.pri').html();
    if (!priceText) {
        priceText = "0";
    }
    // 판매가격
    var productPrice = setNumber(priceText);
    // 추가배송비
    var plusShippingPrice = $("input[name='plusShipping']").val();
    // 최종금액 계산
    var finalPrice = Number(productPrice*cnt) + Number(plusShippingPrice*(cnt-1));
    $('.sumWrap .sumPrice').html(setCommaWon(finalPrice));
    $('.plusShippingPri').html(setCommaWon(Number(plusShippingPrice*(cnt-1))));
}
// comma 원 표시
function setCommaWon(num) {
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
    return str+"원";
}
// comma 원 제거
function setNumber(str) {
    var len,point,num;
    
    len = str.length;
    point = 0;
    num = str.substring(0,point);
    while(point<len) {
        if(str.substring(point,point+1) != ",") {
            num += str.substring(point,point+1);
        }
        point += 1;
    }
    return Number(num.split('원')[0]);
}