var shipData = [];
var doubleSubmitFlag = false;

$(function() {
    if (getUserId() != null) {
        startMain();
        getNoticeNumber();
    }
})
window.onload = function(){
/** ship.html */
    if (location.href.includes("ship.html")) {
        getShip(new Date().yyyymmdd(),new Date().yyyymmdd());
        // 배달검색
        $('.date-btn-span').click(function() {
            getShip($("input[name='date-start']").val(),$("input[name='date-end']").val());
        });
        // 배달목록 이벤트
        $('.shipList').click(function() {
            getShip($("input[name='date-start']").val(),$("input[name='date-end']").val());
        });
        // 등록하기 이벤트
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
            html += "<td class='shipOrderCompanyTel'>자동</td>";
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
            // 발주업체 전화 처리
            $("input[name=shipOrderCompany]").bind("blur", function(event) {
                var msg = {
                    actionType: "FINDONE",
                    companyName: $(event.target).val()
                }
                var callback = function(data) {
                    if (data.resultCode == "0000") {
                        var result = data.resultData;
                        if (result) {
                            if (result.companyName == $(event.target).val()) {
                                $(event.target).parent("td").parent("tr").children(".shipOrderCompanyTel").html(result.companyTel);
                            } else {
                                $(event.target).parent("td").parent("tr").children(".shipOrderCompanyTel").html("-");
                            }
                        } else {
                            $(event.target).parent("td").parent("tr").children(".shipOrderCompanyTel").html("-");
                        }
                    } else {
                        alert("서버 오류입니다.");
                    }
                }
                doPost("GET_COMPANY", msg, callback);
            });
            // 등록버튼 클릭시
            $("input[name='insert']").click(function() {
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
                    ajson.shipOrderCompanyTel = html.eq(i).children(".shipOrderCompanyTel").html();
                    ajson.shipCompany = html.eq(i).children().children("select[name='shipCompany']").val();
                    ajson.shipNumber = html.eq(i).children().children("input[name='shipNumber']").val();
                    ajson.shipPrice = html.eq(i).children().children("input[name='shipPrice']").val();
                    ajsonArray.push(ajson);
                }
                var msg = {
                    actionType: "INSERT",
                    data: ajsonArray
                }
                var callback = function(data) {
                    if (data.resultCode == "0000") {
                        alert("등록되었습니다.");
                        $('.bottom').remove();
                        location.reload();
                    } else {
                        alert("서버 오류입니다.");
                    }
                } 
                doPost("SET_SHIP", msg, callback);
            });
        });
        // 지도열기
        $("input[name='openMap']").click(function() {
            var url = "/map.html";
            url += "?startDate=" + $("input[name=date-start]").val();
            url += "&endDate=" + $("input[name=date-end]").val();
            window.open(url,'_blank','width=1100,height=1000');
        });
    }
/** ship.html */
}
// 배달목록 가져오기
function getShip(startDate, endDate) {
    $("input[name=insert]").remove();
    $('.date-start input').val(startDate);
    $('.date-end input').val(endDate);
    $('.shipInsert').removeClass('on');
    $('.shipList').addClass('on');
    $('.tbl-cont').remove();
    var msg = {
        startDate: startDate,
        endDate: endDate
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var result = data.resultData;
            var resultLen = result.length;
            shipData = result;
            $('.shipList').html("배달목록(" + resultLen + ")");
            for (var i = 0; i < resultLen; i++) {
                var html = "";
                if (result[i].delCheck == "on") {
                    switch (result[i].shipCompany) {
                        case "헌인":
                            html += "<tr class='tbl-cont " + result[i].delCheck + "' style='background: #FFCCCC'>";
                        break;
                        case "사이버":
                            html += "<tr class='tbl-cont " + result[i].delCheck + "' style='background: #FFF2CC'>";
                        break;
                        case "우한결":
                            html += "<tr class='tbl-cont " + result[i].delCheck + "' style='background: #FFFFCC'>";
                        break;
                        case "개인기사":
                            html += "<tr class='tbl-cont " + result[i].delCheck + "' style='background: #CCCCFF'>";
                        break;
                        case "방민우":
                            html += "<tr class='tbl-cont " + result[i].delCheck + "' style='background: #CCEFDC'>";
                        break;
                        case "":
                            html += "<tr class='tbl-cont " + result[i].delCheck + "'>";
                    }
                } else if (result[i].delCheck == "done") {
                    html += "<tr class='tbl-cont " + result[i].delCheck + "' style='background: #808080'>";
                } else {
                    html += "<tr class='tbl-cont " + result[i].delCheck + "'>";
                }
                html += "<td class='no'>" + result[i].no + "</td>";
                html += "<td class='date'>" + result[i].date + "</td>";
                html += "<td class='shipDate'>" + result[i].shipDate+"</td>";
                html += "<td class='shipAddress'>" + result[i].shipAddress + "</td>";
                html += "<td class='shipProduct'>" + result[i].shipProduct + "</td>";
                html += "<td class='shipMemo'>" + result[i].shipMemo + "</td>";
                html += "<td class='shipOrderTo'>" + result[i].shipOrderTo + "</td>";
                html += "<td class='shipOrderCompany'>" + result[i].shipOrderCompany + "</td>";
                html += "<td class='shipOrderCompanyTel'>" + result[i].shipOrderCompanyTel + "</td>";
                html += "<td class='shipCompany'>" + result[i].shipCompany + "</td>";
                html += "<td class='shipNumber'>" + result[i].shipNumber + "</td>";
                html += "<td class='shipPrice'>" + result[i].shipPrice + "</td>";
                if (result[i].delCheck == "on") {
                    html += "<td class='shipProccess'><input type='button' value='수정' name='update' class='btn'><input type='button' value='인수체크' name='delCheck' class='btn'></td>";
                } else if (result[i].delCheck == "off") {
                    html += "<td class='shipProccess'><input type='button' value='수정' name='update' class='btn'><input type='button' value='배 차' name='delCheck' class='btn'></td>";
                } else if (result[i].delCheck == "done") {
                    html += "<td class='shipProccess'><input type='button' value='수정' name='update' class='btn'><input type='button' value='미배차' name='delCheck' class='btn'></td>";
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
                $(this).parent("td").parent("tr").children('.date').html("<input type='date' value='" + date + "' name='date' class='form-control'>");
                $(this).parent("td").parent("tr").children('.shipReceipt').html("<input type='button' value='인쇄' name='recipt' class='btn' disabled>");
                $(this).parent("td").parent("tr").children(".shipDate").html("<input type='text' name='shipDate' class='form-control' value='" + shipDate + "'>");
                $(this).parent("td").parent("tr").children(".shipAddress").html("<input type='text' name='shipAddress' class='form-control' value='" + shipAddress + "'>");
                $(this).parent("td").parent("tr").children(".shipProduct").html("<input type='text' name='shipProduct' class='form-control' value='" + shipProduct + "'>");
                $(this).parent("td").parent("tr").children(".shipMemo").html("<input type='text' name='shipMemo' class='form-control' value='" + shipMemo + "'>");
                $(this).parent("td").parent("tr").children(".shipOrderTo").html("<input type='text' name='shipOrderTo' class='form-control' value='" + shipOrderTo+"'>");
                $(this).parent("td").parent("tr").children(".shipOrderCompany").html("<input type='text' name='shipOrderCompany' class='form-control' value='" + shipOrderCompany + "'>");
                $(this).parent("td").parent("tr").children(".shipNumber").html("<input type='text' name='shipNumber' class='form-control' value='" + shipNumber + "'>");
                $(this).parent("td").parent("tr").children(".shipOrderCompanyTel").html(shipOrderCompanyTel);
                var html = "";
                switch (shipCompany) {
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
                $(this).parent("td").parent("tr").children(".shipPrice").html("<input type='text' name='shipPrice' class='form-control' value='" + shipPrice + "'>");
                $(this).parent("td").parent("tr").children('.shipProccess').html("<input type='button' value='확인' name='confirm' class='btn'><input type='button' value='삭제' name='delete' class='btn'>");
                // 배송지 바뀔때
                $("select[name='shipCompany']").change(function() {
                    var address = $(this).parent("td").parent("tr").children("td").children("input[name='shipAddress']").val();
                    var price = $(this).parent("td").parent("tr").children("td").children("input[name='shipPrice']");
                    var addressMsg= {
                        shipCompanyName: $(this).val()
                    }
                    var addressCallback = function(addressData) {
                        if (addressData.resultCode == "0000") {
                            var result = addressData.resultData;
                            var resultLen = result.length;
                            var getPrice = 0;
                            for (var i = 0; i < resultLen; i++) {
                                if (address.includes(result[i].areaName)) {
                                    getPrice = result[i].price;
                                }
                            }
                            price.val(getPrice);
                        } else {
                            alert("서버 오류입니다.");
                        }
                    }
                    doPost("GET_SHIP_PRICE", addressMsg, addressCallback);
                });
                // 발주업체 전화 처리
                $("input[name=shipOrderCompany]").bind("blur", function(event) {
                    var msg = {
                        actionType: "FINDONE",
                        companyName: $(event.target).val()
                    }
                    var callback = function(data) {
                        if (data.resultCode == "0000") {
                            var result = data.resultData;
                            if (result) {
                                if (result.companyName == $(event.target).val()) {
                                    $(event.target).parent("td").parent("tr").children(".shipOrderCompanyTel").html(result.companyTel);
                                } else {
                                    $(event.target).parent("td").parent("tr").children(".shipOrderCompanyTel").html("-");
                                }
                            } else {
                                $(event.target).parent("td").parent("tr").children(".shipOrderCompanyTel").html("-");
                            }
                        } else {
                            alert("서버 오류입니다.");
                        }
                    }
                    doPost("GET_COMPANY", msg, callback);
                });
                // 수정 확인 버튼
                $("input[name='confirm']").unbind("click").bind("click", function() {
                    // if (doubleSubmitCheck()) return;
                    $(".spinner-wrap").show();
                    var html = $('.tbl-cont.update');
                    var ajsonArray = new Array();
                    for (i = 0; i < html.length; i++) {
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
                    var updateMsg = {
                        actionType: "UPDATE",
                        data: ajsonArray
                    }
                    var updateCallback = function(updateData) {
                        $(".spinner-wrap").hide();
                        if (updateData.resultCode == "0000") {
                            alert("수정되었습니다.");
                            getShip(startDate, endDate);
                        } else {
                            alert("서버오류입니다.");
                            location.reload();
                        }
                    }
                    doPost("SET_SHIP", updateMsg, updateCallback);               
                    return false;
                });
                // 삭제하기
                $("input[name='delete']").click(function() {
                    if (confirm("정말 삭제하시겠습니까?")) {
                        var deleteMsg = {
                            actionType: "DELETE",
                            date: $(this).parent("td").parent("tr").children(".date").children("input[name='date']").val(),
                            no: Number($(this).parent("td").parent("tr").children(".no").html())
                        }
                        var deleteCallback = function(deleteData) {
                            if (deleteData.resultCode == "0000") {
                                location.reload();
                            } else {
                                alert("서버오류입니다.");
                            }
                        }
                        doPost("SET_SHIP", deleteMsg, deleteCallback);
                    }
                });
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
                if (delCheckVal == "off") { // 배차
                    $(this).parent("td").parent("tr").removeClass('off');
                    $(this).parent("td").parent("tr").addClass('on');
                    $(this).val("인수체크");
                    switch (company) {
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
                } else if (delCheckVal == "on") { // 미배차
                    $(this).parent("td").parent("tr").removeClass('on');
                    $(this).parent("td").parent("tr").addClass('done');
                    $(this).parent("td").parent("tr").css("background","#808080");
                    console.log("check");
                    $(this).val("미배차");
                } else if (delCheckVal == "done") { // 인수체크
                    $(this).parent("td").parent("tr").removeClass('done');
                    $(this).parent("td").parent("tr").addClass('off');
                    $(this).parent("td").parent("tr").css("background","#F7F7F7");
                    $(this).val("배 차");
                }
                var delMsg = {
                    date: $(this).parent("td").parent("tr").children(".date").html(),
                    no: Number($(this).parent("td").parent("tr").children(".no").html()),
                    delCheck: $(this).parent("td").parent("tr").attr('class').split("tbl-cont ")[1]
                }
                var delCallback = function(delData) {
                    if (delData.resultCode != "0000") {
                        alert("서버 오류입니다.");
                    }
                }
                doPost("SET_DEL", delMsg, delCallback);
            });
        } else {
            alert("서버 오류입니다.");
        }
    }
    doPost("GET_SHIP", msg, callback);
}
// 배달 등록하기 추가
function plusBoard(obj) {
    $(obj).parent("td").html("<input type='button' name='deletePlus' class='form-control' value='삭제' onclick='deleteBoard(this);' style='background: red; color: white;'>");
    var html = "<tr class='tbl-cont'>";
    html += "<td>자동</td>";
    html += "<td><input type='date' name='date' class='form-control' style='width: 133px' value='" + new Date().yyyymmdd() + "'></td>";
    html += "<td><input type='text' name='shipDate' class='form-control'></td>";
    html += "<td><input type='text' name='shipAddress' class='form-control' onblur='blurShipAddress()'></td>";
    html += "<td><input type='text' name='shipProduct' class='form-control'></td>";
    html += "<td><input type='text' name='shipMemo' class='form-control'></td>";
    html += "<td><input type='text' name='shipOrderTo' class='form-control'></td>";
    html += "<td><input type='text' name='shipOrderCompany' class='form-control'></td>";
    html += "<td class='shipOrderCompanyTel'>자동</td>";
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
    // 발주업체 전화 처리
    $("input[name=shipOrderCompany]").bind("blur", function(event) {
        var msg = {
            actionType: "FINDONE",
            companyName: $(event.target).val()
        }
        var callback = function(data) {
            if (data.resultCode == "0000") {
                var result = data.resultData;
                if (result) {
                    if (result.companyName == $(event.target).val()) {
                        $(event.target).parent("td").parent("tr").children(".shipOrderCompanyTel").html(result.companyTel);
                    } else {
                        $(event.target).parent("td").parent("tr").children(".shipOrderCompanyTel").html("-");
                    }
                } else {
                    $(event.target).parent("td").parent("tr").children(".shipOrderCompanyTel").html("-");
                }
            } else {
                alert("서버 오류입니다.");
            }
        }
        doPost("GET_COMPANY", msg, callback);
    });
}
// 배달 등록하기 삭제
function deleteBoard(obj) {
    $(obj).parent("td").parent("tr").remove();
}
// 배달 등록하기 배송지 수정 이벤트
function blurShipAddress() {
    changeShipCompany($("select[name='shipCompany']"));
}
// 배달관리, 등록하기 배송지 수정 이벤트
function changeShipCompany(obj) {
    var address = $(obj).parent("td").parent("tr").children("td").children("input[name='shipAddress']").val();
    var price = $(obj).parent("td").parent("tr").children("td").children("input[name='shipPrice']");
    var msg = {
        shipCompanyName: $(obj).val()
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var resultData = data.resultData;
            var resultLen = resultData.length;
            var getPrice = 0;
            for (var i = 0; i < resultLen; i++) {
                if (address.includes(resultData[i].areaName)) {
                    getPrice = resultData[i].price;
                }
            }
            price.val(getPrice);
        }
    }
    doPost("GET_SHIP_PRICE", msg, callback);
}
// 배달관리 기간버튼 조회
function getShipCondi(condition) {
    var timeConstant = new Date().getTime();
    switch (condition) {
        case "beforeBefore":
            var time = new Date(timeConstant - 48 * 60 * 60 * 1000).yyyymmdd();
            getShip(time, time);
            break;
        case "before":
            var time = new Date(timeConstant - 24 * 60 * 60 * 1000).yyyymmdd();
            getShip(time, time);
            break;
        case "today":
            var time = new Date().yyyymmdd();
            getShip(time, time);
            break;
        case "after":
            var time = new Date(timeConstant + 24 * 60 * 60 * 1000).yyyymmdd();
            getShip(time, time);
            break;
        case "afterAfter":
            var time = new Date(timeConstant + 48 * 60 * 60 * 1000).yyyymmdd();
            getShip(time, time);
            break;
    }
}
// 중복실행 방지
 function doubleSubmitCheck(){
    if (doubleSubmitFlag) {
        return doubleSubmitFlag;
    } else {
        doubleSubmitFlag = true;
        return false;
    }
}
// 배달관리 엑셀 다운로드
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