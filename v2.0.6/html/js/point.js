$(function() {
    if (getUserId() != null) {
        startMain();
        getNoticeNumber();
    }
})
window.onload = function() {
/** mypage.html */
    if (location.href.includes('mypage.html')) {
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
        month = month > 9 ? '' + month : '0' + month;
        $("select[name=smonth]").val(month).prop('selected', true);
        var startDate = year + "-" + month + '-01';
        var endDate = "";
        if (month == "12") {
            endDate = (year + 1) + "-01-01";
        } else {
            month = (Number(month) + 1) > 9 ? '' + (Number(month) + 1) : '0' + (Number(month) + 1);
            endDate = year + "-" + month+ '-01';
        }
        // 충전/사용 내역 가져오기
        getPointList(startDate, endDate);
        // 충전/사용내역 조회
        $('button[name=btn-search]').click(function() {
            var year = $("select[name=syear]").val();
            var month = $("select[name=smonth]").val();
            var startDate = year + "-" + month + '-01';
            var endDate = "";
            if (month == 12) {
                endDate = (year + 1) + "-01-01";
            } else {
                month = (Number(month) + 1) > 9 ? '' + (Number(month) + 1) : '0' + (Number(month) + 1);
                endDate = year + "-" + month + '-01';
            }
            // 충전/사용 내역 가져오기
            getPointList(startDate, endDate);
        });
    }
/** mypage.html */
/** point.html */
    if (location.href.includes('point.html')) {
        // 가맹점 식별코드 초기화
        IMP = window.IMP;
        IMP.init('imp91090491');
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
            var width = window.innerWidth;
            // 결제하기 모바일
            if (width <= 767) {
                if (chargeMethod == 'card' ) {
                    var msg = {
                        actionType: "MOBILE",
                        userId: userData.userId,
                        imp_uid: "",
                        merchant_uid: merchant_uid,
                        chargePoint: chargePoint,
                        feePoint: feePoint,
                        pay_method: chargeMethod,
                        vbank_num: "",
                        vbank_name: "",
                        vbank_holder: "",
                        vbank_date: "",
                        receipt: "",
                        status: "ready"
                    }
                    var callback = function(data) {
                        if(data.resultCode == "0000") {
                            IMP.request_pay({
                                pg : 'html5_inicis', 
                                pay_method : chargeMethod,
                                merchant_uid : merchant_uid,
                                name : "charge",
                                amount : Number(chargePoint) + Number(feePoint),
                                buyer_email : userData.userEmail,
                                buyer_name : userData.ceoName,
                                buyer_tel : userData.userPhone,
                                buyer_addr : userData.companyAddress,
                                m_redirect_url: webUrl + "/point_ok.html?user_id=" + userData.userId
                            });
                        }
                    }
                    doPost("SET_POINT", msg, callback);  
                } else if (chargeMethod == 'vbank') {
                    var date = new Date().deadlineDate();
                    var msg = {
                        actionType: "MOBILE",
                        userId: userData.userId,
                        imp_uid: "",
                        merchant_uid: merchant_uid,
                        chargePoint: chargePoint,
                        feePoint: feePoint,
                        pay_method: chargeMethod,
                        vbank_num: "",
                        vbank_name: "",
                        vbank_date: "",
                        vbank_holder: "농업회사법인신호(주)",
                        receipt: "",
                        status: "ready"
                    }
                    var callback = function(data) {
                        if(data.resultCode == "0000") {
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
                                vbank_due : date,
                                m_redirect_url: webUrl + "/point_ok.html?user_id=" + userData.userId
                            });
                        }
                    }
                    doPost("SET_POINT", msg, callback);                    
                } else if (chargeMethod == 'kakaopay') {
                    var msg = {
                        actionType: "MOBILE",
                        userId: userData.userId,
                        imp_uid: "",
                        merchant_uid: merchant_uid,
                        chargePoint: chargePoint,
                        feePoint: feePoint,
                        pay_method: "point",
                        vbank_num: "",
                        vbank_name: "",
                        vbank_date: "",
                        vbank_holder: "",
                        receipt: "",
                        status: "ready"
                    }
                    var callback = function(data) {
                        if(data.resultCode == "0000") {
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
                                m_redirect_url: webUrl + "/point_ok.html?user_id=" + userData.userId
                            });
                        }
                    }
                    doPost("SET_POINT", msg, callback);   
                }
            }
            //결제하기 PC
            else {
                if (chargeMethod == 'card' ) {
                    IMP.request_pay({
                        pg : 'html5_inicis', 
                        pay_method : chargeMethod,
                        merchant_uid : merchant_uid,
                        name : "charge",
                        amount : Number(chargePoint) + Number(feePoint),
                        buyer_email : userData.userEmail,
                        buyer_name : userData.ceoName,
                        buyer_tel : userData.userPhone,
                        buyer_addr : userData.companyAddress,
                        m_redirect_url: "https://www.sinho2016.com/point_ok.html"
                    }, function(rsp) {
                        if (rsp.success) {
                            var msg = {
                                actionType: "PC",
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pay_method: rsp.pay_method,
                                vbank_num: "",
                                vbank_name: "",
                                vbank_holder: "",
                                vbank_date: "",
                                receipt: rsp.receipt_url,
                                status: rsp.status
                            }
                            var callback = function(data) {
                                if(data.resultCode == "0000") {
                                    location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=true';
                                }
                            }
                            doPost("SET_POINT", msg, callback);
                        } else {
                            var msg = {
                                actionType: "PC",
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pay_method: chargeMethod,
                                vbank_num: "",
                                vbank_name: "",
                                vbank_holder: "",
                                vbank_date: "",
                                receipt: rsp.receipt_url,
                                status: 'failed'
                            }
                            var callback = function(data) {
                                if(data.resultCode == "0000") {
                                    location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=false';
                                }
                            }
                            doPost("SET_POINT", msg, callback);
                        }
                    });
                } else if (chargeMethod == 'vbank') {
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
                            var msg = {
                                actionType: "PC",
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pay_method: rsp.pay_method,
                                vbank_num: rsp.vbank_num,
                                vbank_name: rsp.vbank_name,
                                vbank_date: rsp.vbank_date,
                                vbank_holder: "농업회사법인신호(주)",
                                receipt: rsp.receipt_url,
                                status: rsp.status
                            }     
                            var callback = function(data) {
                                if(data.resultCode == "0000") {
                                    location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=true';
                                }
                            }
                            doPost("SET_POINT", msg, callback);
                        } else {
                            var msg = {
                                actionType: "PC",
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pay_method: chargeMethod,
                                vbank_num: "",
                                vbank_name: "",
                                vbank_date: "",
                                vbank_holder: "",
                                receipt: rsp.receipt_url,
                                status: 'failed'
                            }
                            var callback = function(data) {
                                if(data.resultCode == "0000") {
                                    location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=false';
                                }
                            }
                            doPost("SET_POINT", msg, callback);
                        }                 
                    });
                } else if (chargeMethod == 'kakaopay') {
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
                            var msg = {
                                actionType: "PC",
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pay_method: rsp.pay_method,
                                vbank_num: "",
                                vbank_name: "",
                                vbank_date: "",
                                vbank_holder: "",
                                receipt: rsp.receipt_url,
                                status: rsp.status
                            }
                            var callback = function(data) {
                                if(data.resultCode == "0000") {
                                    location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=true';
                                }
                            }
                            doPost("SET_POINT", msg, callback);
                        } else {
                            var msg = {
                                actionType: "PC",
                                userId: userData.userId,
                                imp_uid: rsp.imp_uid,
                                merchant_uid: merchant_uid,
                                chargePoint: chargePoint,
                                feePoint: feePoint,
                                pay_method: 'point',
                                vbank_num: "",
                                vbank_name: "",
                                vbank_date: "",
                                vbank_holder: "",
                                receipt: rsp.receipt_url,
                                status: 'failed'
                            }
                            var callback = function(data) {
                                if(data.resultCode == "0000") {
                                    location.href = '/point_ok.html?merchant_uid=' + merchant_uid + '&imp_success=false';
                                }
                            }
                            doPost("SET_POINT", msg, callback);
                        }
                    });
                }
            }
        });
        // 취소 버튼 클릭 시
        $("input[name=cancle-btn]").click(function() {
            goBack();
        });
    }
/** point.html */
/** point_ok.html */
    if (location.href.includes('point_ok.html')) {
        var width = window.innerWidth;
        getPointResult(width);
    }
/** point_ok.html */
/** vbank.html */
    if (location.href.includes('vbank.html')) {
        var request = new Request();
        var merchant_uid = request.getParameter('merchant_uid');
        var msg = {
            actionType: "FINDONE",
            merchant_uid: merchant_uid
        }
        var callback = function(data) {
            if (data.resultCode == "0000") {
                var result = data.resultData;
                $('.vbank_name').html(result.vbank_name);
                $('.vbank_num').html(result.vbank_num);
                $('.vbank_holder').html(result.vbank_holder);
            } else {
                alert("서버 오류입니다.");
            }
        }
        doPost("GET_POINT", msg, callback);
    }
/** vbank.html */
    // 왼쪽섹션에서 충전/사용내역 버튼 클릭시
    $("input[name=getPoint]").click(function() {
        location.href = "/mypage.html";
    });
    // 왼쪽섹션에서 충전하기 버튼 클릭시
    $("input[name=setPoint]").click(function() {
        location.href = '/point.html';
    });
}
// 포인트 충전/사용 내역 조회 
function getPointList(startDate, endDate) {
    var msg = {
        actionType: "TOARRAY",
        userId: userId,
        startDate: startDate,
        endDate: endDate
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var result = data.resultData;
            var resultLen = result.length;
            var useTotal = 0;
            var chargeTotal = 0;
            var feeTotal = 0;
            $(".pointLen").html(resultLen);
            $(".cont-con").remove();
            for (var i = (resultLen - 1); i >= 0; i--) {
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
                    if (result[i].receipt) {
                        html += "<a href='" + result[i].receipt + "' class='text-decoration-none' onClick='window.open(this.href,\"\",\"width=421,height=513\"); return false;' style='color: blue;'>영수증</a>";
                    }
                    html += "</td>";
                } else if (result[i].pay_method == "vbank") {
                    html += "<td>";
                    html += "<a href='/vbank.html?merchant_uid=" + result[i].merchant_uid + "' class='text-decoration-none' onClick='window.open(this.href,\"\",\"width=421,height=513\"); return false;' style='color: blue;'>가상계좌</a>";
                    html += "</td>";
                } else {
                    html += "<td>-</td>";
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
        } else {
            alert("서버 오류입니다.");
        }
    }
    doPost("GET_POINT", msg, callback);
}
// 결제결과 가져오기
function getPointResult(width) {
    var request = new Request();
    var merchant_uid = request.getParameter('merchant_uid');
    var is = request.getParameter('imp_success');
    // 모바일
    if (width <= 767) {
        var userId = request.getParameter('user_id');
        var msg = {
            userId: userId,
            merchant_uid: merchant_uid
        }
        var callback = function(data) {
            if(data.resultCode == "0000") {
                var msg2 = {
                    actionType: "FINDONE",
                    merchant_uid: merchant_uid
                }
                var callback2 = function(data2) {
                    if (data2.resultCode == "0000") {
                        var result = data2.resultData;
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
                                var ddate = String(result.vbank_date);
                                ddate = ddate + "000";
                                $('.payInfo').html(result.vbank_name+" "+result.vbank_num+"<br>"+"예금주: 농업회사법인 신호(주) <br>유효기간: "+ new Date(Number(ddate)).fullDate());
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
                    } else {
                        alert("서버 오류입니다.");
                    }
                }
                doPost("GET_POINT", msg2, callback2);
            }
        }
        doPost("GET_POINT_MOBILE", msg, callback);
    }
    //PC
    else {
        var msg = {
            actionType: "FINDONE",
            merchant_uid: merchant_uid
        }
        var callback = function(data) {
            if (data.resultCode == "0000") {
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
            } else {
                alert("서버 오류입니다.");
            }
        }
        doPost("GET_POINT", msg, callback);
    }
}
// 가상계좌 데드라인 
Date.prototype.deadlineDate = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();
    var hh = this.getHours();
    var m = this.getMinutes();

    return [this.getFullYear(),
        "-",
        (mm > 9 ? '' : '0') + mm,
        ((dd + 3) > 9 ? '' : '0') + (dd + 3),
        (hh > 9 ? '' : '0') + hh,
        (m > 9 ? '' : '0') + m].join('');
}