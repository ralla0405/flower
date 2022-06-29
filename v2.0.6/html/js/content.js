$(function() {
    if (getUserId() != null) {
        startMain();
        getNoticeNumber();
    }
})
window.onload = function(){
    // 내용넣기
    pushData();
    // 최종금액
    calPrice();
    // 주문페이지 넘어가기
    $('.order-btn').click(function(){
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
    });
    // 품질 변경시
    $("input[name=quality]").change(function() {
        var quality = $(this).val();
        var productPrice = decodeURIComponent(escape(window.atob(unescape(getCookie('PDPC'))))).split('kirin')[0];
        switch (quality) {
            case "normal":
                $('.order-info').find(".pri").html(productPrice);
                break;
            case "advanced":
                calPri = Math.ceil((setNumber(productPrice) * (1 + Number(pricePercent.advanced) / 100 )) / 1000) * 1000;
                $('.order-info').find(".pri").html(setCommaWon(calPri));
                setCookie('PDQR',btoa(unescape(encodeURIComponent(pricePercent.advanced+"kirin"))));
                break;
            case "highend":
                calPri = Math.ceil((setNumber(productPrice) * (1 + Number(pricePercent.highend) / 100 )) / 1000) * 1000;
                $('.order-info').find(".pri").html(setCommaWon(calPri));
                setCookie('PDQR',btoa(unescape(encodeURIComponent(pricePercent.highend+"kirin"))));
                break;
        }
        calPrice();
    });    
}
// 내용넣기
function pushData() {
    var productId = window.atob(unescape(getCookie('PDID'))).split('kirin')[0];
    var productName = decodeURIComponent(escape(window.atob(unescape(getCookie('PDNM'))))).split('kirin')[0];
    var productInfo = decodeURIComponent(escape(window.atob(unescape(getCookie('PDIF'))))).split('kirin')[0];
    var productSrc = decodeURIComponent(escape(window.atob(unescape(getCookie('PDSC'))))).split('kirin')[0];
    var productType = window.atob(unescape(getCookie('PDTP'))).split('kirin')[0];
    var productCate = window.atob(unescape(getCookie('PDCA'))).split('kirin')[0];
    var productPrice = decodeURIComponent(escape(window.atob(unescape(getCookie('PDPC'))))).split('kirin')[0];
    var shippingPrice = 0;
    var shipState = decodeURIComponent(escape(window.atob(unescape(getCookie('PDSS'))))).split('kirin')[0];
    var plusShippingPrice = window.atob(unescape(getCookie('PSPC'))).split('kirin')[0];
    $('.nav-title-mobile').html(productName);
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