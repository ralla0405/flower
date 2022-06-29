var optionType = {"cake": 0, "choco": 0, "candy": 0, "bbebbe": 0, "pot": 0, "ship": 0};
var fileCnt = 0;
var shipPrice = 0;
$(function() {
    if (getUserId() != null) {
        startMain();
        getNoticeNumber();
    }
})
window.onload = function() {
/** order.html */
    if (location.href.includes('order.html')) {
        $("input[name=orderDate]").val(new Date().yyyymmdd());
        getOrderInfo();
        // 보내는분 검색/등록
        $("button[name='orderFromBtn']").click(function() {
            window.open("/from.html", "_blank", 'width=500, height=700');
        });
        // 주소 검색
        $("button[name='addrBtn']").click(function() {
            openAddr();
        });
        // 옵션 상품 체크 해제
        $(".chk-false").click(function() {
            var type = $(this).attr("name");
            $("input[name="+type+"]").prop("checked",false);
            switch (type) {
                case "cake":
                    optionType.cake = 0;
                break;
                case "choco":
                    optionType.choco = 0;
                break;
                case "candy":
                    optionType.candy = 0;
                break;
                case "bbebbe":
                    optionType.bbebbe = 0;
                break;
                case "pot":
                    optionType.pot = 0;
                break;
            }
            calPrice();
        });
        // 옵션상품 선택시
        $("input[type=radio]").click(function() {
            var type = $(this).attr("name");
            var price = $(this).val();
            switch (type) {
                case "cake":
                    optionType.cake = price;
                break;
                case "choco":
                    optionType.choco = price;
                break;
                case "candy":
                    optionType.candy = price;
                break;
                case "bbebbe":
                    optionType.bbebbe = price;
                break;
                case "pot":
                    optionType.pot = price;
                break;
            }
            calPrice();
        });
        // 옵션배송비 체크
        $("input[name=orderShip]").change(function() {
            optionType.ship = $(this).val();
            calPrice();
        });
        // 택배배송 체크
        $("input[name=shipState]").change(function() {
            var shipValue = decodeURIComponent(escape(window.atob(unescape(getCookie('PDSV'))))).split('kirin')[0];
            if ($(this).is(":checked")) {
                $('.shippingPrice').html(setCommaWon(Number(shipValue)));
                calPrice();
            } else {
                $('.shippingPrice').html(setCommaWon(shipPrice));
                calPrice();
            }
        });
    }
/** order.html */
/** order_ok.html */
    if (location.href.includes('order_ok.html')) {
        var request = new Request();
        var merchant_uid = request.getParameter('uid');
        var msg = {
            actionType: "FINDONE",
            merchant_uid: merchant_uid
        }
        var callback = function(data) {
            if(data.resultCode == "0000") {
                var result = data.resultData;
                $(".productSrc").prop('src', result.productSrc);
                if (result.productQuality == "highend") {
                    $(".productName").html(result.productName + " <span style='color:#d61213;'>특고급</span>");
                } else if (result.productQuality == "advanced") {
                    $(".productName").html(result.productName + " <span style='color:#d61213;'>고급</span>");
                }
                $(".productInfo").html(result.productInfo);
                $(".productPrice").html(setCommaWon(result.productPrice));
                if (result.shipState == "true") {
                    $(".shippingPrice").html(setCommaWon(result.shippingPrice) + " (택배)");
                } else {
                    $(".shippingPrice").html(setCommaWon(result.shippingPrice));
                }
                var optionPrice = 0;
                if (result.option) {
                    optionPrice = setCommaWon(Number(result.option.cake) + Number(result.option.choco) + Number(result.option.candy) + Number(result.option.bbebbe) + Number(result.option.pot) + Number(result.option.ship));
                }
                $(".optionPrice").html(optionPrice);
                $(".productCnt").html(result.productCnt + "개");
                $(".resultPrice").html(setCommaWon(result.resultPrice));
                $(".merchant_uid").html(result.merchant_uid);
                $(".orderMemo").html(result.orderMemo);
                $(".orderTo").html(result.orderTo);
                $(".orderPhone").html(result.orderPhone);
                $(".orderAddr").html(result.orderAddr);
                $(".orderTime").html(result.orderTime);
                $(".orderRequest").html(result.orderRequest);
                $(".payWay").html(result.pay_method);
            }
        }
        doPost("GET_ORDER", msg, callback);
    }
/** order_ok.html */
/** order_out.html */
    if (location.href.includes('order_out.html')) {
        getOrderOut("month");
        // 검색버튼 클릭 시
        $('.date-btn-span').click(function () {
            var start = $("input[name=date-start]").val();
            var end = $("input[name=date-end]").val();
            getOrderOut("default", start, end);
        });
    }
/** order_out.html */
/** order_in.html */
    if (location.href.includes('order_in.html')) {
        getOrderin('month');
        // 검색버튼 클릭 시
        $('.date-btn').click(function () {
            var start = $("input[name=date-start]").val();
            var end = $("input[name=date-end]").val();
            getOrderin("default", start, end);
        });
    }
/** order_in.html */
/** order_info.html */
    if (location.href.includes('order_info.html')) {
        var request = new Request();
        var merchant_uid = decodeURIComponent(unescape(request.getParameter('uid'), "UTF-8"));
        var type = request.getParameter('type');
        if (type == "in") { $("input[name=shipImgInsert]").show(); }
        else if (type == "out") { $("input[name=shipImgInsert]").hide(); }
        var msg = {
            actionType: "FINDONE",
            merchant_uid: merchant_uid
        }
        var callback = function(data) {
            if (data.resultCode == "0000") {
                var result = data.resultData;
                $(".uid").html(result.merchant_uid);
                if (result.orderType == "wait") {
                    $(".state").html("확인");
                } else if (result.orderType == "complete") {
                    $(".state").html("완료");
                } else if (result.orderType == "fail") {
                    $(".state").html("실패");
                }
                var date = new Date(result.time).yyyymmdd();
                var time = new Date(result.time).hhmmss();
                $(".date").html(date + "<span style='font-size:13px; margin-left:5px;font-weight:none; color:#999;'>" + time + "</span>");
                var productType = result.productType;
                switch (productType) {
                    case "house":
                        $(".orderProduct").html("관엽-" + result.productCate + "-" + result.productName);
                    break;
                    case "western":
                        $(".orderProduct").html("서양란-" + result.productCate + "-"  + result.productName);
                    break;
                    case "oriental":
                        $(".orderProduct").html("동양란-" + result.productCate + "-"  + result.productName);
                    break;
                    case "etc":
                        $(".orderProduct").html("기타-" + result.productCate + "-"  + result.productName);
                    break;
                }
                $(".orderPrice").html(setCommaWon(result.resultPrice));
                $(".orderSrc").prop('src', result.productSrc);
                $(".productInfo").html(result.productInfo);
                $(".productCnt").html(result.productCnt);
                $("input[name=orderMemo]").val(result.orderMemo);
                $("input[name=orderFrom]").val(result.orderFrom);
                $(".optionPrice").html(setCommaWon(result.optionPrice));
                var option = result.option;
                var html = "";
                if (option.cake > 0) {
                    html += "<span style='font-weight:bold'>";
                    html += "케이크</span>(" + setCommaWon(option.cake) + ") ";
                } 
                if(option.choco > 0) {
                    html += "<span style='font-weight:bold'>";
                    html += "초콜렛</span>(" + setCommaWon(option.choco) + ") ";
                } 
                if(option.candy > 0) {
                    html += "<span style='font-weight:bold'>";
                    html += "사탕</span>(" + setCommaWon(option.candy) + ") ";
                } 
                if(option.bbebbe > 0) {
                    html += "<span style='font-weight:bold'>";
                    html += "빼빼로</span>(" + setCommaWon(option.bbebbe) + ") ";
                } 
                if(option.pot > 0) {
                    html += "<span style='font-weight:bold'>";
                    if(option.pot == 5000) {
                        html += "서랍물받이</span>(" + setCommaWon(option.pot) + ") ";
                    }else if (option.pot == 10000) {
                        html += "바퀴물받이</span>(" + setCommaWon(option.pot) + ") ";
                    }
                }
                if(option.ship > 0) {
                    html += "<span style='font-weight:bold'>";
                    html += "배송비</span>(" + setCommaWon(option.ship) + ") ";
                }
                $(".option").html(html);
                $(".orderAddr").html(result.orderAddr);
                var orderTime = result.orderTime.split(" ");
                $(".orderDate").html(orderTime[0] + " <span style='color:red; margin-left:10px;'>" + orderTime[1] + "시 까지</span>");
                if (result.delPerson != "") {
                    $(".delPerson").html(result.delPerson);
                }
                if (result.orderCompleteDate != "") {
                    $(".orderCompleteDate").html(result.orderCompleteDate);
                }
                if (result.delSrc != "") {
                    var src = "";
                    for (var i = 0; i < result.delSrc.length; i ++) {
                        src += "<img src='/img/ship/" + result.merchant_uid + "/" + result.delSrc[i] + "'";
                        if (i == 0) {
                            src += "name='img-photo' data-id='" + i +"' width='100' style='opacity: 1; cursor: pointer;'>";
                        } else {
                            src += "name='img-photo' data-id='" + i +"' width='100' style='margin-left: 10px; opacity: 1; cursor: pointer;'>";
                        }
                    }
                    $(".delSrc").append(src);
                }
                $(".companyName").html(result.companyName);
                $(".orderTo").html(result.orderTo);
                $(".orderRequest").html(result.orderRequest);
                // 배송사진등록 누를경우
                $("input[name=shipImgInsert]").click(function() {
                    var url = "/ship_insert.html";
                    url += "?uid=" + escape(encodeURIComponent($(".uid").html()));                    
                    window.open(url, '_ship_insert', 'width=1000,height=500');
                });
                // 상품사진, 배송사진 자세히보기
                $("img[name=img-photo]").click(function() {
                    console.log("ㅇ앙")
                    var uid = $(".uid").html();
                    var no = $(this).attr('data-id');
                    var url = "/image.html";
                    url += "?uid=" + uid;
                    url += "&no=" + no;
                    window.open(url, '_image', 'width=650, height=750');
                });
            } else {
                alert("서버 오류입니다.");
            }
        }
        doPost("GET_ORDER", msg, callback);
        // 닫기 버튼 누를경우
        $("button[name=btn-close]").click(function() {
            window.close();
        });
    }
/** order_info.html */
/** image.html */
    if (location.href.includes('image.html')) {
        var request = new Request();
        var uid = request.getParameter('uid');
        var no = request.getParameter('no');
        var msg = {
            actionType: "FINDONE",
            merchant_uid: uid
        }
        var callback = function(data) {
            if(data.resultCode == "0000") {
                var result = data.resultData;
                if (result.delSrc) {
                    var html = "";
                    if (no == "undefined") {
                        html += "<img class='image' src='" + result.productSrc + "' style='width: 435px; height:580px; cursor:pointer; margin-bottom:15px;' onclick='self.close();'></img>";
                    }
                    for (var i = 0; i < result.delSrc.length; i ++) {
                        if (no == "all") {
                            html += "<img class='image' src='/img/ship/" + uid + "/" + result.delSrc[i] + "' style='width: 435px; height:580px; cursor:pointer; margin-bottom:15px;' onclick='self.close();'></img>";
                        } else if (Number(no) == i){
                            html += "<img class='image' src='/img/ship/" + uid + "/" + result.delSrc[i] + "' style='width: 435px; height:580px; cursor:pointer; margin-bottom:15px;' onclick='self.close();'></img>";
                        }
                    }
                    $(".image-div").append(html);
                }
            }
        }
        doPost("GET_ORDER", msg, callback);
    }
/** image.html */
/** receipt.html */
    if (location.href.includes('receipt.html')) {
        var request = new Request();
        var no = decodeURIComponent(unescape(request.getParameter('no'), "UTF-8"));
        var date = decodeURIComponent(unescape(request.getParameter('date'), "UTF-8"));
        var shipDate = decodeURIComponent(request.getParameter('shipDate'), "UTF-8");
        var shipAddress = decodeURIComponent(request.getParameter('shipAddress'), "UTF-8");
        var shipProduct = decodeURIComponent(request.getParameter('shipProduct'), "UTF-8");
        var shipMemo = decodeURIComponent(request.getParameter('shipMemo'), "UTF-8");
        var shipOrderCompanyTel = decodeURIComponent(request.getParameter('shipOrderCompanyTel'), "UTF-8");
        var ydmh = "배달시간: "+date.split("-")[0]+" 년 "+date.split("-")[1]+" 월 "+date.split("-")[2]+" 일 "+shipDate+" 까지";
        $('.no').html(no);
        $('.shipDate').html(ydmh);
        $('.shipProduct').html(shipProduct);
        $('.shipMemo').html(shipMemo);
        $('.shipAddress').html(shipAddress);
        $('.shipOrderCompanyTel').html(shipOrderCompanyTel);
        window.print();
    }
/** receipt.html */
/** ship_insert.html */
    if (location.href.includes('ship_insert.html')) {
        var request = new Request();
        var uid = request.getParameter('uid');
        
        var msg = {
            actionType: "FINDONE",
            merchant_uid: uid
        }
        var callback = function(data) {
            if (data.resultCode == "0000") {
                var result = data.resultData;
                $("input[name=delPerson]").val(result.delPerson);
                $("input[name=delPersonRel]").val(result.delPersonRel);
                if (result.orderCompleteDate != "") {
                    var hours = new Date(result.orderCompleteDate).getHours();
                    var minutes = new Date(result.orderCompleteDate).getMinutes();
                    $("input[name=shipDate]").val(new Date(result.orderCompleteDate).yyyymmdd());
                    $("select[name=shipDate_h]").val((hours > 9 ?  '' : '0') + hours).prop('selected', true);
                    $("select[name=shipDate_m]").val((minutes > 9 ? '' : '0') + minutes).prop('selected', true);
                } else {
                    setDate();
                }
                if (result.delSrc) {
                    for (var i = 0; i < result.delSrc.length; i ++) {
                        $("img[data-id=" + i + "]").prop('src', "/img/ship/" + uid + "/" + result.delSrc[i]);
                        $("img[data-id=" + i + "]").parent("div").show();
                    }
                }
            }
        }
        doPost("GET_ORDER", msg, callback);
        // 등록하기 누를경우
        $("button[name=btn-register]").click(function() {
            var delPerson = $("input[name=delPerson]").val();
            var delPersonRel = $("input[name=delPersonRel]").val();
            var shipDate = $("input[name=shipDate]").val();
            var shipDate_h = $("select[name=shipDate_h]").val();
            var shipDate_m = $("select[name=shipDate_m]").val();
            var date = shipDate + "T" + shipDate_h + ":" + shipDate_m;
            if (!delPerson) {
                alert("인수자명을 입력해주세요.");
                $("input[name=delPerson]").focus();
            }
            // 이미지 등록하기
            var delSrcArr = [];
            var delSrcNameArr = [];
            var delSrc = "";
            // 이미지 경로와 이름가져오기
            for (var i = 0; i < $("input[type=file]").length; i ++) {
                delSrc = $("input[type=file]").eq(i).parent('div').find("img[name=img-photo]").attr('src');
                if (delSrc != "") {
                    var name = $("input[type=file]").eq(i).val();
                    var delSrcName = "";
                    if (name == "") {
                        delSrcName = delSrc.split("/")[4];
                    } else {
                        delSrcName = $("input[type=file]").eq(i).val().split("\\")[2];
                    }
                    delSrcArr.push(delSrc);
                    delSrcNameArr.push(delSrcName);
                }
            }
            
            // 이미지 하나씩 업로드하기
            var interval = setInterval(function() {
                if (fileCnt == delSrcArr.length) {
                    clearInterval(interval);
                    alert("정상 처리되었습니다.");
                    window.close();
                    opener.document.location.reload();
                } else if (fileCnt < delSrcArr.length) {
                    var msg = {
                        actionType: "SRC",
                        merchant_uid: uid,
                        delSrc: delSrcArr[fileCnt],
                        delSrcName: delSrcNameArr[fileCnt]
                    }
                    var callback = function(data) {
                        if (!data.resultCode == "0000") {
                            alert("서버 오류입니다.");
                        }
                    }
                    doPost("SET_ORDER", msg, callback);
                    fileCnt ++;
                }
            }, 500);
            // 인수자 및 배송사진 DB 등록하기
            var msg = {
                actionType: "UPDATE",
                merchant_uid: uid,
                delPerson: delPerson,
                delPersonRel: delPersonRel,
                orderCompleteDate: date,
                delSrc: delSrcNameArr
            }
            var callback = function(data) {
                if(data.resultCode == "0000") {
                    if (delSrcNameArr.length == 0) {
                        alert(data.resultMessage);
                        window.close();
                    }
                } else {
                    alert("서버 오류입니다.");
                }
            }
            doPost("SET_ORDER", msg, callback);
        });
        // 배송사진 올릴경우
        $("input[type=file]").change(function() {
            uploadImg(this);
        });
        // 닫기 버튼 누를경우
        $("button[name=btn-close]").click(function() {
            window.close();
        });
        // 배송사진 없애기
        $(".btn-danger").click(function() {
            if (confirm('해당사진을 삭제하시겠습니까?')) {
                $(this).parent("div").find("img[name=img-photo]").prop("src", "");
                $(this).parent("div").hide();
                $(this).parent("div").parent("div").find("#shipImg").val("");
            }
        });
        // 사진 자세히보기
        $("img[name=img-photo]").click(function() {
            var no = $(this).attr('data-id');
            var url = "/image.html";
            url += "?uid=" + uid;
            url += "&no=" + no;
            window.open(url, '_image', 'width=650, height=750');
        });
    }
/** ship_insert.html */
}
// 주문금액 합계 설정하기
function calPrice() {
    var nowPrice = setNumber($(".productPrice").html())*Number($(".productCnt").html()) + setNumber($(".shippingPrice").html());
    var optionPrice = Number(optionType.cake) + Number(optionType.choco) + Number(optionType.candy) + Number(optionType.bbebbe) + Number(optionType.pot) + Number(optionType.ship);
    var resultPrice = nowPrice + optionPrice;
    $(".optionPrice").html(setCommaWon(optionPrice));
    $(".totalPrice").html(setCommaWon(resultPrice));
}
// 배송지 입력
function openAddr() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 배송비 초기화
            var plusShippingPrice = window.atob(unescape(getCookie('PSPC'))).split('kirin')[0];
            var productCnt = window.atob(unescape(getCookie('PDCT'))).split('kirin')[0];
            $('.shippingPrice').html(setCommaWon(Number(plusShippingPrice*(productCnt-1))));
            var resultAddr = "";
            var roadAddr = data.roadAddress; // 도로명 주소 변수
            var jibunAddr = data.jibunAddress;  // 지번 주소 변수
            var zipcode = data.zonecode;     // 우편 번호 변수
            var sido = data.sido;
            var sigungu = data.sigungu;
            var bName = data.bname;
            var bName1 = data.bname1;
            var buildingName = data.buildingName;

            if (data.userSelectedType === 'R') {
                resultAddr = roadAddr;
            } else { 
                resultAddr = jibunAddr;
            }     
          
            $("input[name='addr']").val(resultAddr);

            var msg = {
                shipCompanyName: 'sinho'
            }
            var callback = function(data) {
                if(data.resultCode == "0000") {
                    var resultData = data.resultData;
                    var resultLen = resultData.length;
                    var shipState = $("input[name=shipState]").is(":checked");
                    var shipValue = decodeURIComponent(escape(window.atob(unescape(getCookie('PDSV'))))).split('kirin')[0];
                    // 택배배송일 경우
                    if (shipState == 'true') {
                        $(".shippingPrice").html(setCommaWon(shipValue));
                        calPrice();
                    } else {
                        var isBname = false;
                        isPossible = false;
                        var price = 0;
                        for (var i = 0; i < resultLen; i++) {
                            var areaName = resultData[i].areaName;
                            var bAreaName = resultData[i].bAreaName;
                            var rPrice = resultData[i].price;
                            // 서울
                            if (sido == "서울") {
                                if (areaName == sigungu) {
                                    shipPrice = Number(rPrice) + setNumber($(".shippingPrice").html());
                                    isPossible = true;
                                    isBname = true;
                                }
                            } else if (sido == "경기") {
                                if (sigungu.includes(areaName)) {
                                    isPossible = true;
                                    if (bAreaName) {
                                        if ((bName.includes(bAreaName) && bName) || (bName1.includes(bAreaName) && bName1)) {
                                            isBname = true;
                                            shipPrice = Number(rPrice) + setNumber($(".shippingPrice").html());
                                        }
                                        if (buildingName.includes(bAreaName)) {
                                            isBname = true;
                                            shipPrice = Number(rPrice) + setNumber($(".shippingPrice").html());
                                        }
                                    } else {
                                        price = rPrice;    
                                    }
                                }
                            } else if (sido.includes(areaName)) {
                                isPossible = true;
                                if (bAreaName) {
                                    if ((bName.includes(bAreaName) && bName) || (bName1.includes(bAreaName) && bName1)) {
                                        isBname = true;
                                        shipPrice = Number(rPrice) + setNumber($(".shippingPrice").html());
                                    }
                                    if (sigungu.includes(bAreaName)) {
                                        isBname = true;
                                        shipPrice = Number(rPrice) + setNumber($(".shippingPrice").html());
                                    }
                                } else {
                                    price = rPrice;  
                                }
                            }
                        }
                        // 특별지역이 아닐경우
                        if (!isBname) {
                            shipPrice = Number(price) + setNumber($(".shippingPrice").html());
                        }
                        // 배달 불가 지역일 경우
                        if (!isPossible) {
                            alert("해당 지역은 배송이 불가합니다.\n죄송합니다.");
                            $("input[name='addr']").val("");
                        }
                        if (!$("input[name=shipState]").is(":checked")) {
                            $(".shippingPrice").html(setCommaWon(shipPrice));
                            calPrice();
                        }
                    }
                } else {
                    alert("서버 오류 발생\n당사에 문의 바라바랍니다.");
                }
            }
            doPost("GET_SHIP_PRICE", msg, callback);
        }
    }).open();
}
// 경조사어 선택
function orderMemoInsert(obj) {
    var txt = $(obj).html();
    var preTxt = $("input[name='orderMemo']").val();
    if (preTxt == "") {
        $("input[name='orderMemo']").val(txt);
    } else {
        $("input[name='orderMemo']").val(preTxt + " " + txt);
    }
}
// 주문정보 가져오기
function getOrderInfo() {
    var productId = window.atob(unescape(getCookie('PDID'))).split('kirin')[0];
    var productName = decodeURIComponent(escape(window.atob(unescape(getCookie('PDNM'))))).split('kirin')[0];
    var productInfo = decodeURIComponent(escape(window.atob(unescape(getCookie('PDIF'))))).split('kirin')[0];
    var productSrc = decodeURIComponent(escape(window.atob(unescape(getCookie('PDSC'))))).split('kirin')[0];
    var productPrice = decodeURIComponent(escape(window.atob(unescape(getCookie('PDPC'))))).split('kirin')[0];
    var price = setNumber(productPrice);
    var plusShippingPrice = window.atob(unescape(getCookie('PSPC'))).split('kirin')[0];
    var productCnt = window.atob(unescape(getCookie('PDCT'))).split('kirin')[0];
    var finalOrderPrice = decodeURIComponent(escape(window.atob(unescape(getCookie('ODPC'))))).split('kirin')[0];
    var quality = decodeURIComponent(escape(window.atob(unescape(getCookie('PDQL'))))).split('kirin')[0];
    var qualityRatio = decodeURIComponent(escape(window.atob(unescape(getCookie('PDQR'))))).split('kirin')[0];
    if (qualityRatio != "0") {
        productPrice = setCommaWon(Math.ceil((price * (1 + Number(qualityRatio) / 100)) / 1000) * 1000);
    }     
    var shipState = decodeURIComponent(escape(window.atob(unescape(getCookie('PDSS'))))).split('kirin')[0];
    if (shipState == "true") {
        $("input[name=shipState]").attr("disabled", false);
    }
    var productQuality = "";
    switch (quality) {
        case "normal":
            productQuality = "일반";
            break;
        case "advanced":
            productQuality = "고급";
            break;
        case "highend":
            productQuality = "특고급";
            break;
    }
    $('.productName').html(productName);
    $('.productQuality').html(productQuality);
    $('.productPrice').html(productPrice);
    $('.shippingPrice').html(setCommaWon(Number(plusShippingPrice*(productCnt-1))));
    $('.plusShippingPrice').val(plusShippingPrice);
    $('.productCnt').html(productCnt);
    $('.totalPrice').html(finalOrderPrice);
}
// 결제하기
function orderSubmit() {
    var orderMemo = $("input[name='orderMemo']").val();
    var orderFrom = $("input[name='orderFrom']").val();
    var orderTo = $("input[name='orderTo']").val();
    var orderPhone = $("input[name='orderPhone']").val();
    var orderDate = $("input[name='orderDate']").val();
    var orderHours = $("select[name='orderHours']").val();
    var orderTime = orderDate + " " + orderHours;
    var orderAddrExtra = $("input[name='orderAddrExtra']").val();
    var orderAddr = $("input[name='addr']").val();
    var orderRequest = $("input[name='orderRequest']").val();
    var payway = $("input[name='payway']:checked").val();
    if(!orderMemo) {
        alert("경조사어를 입력해주세요.");
        $("input[name='orderMemo']").focus();
        return false;
    } else if(!orderFrom) {
        alert("보내는분을 입력해주세요.");
        $("input[name='orderFrom']").focus();
        return false;
    } else if(!orderTo) {
        alert("받는사람을 입력해주세요.");
        $("input[name='orderTo']").focus();
        return false;
    } else if(!orderPhone) {
        alert("휴대폰번호를 입력해주세요.");
        $("input[name='orderPhone']").focus();
        return false;
    } else if(!orderDate) {
        alert("배달일시를 선택해주세요.");
        $("input[name='orderDate']").focus();
        return false;
    } else if(Number(orderDate.split('-')[0]) < new Date().getFullYear() || (Number(orderDate.split('-')[0]) == new Date().getFullYear() && Number(orderDate.split('-')[1]) < (new Date().getMonth()+1)) || (Number(orderDate.split('-')[0]) == new Date().getFullYear() && Number(orderDate.split('-')[1]) == (new Date().getMonth()+1) && Number(orderDate.split('-')[2]) < new Date().getDate())) {
        alert("배달일자를 확인해주세요.");
        $("input[name='orderDate']").focus();
        return false;
    } else if(orderHours == "") {
        alert("배달시간을 선택해주세요.");
        $("select[name='orderHours']").focus();
        return false;
    } else if(Number(orderDate.split('-')[2]) == new Date().getDate() && Number(orderHours) <= new Date().getHours()) {
        alert("배달시간을 확인해주세요.");
        $("select[name='orderHours']").focus();
        return false;
    } else if(orderAddr == "") {
        alert("주소를 검색해주세요.");
        $("input[name='addr']").focus();
        return false;
    } else if(orderAddrExtra == "") {
        alert("나머지 주소를 입력해주세요.");
        $("input[name='orderAddrExtra']").focus();
        return false;
    }
    // 포인트 결제
    if(payway == 'point') {
        var merchant_uid = 'S' + new Date().getTime();
        var msg = {
            actionType: 'INSERT',
            merchant_uid: merchant_uid,
            pay_method: payway,
            userId: userData.userId,
            companyName: userData.companyName,
            productId: window.atob(unescape(getCookie('PDID'))).split('kirin')[0],
            productType: window.atob(unescape(getCookie('PDTP'))).split('kirin')[0],
            productCate: decodeURIComponent(escape(window.atob(unescape(getCookie('PDCA'))))).split('kirin')[0],
            productCnt: $('.productCnt').html(),
            productPrice: setNumber($('.productPrice').html()),
            productQuality: decodeURIComponent(escape(window.atob(unescape(getCookie('PDQL'))))).split('kirin')[0],
            shippingPrice: setNumber($(".shippingPrice").html()) - Number($('.plusShippingPrice').val())*(Number($('.productCnt').html())-1),
            shipState: $("input[name=shipState]").is(":checked"),
            resultPrice: setNumber($(".totalPrice").html()),
            optionPrice: setNumber($(".optionPrice").html()),
            option: optionType,
            orderMemo: orderMemo,
            orderFrom: orderFrom,
            orderTo: orderTo,
            orderPhone: orderPhone,
            orderTime: orderTime,
            orderAddr: orderAddr + " " + orderAddrExtra,
            orderRequest: orderRequest
        }
        var callback = function(data) {
            if (data.resultCode == "0000") {
                location.replace('/order_ok.html?uid=' + merchant_uid);
                optionType = {"cake": 0, "choco": 0, "candy": 0, "bbebbe": 0, "pot": 0, "ship": 0};
            } else if(data.resultCode == "9002") {
                alert(data.resultMessage);
                location.replace('/');
            } else if(data.resultCode == "9003") {
                alert(data.resultMessage);
                location.replace('/');
            }
        }
        doPost("SET_ORDER", msg, callback);
    }
}
// 숫자만 입력
function checkNumber(obj) {
    obj.value = obj.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (obj.value < 0 ) {
        obj.value = 0;
    }
}
// 발주 조회
function getOrderOut(type, startDate, endDate) {
    var start = "";
    var end = "";
    var yy = new Date().getFullYear();
    var py = new Date(new Date().getTime() - 1000*60*60*24).getFullYear();
    var ty = new Date(new Date().getTime() + 1000*60*60*24).getFullYear();
    var tty = new Date(new Date().getTime() + 1000*60*60*24*2).getFullYear();
    var mm = new Date().getMonth() + 1;
    var pm = new Date(new Date().getTime() - 1000*60*60*24).getMonth() + 1;
    var tm = new Date(new Date().getTime() + 1000*60*60*24).getMonth() + 1;
    var ttm = new Date(new Date().getTime() + 1000*60*60*24*2).getMonth() + 1;
    var dd = new Date().getDate();
    var pd = new Date(new Date().getTime() - 1000*60*60*24).getDate();
    var td = new Date(new Date().getTime() + 1000*60*60*24).getDate();
    var ttd = new Date(new Date().getTime() + 1000*60*60*24*2).getDate();
    switch(type) {
        case "month" :
            start = [yy,
                '-',
                (mm > 9 ? '' : '0') + mm,
                '-',
                '01'].join('');
            end = new Date().yyyymmdd();
            if(start == end) {
                end = [ty,
                    '-',
                    (tm > 9 ? '' : '0') + tm,
                    '-',
                    (td > 9 ? '' : '0') + td].join('');
            }
            break;
        case "before" :
            start = [py,
                '-',
                (pm > 9 ? '' : '0') + pm,
                '-',
                (pd > 9 ? '' : '0') + pd].join('');
            end = new Date().yyyymmdd();
            break;
        case "today" :
            start = new Date().yyyymmdd();
            end = [ty,
                '-',
                (tm > 9 ? '' : '0') + tm,
                '-',
                (td > 9 ? '' : '0') + td].join('');
            break;
        case "after" :
            start = [tty,
                '-',
                (tm > 9 ? '' : '0') + tm,
                '-',
                (td > 9 ? '' : '0') + td].join('');
            end = [ty,
                '-',
                (ttm > 9 ? '' : '0') + ttm,
                '-',
                (ttd > 9 ? '' : '0') + ttd].join('');
            break;
        case "default" :
            start = startDate,
            end = endDate
            break;
    }
    $("input[name=date-start]").val(start);
    $("input[name=date-end]").val(end);
    var msg = {
        actionType: "USERID",
        userId: userId,
        startDate: start,
        endDate: end
    }
    var callback = function(data) {
        if(data.resultCode == "0000") {
            $(".tbl-cont").remove();
            var resultData = data.resultData;
            var resultLen = resultData.length;
            $(".orderOutList").html("발주목록(" + resultLen + ")");
            for(var i = 0; i < resultLen; i ++) {
                var html = "";
                html += "<tr class='tbl-cont'>";
                html += "<td><a class='merchant_uid'>" + resultData[i].merchant_uid + "</a>"; 
                html += "<br><span class=time>" + new Date(resultData[i].time).hhmmss() + "</span>";
                html += "<input class='imp_uid' type='hidden' value='" + resultData[i].imp_uid + "'></td>";
                html += "<td><span class='time'>" + new Date(resultData[i].time).yyyymmdd() + "</span>";
                html += "<br><span class='orderTime' style='color: blue'>" + resultData[i].orderTime.split(' ')[0] + "</span>";
                html += "<br><span class='orderHour' style='color: red'>(" + resultData[i].orderTime.split(' ')[1] + ":00 까지)</span></td>";
                html += "<td><span class='orderFrom'>" + resultData[i].orderFrom + "</span>";
                html += "<br><span class='orderTo'>" + resultData[i].orderTo + "</span>";
                html += "<input type='hidden' name='orderMemo' value='"+ resultData[i].orderMemo +"'>";
                html += "<input type='hidden' name='orderCompanyTel' value='"+ resultData[i].orderPhone +"'>";
                html += "<input type='hidden' name='orderAddr' value='"+ resultData[i].orderAddr +"'></td>";
                html += "<td class='productName'>" + resultData[i].productName + "</td>";
                if (resultData[i].shipState == "true") {
                    html += "<td><span class='shippingPrice'>" + setCommaWon(resultData[i].shippingPrice).split('원')[0] + "</span><span style='color: red; font-weight: bold;'> (택배)</span>";
                } else {
                    html += "<td><span class='shippingPrice'>" + setCommaWon(resultData[i].shippingPrice).split('원')[0] + "</span>";
                }
                html += "<br><span class='optionPrice'>" + setCommaWon(resultData[i].optionPrice).split('원')[0] + "</span></td>";
                html += "<td class='resultPrice'>" + setCommaWon(resultData[i].resultPrice).split('원')[0] + "</td>";
                if (resultData[i].orderType == "wait") {
                    html += "<td class='orderState'><span style='border-radius: 3px; padding: 2px; font-size: 13px; color: #FFF; background: #337AB7;'>확인</span></td>";
                } else if (resultData[i].orderType == "complete") {
                    html += "<td class='orderState'><span style='border-radius: 3px; padding: 2px; font-size: 13px; color: #FFF; background: #5CB85C;'>완료</span></td>";
                } else if (resultData[i].orderType == "fail"){
                    html += "<td class='orderState'><span style='border-radius: 3px; padding: 2px; font-size: 13px; color: #FFF; background: red;'>실패</span></td>";
                }

                if (resultData[i].delSrc != "") {
                    html += "<td><img class='delSrc' src='img/ship/" + resultData[i].merchant_uid + "/" + resultData[i].delSrc[0] + "'>";
                } else {
                    html += "<td>배송사진 미등록";
                }
                if (resultData[i].delPerson != "") {
                    html += "<br><span class='delPerson'>" + resultData[i].delPerson + "</span>";
                } else {
                    html += "<br><span class='delPerson'>인수자 미등록</span>";
                }
                html += "<td class='receipt'><input type='button' name='receipt' class='btn' value='인수증' style='background: #5BC0DE; color: #FFF;'></td>";
                html += "</tr>";
                $(".result-table tbody").append(html);
            }
            // 배송사진 누를경우
            $(".delSrc").click(function() {
                var url = "/image.html";
                url += "?uid=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('.merchant_uid').html()));
                url += "&no=all";
                window.open(url, '_ship_insert', 'width=700,height=750');
            });
            // 주문정보 열기
            $(".merchant_uid").click(function() {
                var url = "/order_info.html";
                url += "?uid=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('.merchant_uid').html()));
                url += "&type=out";
                window.open(url, '_merchant_uid', 'width=1000,height=1411');
            });
            // 인수증 열기
            $("input[name=receipt]").click(function() {
                var url = "/receipt.html";
                url += "?no=";
                url += "&date=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('.orderTime').html()));
                url += "&shipDate=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('.orderHour').html().split("(")[1].split(" 까지)")[0]));
                url += "&shipAddress=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('input[name=orderAddr]').val() + " // " + $(this).parent('td').parent('tr').find('input[name=orderCompanyTel]').val()));
                url += "&shipProduct=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('.productName').html()));
                url += "&shipMemo=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('input[name=orderMemo]').val()));
                url += "&shipOrderCompanyTel=";
                window.open(url, '_receipt', 'width=1000,height=1000');
            });
        } else {
            alert("서버 오류입니다.");
        }
    }
    doPost("GET_ORDER", msg, callback);
}
// 수주 조회
function getOrderin(type, startDate, endDate) {
    var start = "";
    var end = "";
    var yy = new Date().getFullYear();
    var py = new Date(new Date().getTime() - 1000*60*60*24).getFullYear();
    var ty = new Date(new Date().getTime() + 1000*60*60*24).getFullYear();
    var tty = new Date(new Date().getTime() + 1000*60*60*24*2).getFullYear();
    var mm = new Date().getMonth() + 1;
    var pm = new Date(new Date().getTime() - 1000*60*60*24).getMonth() + 1;
    var tm = new Date(new Date().getTime() + 1000*60*60*24).getMonth() + 1;
    var ttm = new Date(new Date().getTime() + 1000*60*60*24*2).getMonth() + 1;
    var dd = new Date().getDate();
    var pd = new Date(new Date().getTime() - 1000*60*60*24).getDate();
    var td = new Date(new Date().getTime() + 1000*60*60*24).getDate();
    var ttd = new Date(new Date().getTime() + 1000*60*60*24*2).getDate();
    switch(type) {
        case "month" :
            start = [yy,
                '-',
                (mm > 9 ? '' : '0') + mm,
                '-',
                '01'].join('');
            end = [ty,
                '-',
                (tm > 9 ? '' : '0') + tm,
                '-',
                (td > 9 ? '' : '0') + td].join('');
            break;
        case "before" :
            start = [py,
                '-',
                (pm > 9 ? '' : '0') + pm,
                '-',
                (pd > 9 ? '' : '0') + pd].join('');
            end = new Date().yyyymmdd();
            break;
        case "today" :
            start = new Date().yyyymmdd();
            end = [ty,
                '-',
                (tm > 9 ? '' : '0') + tm,
                '-',
                (td > 9 ? '' : '0') + td].join('');
            break;
        case "after" :
            start = [tty,
                '-',
                (tm > 9 ? '' : '0') + tm,
                '-',
                (td > 9 ? '' : '0') + td].join('');
            end = [ty,
                '-',
                (ttm > 9 ? '' : '0') + ttm,
                '-',
                (ttd > 9 ? '' : '0') + ttd].join('');
            break;
        case "default" :
            start = startDate,
            end = endDate
            break;
    }
    $('.date-start input').val(start);
    $('.date-end input').val(end);
    var msg = {
        actionType: "TOARRAY",
        startDate: start,
        endDate: end
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var resultData = data.resultData;
            var resultLen = resultData.length;
            $('.orderInList').html('수주목록('+resultLen+')');
            $('.tbl-cont').remove();
            for (var i = 0; i < resultLen; i++) {
                var html = "";
                html += "<tr class='tbl-cont'>";
                html += "<td><a class='merchant_uid'>" + resultData[i].merchant_uid + "</a>"; 
                html += "<br><span class=time>" + new Date(resultData[i].time).hhmmss() + "</span>";
                html += "<input class='imp_uid' type='hidden' value='" + resultData[i].imp_uid + "'></td>";
                html += "<td><span class='time'>" + new Date(resultData[i].time).yyyymmdd() + "</span>";
                html += "<br><span class='orderTime' style='color: blue'>" + resultData[i].orderTime.split(' ')[0] + "</span>";
                html += "<br><span class='orderHour' style='color: red'>(" + resultData[i].orderTime.split(' ')[1] + ":00 까지)</span></td>";
                html += "<td><span class='orderFrom'>" + resultData[i].orderFrom + "</span>";
                html += "<br><span class='orderTo'>" + resultData[i].orderTo + "</span>";
                html += "<input type='hidden' name='orderMemo' value='"+ resultData[i].orderMemo +"'>";
                html += "<input type='hidden' name='orderCompanyTel' value='"+ resultData[i].orderPhone +"'>";
                html += "<input type='hidden' name='orderAddr' value='"+ resultData[i].orderAddr +"'></td>";
                html += "<td class='companyName'>" + resultData[i].companyName + "</td>";
                html += "<td class='productName'>" + resultData[i].productName + "</td>";
                if (resultData[i].shipState == "true") {
                    html += "<td><span class='shippingPrice'>" + setCommaWon(resultData[i].shippingPrice).split('원')[0] + "</span><span style='color: red; font-weight: bold;'> (택배)</span>";
                } else {
                    html += "<td><span class='shippingPrice'>" + setCommaWon(resultData[i].shippingPrice).split('원')[0] + "</span>";
                }
                html += "<br><span class='optionPrice'>" + setCommaWon(resultData[i].optionPrice).split('원')[0] + "</span></td>";
                html += "<td class='resultPrice'>" + setCommaWon(resultData[i].resultPrice).split('원')[0] + "</td>";
                if (resultData[i].orderType == "wait") {
                    html += "<td class='orderState'><span style='border-radius: 3px; padding: 2px; font-size: 13px; color: #FFF; background: #337AB7;'>확인</span></td>";
                } else if (resultData[i].orderType == "complete") {
                    html += "<td class='orderState'><span style='border-radius: 3px; padding: 2px; font-size: 13px; color: #FFF; background: #5CB85C;'>완료</span></td>";
                } else if (resultData[i].orderType == "fail") {
                    html += "<td class='orderState'><span style='border-radius: 3px; padding: 2px; font-size: 13px; color: #FFF; background: red;'>실패</span></td>";
                }
                html += "<td>";
                if (resultData[i].delSrc != "") {
                    html += "<img class='delSrc' src='img/ship/" + resultData[i].merchant_uid + "/" + resultData[i].delSrc[0] + "'>";
                }
                html += "<input type='button' class='btn' name='shipImgInsert' value='배송사진등록'>";
                if (resultData[i].delPerson != "") {
                    html += "<br><span class='delPerson'>" + resultData[i].delPerson + "</span>";
                } else {
                    html += "<br><span class='delPerson'>인수자 미등록</span>";
                }
                html += "</td>";
                html += "<td class='receipt'><input type='button' name='receipt' class='btn' value='인수증' style='background: #5BC0DE; color: #FFF;'></td>";
                html += "</tr>";
                $('.result-table tbody').append(html);
            }
            // 배송사진등록 누를경우
            $("input[name=shipImgInsert]").click(function() {
                var url = "/ship_insert.html";
                url += "?uid=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('.merchant_uid').html()));
                window.open(url, '_ship_insert', 'width=1000,height=500');
            });
            // 배송사진 누를경우
            $(".delSrc").click(function() {
                var url = "/image.html";
                url += "?uid=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('.merchant_uid').html()));
                url += "&no=all";
                window.open(url, '_ship_insert', 'width=700,height=750');
            });
            // 주문정보 열기
            $(".merchant_uid").click(function() {
                var url = "/order_info.html";
                url += "?uid=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('.merchant_uid').html()));
                url += "&type=in";
                window.open(url, '_merchant_uid', 'width=1000,height=1411');
            });
            // 인수증 열기
            $("input[name=receipt]").click(function() {
                var url = "/receipt.html";
                url += "?no=";
                url += "&date=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('.orderTime').html()));
                url += "&shipDate=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('.orderHour').html().split("(")[1].split(" 까지)")[0]));
                url += "&shipAddress=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('input[name=orderAddr]').val() + " // " + $(this).parent('td').parent('tr').find('input[name=orderCompanyTel]').val()));
                url += "&shipProduct=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('.productName').html()));
                url += "&shipMemo=" + escape(encodeURIComponent($(this).parent('td').parent('tr').find('input[name=orderMemo]').val()));
                url += "&shipOrderCompanyTel=";
                window.open(url, '_receipt', 'width=1000,height=1000');
            });
        } else {
            alert("서버 오류입니다.");
        }
    }
    doPost("GET_ORDER", msg, callback);
}
// 이미지 업로드하기
function uploadImg(obj) {
    if (window.File && window.FileReader) {
        // 입력된 파일이 1개이상인지 확인
        if (obj.files && obj.files[0]) {
            // 이미지 파일인지 확인
            if (!(/image/i).test(obj.files[0].type)) {
                alert("이미지 파일을 선택해주세요!");
                return false;
            }
    
            // fileReader 준비
            var reader = new FileReader();
            reader.onload = function(e) {
                $(obj).parent("div").find(".div-photo").find("img[name=img-photo]").prop("src", e.target.result);
                $(obj).parent("div").find(".div-photo").show();
            }
    
            reader.readAsDataURL(obj.files[0]);
            return false;
        }
    } else {
        alert('브라우저 버전을 업그레이드 해주세요.');
    }
}
// 배달일시 기본 설정
function setDate() {
    $("input[name=shipDate]").val(new Date().yyyymmdd());
    var hours = (new Date().getHours() > 9 ? '' : '0') + new Date().getHours();
    $("select[name=shipDate_h]").val(hours).prop('selected', true);
}