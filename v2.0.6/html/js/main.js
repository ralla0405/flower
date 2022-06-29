$(function() {
    if (getUserId() != null) {
        startMain();
    }
})
window.onload = function() {
    // 공지사항 가져오기
    getNotice();
    getOftenProduct();
    var bootstrapButton = $.fn.button.noConflict();
    $.fn.bootstrapBtn = bootstrapButton;
}
// 공지사항 정보 가져오기
function getNotice() {
    var msg = {
        actionType: "ALL"
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            resultData = data.resultData;
            resultLen = resultData.length;  
            var displayNone = getCookie('ND') || "";
            var display = decodeURIComponent(escape(window.atob(unescape(displayNone))));
            var popCnt = 0;
            var listCnt = 0;
            for ( var i = 0; i < resultLen; i ++ ) {
                // 메인화면 공지사항 리스트
                if (resultData[i].type == "LIST") {
                    listCnt++;
                    if ( listCnt < 4 ) {
                        var html = "<tr>";
                        html += "<td><div class='notice-title'>"
                        html += resultData[i].noticeTitle + "</div>";
                        html += "<div class='notice-date'>"
                        html += resultData[i].noticeDate + "</div></td><td>";
                        html += "<div class='notice-content'>";
                        html += resultData[i].noticeContent + "</div>";
                        html += "<input hidden name='notice-id' value='" + resultData[i].noticeId + "'></td>";
                        html += "</tr>";
                        $('.notice-table tbody').append(html); 
                    }
                } 
                // 팝업 공지사항
                else if (resultData[i].type == "POPUP") {
                    var inWidth = window.innerWidth;
                    var w = 500;
                    var at = 'left+' + Number((600 * popCnt) + 100) + ' top+100';
                    if (inWidth < 767) {
                        w = 300;
                        at = 'left+' + Number(50 * popCnt)  + ' top+' + Number(40 * popCnt + 93); 
                    }
                    if (displayNone != "") {
                        var itIs = false;
                        for (var j = 0; j < display.split(",").length; j++) {
                            if (display.split(",")[j] == resultData[i].noticeId) {
                                itIs = true;
                            }
                        }
                        // 다시보지 않기로한 공지사항 빼고 출력
                        if(!itIs) {
                            var html = "";
                            html += "<div id='dialogNotice" + i + "' title='" + noticeData[i].noticeTitle + "'>";
                            html += "<div class='message-content'>" + noticeData[i].noticeContent + "</div>";
                            html += "<div class='popup-check' style='margin-top:30px; text-align: right;'>";
                            html += "<input type='checkbox' name='popup-check' value='" + noticeData[i].noticeId + "'>";
                            html += " 오늘하루 이창 열지 않기</div></div>";
                            $("body").append(html);
                            // dialog 실행
                            $("#dialogNotice"+i).dialog({
                                resizable: false,
                                height: 'auto',
                                width: w,
                                position: {
                                    my: 'left top',
                                    at: at,
                                    of: window
                                }
                            });
                            popCnt++; 
                        }
                    } else {
                        var html = "";
                        html += "<div id='dialogNotice"+i+"' title='"+resultData[i].noticeTitle+"'>";
                        html += "<div class='message-content'>"+resultData[i].noticeContent+"</div>";
                        html += "<div class='popup-check' style='margin-top:30px; text-align: right;'>";
                        html += "<input type='checkbox' name='popup-check' value='"+resultData[i].noticeId+"'>";
                        html += " 오늘하루 이창 열지 않기</div></div>";
                        $("body").append(html);
                        // dialog 실행
                        $("#dialogNotice"+i).dialog({
                            resizable: false,
                            height: 'auto',
                            width: w,
                            position: {
                                my: 'left top',
                                at: at,
                                of: window
                            }
                        });
                        popCnt++;
                    }
                }  
            }
            // 공지사항 개수 표시
            $('.notice-cnt').html(listCnt);
            // 오늘하루 이창 열지 않기 누를 경우
            $("button[title=Close]").click(function() {
                if ($(this).parents(".ui-dialog").find("input[name=popup-check]").is(":checked")) { 
                    var noticeId = $(this).parents(".ui-dialog").find("input[name=popup-check]").val();
                    var isCookie = getCookie('ND') || "";
                    if (isCookie) {
                        var nowCookie = decodeURIComponent(escape(window.atob(unescape(getCookie('ND')))));
                    } else {
                        var nowCookie = ""
                    }
                    setCookie('ND',btoa(unescape(encodeURIComponent(nowCookie + "," + noticeId))), 7);
                }
            });
        } else {  
            alert(data.resultMessage);
        }
    }
    doPost("GET_NOTICE", msg, callback);
}
// 자주쓰는 상품 가져오기
function getOftenProduct() {
    var msg = {};
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var resultData = data.resultData;
            var resultLen = resultData.length;

            for (var i = 0; i < resultLen; i++) {
                var num = (i + 1);
                $('.productSrc' + num).attr("src", resultData[i].productSrc);
                $('.productName' + num).html(resultData[i].productName);
            }
            // 자주쓰는 상품 클릭 시
            $(".product-link").click(function() {
                var productId = $(this).find("img").attr("src").split(".")[0].split("/")[3];
                for (var j = 0; j < resultLen; j ++) {
                    if (productId == resultData[j].productId) {
                        var productType = resultData[j].productType;
                        var productCate = resultData[j].productCate;
                        var productName = resultData[j].productName;
                        var productInfo = resultData[j].productInfo;
                        var productSrc = resultData[j].productSrc;
                        var productPrice = "";
                        if( userType == "NORMAL" ) {
                            productPrice = setCommaWon(Number(resultData[j].productPrice)*(100 + Number(pricePercent.consumer))/100);
                        }else if( userType == "COMPANY" ) {
                            productPrice = setCommaWon(Number(resultData[j].productPrice)*(100 + Number(pricePercent.company))/100);
                        }else if( userType == "FLOWER" ) {
                            productPrice = setCommaWon(resultData[j].productPrice);
                        }
                        var plusShippingPrice = resultData[j].shippingPriceExtra;
                        var shipState = "false";
                        if (resultData[j].shipState == "true") {
                            shipState = resultData[j].shipState;
                        }
                        var shipValue = 0;
                        if (Number(resultData[j].shipValue) > 0) {
                            shipValue = resultData[j].shipValue;
                        }
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
                    }
                }
                return false;
            }); 
        } else {  
            alert(data.resultMessage);
        }
    }
    doPost("GET_OFTEN", msg, callback);
}