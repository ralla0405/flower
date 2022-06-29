var serverUrl = "https://www.sinho2016.com:444";
var userId = "";
var authType = "";
var shippingAddr = "";
var payway;
var optionType = {"cake": 0, "choco": 0, "candy": 0, "bbebbe": 0, "pot": 0, "ship": 0};
var fileCnt = 0;
var shipPrice = 0;
window.onload = function(){
    // 사용자 아이디 가져오기
    var id = getCookie("USER_ID");
    if(id != null) {
        userId = window.atob(unescape(id.split('sin')[1]));
    }
    // 상품수정 정보 가져오기
    if(location.href.includes('order.html') && !location.href.includes('order_in')) {
        $("input[name=orderDate]").val(new Date().yyyymmdd());
        getOrderInfo();
        // 사용자 정보 가져오기 
        getUser("noneList");
        // 로그아웃
        $('.logout-btn').click(function(){
            deleteCookie('AUTO_LOGIN');
            deleteCookie('USER_ID');
            deleteCookie('SHIP_ADDR');
            location.replace("/");
        });
        // 보내는분 검색/등록
        $("button[name='orderFromBtn']").click(function() {
            window.open("/from.html","_blank",'width=500,height=700');
        });
        // 검색
        $("button[name='addrBtn']").click(function() {
            openAddr();
        });
    }
    // 주문완료 정보 가져오기
    if(location.href.includes('order_ok.html')) {
        var request = new Request();
        var merchant_uid = request.getParameter('uid');
        jQuery.ajax({
            url: serverUrl+"/appapi/GET_ORDER/appRequest.do",
            type: "POST",
            dataType: 'json',
            data: {
                actionType: "FINDONE",
                merchant_uid: merchant_uid
            }
        }).done(function(data) {
            if(data.resultCode == "0000") {
                var result = data.resultData;
                $(".productSrc").prop('src', result.productSrc);
                $(".productName").html(result.productName);
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
        });
    }
    // 보내는분 불러오기
    if(location.href.includes('from')) {
        // 보내는분 불러오기
        getFrom();
        // 보내는분 등록
        $("input[name='fromTxtBtn']").click(function() {
            var fromTxt = $("input[name='fromTxt']").val();
            if(fromTxt) {
                jQuery.ajax({
                    url: serverUrl+"/appapi/SET_FROM/appRequest.do",
                    type: "POST",
                    dataType: 'json',
                    data: {
                        actionType: "INSERT",
                        userId: userId,
                        fromId: fromTxt
                    }
                }).done(function(data) {
                    if(data.resultCode == "0000") {
                        location.reload();
                    }
                });
            }else {
                alert("보내는분은 입력해주세요.");
                $("intput[name='fromTxt']").focus();
            }
        });
    }
    // 주문정보 불러오기
    if(location.href.includes('order_info')) {
        var request = new Request();
        var merchant_uid = decodeURIComponent(unescape(request.getParameter('uid'), "UTF-8"));
        var type = request.getParameter('type');
        if (type == "in") {$("input[name=shipImgInsert]").show();}
        else if (type == "out") {$("input[name=shipImgInsert]").hide();}
        jQuery.ajax({
            url: serverUrl+"/appapi/GET_ORDER/appRequest.do",
            type: "POST",
            dataType: 'json',
            data: {
                actionType: "FINDONE",
                merchant_uid: merchant_uid
            }
        }).done(function(data) {
            if(data.resultCode == "0000") {
                var resultData = data.resultData;
                $(".uid").html(resultData.merchant_uid);
                if (resultData.orderType == "wait") {
                    $(".state").html("확인");
                } else if (resultData.orderType == "complete") {
                    $(".state").html("완료");
                } else if (resultData.orderType == "fail") {
                    $(".state").html("실패");
                }
                var date = new Date(resultData.time).yyyymmdd();
                var time = new Date(resultData.time).hhmmss();
                $(".date").html(date + "<span style='font-size:13px; margin-left:5px;font-weight:none; color:#999;'>" + time + "</span>");
                var productType = resultData.productType;
                switch(productType) {
                    case "house":
                        $(".orderProduct").html("관엽-" + resultData.productCate + "-" + resultData.productName);
                    break;
                    case "western":
                        $(".orderProduct").html("서양란-" + resultData.productCate + "-"  + resultData.productName);
                    break;
                    case "oriental":
                        $(".orderProduct").html("동양란-" + resultData.productCate + "-"  + resultData.productName);
                    break;
                    case "etc":
                        $(".orderProduct").html("기타-" + resultData.productCate + "-"  + resultData.productName);
                    break;
                }
                $(".orderPrice").html(setCommaWon(resultData.resultPrice));
                $(".orderSrc").prop('src', resultData.productSrc);
                $(".productInfo").html(resultData.productInfo);
                $(".productCnt").html(resultData.productCnt);
                $("input[name=orderMemo]").val(resultData.orderMemo);
                $("input[name=orderFrom]").val(resultData.orderFrom);
                $(".optionPrice").html(setCommaWon(resultData.optionPrice));
                var option = resultData.option;
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
                $(".orderAddr").html(resultData.orderAddr);
                var orderTime = resultData.orderTime.split(" ");
                $(".orderDate").html(orderTime[0] + " <span style='color:red; margin-left:10px;'>" + orderTime[1] + "시 까지</span>");
                if (resultData.delPerson != "") {
                    $(".delPerson").html(resultData.delPerson);
                }
                if (resultData.orderCompleteDate != "") {
                    $(".orderCompleteDate").html(resultData.orderCompleteDate);
                }
                if (resultData.delSrc != "") {
                    var src = "";
                    for (var i = 0; i < resultData.delSrc.length; i ++) {
                        src += "<img src='/img/ship/" + resultData.merchant_uid + "/" + resultData.delSrc[i] + "'";
                        if (i == 0) {
                            src += "name='img-photo' data-id='" + i +"' width='100' style='opacity: 1; cursor: pointer;'>";
                        }else {
                            src += "name='img-photo' data-id='" + i +"' width='100' style='margin-left: 10px; opacity: 1; cursor: pointer;'>";
                        }
                    }
                    $(".delSrc").append(src);
                }
                $(".companyName").html(resultData.companyName);
                $(".orderTo").html(resultData.orderTo);
                $(".orderRequest").html(resultData.orderRequest);
            }
        });
        // 닫기 버튼 누를경우
        $("button[name=btn-close]").click(function() {
            window.close();
        });
        // 배송사진등록 누를경우
        $("input[name=shipImgInsert]").click(function() {
            var url = "/ship_insert.html";
            url += "?uid=" + escape(encodeURIComponent($(".uid").html()));
            window.open(url, '_ship_insert', 'width=1000,height=500');
        });
        // 사진 자세히보기
        $("img[name=img-photo]").click(function() {
            var uid = $(".uid").html();
            var no = $(this).attr('data-id');
            var url = "/image.html";
            url += "?uid=" + uid;
            url += "&no=" + no;
            window.open(url, '_image', 'width=650, height=750');
        });
    }
    // 배송사진 등록하기 불러오기
    if(location.href.includes('ship_insert')) {
        var request = new Request();
        var uid = request.getParameter('uid');
        
        // 인수자 및 배송사진 불러오기
        jQuery.ajax({
            url: serverUrl+"/appapi/GET_ORDER/appRequest.do",
            type: "POST",
            dataType: 'json',
            data: {
                actionType: "FINDONE",
                merchant_uid: uid
            }
        }).done(function(data) {
            if(data.resultCode == "0000") {
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
                    // 배달일시 기본 설정
                    setDate();
                }
                if (result.delSrc) {
                    for (var i = 0; i < result.delSrc.length; i ++) {
                        $("img[data-id=" + i + "]").prop('src', "/img/ship/" + uid + "/" + result.delSrc[i]);
                        $("img[data-id=" + i + "]").parent("div").show();
                    }
                }
                
            }
        });
        // 등록하기 누를경우
        $("button[name=btn-register]").click(function() {
            var delPerson = $("input[name=delPerson]").val();
            var delPersonRel = $("input[name=delPersonRel]").val();
            var shipDate = $("input[name=shipDate]").val();
            var shipDate_h = $("select[name=shipDate_h]").val();
            var shipDate_m = $("select[name=shipDate_m]").val();
            var date = shipDate + "T" + shipDate_h + ":" + shipDate_m;
            if(!delPerson) {
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
                if(delSrc != "") {
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
                console.log(delSrc);
            }
            
            // 이미지 하나씩 업로드하기
            var interval = setInterval(function() {
                if (fileCnt == delSrcArr.length) {
                    clearInterval(interval);
                    alert("정상 처리되었습니다.");
                    window.close();
                    opener.document.location.reload();
                } else if (fileCnt < delSrcArr.length) {
                    jQuery.ajax({
                        url: serverUrl+"/appapi/SET_ORDER/appRequest.do",
                        type: "POST",
                        dataType: 'json',
                        data: {
                            actionType: "SRC",
                            merchant_uid: uid,
                            delSrc: delSrcArr[fileCnt],
                            delSrcName: delSrcNameArr[fileCnt]
                        }
                    }).done(function(data) {
                        if(data.resultCode == "0000") {
                        }
                    });
                    fileCnt ++;
                }
            }, 500);
            // 인수자 및 배송사진 DB 등록하기
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_ORDER/appRequest.do",
                type: "POST",
                dataType: 'json',
                data: {
                    actionType: "UPDATE",
                    merchant_uid: uid,
                    delPerson: delPerson,
                    delPersonRel: delPersonRel,
                    orderCompleteDate: date,
                    delSrc: delSrcNameArr
                }
            }).done(function(data) {
                if(data.resultCode == "0000") {
                    if (delSrcNameArr.length == 0) {
                        alert("정상 처리되었습니다.");
                        window.close();
                    }
                }
            });
            return false;
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
    // 이미지 불러오기
    if(location.href.includes('image')) {
        var request = new Request();
        var uid = request.getParameter('uid');
        var no = request.getParameter('no');
        jQuery.ajax({
            url: serverUrl+"/appapi/GET_ORDER/appRequest.do",
            type: "POST",
            dataType: 'json',
            data: {
                actionType: "FINDONE",
                merchant_uid: uid
            }
        }).done(function(data) {
            if(data.resultCode == "0000") {
                var result = data.resultData;
                if (result.delSrc) {
                    var html = "";
                    if (no == "undefined") {
                        html += "<img class='image' src='" + result.productSrc + "' style='width: 435px; height:580px; cursor:pointer; margin-bottom:15px;' onclick='self.close();'></img>";
                    }
                    for (var i = 0; i < result.delSrc.length; i ++) {
                        console.log("Test");
                        if (no == "all") {
                            html += "<img class='image' src='/img/ship/" + uid + "/" + result.delSrc[i] + "' style='width: 435px; height:580px; cursor:pointer; margin-bottom:15px;' onclick='self.close();'></img>";
                        } else if (Number(no) == i){
                            html += "<img class='image' src='/img/ship/" + uid + "/" + result.delSrc[i] + "' style='width: 435px; height:580px; cursor:pointer; margin-bottom:15px;' onclick='self.close();'></img>";
                        }
                    }
                    $(".image-div").append(html);
                }
            }
        });
    }
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
    // 뒤로가기
    $('.bi-chevron-left').click(function() {
        window.history.back();
    });
}
// 주문금액 합계 설정하기
function calPrice() {
    var nowPrice = setNumber($(".productPrice").html())*Number($(".productCnt").html()) + setNumber($(".shippingPrice").html());
    var optionPrice = Number(optionType.cake) + Number(optionType.choco) + Number(optionType.candy) + Number(optionType.bbebbe) + Number(optionType.pot) + Number(optionType.ship);
    var resultPrice = nowPrice + optionPrice;
    $(".optionPrice").html(setCommaWon(optionPrice));
    $(".totalPrice").html(setCommaWon(resultPrice));
}
// 이미지 업로드하기
function uploadImg(obj) {
if(window.File && window.FileReader) {
    // 입력된 파일이 1개이상인지 확인
    if(obj.files && obj.files[0]) {
        // 이미지 파일인지 확인
        if(!(/image/i).test(obj.files[0].type)) {
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
}else {
    alert('브라우저 버전을 업그레이드 해주세요.');
}
}
// 배달일시 기본 설정
function setDate() {
$("input[name=shipDate]").val(new Date().yyyymmdd());
var hours = (new Date().getHours() > 9 ? '' : '0') + new Date().getHours();
$("select[name=shipDate_h]").val(hours).prop('selected', true);
}
// 보내는분 가져오기
function getFrom() {
jQuery.ajax({
    url: serverUrl+"/appapi/GET_FROM/appRequest.do",
    type: "POST",
    dataType: 'json',
    data: {
        userId: userId
    }
}).done(function(data) {
    if(data.resultCode == "0000") {
        var resultData = data.resultData;
        var resultLen = resultData.length;
        for(var i = 0; i < resultLen; i ++) {
            var html = "<tr>";
            html += "<td>"+(i+1)+"</td>";
            html += "<td class='fromContents'>"+resultData[i].fromId+"</td>";
            html += "<td><input type='button' class='btn' name='delete' value='삭제'></td>" 
            html += "</tr>";
            $("table tbody").append(html);
        }
        // 삭제하기
        $("input[name='delete']").click(function() {
            var fromId = $(this).parent().parent().find(".fromContents").html();
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_FROM/appRequest.do",
                type: "POST",
                dataType: 'json',
                data: {
                    actionType: "DELETE",
                    userId: userId,
                    fromId: fromId
                }
            }).done(function(data) {
                if(data.resultCode == "0000") {
                    location.reload();
                }
            });
        });
        // 보내는분 선택 시
        $(".fromContents").click(function() {
            var fromTxt = $(this).html()
            $("input[name='orderFrom']",opener.document).val(fromTxt);
            top.window.close();
        });
    }
});
}
// 배송지 입력
function openAddr() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var roadAddr = data.roadAddress; // 도로명 주소 변수
            var finalAddr = '';

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                roadAddr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                roadAddr = data.jibunAddress;
            }                
            
            // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
            finalAddr = roadAddr;
            $("input[name='addr']").val(finalAddr);
            shippingAddr = finalAddr;
            jQuery.ajax({
                url: serverUrl+"/appapi/GET_SHIP_PRICE/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    shipCompanyName: '헌인'
                }
            }).done(function(data) {
                if(data.resultCode == "0000") {
                    var resultData = data.resultData;
                    var resultLen = resultData.length;
                    var seoulGyunggi = false;
                    var plusPrice = 0;
                    var totalPrice = 0;
                    var shipState = $("input[name=shipState]").is(":checked");
                    var shipValue = decodeURIComponent(escape(window.atob(unescape(getCookie('PDSV'))))).split('kirin')[0];
                    // 택배배송일 경우
                    if (shipState == 'true') {
                        var shipValue = decodeURIComponent(escape(window.atob(unescape(getCookie('PDSV'))))).split('kirin')[0];
                        $(".shippingPrice").html(setCommaWon(shipValue));
                        calPrice();
                    } else {
                        for(var i = 0; i < resultLen; i ++) {
                            if (shippingAddr.includes("서울") || shippingAddr.includes("경기")) {
                                seoulGyunggi = true;
                                if (shippingAddr.includes(resultData[i].areaName)) {
                                    plusPrice = setNumber($(".shippingPrice").html());
                                    shipPrice = Number(resultData[i].price) + plusPrice;
                                }
                            }
                        }
                        if (seoulGyunggi) {
                            $(".shippingPrice").html(setCommaWon(shipPrice));
                            calPrice();
                        } else {
                            alert("서울/경기권 외 지역은 배송이 불가합니다.\n죄송합니다.");
                            $("input[name='addr']").val("");
                        }
                    }
                }
            });
        }
    }).open();
}
// 핸드폰번호 '-' 자동입력
function inputPhoneNumber(obj) {
var number = obj.value.replace(/[^0-9]/g, "");
var phone = "";

if(number.length < 4) {
    return number;
} else if(number.length < 7) {
    phone += number.substr(0, 3);
    phone += "-";
    phone += number.substr(3);
} else if(number.length < 11) {
    phone += number.substr(0, 3);
    phone += "-";
    phone += number.substr(3, 3);
    phone += "-";
    phone += number.substr(6);
} else {
    phone += number.substr(0, 3);
    phone += "-";
    phone += number.substr(3, 4);
    phone += "-";
    phone += number.substr(7);
}
obj.value = phone;
}
// 경조사어 선택
function orderMemoInsert(obj) {
var txt = $(obj).html();
var preTxt = $("input[name='orderMemo']").val();
$("input[name='orderMemo']").val(preTxt+txt);
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
// 결제방법 체크
function paywayChk(obj) {
payway = obj.getAttribute('value');
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
    payway = $("input[name='payway']:checked").val();
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
    // 회사명 가져오기
    var company = "";
    if(authType == "ADMIN") {
        company = "관리자"
    } else if(authType == "USER") {
        company = $(".nav-login .user-c-name").html().split(" 님")[0];
    }
    if (company == "" ) {
        var userName = decodeURIComponent(escape(window.atob(unescape(getCookie('RQUN'))))).split('kirin')[0];
        var userPhone = decodeURIComponent(escape(window.atob(unescape(getCookie('RQUP'))))).split('kirin')[0];
    } else {
        if(payway == 'point') {
            var merchant_uid = 'S' + new Date().getTime();
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_ORDER/appRequest.do",
                type: "POST",
                dataType: 'json',
                data: {
                    actionType: 'INSERT',
                    merchant_uid: merchant_uid,
                    pay_method: payway,
                    userId: userData.userId,
                    companyName: company,
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
                    orderAddr: orderAddr,
                    orderRequest: orderRequest,
                    vbank_name: "",
                    vbank_num: "",
                    vbank_date: ""
                }
            }).done(function(data) {
                if(data.resultCode == "0000") {
                    location.replace('/order_ok.html?uid=' + merchant_uid);
                    optionType = {"cake": 0, "choco": 0, "candy": 0, "bbebbe": 0, "pot": 0, "ship": 0};
                }else if(data.resultCode == "9002") {
                    alert(data.resultMessage);
                    location.replace('/');
                }else if(data.resultCode == "9003") {
                    alert(data.resultMessage);
                    location.replace('/');
                }
            });
        }
    }
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
// get 년월일
Date.prototype.yyyymmdd = function() {
var mm = this.getMonth() + 1;
var dd = this.getDate();

return [this.getFullYear(),
    '-',
    (mm>9? '': '0')+ mm,
    '-',
    (dd>9? '': '0')+ dd].join('');
}
// get 시분초
Date.prototype.hhmmss = function() {
var hh = this.getHours();
var mm = this.getMinutes();
var ss = this.getSeconds();
return [(hh > 9 ? '' : '0') + hh,
        ':',
        (mm > 9 ? '' : '0') + mm,
        ':',
        (ss > 9 ? '' : '0') + ss].join('');
}
// 쿠키가져오기
function getCookie(cookie_name){
var value = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
return value? value[2] : null;
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
// 숫자만 입력
function checkNumber(obj) {
obj.value = obj.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
if (obj.value < 0 ) {
    obj.value = 0;
}
}