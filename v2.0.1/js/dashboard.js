var serverUrl = "https://www.sinho2016.com:444";
var userId = "";
var authType = "";
var userType = "";
var userData;
var IMP;
var shippingAddr = "";
var productChk = false;
var productData = "";
var pricePercent = {company: 0, consumer: 0, advanced: 0, highend: 0};
var shipData = [];
var doubleSubmitFlag = false;
window.onload = function(){
    // 사용자 아이디 가져오기
    var id = getCookie("USER_ID");
    if(id != null) {
        userId = window.atob(unescape(id.split('sin')[1]));
    }
    // 사용자 정보 가져오기 
    getUser("noneList");
    // 로그아웃
    $('.logout-btn').click(function(){
        deleteCookie('AUTO_LOGIN');
        deleteCookie('USER_ID');
        deleteCookie('LOGIN');
        deleteCookie('CHECK');
        deleteCookie('ND');
        location.replace("/");
    });
    // 발주관리
    if(location.href.includes('order_out.html')) {
        getOrderOut("month");
    }
    // 상품 정보 가져오기 local 에서만
    //if(location.href.includes('dashboard')) {
        getProduct();
    //}
    // 상품리스트 가져오기
    if(location.href.includes('product_list')) {
        getProductAll();
    }
    // 자주 쓰는 상품
    if(location.href.includes('main')) {
        getOftenProduct();
    }
    // 수주정보 가져오기
    if(location.href.includes('order_in')) {
        getOrderin('month');
    }
    // 배달정보 가져오기
    if(location.href.includes('ship')) {
        getShip(new Date().yyyymmdd(),new Date().yyyymmdd());
        $('.shipList').click(function() {
            getShip($("input[name='date-start']").val(),$("input[name='date-end']").val());
        });
    }
    // 업체정보 가져오기
    if(location.href.includes('company_list')) {
        getCompany();
    }
    // 인수증 정보 가져오기
    if(location.href.includes('receipt')) {
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
    // 상품수정 정보 가져오기
    if(location.href.includes('product_update')) {
        var request = new Request();
        var productId = decodeURIComponent(unescape(request.getParameter('productId'), "UTF-8"));
        var productType = decodeURIComponent(request.getParameter('productType'), "UTF-8");
        var productCate = decodeURIComponent(request.getParameter('productCate'), "UTF-8");
        var productName = decodeURIComponent(request.getParameter('productName'), "UTF-8");
        var productInfo = decodeURIComponent(request.getParameter('productInfo'), "UTF-8");
        var productSrc = decodeURIComponent(request.getParameter('productSrc'), "UTF-8");
        var productPrice = decodeURIComponent(request.getParameter('productPrice'), "UTF-8");
        var productPriceCom = decodeURIComponent(request.getParameter('productPriceCom'), "UTF-8");
        var productPriceFl = decodeURIComponent(request.getParameter('productPriceFl'), "UTF-8");
        var shipState = decodeURIComponent(request.getParameter('shipState'), "UTF-8");
        var shippingPriceExtra = decodeURIComponent(request.getParameter('shippingPriceExtra'), "UTF-8");
        $("input[name='productId']").val(productId);
        switch(productType) {
            case "관엽":
                $("select[name='productType']").val("house");
                var html = "";
                html += "<option value='테이블용'>테이블용</option>";
                html += "<option value='1m'>1m</option>";
                html += "<option value='1m~1.5m'>1m~1.5m</option>";
                html += "<option value='1.5m 이상'>1.5m 이상</option>";
                html += "<option value='대품'>대품</option>";
                $("select[name='productCate']").append(html);
                $("select[name='productCate']").val(productCate);
                break;
            case "서양란":
                $("select[name='productType']").val("western");
                var html = "";
                html += "<option value='노란호접'>노란호접</option>";
                html += "<option value='핑크호접'>핑크호접</option>";
                html += "<option value='만천홍'>만천홍</option>";
                html += "<option value='대륜'>대륜</option>";
                html += "<option value='심비디움'>심비디움</option>";
                $("select[name='productCate']").append(html);
                $("select[name='productCate']").val(productCate);
                break;
            case "동양란":
                $("select[name='productType']").val("oriental");
                break;
            case "기타":
                $("select[name='productType']").val("etc");
                break;
        }
        $("input[name='productName']").val(productName);
        $("input[name='productInfo']").val(productInfo);
        var html ="";
        html += "<div class='upload-thumb-wrap'>";
        html += "<img src='"+productSrc+"' class='upload-thumb'></div>";
        $(".upload-display").append(html);
        $(".preview-image").addClass("on");
        $("input[name='productPrice']").val(productPrice);
        $("input[name='productPriceCom']").val(productPriceCom);
        $("input[name='productPriceFl']").val(productPriceFl);
        if (shipState == "가능") {
            $("select[name='shipState']").val("true").prop("selected", true);
        } else if (shipState == "불가") {
            $("select[name='shipState']").val("false").prop("selected", true);
        } else {
            $("select[name='shipState']").val("true").prop("selected", true);
        }
        $("input[name='shippingPriceExtra']").val(shippingPriceExtra);
    }
    // 포인트 충전/사용 내역 
    if (location.href.includes('mypage')) {
        // 이번달 포인트 충전/사용내역 가젿오기
        var year = new Date().getFullYear();
        var html = "";
        for (var i = 0; i < 4; i ++) {
            if (i == 2) {
                html += "<option value='" + (year - 2 + i) + "' selected>" + (year - 2 +  i) + "</option>";
            } else {
                html += "<option value='" + (year - 2 + i) + "'>" + (year - 2 + i) + "</option>";
            }
        }
        $("select[name=syear]").append(html);
        var month = new Date().getMonth() + 1;
        month = month > 9 ? '': '0' + month;
        $("select[name=smonth]").val(month).prop('selected', true);
        var startDate = year + "-" + month + '-01';
        var endDate = "";
        if (month == "12") {
            endDate = (year + 1) + "-01-01";
        } else {
            month = (Number(month) + 1) > 9 ? '': '0' + (Number(month) + 1);
            endDate = year + "-" + month+ '-01';
        }
        // 현재 포인트 가져오기
        getPoint();
        // 충전/사용 내역 가져오기
        getPointList(startDate, endDate);
    }
    // 포인트 충전하기
    if (location.href.includes('point')) {
        // 가맹점 식별코드 초기화
        IMP = window.IMP;
        IMP.init('imp91090491');
        // 현재 포인트 가져오기
        getPoint();
        // 충전금액 변경 시
        $("input[name=price]").change(function() {
            var method = $("input[name=method]:checked").val();
            var price = $(this).val();
            if (method == 'card') {
                $("input[name=totalPoint]").val(setCommaWon(price * 0.97).split("원")[0]);
                $("input[name=feePoint]").val(price * 0.03);
            } else {
                $("input[name=totalPoint]").val(setCommaWon(price).split("원")[0]);
                $("input[name=feePoint]").val("0");
            }
        });
        // 충전방법 변경 시
        $("input[name=method]").change(function() {
            var price = $("input[name=price]:checked").val();
            var method = $(this).val();
            if (price) {
                if (method == 'card') {
                    $("input[name=totalPoint]").val(setCommaWon(price * 0.97).split("원")[0]);
                    $("input[name=feePoint]").val(price * 0.03);
                } else {
                    $("input[name=totalPoint]").val(setCommaWon(price).split("원")[0]);
                    $("input[name=feePoint]").val("0");
                }
            }
        });
        // 충전하기 버튼 클릭 시
        $("input[name=charge-btn]").click(function() {
            var chargePoint = setNumber($("input[name=totalPoint]").val());
            var chargeMethod = $("input[name=method]:checked").val();
            var feePoint = $("input[name=feePoint]").val();
            var merchant_uid = 'P' + new Date().getTime();
            if (!chargePoint) {
                alert("결제금액을 선택해주세요.");
                return false;
            } else if(!chargeMethod) {
                alert("결제방법을 선택해주세요.");
                return false;
            } 
            if(chargeMethod == 'card' ) {
                IMP.request_pay({
                    pg : 'html5_inicis', 
                    pay_method : chargeMethod,
                    merchant_uid : merchant_uid,
                    name : "charge",
                    amount : chargePoint,
                    buyer_email : userData.userEmail,
                    buyer_name : userData.ceoName,
                    buyer_tel : userData.userPhone,
                    buyer_addr : userData.companyAddress,
                    m_redirect_url: "https://www.sinho2016.com/point_ok.html"
                }, function(rsp) {
                    if (rsp.success) {
                        jQuery.ajax({
                            url: serverUrl+"/appapi/SET_POINT/appRequest.do",
                            type: "POST",
                            dataType: 'json',
                            data: {
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pg_provider: rsp.pg_provider,
                                pay_method: rsp.pay_method,
                                vbank_num: "",
                                vbank_name: "",
                                vbank_holder: "",
                                vbank_date: "",
                                receipt: rsp.receipt_url,
                                status: rsp.status
                            }
                        }).done(function(data) {
                            if(data.resultCode == "0000") {
                                location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=true';
                            }
                        });
                    } else {
                        jQuery.ajax({
                            url: serverUrl+"/appapi/SET_POINT/appRequest.do",
                            type: "POST",
                            dataType: 'json',
                            data: {
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pg_provider: rsp.pg_provider,
                                pay_method: chargeMethod,
                                vbank_num: "",
                                vbank_name: "",
                                vbank_holder: "",
                                vbank_date: "",
                                receipt: rsp.receipt_url,
                                status: 'failed'
                            }
                        }).done(function(data) {
                            if(data.resultCode == "0000") {
                                location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=false';
                            }
                        });
                    }
                });
            } else if(chargeMethod == 'vbank') {
                var date = new Date().deadlineDate();
                IMP.request_pay({
                    pg : 'html5_inicis', 
                    pay_method : chargeMethod,
                    merchant_uid : merchant_uid,
                    name : "charge",
                    amount : chargePoint,
                    buyer_email : userData.userEmail,
                    buyer_name : userData.ceoName,
                    buyer_tel : userData.userPhone,
                    buyer_addr : userData.companyAddress,
                    vbank_due : date
                }, function(rsp) {
                    if (rsp.success) {                        
                        jQuery.ajax({
                            url: serverUrl+"/appapi/SET_POINT/appRequest.do",
                            type: "POST",
                            dataType: 'json',
                            data: {
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pg_provider: rsp.pg_provider,
                                pay_method: rsp.pay_method,
                                vbank_num: rsp.vbank_num,
                                vbank_name: rsp.vbank_name,
                                vbank_date: rsp.vbank_date,
                                vbank_holder: "농업회사법인신호(주)",
                                receipt: rsp.receipt_url,
                                status: rsp.status
                            }
                        }).done(function(data) {
                            if(data.resultCode == "0000") {
                                location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=true';
                            }
                        });
                    } else {
                        jQuery.ajax({
                            url: serverUrl+"/appapi/SET_POINT/appRequest.do",
                            type: "POST",
                            dataType: 'json',
                            data: {
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pg_provider: rsp.pg_provider,
                                pay_method: chargeMethod,
                                vbank_num: "",
                                vbank_name: "",
                                vbank_date: "",
                                vbank_holder: "",
                                receipt: rsp.receipt_url,
                                status: 'failed'
                            }
                        }).done(function(data) {
                            if(data.resultCode == "0000") {
                                location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=false';
                            }
                        });
                    }                 
                });
            } else if(chargeMethod == 'kakaopay') {
                IMP.request_pay({
                    pg : 'kakaopay', 
                    pay_method : "card",
                    merchant_uid : merchant_uid,
                    name : "charge",
                    amount : chargePoint,
                    buyer_email : userData.userEmail,
                    buyer_name : userData.ceoName,
                    buyer_tel : userData.userPhone,
                    buyer_addr : userData.companyAddress,
                    m_redirect_url: "https://www.sinho2016.com/point_ok.html"
                }, function(rsp) {
                    if (rsp.success) {
                        jQuery.ajax({
                            url: serverUrl+"/appapi/SET_POINT/appRequest.do",
                            type: "POST",
                            dataType: 'json',
                            data: {
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pg_provider: rsp.pg_provider,
                                pay_method: rsp.pay_method,
                                vbank_num: "",
                                vbank_name: "",
                                vbank_date: "",
                                vbank_holder: "",
                                receipt: rsp.receipt_url,
                                status: rsp.status
                            }
                        }).done(function(data) {
                            if(data.resultCode == "0000") {
                                location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=true';
                            }
                        });
                    } else {
                        jQuery.ajax({
                            url: serverUrl+"/appapi/SET_POINT/appRequest.do",
                            type: "POST",
                            dataType: 'json',
                            data: {
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pg_provider: rsp.pg_provider,
                                pay_method: 'point',
                                vbank_num: "",
                                vbank_name: "",
                                vbank_date: "",
                                vbank_holder: "",
                                receipt: rsp.receipt_url,
                                status: 'failed'
                            }
                        }).done(function(data) {
                            if(data.resultCode == "0000") {
                                location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=false';
                            }
                        });
                    }
                });
            }
        });
        // 취소 버튼 클릭 시
        $("input[name=cancle-btn]").click(function() {
            prePage();
        });
    }
    // 계정정보 불러오기
    if (location.href.includes('user_update')) {
        jQuery.ajax({
            url: serverUrl+"/appapi/GET_USER/appRequest.do",
            type: "POST",
            dataType: "json",
            data: {
                actionType: "FINDONE",
                userId: userId
            }
        }).done(function(data) {
            if(data.resultCode == "0000") {
                var result = data.resultData;
                $("input[name=comName]").val(result.companyName);
                $("input[name=ceoName]").val(result.ceoName);
                $(".userId").html(result.userId);
                $("input[name=userPw]").val("");
                $("input[name=userMobile]").val(result.userPhone);
                $("input[name=userEmail]").val(result.userEmail.split('@')[0]);
                $("input[name=emailDomain]").val(result.userEmail.split('@')[1]);
                $("input[name=userTel]").val(result.userTel);
                $("input[name=comNumber]").val(result.companyNumber);
                $("input[name=userFax]").val(result.userFax);
                $("input[name=post]").val(result.companyAddress.split("/")[0]);
                $("input[name=addr]").val(result.companyAddress.split("/")[1]);
                $("input[name=extraAddr]").val(result.companyAddress.split("/")[2]);
            }
        });
    }
    // 업체등록
    $('.companyInsert').click(function() {
        $('.companyList').removeClass('on');
        $('.companyInsert').addClass('on');
        $('.tbl-cont').remove();
        $('.bottom').remove();
        $('.body-content.company').append("<div class='bottom'><input type='button' value='등록' name='insert' class='btn'></div>")
        var html = "<tr class='tbl-cont'>";
        html += "<td>자동</td>";
        html += "<td><input type='text' name='companyName' class='form-control'></td>";
        html += "<td><input type='text' name='companyTel' class='form-control'></td>";
        html += "<td class='plusTd'><input type='button' name='insertPlus' class='form-control' value='추가' onclick='plusCompany();' style='width:150px; margin:0 auto;'></td>";
        html += "</tr>"
        $('.result-table tbody').append(html);
         // 등록버튼 클릭시
        $("input[name='insert']").click(function() {
            var html = $('.tbl-cont');
            var ajsonArray = new Array();
            for(i=0; i<html.length;i++) {
                var ajson = new Object();
                ajson.companyName =  html.eq(i).children().children("input[name='companyName']").val();
                ajson.companyTel = html.eq(i).children().children("input[name='companyTel']").val();
                ajsonArray.push(ajson);
            }
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_COMPANY/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    actionType: "INSERT",
                    data: ajsonArray
                }
            }).done(function(data) {
                if(data.resultCode == "0000") {
                    alert("등록되었습니다.");
                    $('.bottom').remove();
                    location.reload();
                }
            });
        });
    });
    // 배달등록
    $('.shipInsert').click(function() {
        $('.shipList').removeClass('on');
        $('.shipInsert').addClass('on');
        $('.tbl-cont').remove();
        $('.bottom').remove();
        $('.body-content.ship').append("<div class='bottom'><input type='button' value='등록' name='insert' class='btn'></div>")
        var html = "<tr class='tbl-cont'>";
        html += "<td>자동</td>";
        html += "<td><input type='date' name='date' class='form-control' style='width: 133px' value='"+new Date().yyyymmdd()+"'></td>";
        html += "<td><input type='text' name='shipDate' class='form-control'></td>";
        html += "<td><input type='text' name='shipAddress' class='form-control' onblur='blurShipAddress()'></td>";
        html += "<td><input type='text' name='shipProduct' class='form-control'></td>";
        html += "<td><input type='text' name='shipMemo' class='form-control'></td>";
        html += "<td><input type='text' name='shipOrderTo' class='form-control'></td>";
        html += "<td><input type='text' name='shipOrderCompany' class='form-control'></td>";
        html += "<td>자동</td>";
        html += "<td><select name='shipCompany' onchange='changeShipCompany(this)'><option value='헌인'>헌인</option><option value='사이버'>사이버</option><option value='개인기사'>개인기사</option><option value='방민우'>방민우</option><option value='우한결'>우한결</option></select></td>";
        html += "<td><input type='text' name='shipNumber' class='form-control'></td>"
        html += "<td><input type='text' name='shipPrice' class='form-control'></td>";
        html += "<td class='plusTd'><input type='button' name='insertPlus' class='form-control' value='추가' onclick='plusBoard(this);'></td>";
        html += "<td>자동</td>";
        html += "</tr>"
        $('.result-table tbody').append(html);
        // 받는분 중복
        $("input[name=shipOrderTo]").bind("blur", function(event) {
            var state = false;
            for (var j = 0; j < shipData.length; j ++) {
                if ($(event.target).val() == shipData[j].shipOrderTo && $(event.target).val() != "") {
                    state = true;
                }
            }
            if (state) {
                if (!confirm("받는 분 \"" + $(event.target).val() + "\" 이 등록된 배달과 중복됩니다.\n그래도 등록하시겠습니까?")) {
                    $(event.target).val("");
                }
            }
        });
        // 등록버튼 클릭시
        $("input[name='insert']").click(function() {
            if (doubleSubmitCheck()) return;
            var html = $('.tbl-cont');
            var ajsonArray = new Array();
            for (i = 0; i < html.length; i ++) {
                var ajson = new Object();
                ajson.date =  html.eq(i).children().children("input[name='date']").val();
                ajson.shipDate = html.eq(i).children().children("input[name='shipDate']").val();
                ajson.shipAddress = html.eq(i).children().children("input[name='shipAddress']").val();
                ajson.shipProduct = html.eq(i).children().children("input[name='shipProduct']").val();
                ajson.shipMemo = html.eq(i).children().children("input[name='shipMemo']").val();
                ajson.shipOrderTo = html.eq(i).children().children("input[name='shipOrderTo']").val();
                ajson.shipOrderCompany = html.eq(i).children().children("input[name='shipOrderCompany']").val();
                ajson.shipCompany = html.eq(i).children().children("select[name='shipCompany']").val();
                ajson.shipNumber = html.eq(i).children().children("input[name='shipNumber']").val();
                ajson.shipPrice = html.eq(i).children().children("input[name='shipPrice']").val();
                ajsonArray.push(ajson);
            }
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_SHIP/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    actionType: "INSERT",
                    data: ajsonArray
                }
            }).done(function(data) {
                if(data.resultCode == "0000") {
                    alert("등록되었습니다.");
                    $('.bottom').remove();
                    location.reload();
                }
            });
        });
    });
    // 배달검색
    $('.date-btn').click(function() {
        if(location.href.includes('ship')) {
            getShip($("input[name='date-start']").val(),$("input[name='date-end']").val());
        }else if(location.href.includes('order_in')) {
            getOrderin("default", $("input[name='date-start']").val(),$("input[name='date-end']").val());
        }
    });
    // 팩스 테스트
    $('.fax-btn').click(function() {

        // 바로빌 연동서비스 URI 
        var barobillURI = 'http://testws.baroservice.com/TI.asmx'; // 테스트베드 FAX URI
        //var barobillURI = 'http://ws.baroservice.com/FAX.asmx'; // 실서비스 FAX URI

        // 바로빌 연동서비스 함수명
        var functionName = 'SendFaxFromFTP';

        // 바로빌 연동서비스 파라메터
        var CERTKEY = "71573BD2-8100-47B8-A71B-B252722D9C10";
        var ErrCode = "-10002";
        var CorpNum = "8778600364";
        var SenderID = "sinho2016";
        var FileName = "test";
        var FromNumber = "010-3713-4282";
        var ToNumber = "02-459-1268";
        var ReceiveCorp = "신호주식회사";
        var ReceiveName = "방민우";
        
        // XML 전문
        var requestXML = '' +
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Body>' +
        '<' + functionName + 'xmlns="http://ws.baroservice.com/">' +
            '<CERTKEY>' + CERTKEY + '</CERTKEY>' +
            '<ErrCode>' + ErrCode + '</ErrCode>' +
            // '<CorpNum>' + CorpNum + '</CorpNum>' +
            // '<SenderID>' + SenderID + '</SenderID>' +
            // '<FileName>' + FileName + '</FileName>' +
            // '<FromNumber>' + FromNumber + '</FromNumber>' +
            // '<ToNumber>' + ToNumber + '</ToNumber>' +
            // '<ReceiveCorp>' + ReceiveCorp + '</ReceiveCorp>' +
            // '<ReceiveName>' + ReceiveName + '</ReceiveName>' +
        '</' + functionName + '>' +
        '</soap:Body>' +
        '</soap:Envelope>';

        jQuery.ajax({
            contentType: 'text/xml; charset=utf-8',
            dataType: 'xml',
            url: barobillURI,
            type: 'POST',
            data: requestXML,
            beforeSend: function(jqXHR, settings) {
                jqXHR.setRequestHeader('SOAPAction', 'http://ws.baroservice.com/' + functionName);
            },
            success: function(data, textStatus, jqXHR) {
                var result = $(data).find(functionName + 'Result').html();
                alert(result);
            }, 
            error: function(jqXHR, textStatus, errorThrown) {
                alert(textStatus);
            }
        });
    });
    // 상품등록 이미지 변경시
    $('#input-file-imgB').change(function() {
        uploadImg(this);
    })
    // 이미지 상세보기 버튼
    $('.view-li').click(function() {
        var src = $('.upload-thumb').attr('src');
        $('.view-img-pop-mask').show();
        $('.view-img-pop').show();
        $('.img-area-inner img').attr('src',src);
    });
    // 이미지 수정하기 버튼
    $('.edit-li').click(function() {
        $('#input-file-imgB').click();
    });
    // 이미지 삭제하기 버튼
    $('.del-li').click(function() {
        $('.upload-display').empty();
        $('.preview-image').removeClass('on');
    });
    // 상세보기 닫기 버튼
    $('.close-btn').click(function() {
        $('.view-img-pop-mask').hide();
        $('.view-img-pop').hide();
    });
    // 메인로고 클릭 시
    $('.nav-title').click(function() {
        location.href = '/dashboard.html';
    })
    // 상품 가격 퍼센트 적용 시
    $("input[name=priceAdapt]").click(function() {
        if(confirm("적용하시겠습니까??")) {
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_PRICE/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    actionType: "price",
                    company: $("input[name=companyPercent]").val(),
                    consumer: $("input[name=consumerPercent]").val(),
                    advanced: $("input[name=advanced]").val(),
                    highend: $("input[name=highend]").val()
                }
            }).done(function(data) {
                if (data.resultCode == "0000") {
                    location.reload();
                }
            });
        }
    });
    // 왼쪽섹션에서 충전/사용내역 버튼 클릭시
    $("input[name=getPoint]").click(function() {
        location.href = "/mypage.html";
    });
    // 왼쪽섹션에서 충전하기 버튼 클릭시
    $("input[name=setPoint]").click(function() {
        location.href = '/point.html';
    });
    // 뒤로가기
    $('.bi-chevron-left').click(function() {
        window.history.back();
    });
    // 홈으로가기
    $('.bi-chevron-left.go-home').click(function() {
        location.href = '/main.html';
    });
    // 충전/사용내역 조회
    $('button[name=btn-search]').click(function() {
        var year = $("select[name=syear]").val();
        var month = $("select[name=smonth]").val();
        var startDate = year + "-" + month + '-01';
        var endDate = "";
        if (month == 12) {
            endDate = (year + 1) + "-01-01";
        } else {
            month = (Number(month) + 1) > 9 ? '': '0' + (Number(month) + 1);
            endDate = year + "-" + month + '-01';
        }
        // 충전/사용 내역 가져오기
        getPointList(startDate, endDate);
    });
    // 사용자 정보 변경 버튼
    $('.changeUser').click(function(){
        var width = window.innerWidth;
        if (width < 800) {
            updateUser('mobile');
        } else {
            updateUser('pc');
        }
    });
}
$(function() {
    // authType 가져오기
    var type = getCookie("USER_AT");
    if( type != "") {
        authType = window.atob(unescape(type.split('sin')[1]));
    }
    var uType = getCookie("USER_TP");
    if( uType != "") {
        userType = window.atob(unescape(uType.split('sin')[1]));
    }
    // 공지사항 가져오기
    getNotice();
    var bootstrapButton = $.fn.button.noConflict();
    $.fn.bootstrapBtn = bootstrapButton;
    // 상품 금액 퍼센트 가져오기
    getPrice();
})
// 회원정보 수정
function updateUser(type) {
    if (type == 'mobile') {
        var userId = $(".mobile .userId").html();
        var companyName = $(".mobile input[name=comName]").val();
        var ceoName = $(".mobile input[name=ceoName]").val();
        var userPw = $(".mobile input[name=userPw]").val();
        var userRePw = $(".mobile input[name='userRePw']").val();
        var userPhone = $(".mobile input[name='userMobile']").val();
        var beforeEmail = $(".mobile input[name='userEmail']").val();
        var afterEmail =  $(".mobile input[name='emailDomain']").val();
        var userEmail = beforeEmail + "@" + afterEmail;
        var userTel = $(".mobile input[name='userTel']").val();
        var companyNumber = $(".mobile input[name='comNumber']").val();
        var userFax = $(".mobile input[name='userFax']").val();
        var preAddress = $(".mobile input[name='post']").val();
        var companyAddress = preAddress + "/"+ $(".mobile input[name='addr']").val() + "/" + $(".mobile input[name='extraAddr']").val();
        var companyExtraAddress = $(".mobile input[name='extraAddr']").val();
    } else {
        var userId = $(".userId").html();
        var companyName = $("input[name=comName]").val();
        var ceoName = $("input[name=ceoName]").val();
        var userPw = $("input[name=userPw]").val();
        var userRePw = $("input[name='userRePw']").val();
        var userPhone = $("input[name='userMobile']").val();
        var userEmail = $("input[name='userEmail']").val() + "@" + $("input[name='emailDomain']").val();
        var userTel = $("input[name='userTel']").val();
        var companyNumber = $("input[name='comNumber']").val();
        var userFax = $("input[name='userFax']").val();
        var companyAddress = $("input[name='post']").val() + "/"+ $("input[name='addr']").val() + "/" + $("input[name='extraAddr']").val();
        var companyExtraAddress = $("input[name='extraAddr']").val();
    }
    
    if(companyName == '') {
        alert('업체명을 입력해주세요.');
        $("input[name='comName']").focus();
        return false;
    }else if(ceoName == '') {
        alert('대표자명을 입력해주세요.');
        $("input[name='ceoName']").focus();
        return false;
    }else if(userPw == '') {
        alert('비밀번호를 입력해주세요.');
        $("input[name='userPw']").focus();
        return false;
    }else if(userPw != userRePw) {
        alert('비밀번호가 일치하지 않습니다.');
        $("input[name='userRePw']").focus();
        return false;
    }else if(!validatePassword(userPw)){
        alert('비밀번호의 조합을 확인해주세요.');
        $("input[name='userPw']").focus();
        return false;
    }if(userPhone == '') {
        alert('휴대폰 번호를를 입력해주세요.');
        $("input[name='userMobile']").focus();
        return false;
    }else if(beforeEmail == '' || afterEmail == '') {
        alert('이메일주소를 입력해주세요.');
        $("input[name='userEmail']").focus();
        return false;
    }else if(companyNumber == ''){
        alert('사업자번호를 입력해주세요.');
        $("input[name='comNumber']").focus();
        return false;
    }else if(preAddress == '') {
        alert('사업장 주소를 입력해주세요.');
        return false;
    }else if(companyExtraAddress == '') {
        alert('상세주소를 입력해주세요.');
        $("input[name='extraAddr']").focus();
        return false;
    }
    jQuery.ajax({
        url: serverUrl+"/appapi/SET_USER/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "UPDATE",
            userId: userId,
            companyName: companyName,
            ceoName: ceoName,
            userPw: userPw,
            userPhone: userPhone,
            userEmail: userEmail,
            userTel: userTel,
            companyNumber: companyNumber,
            userFax: userFax,
            companyAddress: companyAddress
        }
    }).done(function(data) {
        if(data.resultCode == "0000") {
            alert(data.resultMessage);
            location.replace('/dashboard.html');
        }
    });
}
/**
 * 중복 실행 방지
 * 
 * @return {Boolean}
 */
function doubleSubmitCheck(){
    if(doubleSubmitFlag){
        return doubleSubmitFlag;
    }else{
        doubleSubmitFlag = true;
        return false;
    }
}
// 포인트 잔액 조회
function getPoint() {
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_POINT_NUMBER/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            userId: userId
        }
    }).done(function(data) {
        var result = data.resultData;
        $(".point-val").html("<b>" + setCommaWon(result).split('원')[0] + "</b>");
    });
}
// 포인트 충전 리스트 내역
function getPointList(startDate, endDate) {
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_POINT/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "TOARRAY",
            userId: userId,
            startDate: startDate,
            endDate: endDate
        }
    }).done(function(data) {
        var result = data.resultData;
        var resultLen = result.length;
        var useTotal = 0;
        var chargeTotal = 0;
        var feeTotal = 0;
        $(".pointLen").html(resultLen);
        $(".cont-con").remove();
        for(var i = (resultLen - 1); i >= 0; i --) {
            var use = 0;
            var html = "";
            html += "<tr class='cont-con' style='border-bottom:1px solid #B5BABD;'>";
            html += "<td>" + (i + 1) + "</td>";
            html += "<td>" + new Date(result[i].time).yyyymmdd() + " " + new Date(result[i].time).hhmmss() + "</td>";
            if (result[i].usePoint == 0) {
                use = result[i].usePoint;
            } else {
                use = '-' + setComma(result[i].usePoint.toString().split('-')[1]);
            }
            html += "<td>" + use + "</td>"; 
            html += "<td>" + setCommaWon(result[i].chargePoint).split("원")[0] + "</td>";
            html += "<td style='font-weight: bold;'>" + setCommaWon(result[i].totalPoint).split("원")[0] + "</td>";
            html += "<td>" + result[i].memo + "</td>";
            if (result[i].pay_method == "point" || result[i].pay_method == "card") {
                html += "<td>";
                html += "<a href='" + result[i].receipt + "' class='text-decoration-none' onClick='window.open(this.href,\"\",\"width=421,height=513\"); return false;' style='color: blue;'>영수증</a>";
                html += "</td>";
            } else if (result[i].pay_method == "vbank") {
                html += "<td>";
                html += "<a href='/vbank.html?merchant_uid=" + result[i].merchant_uid + "' class='text-decoration-none' onClick='window.open(this.href,\"\",\"width=421,height=513\"); return false;' style='color: blue;'>가상계좌</a>";
                html += "</td>";
            } else {
                html += "<td></td>";
            }
            if (result[i].status == "wait") {
                html += "<td>대기</td>";
            } else if (result[i].status == "ready") {
                html += "<td>입금대기</td>";
            } else if (result[i].status == "cancelled") {
                html += "<td>취소</td>";
            } else if (result[i].status == "failed") {
                html += "<td>실패</td>";
            } else if (result[i].status == "complete" || result[i].status == "paid") {
                html += "<td>승인</td>";
                useTotal += Number(result[i].usePoint);
                chargeTotal += Number(result[i].chargePoint);
                if (result[i].pay_method == 'card') {
                    feeTotal += Number(result[i].feePoint);
                }
            }
            html += "</tr>";
            $(".right-section tbody").append(html);
        }
        if (useTotal == 0) {
            $(".orderOutPrice").html(useTotal);
        } else {
            $(".orderOutPrice").html('-' + setComma(useTotal.toString().split('-')[1]));
        }
        $(".pointPrice").html(setComma(chargeTotal));
        $(".pointFeePrice").html(setComma(feeTotal));
    });
}
// 상품 금액 퍼센트 가져오기
function getPrice() {
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_PRICE/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "price"
        }
    }).done(function(data) {
        var result = data.resultData;
        pricePercent.company = result.company;
        pricePercent.consumer = result.consumer;
        pricePercent.advanced = result.advanced;
        pricePercent.highend = result.highend;
    });
}
// 숫자만 입력
function checkNumber(obj) {
    obj.value = obj.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if(obj.value > 100) {
        obj.value = 100;
    } else if (obj.value < 0 ) {
        obj.value = 0;
    }
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
// 카테고리 변환
function enToKr(obj) {
    switch(obj){
        case "house":
            return "관엽";
        case "western":
            return "서양란";
        case "oriental":
            return "동양란";
        case "etc":
            return "기타";
    }
}
// 배달등록 추가하기
function plusBoard(obj) {
    $(obj).parent("td").html("<input type='button' name='deletePlus' class='form-control' value='삭제' onclick='deleteBoard(this);' style='background: red; color: white;'>");
    var html = "<tr class='tbl-cont'>";
    html += "<td>자동</td>";
    html += "<td><input type='date' name='date' class='form-control' style='width: 133px' value='"+new Date().yyyymmdd()+"'></td>";
    html += "<td><input type='text' name='shipDate' class='form-control'></td>";
    html += "<td><input type='text' name='shipAddress' class='form-control' onblur='blurShipAddress()'></td>";
    html += "<td><input type='text' name='shipProduct' class='form-control'></td>";
    html += "<td><input type='text' name='shipMemo' class='form-control'></td>";
    html += "<td><input type='text' name='shipOrderTo' class='form-control'></td>";
    html += "<td><input type='text' name='shipOrderCompany' class='form-control'></td>";
    html += "<td>자동</td>";
    html += "<td><select name='shipCompany' onchange='changeShipCompany(this)' ><option value='헌인'>헌인</option><option value='사이버'>사이버</option><option value='우한결'>우한결</option><option value='개인기사'>개인기사</option><option value='방민우'>방민우</option></select></td>";
    html += "<td><input type='text' name='shipNumber' class='form-control'></td>"
    html += "<td><input type='text' name='shipPrice' class='form-control'></td>";
    html += "<td class='plusTd'><input type='button' name='insertPlus' class='form-control' value='추가' onclick='plusBoard(this);'></td>";
    html += "<td>자동</td>";
    html += "</tr>"
    $('.result-table tbody').append(html);
    // 받는분 중복
    $("input[name=shipOrderTo]").unbind("blur").bind("blur", function(event) {
        var state = false;
        for (var j = 0; j < shipData.length; j ++) {
            if ($(event.target).val() == shipData[j].shipOrderTo && $(event.target).val() != "") {
                state = true;
            }
        }
        if (state) {
            if (!confirm("받는 분 \"" + $(event.target).val() + "\" 이 등록된 배달과 중복됩니다.\n그래도 등록하시겠습니까?")) {
                $(event.target).val("");
            }
        }
    });
}
// 배달등록 삭제하기
function deleteBoard(obj) {
    $(obj).parent("td").parent("tr").remove();
}
// 배송지 수정할때
function blurShipAddress() {
    changeShipCompany($("select[name='shipCompany']"));
}
// 배달업체 수정할때
function changeShipCompany(obj) {
    var address = $(obj).parent("td").parent("tr").children("td").children("input[name='shipAddress']").val();
    var price = $(obj).parent("td").parent("tr").children("td").children("input[name='shipPrice']");
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_SHIP_PRICE/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            shipCompanyName: $(obj).val()
        }
    }).done(function(data) {
        if(data.resultCode == "0000") {
            var resultData = data.resultData;
            var resultLen = resultData.length;
            var isData = 0;
            for(var i=0; i<resultLen; i++) {
                if(address.includes(resultData[i].areaName)) {
                    isData = resultData[i].price;
                }
            }
            price.val(isData);
        }
    });
}
// 업체등록 추가하기
function plusCompany() {
    $('.plusTd').empty();
    var html = "<tr class='tbl-cont'>";
    html += "<td>자동</td>";
    html += "<td><input type='text' name='companyName' class='form-control'></td>";
    html += "<td><input type='text' name='companyTel' class='form-control'></td>";
    html += "<td class='plusTd'><input type='button' name='insertPlus' class='form-control' value='추가' onclick='plusCompany();' style='width:100px; margin:0 auto;'></td>";
    html += "</tr>"
    $('.result-table tbody').append(html);
}
// 사용자 정보 가져오기
function getUser(kind) {
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_USER/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "ALL"
        }
    }).done(function(data) {
        if(data.resultCode == "0000") {
            var resultData = data.resultData;
            var resultLen = resultData.length;
            var noUserLen = 0;
            $('.tbl-cont').remove();
            for(var i=0; i<resultLen; i++) {
                if(resultData[i].userId == userId) {
                    userData = resultData[i];
                    if(authType == "ADMIN") {
                        $('.nav-logout').addClass('d-none');
                        $('.nav-admin').removeClass('d-none');
                        getOrderInCnt();
                    }else if(authType == "USER") {
                        $('.nav-logout').addClass('d-none');
                        $('.nav-login').removeClass('d-none');
                        $('.nav-login .user-c-name').html(userData.companyName + " 님");
                    }
                }
                if(resultData[i].flag == "N") {
                    noUserLen += 1;
                }
                if(location.href.includes('user_list')) {
                    for(var j=0; j<$('.tab li').length; j++) {
                        if($('.tab li').eq(j).hasClass(kind)) {
                            $('.tab li').eq(j).addClass('on');
                        }else {
                            $('.tab li').eq(j).removeClass('on');
                        }
                    }
                    if(resultData[i].authType == "USER") {
                        if(kind == 'noneList') {
                            if(resultData[i].flag == "N") {
                                var html = "<tr class='tbl-cont'>";
                                html += "<td class='none'>미처리</td>";
                                html += "<td>"+resultData[i].companyName+"</td>";
                                html += "<td>"+resultData[i].ceoName+"</td>";
                                html += "<td>"+resultData[i].userId+"</td>";
                                html += "<td>"+resultData[i].userPhone+"</td>";
                                html += "<td>"+resultData[i].userEmail+"</td>";
                                html += "<td>"+resultData[i].userTel+"</td>";
                                html += "<td>"+resultData[i].companyNumber+"</td>";
                                html += "<td>"+resultData[i].userFax+"</td>";
                                html += "<td>"+resultData[i].companyAddress+"</td>";
                                html += "<td><select name='userType'>";
                                html += "<option value='NORMAL'>일반소비자</option>";
                                html += "<option value='COMPANY'>기업</option>";
                                html += "<option value='FLOWER'>도매직발주</option>";
                                html += "</select></td>";
                                html += "<td><input type='button' value='승인' name='approval' class='btn'></td>";
                                html += "</tr>"
                                $('.result-table tbody').append(html);
                            }
                        }else if(kind == 'userList') {
                            if(resultData[i].flag == "Y") {
                                var html = "<tr class='tbl-cont'>";
                                html += "<td class='done'>승인완료</td>";
                                html += "<td>"+resultData[i].companyName+"</td>";
                                html += "<td>"+resultData[i].ceoName+"</td>";
                                html += "<td>"+resultData[i].userId+"</td>";
                                html += "<td>"+resultData[i].userPhone+"</td>";
                                html += "<td>"+resultData[i].userEmail+"</td>";
                                html += "<td>"+resultData[i].userTel+"</td>";
                                html += "<td>"+resultData[i].companyNumber+"</td>";
                                html += "<td>"+resultData[i].userFax+"</td>";
                                html += "<td>"+resultData[i].companyAddress+"</td>";
                                html += "<td><select name='userType'>";
                                if(resultData[i].userType == "NORMAL") {
                                    html += "<option value='NORMAL' selected>일반소비자</option>";
                                    html += "<option value='COMPANY'>기업</option>";
                                    html += "<option value='FLOWER'>도매직발주</option>";
                                } else if(resultData[i].userType == "COMPANY") {
                                    html += "<option value='NORMAL'>일반소비자</option>";
                                    html += "<option value='COMPANY' selected>기업</option>";
                                    html += "<option value='FLOWER'>도매직발주</option>";
                                } else if(resultData[i].userType == "FLOWER") {
                                    html += "<option value='NORMAL'>일반소비자</option>";
                                    html += "<option value='COMPANY'>기업</option>";
                                    html += "<option value='FLOWER' selected>도매직발주</option>";
                                }
                                html += "</select></td>";
                                html += "<td><input type='button' value='수정' name='userUpdate' class='btn'></td>";
                                html += "</tr>"
                                $('.result-table tbody').append(html);
                            }
                        }
                    }
                }
            }
            $(".noneList").html("미처리("+noUserLen+")");
            $(".userList").html("회원목록("+(resultLen-1-noUserLen)+")");
            $('.join-cnt').html(noUserLen);
            // 회원 승인처리
            $("input[name='approval']").click(function() {
                var id = $(this).parent().parent().children('td').eq(3).html();
                var type = $(this).parent().parent().find("select[name=userType]").val();
                jQuery.ajax({
                    url: serverUrl+"/appapi/SET_USER/appRequest.do",
                    type: "POST",
                    dataType: "json",
                    data: {
                        actionType: "TYPE",
                        userId: id,
                        userType: type
                    }
                }).done(function(data) {
                    if(data.resultCode == "0000") {
                        alert("승인 되었습니다.");
                        location.reload();
                    }
                });
                return false;
            });
            // 회원 수정처리
            $("input[name='userUpdate']").click(function() {
                var id = $(this).parent().parent().children('td').eq(3).html();
                var type = $(this).parent().parent().find("select[name=userType]").val();
                jQuery.ajax({
                    url: serverUrl+"/appapi/SET_USER/appRequest.do",
                    type: "POST",
                    dataType: "json",
                    data: {
                        actionType: "TYPE",
                        userId: id,
                        userType: type
                    }
                }).done(function(data) {
                    if(data.resultCode == "0000") {
                        alert("수정 되었습니다.");
                        location.reload();
                    }
                });
                return false;
            });
        }
    });
}
// 이미지 사이즈 변경
function changeLeft(obj) {
    var w = obj.width;
    var boxW = $(".imgBox").width();
    if(w > boxW) {
        $(obj).css("left", "-" + (w - boxW)/2 + "px");
    }
}
// 자주쓰는 상품 가져오기
function getOftenProduct() {
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_PRODUCT/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "ALL"
        }
    }).done(function(data) {
        var resultData = data.resultData;
        var resultLen = resultData.length;

        resultData.sort(function(a,b) {
            return b.saleCnt - a.saleCnt;
        });

        for (var i = 0; i < 16; i ++) {
            var num = (i + 1);
            $('.productSrc' + num).attr("src", resultData[i].productSrc);
            $('.productName' + num).html(resultData[i].productName);
        }
        // 자주쓰는 상품 클릭 시
        $(".product-link").click(function() {
            var productId = $(this).find("img").attr("src").split(".")[0].split("/")[3];
            for(var j = 0; j < resultLen; j ++ ) {
                if(productId == resultData[j].productId) {
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
                    setCookie('PDID',btoa(productId+"kirin"));
                    setCookie('PDTP',btoa(productType+"kirin"));
                    setCookie('PDCA',btoa(unescape(encodeURIComponent(productCate+"kirin"))));
                    setCookie('PDNM',btoa(unescape(encodeURIComponent(productName+"kirin"))));
                    setCookie('PDIF',btoa(unescape(encodeURIComponent(productInfo+"kirin"))));
                    setCookie('PDSC',btoa(unescape(encodeURIComponent(productSrc+"kirin"))));
                    setCookie('PDPC',btoa(unescape(encodeURIComponent(productPrice+"kirin"))));
                    setCookie('PSPC',btoa(plusShippingPrice+"kirin"));
                    setCookie('PDSS',btoa(unescape(encodeURIComponent(shipState+"kirin"))));
                    setCookie('PDSV',btoa(unescape(encodeURIComponent(shipValue+"kirin"))));
                    jQuery.ajax({
                        url: serverUrl+"/appapi/SET_PRODUCT_VIEW/appRequest.do",
                        type: "POST",
                        dataType: "json",
                        data: {
                            productId: productId
                        }
                    }).done(function(data) {
                        if (data.resultCode == "0000") {
                            location.href = "/content.html";
                        } else {
                            alert("서버 오류입니다.");
                        }
                    });
                }
            }
            return false;
        }); 
    });
}
// 상품 정보 가져오기
function getProduct() {
    var request = new Request();
    var type = request.getParameter('type');
    // 카테고리 가져오기
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_CATEGORY/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            categoryId: type
        }
    }).done(function(data) {
        var resultData = data.resultData;
        var resultLen = resultData.length;
        var html = "<div class='ssTitle'>";
        html += "<span>카테고리 \'중\'</span>";
        html += "</div>";
        html += "<div class='ssCont'>";
        for( var i = 0; i < resultLen; i ++ ) {
            html += "<div class='sBox'>";
            html += "<a href='javascript:;' onclick='getProductCate(this);' name="+resultData[i].categorySubId+">"
            html += resultData[i].categoryData;
            html += "</a>";
            html += "</div>";
        }
        html += "</div>";
        $(".subCateDepth2").append(html);
    });
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
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_PRODUCT/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: type
        }
    }).done(function(data) {
        var resultData = data.resultData;
        var resultLen = resultData.length;
        if(resultLen == 0) {
            $('.content-wrap').css('height','900px');
        }
        var len = 0;
        for (var i = 0; i < resultLen; i ++) {
            if(resultData[i].viewState == "Y") {
                len += 1;
                var html = "";
                html += "<li>";
                html += "<div class='liWrap'><div class='imgBox'>";
                html += "<img src='"+resultData[i].productSrc+"' onload='changeLeft(this);'></div>";
                html += "<div class='productName'>"+resultData[i].productName+"</div>";
                html += "<div class='productInfo'>"+resultData[i].productInfo+"</div>";
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
                if(userType == "NORMAL") {
                    html += "<div class='productPrice'><span class='price'>"+setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.consumer))/100)+"</span></div>";
                } else if(userType == "COMPANY") {
                    html += "<div class='productPrice'><span class='price'>"+setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.company))/100)+"</span></div>";
                } else if(userType == "FLOWER") {
                    html += "<div class='productPrice'><span class='price'>"+setCommaWon(resultData[i].productPrice)+"</span></div>";
                }
                html += "<input hidden type='text' value='"+resultData[i].shippingPriceExtra+"' name='plusShippingPrice'>";
                html += "<input hidden type='text' value='"+resultData[i].productType+"' name='productType'>";
                html += "<input hidden type='text' value='"+resultData[i].productCate+"' name='productCate'>";
                html += "</div></div></li>"
                $('.product-list ul').append(html);
            }
        }
        $('.total-cnt').html(len);
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
            setCookie('PDID',btoa(productId+"kirin"));
            setCookie('PDTP',btoa(productType+"kirin"));
            setCookie('PDCA',btoa(unescape(encodeURIComponent(productCate+"kirin"))));
            setCookie('PDNM',btoa(unescape(encodeURIComponent(productName+"kirin"))));
            setCookie('PDIF',btoa(unescape(encodeURIComponent(productInfo+"kirin"))));
            setCookie('PDSC',btoa(unescape(encodeURIComponent(productSrc+"kirin"))));
            setCookie('PDPC',btoa(unescape(encodeURIComponent(productPrice+"kirin"))));
            setCookie('PSPC',btoa(plusShippingPrice+"kirin"));
            setCookie('PDSS',btoa(unescape(encodeURIComponent(shipState+"kirin"))));
            setCookie('PDSV',btoa(unescape(encodeURIComponent(shipValue+"kirin"))));
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_PRODUCT_VIEW/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    productId: productId
                }
            }).done(function(data) {
                if (data.resultCode == "0000") {
                    location.href = "/content.html";
                } else {
                    alert("서버 오류입니다.");
                }
            });
        });
    });
}
// 카테고리 대 선택시
function cateChg(obj, type) {
    $(".subCateDepth2").empty();
    $('.product-list ul').empty();
    switch(type){
        case "house":
            $(".presentCategory").html("관엽");
            $('.nav-title-mobile').html("관엽");
            break;
        case "western":
            $(".presentCategory").html("서양란");
            $('.nav-title-mobile').html("서양란");
            break;
        case "oriental":
            $(".presentCategory").html("동양란");
            $('.nav-title-mobile').html("동양란");
            break;
        case "etc":
            $(".presentCategory").html("기타");
            $('.nav-title-mobile').html("기타");
            break;
    }
    $(".subCategory").empty();
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_CATEGORY/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            categoryId: type
        }
    }).done(function(data) {
        var resultData = data.resultData;
        var resultLen = resultData.length;
        var html = "<div class='ssTitle'>";
        html += "<span>카테고리 \'중\'</span>";
        html += "</div>";
        html += "<div class='ssCont'>";
        for( var i = 0; i < resultLen; i ++ ) {
            html += "<div class='sBox'>";
            html += "<a href='javascript:;' onclick='getProductCate(this);' name="+resultData[i].categorySubId+">"
            html += resultData[i].categoryData;
            html += "</a>";
            html += "</div>";
        }
        html += "</div>";
        $(".subCateDepth2").append(html);
        $(obj).addClass('on');
        $('.subCateDepth1 a').not($(obj)).removeClass('on');
    });
    // GET_PRODUCT
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_PRODUCT/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: type,
            productCate: ""
        }
    }).done(function(data) {
        var resultData = data.resultData;
        var resultLen = resultData.length;
        if(resultLen == 0) {
            $('.content-wrap').css('height','900px');
        }
        var len = 0;
        for(var i=0; i<resultLen; i++) {
            if(resultData[i].viewState == "Y") {
                len += 1;
                var html = "";
                html += "<li>";
                html += "<div class='liWrap'><div class='imgBox'>";
                html += "<img src='"+resultData[i].productSrc+"' onload='changeLeft(this);'></div>";
                html += "<div class='productName'>"+resultData[i].productName+"</div>";
                html += "<div class='productInfo'>"+resultData[i].productInfo+"</div>";
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
                html += "<input type='hidden' class='productId' value='"+resultData[i].productId+"'>";
                if(userType == "NORMAL") {
                    html += "<div class='productPrice'><span class='price'>"+setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.consumer))/100)+"</span></div>";
                } else if(userType == "COMPANY") {
                    html += "<div class='productPrice'><span class='price'>"+setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.company))/100)+"</span></div>";
                } else if(userType == "FLOWER") {
                    html += "<div class='productPrice'><span class='price'>"+setCommaWon(resultData[i].productPrice)+"</span></div>";
                }
                html += "<input hidden type='text' value='"+resultData[i].shippingPriceExtra+"' name='plusShippingPrice'>";
                html += "<input hidden type='text' value='"+resultData[i].productType+"' name='productType'>";
                html += "<input hidden type='text' value='"+resultData[i].productCate+"' name='productCate'>";
                html += "</div></div></li>";
                $('.product-list ul').append(html);
            }
        }
        $('.total-cnt').html(len);
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
            setCookie('PDID',btoa(productId+"kirin"));
            setCookie('PDTP',btoa(productType+"kirin"));
            setCookie('PDCA',btoa(unescape(encodeURIComponent(productCate+"kirin"))));
            setCookie('PDNM',btoa(unescape(encodeURIComponent(productName+"kirin"))));
            setCookie('PDIF',btoa(unescape(encodeURIComponent(productInfo+"kirin"))));
            setCookie('PDSC',btoa(unescape(encodeURIComponent(productSrc+"kirin"))));
            setCookie('PDPC',btoa(unescape(encodeURIComponent(productPrice+"kirin"))));
            setCookie('PSPC',btoa(plusShippingPrice+"kirin"));
            setCookie('PDSS',btoa(unescape(encodeURIComponent(shipState+"kirin"))));
            setCookie('PDSV',btoa(unescape(encodeURIComponent(shipValue+"kirin"))));
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_PRODUCT_VIEW/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    productId: productId
                }
            }).done(function(data) {
                if (data.resultCode == "0000") {
                    location.href = "/content.html";
                } else {
                    alert("서버 오류입니다.");
                }
            });
        });
    });
}
// 카테고리 중 선택시
function getProductCate(obj) {
    $('.product-list ul').empty();
    var productType = krToen($(".subCateDepth1").find("a.on").html());
    var productCate = $(obj).html();
    $(".subCategory").html(productCate);
    $('.nav-title-mobile').html(productCate);
    // GET_PRODUCT
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_PRODUCT/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: productType,
            productCate: productCate
        }
    }).done(function(data) {
        var resultData = data.resultData;
        var resultLen = resultData.length;
        if(resultLen == 0) {
            $('.content-wrap').css('height','900px');
        }
        var len = 0;
        for(var i=0; i<resultLen; i++) {
            if(resultData[i].viewState == "Y") {
                len += 1;
                var html = "";
                html += "<li>";
                html += "<div class='liWrap'><div class='imgBox'>";
                html += "<img src='"+resultData[i].productSrc+"' onload='changeLeft(this);'></div>";
                html += "<div class='txtBox'></div>";
                html += "<div class='productName'>"+resultData[i].productName+"</div>";
                html += "<div class='productInfo'>"+resultData[i].productInfo+"</div>";
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
                html += "<input type='hidden' class='productId' value='"+resultData[i].productId+"'>";
                if(userType == "NORMAL") {
                    html += "<div class='productPrice'><span class='price'>"+setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.consumer))/100)+"</span></div>";
                } else if(userType == "COMPANY") {
                    html += "<div class='productPrice'><span class='price'>"+setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.company))/100)+"</span></div>";
                } else if(userType == "FLOWER") {
                    html += "<div class='productPrice'><span class='price'>"+setCommaWon(resultData[i].productPrice)+"</span></div>";
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
        $('.total-cnt').html(len);
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
            setCookie('PDID',btoa(productId+"kirin"));
            setCookie('PDTP',btoa(productType+"kirin"));
            setCookie('PDCA',btoa(unescape(encodeURIComponent(productCate+"kirin"))));
            setCookie('PDNM',btoa(unescape(encodeURIComponent(productName+"kirin"))));
            setCookie('PDIF',btoa(unescape(encodeURIComponent(productInfo+"kirin"))));
            setCookie('PDSC',btoa(unescape(encodeURIComponent(productSrc+"kirin"))));
            setCookie('PDPC',btoa(unescape(encodeURIComponent(productPrice+"kirin"))));
            setCookie('PSPC',btoa(plusShippingPrice+"kirin"));
            setCookie('PDSS',btoa(unescape(encodeURIComponent(shipState+"kirin"))));
            setCookie('PDSV',btoa(unescape(encodeURIComponent(shipValue+"kirin"))));
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_PRODUCT_VIEW/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    productId: productId
                }
            }).done(function(data) {
                if (data.resultCode == "0000") {
                    location.href = "/content.html";
                } else {
                    alert("서버 오류입니다.");
                }
            });
        });
    });
}
// 공지사항 정보 가져오기
function getNotice() {
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_NOTICE/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            
        }
    }).done(function(data) {
        noticeData = data.resultData;
        noticeLen = noticeData.length;    
        if(location.href.includes("main")) {
            var displayNone = getCookie('ND') || "";
            var display = decodeURIComponent(escape(window.atob(unescape(displayNone))));
            var popCnt = 0;
            var listCnt = 0;
            for( var i = 0; i < noticeLen; i ++ ) {
                if( noticeData[i].flag == "Y") {
                    if( noticeData[i].type == "LIST" ) {
                        listCnt++;
                        if( listCnt < 4 ) {
                            var html = "<tr>";
                            html += "<td><div class='notice-title'>"
                            html += noticeData[i].noticeTitle + "</div>";
                            html += "<div class='notice-date'>"
                            html += noticeData[i].noticeDate + "</div></td><td>";
                            html += "<div class='notice-content'>";
                            html += noticeData[i].noticeContent + "</div>";
                            html += "<input hidden name='notice-id' value='"+noticeData[i].noticeId+"'></td>";
                            html += "</tr>";
                            $('.notice-table tbody').append(html); 
                        }
                    } else if ( noticeData[i].type == "POPUP" ) {
                        var inWidth = window.innerWidth;
                        var w = 500;
                        var at = 'left+' + Number((600 * popCnt) + 100) + ' top+100';
                        if (inWidth < 767) {
                            w = 300;
                            at = 'left+' + Number(50 * popCnt)  + ' top+' + Number(40 * popCnt + 93); 
                        }
                        if ( displayNone != "") {
                            var itIs = false;
                            for( var j = 0; j < display.split(",").length; j ++ ) {
                                if( display.split(",")[j] == noticeData[i].noticeId ) {
                                    itIs = true;
                                }
                            }
                            // 공지사항 show 확인
                            if(!itIs) {
                                var html = "";
                                html += "<div id='dialogNotice"+i+"' title='"+noticeData[i].noticeTitle+"'>";
                                html += "<div class='message-content'>"+noticeData[i].noticeContent+"</div>";
                                html += "<div class='popup-check' style='margin-top:30px; text-align: right;'>";
                                html += "<input type='checkbox' name='popup-check' value='"+noticeData[i].noticeId+"'>";
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
                            html += "<div id='dialogNotice"+i+"' title='"+noticeData[i].noticeTitle+"'>";
                            html += "<div class='message-content'>"+noticeData[i].noticeContent+"</div>";
                            html += "<div class='popup-check' style='margin-top:30px; text-align: right;'>";
                            html += "<input type='checkbox' name='popup-check' value='"+noticeData[i].noticeId+"'>";
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
            }
            // 오늘하루 이창 열지 않기 누를 경우
            $("button[title=Close]").click(function() {
                if($(this).parents(".ui-dialog").find("input[name=popup-check]").is(":checked")) { 
                    var noticeId = $(this).parents(".ui-dialog").find("input[name=popup-check]").val();
                    var isCookie = getCookie('ND') || "";
                    if (isCookie) {
                        var nowCookie = decodeURIComponent(escape(window.atob(unescape(getCookie('ND')))));
                    }else {
                        var nowCookie = ""
                    }
                    setCookie('ND',btoa(unescape(encodeURIComponent(nowCookie+","+noticeId))),1);
                }
            });
        } else if (location.href.includes("notice.html")) {
            $(".admin").hide();
            var listCnt = 0;
            if(authType == "ADMIN") {
                for( var i = 0; i < noticeLen; i ++ ) {
                    listCnt ++;
                    var html = "<tr>";
                    html += "<td><label><input type='checkbox' name='nList'><span></span></label></td>";
                    html += "<th scope='row'>";
                    html += listCnt + "</th>";
                    html += "<td class='noticeType'>"
                    if (noticeData[i].type == "LIST") {
                        html += "리스트";
                    } else if (noticeData[i].type == "POPUP") {
                        html += "팝업";
                    }
                    html += "</td>";
                    html += "<td class='noticeTitle'>";
                    html += noticeData[i].noticeTitle + "</td>";
                    html += "<td class='noticeDate'>";
                    html += noticeData[i].noticeDate + "</td>";
                    html += "<td class='noticeCnt'>";
                    html += noticeData[i].noticeCnt + "</td>";
                    html += "<input type='hidden' name='noticeId' value='"+noticeData[i].noticeId+"'>";
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
            } else if (authType == "USER"){
                for( var i = 0; i < noticeLen; i ++ ) {
                    if (noticeData[i].type == "LIST" ) {
                        listCnt++;
                        var html = "<tr>";
                        html += "<th scope='row'>";
                        html += listCnt + "</th>";
                        html += "<td class='noticeTitle'>";
                        html += noticeData[i].noticeTitle + "</td>";
                        html += "<td class='noticeDate'>";
                        html += noticeData[i].noticeDate + "</td>";
                        html += "<td class='noticeCnt'>";
                        html += noticeData[i].noticeCnt + "</td>";
                        html += "<input type='hidden' name='noticeId' value='"+noticeData[i].noticeId+"'>";
                        html += "</tr>";
                        $('.table tbody').append(html);
                    }
                }
            }
            // 공지사항 제목 클릭 시
            $(".noticeTitle").click(function() {
                var noticeId = $(this).parent().find("input[name=noticeId]").val();
                jQuery.ajax({
                    url: serverUrl+"/appapi/SET_NOTICE_VIEW/appRequest.do",
                    type: "POST",
                    dataType: "json",
                    data: {
                        noticeId: noticeId,
                        authType: authType
                    }
                }).done(function(data) {
                    if (data.resultCode == "0000") {
                        var url = "notice_cont.html";
                        url += "?id=" + escape(encodeURIComponent(noticeId),"UTF-8");
                        url += "&type=" + authType;
                        location.href = url;
                    }
                });
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
                        for (var i = 0; i < len; i ++) {
                            noticeId.push(html.eq(i).parent("label").parent("td").parent("tr").find("input[name=noticeId]").val());
                        }
                        jQuery.ajax({
                            url: serverUrl+"/appapi/SET_NOTICE/appRequest.do",
                            type: "POST",
                            dataType: "json",
                            data: {
                                actionType: "DELETE",
                                noticeId: noticeId
                            }
                        }).done(function(data) {
                            alert(data.resultMessage);
                            location.reload();
                        });
                    }
                }
            });
            // 공지사항 글쓰기 클릭 시
            $("input[name=insertNotice]").click(function() {
                location.href = "notice_insert.html";
            });
        } else if(location.href.includes("notice_cont.html")) {
            var request = new Request();
            var noticeId = decodeURIComponent(unescape(request.getParameter('id'), "UTF-8"));
            if( authType == "ADMIN" ) {
                $(".admin").show();
                $(".user").hide();
                for( var i = 0; i < noticeData.length; i ++ ) {
                    if( noticeData[i].noticeId == noticeId ) {
                        $(".nav-title-mobile").html(noticeData[i].noticeTitle);
                        $("input[name=noticeTitle]").val(noticeData[i].noticeTitle);
                        $("input[name=noticeId]").val(noticeData[i].noticeId);
                        $("select[name=noticeType]").val(noticeData[i].type).prop('selected', true);
                        $(".day").html("작성일 : " + noticeData[i].noticeDate);
                        $(".hits").html("조회수 : " + noticeData[i].noticeCnt);
                        $("#summernote").summernote('code',noticeData[i].noticeContent);
                    }  
                }
            } else if (authType == "USER") {
                $(".admin").hide();
                $(".user").show();
                for( var i = 0; i < noticeData.length; i ++ ) {
                    if( noticeData[i].noticeId == noticeId ) {
                        $(".nav-title-mobile").html(noticeData[i].noticeTitle);
                        $(".noticeTitle").html(noticeData[i].noticeTitle);
                        $(".day").html("작성일 : " + noticeData[i].noticeDate);
                        $(".hits").html("조회수 : " + noticeData[i].noticeCnt);
                        $(".noticeContent").html(noticeData[i].noticeContent);
                    }  
                }
            }
        }
        if(authType == "USER") {
            var ntLen = 0;
            for(var i = 0; i < noticeLen; i ++) {
                if(noticeData[i].type == "LIST") {
                    ntLen++;
                }
            }
            $('.notice-cnt').html(ntLen);
        }
    });
}
// 공지사항 목록으로 가기
function goList() {
    location.href = "notice.html";
}
// 관리자 수주개수 가져오기
function getOrderInCnt() {
    var yy = new Date().getFullYear();
    var mm = new Date().getMonth() + 1;
    var ty = new Date(new Date().getTime() + 1000*60*60*24).getFullYear();
    var tm = new Date(new Date().getTime() + 1000*60*60*24).getMonth() + 1;
    var td = new Date(new Date().getTime() + 1000*60*60*24).getDate();
    var startDate = [yy,
        '-',
        (mm > 9 ? '' : '0') + mm,
        '-',
        '01'].join('');
    var endDate = [ty,
        '-',
        (tm > 9 ? '' : '0') + tm,
        '-',
        (td > 9 ? '' : '0') + td].join('');
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_ORDER/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "COUNT",
            startDate: startDate,
            endDate: endDate
        }
    }).done(function(data) {
        var resultData = data.resultData;
        var resultLen = resultData.length;
        var waitLen = 0;
        for( var i = 0; i < resultLen; i ++ ) {
            switch(resultData[i].orderType) {
                case "wait":
                    waitLen += 1;
                    break;
            }
        }
        $('.orders-cnt').html(waitLen);
    });
}
// 발주관리
function getOrderOut(type,startDate,endDate) {
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
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_ORDER/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "USERID",
            userId: userId,
            startDate: start,
            endDate: end
        }
    }).done(function(data) {
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
                if (resultData[i].delSrc.length > 0) {
                    html += "<td><img class='delSrc' src='" + resultData[i].delSrc + "'>";
                } else {
                    html += "<td>배송사진 미등록";
                }
                if (resultData[i].delPerson) {
                    html += "<br><span class='delPerson'>" + resultData[i].delPerson + "</span></td>";
                } else {
                    html += "<br><span class='delPerson'>인수자 미등록</span></td>";
                }
                html += "<td class='receipt'><input type='button' name='receipt' class='btn' value='인수증' style='background: #5BC0DE; color: #FFF;'></td>";
                html += "</tr>";
                $(".result-table tbody").append(html);
            }
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
        }
    });
}
// 수주정보 가져오기
function getOrderin(type, startDate, endDate) {
    // 수주관리 페이지일 경우
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
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_ORDER/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "TOARRAY",
            startDate: start,
            endDate: end
        }
    }).done(function(data) {
        if (data.resultCode == "0000") {
            var resultData = data.resultData;
            var resultLen = resultData.length;
            $('.orderInList').html('수주목록('+resultLen+')');
            $('.tbl-cont').remove();
            for(var i=0; i< resultLen; i++) {
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
        }
    });
}
// 배달관리 가져오기
function getShip(startDate, endDate) {
    $('.date-start input').val(startDate);
    $('.date-end input').val(endDate);
    $('.shipInsert').removeClass('on');
    $('.shipList').addClass('on');
    $('.tbl-cont').remove();
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_SHIP/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            startDate: startDate,
            endDate: endDate
        }
    }).done(function(data) {
        var resultData = data.resultData;
        var resultLen = resultData.length;
        shipData = resultData;
        $('.shipList').html("배달목록("+resultLen+")");
        for(var i=0; i<resultLen; i++) {
            var html = "";
            if(resultData[i].delCheck == "on") {
                switch(resultData[i].shipCompany) {
                    case "헌인":
                        html += "<tr class='tbl-cont "+resultData[i].delCheck+"' style='background: #FFCCCC'>";
                    break;
                    case "사이버":
                        html += "<tr class='tbl-cont "+resultData[i].delCheck+"' style='background: #FFF2CC'>";
                    break;
                    case "우한결":
                        html += "<tr class='tbl-cont "+resultData[i].delCheck+"' style='background: #FFFFCC'>";
                    break;
                    case "개인기사":
                        html += "<tr class='tbl-cont "+resultData[i].delCheck+"' style='background: #CCCCFF'>";
                    break;
                    case "방민우":
                        html += "<tr class='tbl-cont "+resultData[i].delCheck+"' style='background: #CCEFDC'>";
                    break;
                    case "":
                        html += "<tr class='tbl-cont "+resultData[i].delCheck+"'>";
                }
            }else {
                html += "<tr class='tbl-cont "+resultData[i].delCheck+"'>";
            }
            html += "<td class='no'>"+resultData[i].no+"</td>";
            html += "<td class='date'>"+resultData[i].date+"</td>";
            html += "<td class='shipDate'>"+resultData[i].shipDate+"</td>";
            html += "<td class='shipAddress'>"+resultData[i].shipAddress+"</td>";
            html += "<td class='shipProduct'>"+resultData[i].shipProduct+"</td>";
            html += "<td class='shipMemo'>"+resultData[i].shipMemo+"</td>";
            html += "<td class='shipOrderTo'>"+resultData[i].shipOrderTo+"</td>";
            html += "<td class='shipOrderCompany'>"+resultData[i].shipOrderCompany+"</td>";
            html += "<td class='shipOrderCompanyTel'>"+resultData[i].shipOrderCompanyTel+"</td>";
            html += "<td class='shipCompany'>"+resultData[i].shipCompany+"</td>";
            html += "<td class='shipNumber'>"+resultData[i].shipNumber+"</td>";
            html += "<td class='shipPrice'>"+resultData[i].shipPrice+"</td>";
            if(resultData[i].delCheck == "on") {
                html += "<td class='shipProccess'><input type='button' value='수정' name='update' class='btn'><input type='button' value='미배차' name='delCheck' class='btn'></td>";
            }else {
                html += "<td class='shipProccess'><input type='button' value='수정' name='update' class='btn'><input type='button' value='배 차' name='delCheck' class='btn'></td>";
            }
            html += "<td class='shipReceipt'><input type='button' value='인쇄' name='receipt' class='btn'></td>";
            html += "</tr>"
            
            $('.result-table tbody').append(html);
        }
        // 수정하기
        $("input[name='update']").click(function() {
            $(this).parent("td").parent("tr").addClass('update');
            $("input[name='confirm']").remove();
            var date = $(this).parent("td").parent("tr").children(".date").html();
            var shipDate = $(this).parent("td").parent("tr").children(".shipDate").html();
            var shipAddress = $(this).parent("td").parent("tr").children(".shipAddress").html();
            var shipProduct = $(this).parent("td").parent("tr").children(".shipProduct").html();
            var shipMemo = $(this).parent("td").parent("tr").children(".shipMemo").html();
            var shipOrderTo = $(this).parent("td").parent("tr").children(".shipOrderTo").html();
            var shipOrderCompany = $(this).parent("td").parent("tr").children(".shipOrderCompany").html();
            var shipOrderCompanyTel = $(this).parent("td").parent("tr").children(".shipOrderCompanyTel").html();
            var shipCompany = $(this).parent("td").parent("tr").children(".shipCompany").html();
            var shipNumber = $(this).parent("td").parent("tr").children(".shipNumber").html();
            var shipPrice = $(this).parent("td").parent("tr").children(".shipPrice").html();
            $(this).parent("td").parent("tr").children('.date').html("<input type='date' value='"+date+"' name='date' class='form-control'>");
            $(this).parent("td").parent("tr").children('.shipReceipt').html("<input type='button' value='인쇄' name='recipt' class='btn' disabled>");
            $(this).parent("td").parent("tr").children(".shipDate").html("<input type='text' name='shipDate' class='form-control' value='"+shipDate+"'>");
            $(this).parent("td").parent("tr").children(".shipAddress").html("<input type='text' name='shipAddress' class='form-control' value='"+shipAddress+"'>");
            $(this).parent("td").parent("tr").children(".shipProduct").html("<input type='text' name='shipProduct' class='form-control' value='"+shipProduct+"'>");
            $(this).parent("td").parent("tr").children(".shipMemo").html("<input type='text' name='shipMemo' class='form-control' value='"+shipMemo+"'>");
            $(this).parent("td").parent("tr").children(".shipOrderTo").html("<input type='text' name='shipOrderTo' class='form-control' value='"+shipOrderTo+"'>");
            $(this).parent("td").parent("tr").children(".shipOrderCompany").html("<input type='text' name='shipOrderCompany' class='form-control' value='"+shipOrderCompany+"'>");
            $(this).parent("td").parent("tr").children(".shipNumber").html("<input type='text' name='shipNumber' class='form-control' value='"+shipNumber+"'>");
            $(this).parent("td").parent("tr").children(".shipOrderCompanyTel").html(shipOrderCompanyTel);
            var html = "";
            switch(shipCompany) {
                case "헌인": 
                    html = "<select name='shipCompany'><option value='헌인' selected>헌인</option><option value='사이버'>사이버</option><option value='우한결'>우한결</option><option value='개인기사'>개인기사</option><option value='방민우'>방민우</option></select>";
                break;
                case "사이버": 
                    html = "<select name='shipCompany'><option value='헌인'>헌인</option><option value='사이버' selected>사이버</option><option value='우한결'>우한결</option><option value='개인기사'>개인기사</option><option value='방민우'>방민우</option></select>";
                break;
                case "우한결": 
                    html = "<select name='shipCompany'><option value='헌인'>헌인</option><option value='사이버'>사이버</option><option value='우한결' selected>우한결</option><option value='개인기사'>개인기사</option><option value='방민우'>방민우</option></select>";
                break;
                case "개인기사": 
                    html = "<select name='shipCompany'><option value='헌인'>헌인</option><option value='사이버'>사이버</option><option value='우한결'>우한결</option><option value='개인기사' selected>개인기사</option><option value='방민우'>방민우</option></select>";
                break;
                case "방민우": 
                    html = "<select name='shipCompany'><option value='헌인'>헌인</option><option value='사이버'>사이버</option><option value='우한결'>우한결</option><option value='개인기사'>개인기사</option><option value='방민우' selected>방민우</option></select>";
                break;
                case "":
                    html = "<select name='shipCompany'><option value='헌인'>헌인</option><option value='사이버'>사이버</option><option value='우한결'>우한결</option><option value='개인기사'>개인기사</option><option value='방민우'>방민우</option></select>";
                break;
            }
            $(this).parent("td").parent("tr").children(".shipCompany").html(html);
            $(this).parent("td").parent("tr").children(".shipPrice").html("<input type='text' name='shipPrice' class='form-control' value='"+shipPrice+"'>");
            $(this).parent("td").parent("tr").children('.shipProccess').html("<input type='button' value='확인' name='confirm' class='btn'><input type='button' value='삭제' name='delete' class='btn'>");
            // 배송지 바뀔때
            $("select[name='shipCompany']").change(function() {
                var address = $(this).parent("td").parent("tr").children("td").children("input[name='shipAddress']").val();
                var price = $(this).parent("td").parent("tr").children("td").children("input[name='shipPrice']");
                jQuery.ajax({
                    url: serverUrl+"/appapi/GET_SHIP_PRICE/appRequest.do",
                    type: "POST",
                    dataType: "json",
                    data: {
                        shipCompanyName: $(this).val()
                    }
                }).done(function(data) {
                    if(data.resultCode == "0000") {
                        var resultData = data.resultData;
                        var resultLen = resultData.length;
                        var isData = 0;
                        for(var i=0; i<resultLen; i++) {
                            if(address.includes(resultData[i].areaName)) {
                                isData = resultData[i].price;
                            }
                        }
                        price.val(isData);
                    }
                });
            });
            // 수정 확인 버튼
            $("input[name='confirm']").unbind("click").bind("click", function() {
                if (doubleSubmitCheck()) return;
                $(".spinner-wrap").show();
                var html = $('.tbl-cont.update');
                var ajsonArray = new Array();
                for(i = 0; i < html.length; i ++) {
                    var ajson = new Object();
                    ajson.no = html.eq(i).children().html();
                    ajson.preDate = date;
                    ajson.date =  html.eq(i).children().children("input[name='date']").val();
                    ajson.shipDate = html.eq(i).children().children("input[name='shipDate']").val();
                    ajson.shipAddress = html.eq(i).children().children("input[name='shipAddress']").val();
                    ajson.shipProduct = html.eq(i).children().children("input[name='shipProduct']").val();
                    ajson.shipMemo = html.eq(i).children().children("input[name='shipMemo']").val();
                    ajson.shipOrderTo = html.eq(i).children().children("input[name='shipOrderTo']").val();
                    ajson.shipOrderCompany = html.eq(i).children().children("input[name='shipOrderCompany']").val();
                    ajson.shipOrderCompanyTel = html.eq(i).children(".shipOrderCompanyTel").html();
                    ajson.shipCompany = html.eq(i).children().children("select[name='shipCompany']").val();
                    ajson.shipNumber = html.eq(i).children().children("input[name='shipNumber']").val();
                    ajson.shipPrice = html.eq(i).children().children("input[name='shipPrice']").val();
                    ajson.delCheck = html.eq(i).attr('class').split("tbl-cont ")[1].split(" update")[0];
                    ajsonArray.push(ajson);
                }
                jQuery.ajax({
                    url: serverUrl+"/appapi/SET_SHIP/appRequest.do",
                    type: "POST",
                    dataType: "json",
                    data: {
                        actionType: "UPDATE",
                        data: ajsonArray
                    }
                }).done(function(data) {
                    $(".spinner-wrap").hide();
                    if(data.resultCode == "0000") {
                        alert("수정되었습니다.");
                    }else {
                        alert("서버오류입니다.");
                    }
                    location.reload();
                });
                $(".tbl-cont").removeClass('update');
                stopImmediatepropagation();
                return false;
            });
            // 삭제하기
            $("input[name='delete']").click(function() {
                if(confirm("정말 삭제하시겠습니까?")) {
                    jQuery.ajax({
                        url: serverUrl+"/appapi/SET_SHIP/appRequest.do",
                        type: "POST",
                        dataType: "json",
                        data: {
                            actionType: "DELETE",
                            date: $(this).parent("td").parent("tr").children(".date").children("input[name='date']").val(),
                            no: Number($(this).parent("td").parent("tr").children(".no").html())
                        }
                    }).done(function(data) {
                        if(data.resultCode == "0000") {
                            location.reload();
                        }else {
                            alert("서버오류입니다.");
                        }
                    });
                } else {
                    return;
                }
            });
            return;
        });
        // 인수증열기
        $("input[name='receipt']").click(function() {
            var url = "/receipt.html";
            url += "?no=" + escape(encodeURIComponent($(this).parent('td').parent('tr').children(".no").html()), "UTF-8");;
            url += "&date=" + escape(encodeURIComponent($(this).parent('td').parent('tr').children(".date").html()), "UTF-8");
            url += "&shipDate=" + escape(encodeURIComponent($(this).parent('td').parent('tr').children(".shipDate").html(),"UTF-8"));
            url += "&shipAddress=" + escape(encodeURIComponent($(this).parent('td').parent('tr').children(".shipAddress").html(),"UTF-8"));
            url += "&shipProduct=" + escape(encodeURIComponent($(this).parent('td').parent('tr').children(".shipProduct").html(),"UTF-8"));
            url += "&shipMemo=" + escape(encodeURIComponent($(this).parent('td').parent('tr').children(".shipMemo").html(),"UTF-8"));
            url += "&shipOrderCompanyTel=" + escape(encodeURIComponent($(this).parent('td').parent('tr').children(".shipOrderCompanyTel").html(),"UTF-8"));
            window.open(url,'_blank','width=1000,height=1000');
        });
        // 배차처리
        $("input[name='delCheck']").click(function() {
            var company = $(this).parent("td").parent("tr").children('.shipCompany').html();
            var cla = $(this).parent("td").parent("tr").attr('class');
            var delCheckVal = cla.split("tbl-cont ")[1];
            if(delCheckVal == "on") {
                $(this).parent("td").parent("tr").removeClass('on');
                $(this).parent("td").parent("tr").addClass('off');
                $(this).parent("td").parent("tr").css("background","#F7F7F7");
                $(this).val("배 차");
            }else if(delCheckVal == "off") {
                $(this).parent("td").parent("tr").removeClass('off');
                $(this).parent("td").parent("tr").addClass('on');
                $(this).val("미배차");
                switch(company) {
                    case "헌인":
                        $(this).parent("td").parent("tr").css("background","#FFCCCC");
                    break;
                    case "사이버":
                        $(this).parent("td").parent("tr").css("background","#FFF2CC");
                    break;
                    case "우한결":
                        $(this).parent("td").parent("tr").css("background","#FFFFCC");
                    break;
                    case "개인기사":
                        $(this).parent("td").parent("tr").css("background","#CCCCFF");
                    break;
                    case "방민우":
                        $(this).parent("td").parent("tr").css("background","#CCEFDC");
                    break;
                    case "":
                        $(this).parent("td").parent("tr").css("background","");
                    break;
                }
            } 
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_DEL/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    date: $(this).parent("td").parent("tr").children(".date").html(),
                    no: Number($(this).parent("td").parent("tr").children(".no").html()),
                    delCheck: $(this).parent("td").parent("tr").attr('class').split("tbl-cont ")[1]
                }
            }).done(function(data) {

            });
        });
    });
    return;
}
// 업체관리 가져오기
function getCompany() {
    $('.companyInsert').removeClass('on');
    $('.companyList').addClass('on');
    $('.tbl-cont').remove();
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_COMPANY/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            
        }
    }).done(function(data) {
        var resultData = data.resultData;
        var resultLen = resultData.length;
        $('.companyList').html("업체목록("+resultLen+")");
        for(var i=0; i<resultLen; i++) {
            var html = "";
            html += "<tr class='tbl-cont'>";
            html += "<td class='companyId' name='"+resultData[i].companyId+"'>"+(i+1)+"</td>";
            html += "<td class='companyName'>"+resultData[i].companyName+"</td>";
            html += "<td class='companyTel'>"+resultData[i].companyTel+"</td>";
            html += "<td class='process'><input type='button' value='수정' name='update' class='btn'></td>";
            html += "</tr>"
            $('.result-table tbody').append(html);
        }
        // 수정하기
        $("input[name='update']").click(function() {
            $(this).parent("td").parent("tr").addClass('update');
            $("input[name='confirm']").remove();
            var companyName = $(this).parent("td").parent("tr").children(".companyName").html();
            var companyTel = $(this).parent("td").parent("tr").children(".companyTel").html();
            $(this).parent("td").parent("tr").children('.companyName').html("<input type='text' value='"+companyName+"' name='companyName' class='form-control'>");
            $(this).parent("td").parent("tr").children('.companyTel').html("<input type='text' value='"+companyTel+"' name='companyTel' class='form-control'>");
            $(this).parent("td").parent("tr").children('.process').html("<input type='button' value='확인' name='confirm' class='btn'><input type='button' value='삭제' name='delete' class='btn'>");
            // 수정 확인 버튼
            $("input[name='confirm']").click(function() {
                $(".spinner-wrap").show();
                var html = $('.tbl-cont.update');
                var ajsonArray = new Array();
                for(i=0; i<html.length;i++) {
                    var ajson = new Object();
                    ajson.companyId = html.eq(i).children(".companyId").attr('name');
                    ajson.companyName = html.eq(i).children().children("input[name='companyName']").val();
                    ajson.companyTel =  html.eq(i).children().children("input[name='companyTel']").val();
                    ajsonArray.push(ajson);
                }
                jQuery.ajax({
                    url: serverUrl+"/appapi/SET_COMPANY/appRequest.do",
                    type: "POST",
                    dataType: "json",
                    data: {
                        actionType: "UPDATE",
                        data: ajsonArray
                    }
                }).done(function(data) {
                    $(".spinner-wrap").hide();
                    if(data.resultCode == "0000") {
                        alert("수정되었습니다.");
                    }else {
                        alert("서버오류입니다.");
                    }
                    location.reload();
                });
                $(".tbl-cont").removeClass('update');
                return;
            });
             // 삭제하기
            $("input[name='delete']").click(function() {
                if(confirm("정말 삭제하시겠습니까?")) {
                    jQuery.ajax({
                        url: serverUrl+"/appapi/SET_COMPANY/appRequest.do",
                        type: "POST",
                        dataType: "json",
                        data: {
                            actionType: "DELETE",
                            companyId: $(this).parent("td").parent("tr").children(".companyId").attr('name'),
                        }
                    }).done(function(data) {
                        if(data.resultCode == "0000") {
                            location.reload();
                        }else {
                            alert("서버오류입니다.");
                        }
                    });
                } else {
                    return;
                }
                return;
            });
            return;
        });
    });
    return;
}
// 배달관리조건 가져오기
function getShipCondi(condition) {
    var timeConstant = new Date().getTime();
    if(condition == "before") {
        var time = new Date(timeConstant - 24*60*60*1000).yyyymmdd();
        getShip(time,time);
    }else if(condition == "today") {
        var time = new Date().yyyymmdd();
        getShip(time,time);
    }else if(condition == "after") {
        var time = new Date(timeConstant + 24*60*60*1000).yyyymmdd();
        getShip(time,time);
    }
}
// 쿠키가져오기
function getCookie(cookie_name){
    var value = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    return value? value[2] : null;
}
// 쿠키저장하기
function setCookie(cookie_name, value, days){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + days);
    // 설정 일수만큼 현재시간에 만료값으로 지정
    var cookie_value = escape(value) + ((days === null) ? '' : ';    expires=' + exdate.toUTCString());
    document.cookie = cookie_name + '=' + cookie_value;
}
// 쿠키삭제하기
function deleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
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
// getTime
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
// 가상계좌 데드라인
Date.prototype.deadlineDate = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();
    var hh = this.getHours();
    var m = this.getMinutes();

    return [this.getFullYear(),
        (mm>9? '': '0')+ mm,
        ((dd+3)>9? '': '0')+ (dd+3),
        (hh>9? '': '0')+ hh,
        (m>9? '': '0')+ m].join('');
}
// 엑셀 다운로드
function fnExcelReport(id, title) {
    var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
    tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';
    tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
    tab_text = tab_text + "<table border='1px'>";
    var exportTable = $('#' + id).clone();
    exportTable.find('input').each(function (index, elem) { $(elem).remove(); });
    tab_text = tab_text + exportTable.html();
    tab_text = tab_text + '</table></body></html>';
    var data_type = 'data:application/vnd.ms-excel';
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var fileName = title + '.xls';
    //Explorer 환경에서 다운로드
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        if (window.navigator.msSaveBlob) {
            var blob = new Blob([tab_text], {
                type: "application/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, fileName);
        }
    } else {
        var blob2 = new Blob([tab_text], {
            type: "application/csv;charset=utf-8;"
        });
        var filename = fileName;
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob2);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}
// 전부 체크하기
function checkPListAll() {
    if(!productChk) {
        $("input[name='pList']").prop('checked', true);
        $("input:checkbox[name='pListAll']").prop('checked', true);
        productChk = true;
    }
    else {
        $("input[name='pList']").prop('checked', false);  
        $("input:checkbox[name='pListAll']").prop('checked', false); 
        productChk = false; 
    }
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
                $('.preview-image').addClass('on');
                var html="";
                html += "<div class='upload-thumb-wrap'><img src='"+e.target.result+"' class='upload-thumb'></div>"
                $('.upload-display').empty();
                $('.upload-display').append(html);
            }

            reader.readAsDataURL(obj.files[0]);
        }
    }else {
        alert('브라우저 버전을 업그레이드 해주세요.');
    }
}
// 상품 리스트 가져오기
function getProductAll() {
    $('.cont-con').remove();
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_PRICE/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "price"
        }
    }).done(function(data) {
        var result = data.resultData;
        pricePercent.company = result.company;
        pricePercent.consumer = result.consumer;
        pricePercent.advanced = result.advanced;
        pricePercent.highend = result.highend;
        $("input[name=companyPercent]").val(result.company);
        $("input[name=consumerPercent]").val(result.consumer);
        $("input[name=advanced]").val(result.advanced);
        $("input[name=highend]").val(result.highend);
    });
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_PRODUCT/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "ALL"
        }
    }).done(function(data) {
        var resultData = data.resultData;
        productData = resultData;
        var resultLen = resultData.length;
        var limitLen = 10;
        var resultPaging = parseInt(resultLen/11)+1;
        $('.productLen').html(resultLen);
        for (var i = 0; i < resultLen; i ++) {
            if (i < limitLen) {
                var html = "<tr class='cont-con' style='border-bottom: 1px solid #B5BABD;'>";
                html += "<td><label><input type='checkbox' name='pList' value='"+resultData[i].productId+"'><span></span></label></td>";
                html += "<td><div class='productId' style='font-weight:bold;'>"+resultData[i].productId+"</div>";
                if(resultData[i].viewState == "Y") {
                    html += "<div class='view on'>[진열상태]</div>";
                    html += "<div class='viewBtn off btn'>진열 안하기</div></td>";
                }else if(resultData[i].viewState == "N") {
                    html += "<div class='view off'>[미진열상태]</div>";
                    html += "<div class='viewBtn on btn'>진열 하기</div></td>";
                }
                html += "<td style='text-align: left'><div style='width:50px; display:inline-block; vertical-align: top;'><img src='"+resultData[i].productSrc+"' class='productSrc' style='width:50px; height:50px;' onmouseover='$(\"#HideShow"+i+"\").show();' onmouseout='$(\"#HideShow"+i+"\").hide();'><div id='HideShow"+i+"' style='position: absolute; z-index: 1; display: none;'><img src='"+resultData[i].productSrc+"' style='width:350px; height:466px'></div></div>";
                html += "<div style='width:100px; padding-left:10px; display:inline-block;'><div><strong class='productName'>"+resultData[i].productName+"</strong></div>";
                if(resultData[i].productType == "oriental") {
                    html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>동양란</div>";
                }else if(resultData[i].productType == "house") {
                    html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>관엽</div>";
                }else if(resultData[i].productType == "western") {
                    html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>서양란</div>";
                }else if(resultData[i].productType == "etc") {
                    html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>기타</div>";
                }
                html += "<div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productCate'>"+resultData[i].productCate+"</div></div></div>";
                html += "<input type='hidden' value='"+resultData[i].productInfo+"' class='productInfo'></td>"
                html += "<td><span class='productPriceCon'>"+setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.consumer))/100).split('원')[0]+"</span><span style='color:#CC9900'>원</td>";
                html += "<td><span class='productPriceCom'>"+setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.company))/100).split('원')[0]+"</span><span style='color:#CC9900'>원</td>";
                html += "<td><span class='productPrice'>"+setCommaWon(resultData[i].productPrice).split('원')[0]+"</span><span style='color:#CC9900'>원</td>";
                html += "<td><span class='shippingPriceExtra'>"+setCommaWon(resultData[i].shippingPriceExtra).split('원')[0]+" 원</span></td>";
                if (resultData[i].shipState == "true") {
                    html += "<td><div class='isShip on'>가능</div></td>";
                } else if (resultData[i].shipState == "false") {
                    html += "<td><div class='isShip off'>불가</div></td>";
                } else {
                    html += "<td>-</td>";
                }
                html += "<td><span class='viewCnt'>"+resultData[i].viewCnt+"</span> 회<br>";
                html += "<span class='saleCnt'>"+resultData[i].saleCnt+"</span> 개</td>";
                html += "<td><input type='button' name='updateProduct' class='btn' value='수정' onclick='updateProduct(this)'><input type='button' class='btn' name='deleteProduct' value='삭제' onclick='deleteProduct(this)'></td>";
                html += "</tr>";
                $('.right-section table tbody').append(html);
            }
        }
        // paging 추가
        $(".paging").empty();
        var html = "<a href='javascript:;' onclick='page_go(1);' class='page-select'> &lt; </a>";
        for(var j=0; j<resultPaging;j++) {
            if(j == 0) {
                html += "<a href='javascript:;' onclick='page_go("+(j+1)+");' class='page-selecet page-selected'>"+(j+1)+"</a>";
            }else {
                html += "<a href='javascript:;' onclick='page_go("+(j+1)+");' class='page-selecet'>"+(j+1)+"</a>";
            }
        }
        html += "<a href='javascript:;' onclick='page_go("+(resultPaging)+");' class='page-selecet'> &gt; </a>";
        $(".paging").append(html);
        // 진열상태 변경
        $('.viewBtn').click(function() {
            var state = $(this).hasClass('on');
            var obj = $(this);
            if(state) {
                jQuery.ajax({
                    url: serverUrl+"/appapi/SET_PRODUCT_VIEWSTATE/appRequest.do",
                    type: "POST",
                    dataType: "json",
                    data: {
                        productId: $(this).parent().children(".productId").html(),
                        viewState: 'Y'
                    }
                }).done(function(data) {
                    if(data.resultCode == "0000") {
                        obj.removeClass('on');
                        obj.addClass('off');
                        obj.html('진열 안하기');
                        obj.parent().children(".view").removeClass('off');
                        obj.parent().children(".view").addClass('on');
                        obj.parent().children(".view").html("[진열상태]");
                    }else {
                        alert("서버 오류입니다.");
                    }
                });
            }else { 
                jQuery.ajax({
                    url: serverUrl+"/appapi/SET_PRODUCT_VIEWSTATE/appRequest.do",
                    type: "POST",
                    dataType: "json",
                    data: {
                        actionType: "UPDATE",
                        productId: $(this).parent().children(".productId").html(),
                        viewState: 'N'
                    }
                }).done(function(data) {
                    if(data.resultCode == "0000") {
                        obj.removeClass('off');
                        obj.addClass('on');
                        obj.html('진열 하기');
                        obj.parent().children(".view").removeClass('on');
                        obj.parent().children(".view").addClass('off');
                        obj.parent().children(".view").html("[미진열상태]");
                    }else {
                        alert("서버 오류입니다.");
                    }
                });
            }
        });
    });
}
// 상품 페이지 넘길때
function page_go(page_cnt) {
    for(var j=0; j<$(".page-selecet").length; j++) {
        if($(".page-selecet").eq(j).html() == page_cnt) {
            $(".page-selecet").eq(j).addClass('page-selected');
        }else {
            $(".page-selecet").eq(j).addClass('page-select');
            $(".page-selecet").eq(j).removeClass("page-selected");
        }
    }
    var resultData = productData;
    var resultLen = resultData.length;
    var limitLen = page_cnt*10;
    $('.cont-con').remove();
    for(var i=0; i<resultLen; i++) {
        if(limitLen-10 <= i && i < limitLen) {
            var html = "<tr class='cont-con' style='border-bottom: 1px solid #B5BABD;'>";
            html += "<td><label><input type='checkbox' name='pList' value='"+resultData[i].productId+"'><span></span></label></td>";
            html += "<td><div class='productId' style='font-weight:bold;'>"+resultData[i].productId+"</div>";
            if(resultData[i].viewState == "Y") {
                html += "<div class='view on'>[진열상태]</div>";
                html += "<div class='viewBtn off btn'>진열 안하기</div></td>";
            }else if(resultData[i].viewState == "N") {
                html += "<div class='view off'>[미진열상태]</div>";
                html += "<div class='viewBtn on btn'>진열 하기</div></td>";
            }
            html += "<td style='text-align: left'><div style='width:50px; display:inline-block; vertical-align: top;'><img src='"+resultData[i].productSrc+"'  class='productSrc' style='width:50px; height:50px;' onmouseover='$(\"#HideShow"+i+"\").show();' onmouseout='$(\"#HideShow"+i+"\").hide();'><div id='HideShow"+i+"' style='position: absolute; z-index: 1; display: none;'><img src='"+resultData[i].productSrc+"' style='width:350px; height:466px'></div></div>";
            html += "<div style='width:100px; padding-left:10px; display:inline-block;'><div><strong class='productName'>"+resultData[i].productName+"</strong></div>";
            if(resultData[i].productType == "oriental") {
                html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>동양란</div>";
            }else if(resultData[i].productType == "house") {
                html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>관엽</div>";
            }else if(resultData[i].productType == "western") {
                html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>서양란</div>";
            }else if(resultData[i].productType == "etc") {
                html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>기타</div>";
            }
            html += "<div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productCate'>"+resultData[i].productCate+"</div></div></div>";
            html += "<input type='hidden' value='"+resultData[i].productInfo+"' class='productInfo'></td>"
            html += "<td><span class='productPriceCon'>"+setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.consumer))/100).split('원')[0]+"</span><span style='color:#CC9900'>원</td>";
            html += "<td><span class='productPriceCom'>"+setCommaWon(Number(resultData[i].productPrice)*(100 + Number(pricePercent.company))/100).split('원')[0]+"</span><span style='color:#CC9900'>원</td>";
            html += "<td><span class='productPrice'>"+setCommaWon(resultData[i].productPrice).split('원')[0]+"</span><span style='color:#CC9900'>원</td>";
            html += "<td><span class='shippingPriceExtra'>"+setCommaWon(resultData[i].shippingPriceExtra).split('원')[0]+" 원</span></td>";
            if (resultData[i].shipState == "true") {
                html += "<td><div class='isShip on'>가능</div></td>";
            } else if (resultData[i].shipState == "false") {
                html += "<td><div class='isShip off'>불가</div></td>";
            } else {
                html += "<td>-</td>";
            }
            html += "<td><span class='viewCnt'>"+resultData[i].viewCnt+"</span> 회<br>";
            html += "<span class='saleCnt'>"+resultData[i].saleCnt+"</span> 개</td>";
            html += "<td><input type='button' name='updateProduct' class='btn' value='수정' onclick='updateProduct(this)'><input type='button' class='btn' name='deleteProduct' value='삭제' onclick='deleteProduct(this)'></td>";
            html += "</tr>";
            $('.right-section table tbody').append(html);
        }
    }
    // 진열상태 변경
    $('.viewBtn').click(function() {
        var state = $(this).hasClass('on');
        var obj = $(this);
        if(state) {
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_PRODUCT_VIEWSTATE/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    actionType: "UPDATE",
                    productId: $(this).parent().children(".productId").html(),
                    viewState: 'Y'
                }
            }).done(function(data) {
                if(data.resultCode == "0000") {
                    obj.removeClass('on');
                    obj.addClass('off');
                    obj.html('진열 안하기');
                    obj.parent().children(".view").removeClass('off');
                    obj.parent().children(".view").addClass('on');
                    obj.parent().children(".view").html("[진열상태]");
                }else {
                    alert("서버 오류입니다.");
                }
            });
        }else { 
            jQuery.ajax({
                url: serverUrl+"/appapi/SET_PRODUCT_VIEWSTATE/appRequest.do",
                type: "POST",
                dataType: "json",
                data: {
                    actionType: "UPDATE",
                    productId: $(this).parent().children(".productId").html(),
                    viewState: 'N'
                }
            }).done(function(data) {
                if(data.resultCode == "0000") {
                    obj.removeClass('off');
                    obj.addClass('on');
                    obj.html('진열 하기');
                    obj.parent().children(".view").removeClass('on');
                    obj.parent().children(".view").addClass('off');
                    obj.parent().children(".view").html("[미진열상태]");
                }else {
                    alert("서버 오류입니다.");
                }
            });
        }
    });
}
// 상품 중 분류 가져오기
function getCate(obj) {
    $("select[name='productCate']").empty();
    var categoryId = $(obj).val();
    jQuery.ajax({
        url: serverUrl+"/appapi/GET_CATEGORY/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            categoryId: categoryId
        }
    }).done(function(data) {
        var resultData = data.resultData;
        var resultLen = resultData.length;
        var html = "";
        for( var i = 0; i < resultLen; i ++ ) {
            html += "<option value='"+resultData[i].categoryData+"'>"+resultData[i].categoryData+"</option>";
        }
        $("select[name='productCate']").append(html);
    });
}
// 상품 등록하기
function setProduct() {
    var productType = $("select[name='productType']").val();
    var productCate = $("select[name='productCate']").val();
    var productName = $("input[name='productName']").val();
    var productInfo = $("input[name='productInfo']").val();
    var productSrc = $(".upload-thumb").attr('src');
    var productPrice = $("input[name='productPrice']").val();
    var shippingPriceExtra = $("input[name='shippingPriceExtra']").val();
    var shipState = $("select[name=shipState]").val();
    if(productName == "") {
        alert("상품명을 입력해주세요.");
        $("selecet[name='productName']").focus();
        return false;
    }else if(productInfo == "") {
        alert("간략한설명을 입력해주세요.");
        $("input[name='productInfo']").focus();
        return false;
    }else if(productSrc == "") {
        alert("대표이미지를 설정해주세요.");
        return false;
    }else if(productPrice == "") {
        alert("소비자 가격을 입력해주세요.");
        $("input[name='productPrice']").focus();
        return false;
    }else if(productPriceCom == "") {
        alert("기업가 가격을 입력해주세요.");
        $("input[name='productPriceCom']").focus();
        return false;
    }else if(productPriceFl == "") {
        alert("도매직발주가 가격을 입력해주세요.");
        $("input[name='productPriceFl']").focus();
        return false;
    }else if(shippingPriceExtra == "") {
        alert("추가시 발생하는 배송비를 입력해주세요.");
        $("input[name='shippingPriceExtra']").focus();
        return false;
    }
    jQuery.ajax({
        url: serverUrl+"/appapi/SET_PRODUCT/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "INSERT",
            productType: productType,
            productCate: productCate,
            productName: productName,
            productInfo: productInfo,
            productSrc: productSrc,
            productPrice: productPrice,
            shipState: shipState,
            shippingPriceExtra: shippingPriceExtra
        }
    }).done(function(data) {
        if(data.resultCode == "0000") {
            alert("상품이 등록되었습니다.");
            location.replace('/product_list.html');
        }
    });
}
// 상품 전체 삭제하기
function deletePList() {
    $(".spinner-wrap").show();
    var html = $("input[name='pList']:checked");
    var ajsonArray = new Array();
    for(i=0; i<html.length;i++) {
        var ajson = new Object();
        ajson.productId = html.eq(i).val();
        ajsonArray.push(ajson);
    }
    jQuery.ajax({
        url: serverUrl+"/appapi/SET_PRODUCT/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "DELETE",
            data: ajsonArray
        }
    }).done(function(data) {
        $(".spinner-wrap").hide();
        if(data.resultCode == "0000") {
            alert("상품이 삭제되었습니다.");
            location.replace('/product_list.html');
        }
    });
}
// 수정하기페이지 넘어가기
function updateProduct(obj) {
    var productId = $(obj).parent("td").parent("tr").children("td").children(".productId").html();
    var productType = $(obj).parent("td").parent("tr").children("td").children("div").children("div").children(".productType").html();
    var productCate = $(obj).parent("td").parent("tr").children("td").children("div").children("div").children(".productCate").html();
    var productName = $(obj).parent("td").parent("tr").children("td").children("div").children("div").children(".productName").html();
    var productInfo = $(obj).parent("td").parent("tr").children("td").children(".productInfo").val();
    var productSrc = $(obj).parent("td").parent("tr").children("td").children("div").children("img.productSrc").attr('src');
    var productPrice = setNumber($(obj).parent("td").parent("tr").children("td").children(".productPrice").html());
    var shipState = $(obj).parent("td").parent("tr").find(".isShip").html();
    var shippingPriceExtra = setNumber($(obj).parent("td").parent("tr").children("td").children(".shippingPriceExtra").html());
    var url = "/product_update.html";
    url += "?productId=" + escape(encodeURIComponent(productId),"UTF-8");
    url += "&productType=" + escape(encodeURIComponent(productType),"UTF-8");
    url += "&productCate=" + escape(encodeURIComponent(productCate),"UTF-8");
    url += "&productName=" + escape(encodeURIComponent(productName),"UTF-8");
    url += "&productInfo=" + escape(encodeURIComponent(productInfo),"UTF-8");
    url += "&productSrc=" + escape(encodeURIComponent(productSrc),"UTF-8");
    url += "&productPrice=" + escape(encodeURIComponent(productPrice),"UTF-8");
    url += "&shipState=" + escape(encodeURIComponent(shipState),"UTF-8");
    url += "&shippingPriceExtra=" + escape(encodeURIComponent(shippingPriceExtra),"UTF-8");
    location.href = url;  
}
// 수정하기
function setUpdateProduct() {
    $(".spinner-wrap").show();
    var productId = $("input[name='productId']").val();
    var productType = $("select[name='productType']").val();
    var productCate = $("select[name='productCate']").val();
    var productName = $("input[name='productName']").val();
    var productInfo = $("input[name='productInfo']").val();
    var productSrc = $(".upload-thumb").attr('src');
    var productPrice = $("input[name='productPrice']").val();
    var shippingPriceExtra = $("input[name='shippingPriceExtra']").val();
    var shipState = $("select[name=shipState]").val();
    jQuery.ajax({
        url: serverUrl+"/appapi/SET_PRODUCT/appRequest.do",
        type: "POST",
        dataType: "json",
        data: {
            actionType: "UPDATE",
            productId: productId,
            productType: productType,
            productCate: productCate,
            productName: productName,
            productInfo: productInfo,
            productSrc: productSrc,
            productPrice: productPrice,
            shipState: shipState,
            shippingPriceExtra: shippingPriceExtra
        }
    }).done(function(data) {
        $(".spinner-wrap").hide();
        if(data.resultCode == "0000") {
            alert("상품이 수정되었습니다.");
            location.replace('/product_list.html');
        }
    });
}
// 삭제하기
function deleteProduct(obj) {
    if(confirm("정말 삭제하시겠습니까?")) {
        $(".spinner-wrap").show();
        var productId = $(obj).parent("td").parent("tr").children("td").children(".productId").html();
        var ajsonArray = new Array();
        var ajson = new Object();
        ajson.productId = productId;
        ajsonArray.push(ajson);
        jQuery.ajax({
            url: serverUrl+"/appapi/SET_PRODUCT/appRequest.do",
            type: "POST",
            dataType: "json",
            data: {
                actionType: "DELETE",
                data: ajsonArray
            }
        }).done(function(data) {
            $(".spinner-wrap").hide();
            if(data.resultCode == "0000") {
                alert("상품이 삭제되었습니다.");
                location.replace('/product_list.html');
            }
        });
    }else {
        return;
    }
}
// 뒤로가기
function prePage() {
    window.history.back();
}