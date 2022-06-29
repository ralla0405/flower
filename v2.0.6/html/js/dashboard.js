$(function() {
    if (getUserId() != null) {
        startMain();
        getNoticeNumber();
    }
})
window.onload = function(){
    getProducts();
}
// 상품 정보 가져오기
function getProducts() {
    var request = new Request();
    var type = request.getParameter('type');
    // 카테고리 가져오기
    var msg = {
        categoryId: type
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var resultData = data.resultData;
            var resultLen = resultData.length;
            var html = "<div class='ssTitle'>";
            html += "<span>카테고리 \'중\'</span>";
            html += "</div>";
            html += "<div class='ssCont'>";
            for ( var i = 0; i < resultLen; i++ ) {
                html += "<div class='sBox'>";
                html += "<a href='javascript:;' onclick='getProductCate(this);' name=" + resultData[i].categorySubId + ">"
                html += resultData[i].categoryData;
                html += "</a>";
                html += "</div>";
            }
            html += "</div>";
            $(".subCateDepth2").append(html);
        } else {
            alert("서버 오류입니다.");
        }
    }
    doPost("GET_CATEGORY", msg, callback);
    // 카테고리 UI
    switch(type) {
        case "house":
            $('.presentCategory').html("관엽");
            $('.nav-title-mobile').html("관엽");
            $(".cateHouse").addClass('on');
            break;
        case "western":
            $('.presentCategory').html("서양란");
            $('.nav-title-mobile').html("서양란");
            $(".cateWestern").addClass('on');
            break;
        case "oriental":
            $('.presentCategory').html("동양란");
            $('.nav-title-mobile').html("동양란");
            $(".cateOriental").addClass('on');
            break;
        case "etc":
            $('.presentCategory').html("기타");
            $('.nav-title-mobile').html("기타");
            $(".cateEtc").addClass('on');
            break;
        default:
            $('.presentCategory').html("전체");
            $('.nav-title-mobile').html("전체");
            type = "ALL";
            break;                    
    };
    // GET_PRODUCT
    var productMsg = {
        actionType: type
    }
    var productCallback = function(data) {
        if (data.resultCode == "0000") {
            var resultData = data.resultData;
            var resultLen = resultData.length;
            if (resultLen == 0) {
                $('.content-wrap').css('height','900px');
            }
            var totalCnt = 0;
            for (var i = 0; i < resultLen; i++) {
                if (resultData[i].viewState == "Y") {
                    totalCnt += 1;
                    var html = "";
                    html += "<li>";
                    html += "<div class='liWrap'><div class='imgBox'>";
                    html += "<img src='" + resultData[i].productSrc + "' onload='changeLeft(this);'></div>";
                    html += "<div class='productName'>" + resultData[i].productName + "</div>";
                    html += "<div class='productInfo'>" + resultData[i].productInfo + "</div>";
                    if (resultData[i].shipState == "true") {
                        html += "<div class='shipState'name='true'>택배가능</div>";
                    } else {
                        html += "<div class='shipState'name='false'>　</div>";
                    }
                    if (Number(resultData[i].shipValue) >= 0) {
                        html += "<input type='hidden' class='shipValue' value='" + resultData[i].shipValue + "'>";
                    } else {
                        html += "<input type='hidden' class='shipValue' value='0'>";
                    }
                    html += "<input type='hidden' class='productId' value='" + resultData[i].productId + "'>";
                    if (userType == "NORMAL" || userType == "") {
                        html += "<div class='productPrice'><span class='price'>" + setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.consumer))/100) + "</span></div>";
                    } else if (userType == "COMPANY") {
                        html += "<div class='productPrice'><span class='price'>" + setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.company))/100) + "</span></div>";
                    } else if (userType == "FLOWER") {
                        html += "<div class='productPrice'><span class='price'>" + setCommaWon(resultData[i].productPrice) + "</span></div>";
                    }
                    html += "<input hidden type='text' value='" + resultData[i].shippingPriceExtra + "' name='plusShippingPrice'>";
                    html += "<input hidden type='text' value='" + resultData[i].productType + "' name='productType'>";
                    html += "<input hidden type='text' value='" + resultData[i].productCate + "' name='productCate'>";
                    html += "</div></div></li>"
                    $('.product-list ul').append(html);
                }
            }
            $('.total-cnt').html(totalCnt);
        } else {
            alert("서버 오류입니다.");
        }
        // 상세페이지 넘어가기
        $('.product-list li').click(function(){
            var productId = $(this).find('input.productId').val();
            var productType = $(this).find("input[name='productType']").val();
            var productCate = $(this).find("input[name='productCate']").val();
            var productName = $(this).find('div.productName').html();
            var productInfo = $(this).find('div.productInfo').html();
            var productSrc = $(this).find('img').attr('src');
            var productPrice = $(this).find('span.price').html();
            var plusShippingPrice = $(this).find("input[name='plusShippingPrice']").val();
            var shipState = $(this).find("div.shipState").attr('name');
            var shipValue = $(this).find(".shipValue").val();
            setCookie('PDID',btoa(productId + "kirin"));
            setCookie('PDTP',btoa(productType + "kirin"));
            setCookie('PDCA',btoa(unescape(encodeURIComponent(productCate + "kirin"))));
            setCookie('PDNM',btoa(unescape(encodeURIComponent(productName + "kirin"))));
            setCookie('PDIF',btoa(unescape(encodeURIComponent(productInfo + "kirin"))));
            setCookie('PDSC',btoa(unescape(encodeURIComponent(productSrc + "kirin"))));
            setCookie('PDPC',btoa(unescape(encodeURIComponent(productPrice + "kirin"))));
            setCookie('PSPC',btoa(plusShippingPrice + "kirin"));
            setCookie('PDSS',btoa(unescape(encodeURIComponent(shipState + "kirin"))));
            setCookie('PDSV',btoa(unescape(encodeURIComponent(shipValue + "kirin"))));
            var secondMsg = {
                productId: productId
            }
            var secondCallback = function() {
                if (data.resultCode == "0000") {
                    location.href = "/content.html";
                } else {
                    alert("서버 오류입니다.");
                }
            }
            doPost("SET_PRODUCT_VIEW", secondMsg, secondCallback);
        });
    }
    doPost("GET_PRODUCT", productMsg, productCallback);
}
// 카테고리 중 선택시
function getProductCate(obj) {
    $('.product-list ul').empty();
    var productType = krToen($(".subCateDepth1").find("a.on").html());
    var productCate = $(obj).html();
    $(".subCategory").html(productCate);
    $('.nav-title-mobile').html(productCate);
    // GET_PRODUCT
    var msg = {
        actionType: productType,
        productCate: productCate
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var resultData = data.resultData;
            var resultLen = resultData.length;
            if (resultLen == 0) {
                $('.content-wrap').css('height','900px');
            }
            var totalCnt = 0;
            for (var i = 0; i < resultLen; i++) {
                if (resultData[i].viewState == "Y") {
                    totalCnt += 1;
                    var html = "";
                    html += "<li>";
                    html += "<div class='liWrap'><div class='imgBox'>";
                    html += "<img src='" + resultData[i].productSrc + "' onload='changeLeft(this);'></div>";
                    html += "<div class='txtBox'></div>";
                    html += "<div class='productName'>" + resultData[i].productName + "</div>";
                    html += "<div class='productInfo'>" + resultData[i].productInfo + "</div>";
                    if (resultData[i].shipState == "true") {
                        html += "<div class='shipState'name='true'>택배가능</div>";
                    } else {
                        html += "<div class='shipState'name='false'>　</div>";
                    }
                    if (Number(resultData[i].shipValue) >= 0) {
                        html += "<input type='hidden' class='shipValue' value='" + resultData[i].shipValue + "'>";
                    } else {
                        html += "<input type='hidden' class='shipValue' value='0'>";
                    }
                    html += "<input type='hidden' class='productId' value='" + resultData[i].productId + "'>";
                    if (userType == "NORMAL") {
                        html += "<div class='productPrice'><span class='price'>" + setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.consumer))/100) + "</span></div>";
                    } else if (userType == "COMPANY") {
                        html += "<div class='productPrice'><span class='price'>" + setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.company))/100) + "</span></div>";
                    } else if (userType == "FLOWER") {
                        html += "<div class='productPrice'><span class='price'>" + setCommaWon(resultData[i].productPrice) + "</span></div>";
                    }
                    html += "<input hidden type='text' value='"+resultData[i].shippingPriceExtra+"' name='plusShippingPrice'>";
                    html += "<input hidden type='text' value='"+resultData[i].productType+"' name='productType'>";
                    html += "<input hidden type='text' value='"+resultData[i].productCate+"' name='productCate'>";
                    html += "</div></div></li>";
                    $('.product-list ul').append(html);
                }
            }
            $(obj).addClass('on');
            $('.subCateDepth2 a').not($(obj)).removeClass('on');
            $('.total-cnt').html(totalCnt);
            // 상세페이지 넘어가기
            $('.product-list li').click(function(){
                var productId = $(this).find('input.productId').val();
                var productType = $(this).find("input[name='productType']").val();
                var productCate = $(this).find("input[name='productCate']").val();
                var productName = $(this).find('div.productName').html();
                var productInfo = $(this).find('div.productInfo').html();
                var productSrc = $(this).find('img').attr('src');
                var productPrice = $(this).find('span.price').html();
                var plusShippingPrice = $(this).find("input[name='plusShippingPrice']").val();
                var shipState = $(this).find("div.shipState").attr('name');
                var shipValue = $(this).find(".shipValue").val();
                setCookie('PDID',btoa(productId + "kirin"));
                setCookie('PDTP',btoa(productType + "kirin"));
                setCookie('PDCA',btoa(unescape(encodeURIComponent(productCate + "kirin"))));
                setCookie('PDNM',btoa(unescape(encodeURIComponent(productName + "kirin"))));
                setCookie('PDIF',btoa(unescape(encodeURIComponent(productInfo + "kirin"))));
                setCookie('PDSC',btoa(unescape(encodeURIComponent(productSrc + "kirin"))));
                setCookie('PDPC',btoa(unescape(encodeURIComponent(productPrice + "kirin"))));
                setCookie('PSPC',btoa(plusShippingPrice + "kirin"));
                setCookie('PDSS',btoa(unescape(encodeURIComponent(shipState + "kirin"))));
                setCookie('PDSV',btoa(unescape(encodeURIComponent(shipValue + "kirin"))));
                var secondMsg = {
                    productId: productId
                }
                var secondCallback = function() {
                    if (data.resultCode == "0000") {
                        location.href = "/content.html";
                    } else {
                        alert("서버 오류입니다.");
                    }
                }
                doPost("SET_PRODUCT_VIEW", secondMsg, secondCallback);
            });
        } else {
            alert("서버 오류입니다.");
        }
    }
    doPost("GET_PRODUCT", msg, callback);
}
// 카테고리 변환
function krToen(obj) {
    switch(obj){
        case "관엽":
            return "house";
        case "서양란":
            return "western";
        case "동양란":
            return "oriental";
        case "기타":
            return "etc";
    }
}
// 상품 이미지 사이즈 변경
function changeLeft(obj) {
    var w = obj.width;
    var boxW = $(".imgBox").width();
    if(w > boxW) {
        $(obj).css("left", "-" + (w - boxW)/2 + "px");
    }
}