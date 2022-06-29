var productChk = false;
$(function() {
    if (getUserId() != null) {
        startMain();
        getNoticeNumber();
    }
})
window.onload = function() {
/** product_list */
    if (location.href.includes("product_list.html")) {
        getProductAll();
        // 고급, 특고급, 소비자가, 기업가 적용 이벤트
        $("input[name=priceAdapt]").click(function() {
            if (confirm("비율을 적용하시겠습니까??")) {
                var msg = {
                    actionType: "price",
                    company: $("input[name=companyPercent]").val(),
                    consumer: $("input[name=consumerPercent]").val(),
                    advanced: $("input[name=advanced]").val(),
                    highend: $("input[name=highend]").val()
                }
                var callback = function(data) {
                    if (data.resultCode == "0000") {
                        location.reload();
                    } else {
                        alert("서버 오류입니다.");
                    }
                }
                doPost("SET_PRICE", msg, callback);
            }
        });
    }
/** product_list */
/** product_update */
    if (location.href.includes('product_update')) {
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
        switch (productType) {
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
/** product_update */
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
    // 상세보기 닫기 버튼
    $('.close-btn').click(function() {
        $('.view-img-pop-mask').hide();
        $('.view-img-pop').hide();
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
}
/** list */
// 상품 목록 가져오기 
function getProductAll() {
    $('.cont-con').remove();
    var msg = {
        actionType: "ALL"
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            var result = data.resultData;
            productData = result;
            var resultLen = result.length;
            var limitLen = 10;
            var resultPaging = parseInt(resultLen / 11) + 1;
            $('.productLen').html(resultLen);
            for (var i = 0; i < resultLen; i ++) {
                if (i < limitLen) {
                    var html = "<tr class='cont-con' style='border-bottom: 1px solid #B5BABD;'>";
                    html += "<td><label><input type='checkbox' name='pList' value='"+result[i].productId+"'><span></span></label></td>";
                    html += "<td><div class='productId' style='font-weight:bold;'>"+result[i].productId+"</div>";
                    if(result[i].viewState == "Y") {
                        html += "<div class='view on'>[진열상태]</div>";
                        html += "<div class='viewBtn off btn'>진열 안하기</div></td>";
                    }else if(result[i].viewState == "N") {
                        html += "<div class='view off'>[미진열상태]</div>";
                        html += "<div class='viewBtn on btn'>진열 하기</div></td>";
                    }
                    html += "<td style='text-align: left'><div style='width:50px; display:inline-block; vertical-align: top;'><img src='"+result[i].productSrc+"' class='productSrc' style='width:50px; height:50px;' onmouseover='$(\"#HideShow"+i+"\").show();' onmouseout='$(\"#HideShow"+i+"\").hide();'><div id='HideShow"+i+"' style='position: absolute; z-index: 1; display: none;'><img src='"+result[i].productSrc+"' style='width:350px; height:466px'></div></div>";
                    html += "<div style='width:100px; padding-left:10px; display:inline-block;'><div><strong class='productName'>"+result[i].productName+"</strong></div>";
                    if(result[i].productType == "oriental") {
                        html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>동양란</div>";
                    }else if(result[i].productType == "house") {
                        html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>관엽</div>";
                    }else if(result[i].productType == "western") {
                        html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>서양란</div>";
                    }else if(result[i].productType == "etc") {
                        html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>기타</div>";
                    }
                    html += "<div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productCate'>"+result[i].productCate+"</div></div></div>";
                    html += "<input type='hidden' value='"+result[i].productInfo+"' class='productInfo'></td>"
                    html += "<td><span class='productPriceCon'>"+setCommaWon(Number(result[i].productPrice)*(100 + Number(pricePercent.consumer))/100).split('원')[0]+"</span><span style='color:#CC9900'>원</td>";
                    html += "<td><span class='productPriceCom'>"+setCommaWon(Number(result[i].productPrice)*(100 + Number(pricePercent.company))/100).split('원')[0]+"</span><span style='color:#CC9900'>원</td>";
                    html += "<td><span class='productPrice'>"+setCommaWon(result[i].productPrice).split('원')[0]+"</span><span style='color:#CC9900'>원</td>";
                    html += "<td><span class='shippingPriceExtra'>"+setCommaWon(result[i].shippingPriceExtra).split('원')[0]+" 원</span></td>";
                    if (result[i].shipState == "true") {
                        html += "<td><div class='isShip on'>가능</div></td>";
                    } else if (result[i].shipState == "false") {
                        html += "<td><div class='isShip off'>불가</div></td>";
                    } else {
                        html += "<td>-</td>";
                    }
                    html += "<td><span class='viewCnt'>"+result[i].viewCnt+"</span> 회<br>";
                    html += "<span class='saleCnt'>"+result[i].saleCnt+"</span> 개</td>";
                    html += "<td><input type='button' name='updateProduct' class='btn' value='수정' onclick='goUpdateProduct(this)'><input type='button' class='btn' name='deleteProduct' value='삭제' onclick='deleteProduct(this)'></td>";
                    html += "</tr>";
                    $('.right-section table tbody').append(html);
                }
            }
            // paging 추가
            $(".paging").empty();
            var html = "<a href='javascript:;' onclick='page_go(1);' class='page-select'> &lt; </a>";
            for (var j = 0; j < resultPaging; j++) {
                if (j == 0) {
                    html += "<a href='javascript:;' onclick='page_go("+(j+1)+");' class='page-selecet page-selected'>"+(j+1)+"</a>";
                } else {
                    html += "<a href='javascript:;' onclick='page_go("+(j+1)+");' class='page-selecet'>"+(j+1)+"</a>";
                }
            }
            html += "<a href='javascript:;' onclick='page_go("+(resultPaging)+");' class='page-selecet'> &gt; </a>";
            $(".paging").append(html);
            // 진열상태 변경
            $('.viewBtn').click(function() {
                var state = $(this).hasClass('on');
                var obj = $(this);
                if (state) {
                    var viewMsg = {
                        productId: $(this).parent().children(".productId").html(),
                        viewState: 'Y'
                    }
                    var viewCallback = function(viewData) {
                        if (viewData.resultCode == "0000") {
                            obj.removeClass('on');
                            obj.addClass('off');
                            obj.html('진열 안하기');
                            obj.parent().children(".view").removeClass('off');
                            obj.parent().children(".view").addClass('on');
                            obj.parent().children(".view").html("[진열상태]");
                        } else {
                            alert("서버 오류입니다.");
                        }
                    }
                    doPost("SET_PRODUCT_VIEWSTATE", viewMsg, viewCallback);
                } else { 
                    var viewMsg = {
                        productId: $(this).parent().children(".productId").html(),
                        viewState: 'N'
                    }
                    var viewCallback = function(viewData) {
                        if (viewData.resultCode == "0000") {
                            obj.removeClass('off');
                            obj.addClass('on');
                            obj.html('진열 하기');
                            obj.parent().children(".view").removeClass('on');
                            obj.parent().children(".view").addClass('off');
                            obj.parent().children(".view").html("[미진열상태]");
                        } else {
                            alert("서버 오류입니다.");
                        }
                    }
                    doPost("SET_PRODUCT_VIEWSTATE", viewMsg, viewCallback);
                }
            });
            $("input[name=companyPercent]").val(pricePercent.company);
            $("input[name=consumerPercent]").val(pricePercent.consumer);
            $("input[name=advanced]").val(pricePercent.advanced);
            $("input[name=highend]").val(pricePercent.highend);
        } else {
            alert("서버 오류입니다.");
        }
    }
    doPost("GET_PRODUCT", msg, callback);
}
// 상품 페이지 넘어가기
function page_go(page_cnt) {
    for (var j = 0; j < $(".page-selecet").length; j++) {
        if ($(".page-selecet").eq(j).html() == page_cnt) {
            $(".page-selecet").eq(j).addClass('page-selected');
        } else {
            $(".page-selecet").eq(j).addClass('page-select');
            $(".page-selecet").eq(j).removeClass("page-selected");
        }
    }
    var resultData = productData;
    var resultLen = resultData.length;
    var limitLen = page_cnt * 10;
    $('.cont-con').remove();
    for (var i = 0; i < resultLen; i++) {
        if (limitLen - 10 <= i && i < limitLen) {
            var html = "<tr class='cont-con' style='border-bottom: 1px solid #B5BABD;'>";
            html += "<td><label><input type='checkbox' name='pList' value='"+resultData[i].productId+"'><span></span></label></td>";
            html += "<td><div class='productId' style='font-weight:bold;'>"+resultData[i].productId+"</div>";
            if (resultData[i].viewState == "Y") {
                html += "<div class='view on'>[진열상태]</div>";
                html += "<div class='viewBtn off btn'>진열 안하기</div></td>";
            } else if (resultData[i].viewState == "N") {
                html += "<div class='view off'>[미진열상태]</div>";
                html += "<div class='viewBtn on btn'>진열 하기</div></td>";
            }
            html += "<td style='text-align: left'><div style='width:50px; display:inline-block; vertical-align: top;'><img src='"+resultData[i].productSrc+"'  class='productSrc' style='width:50px; height:50px;' onmouseover='$(\"#HideShow"+i+"\").show();' onmouseout='$(\"#HideShow"+i+"\").hide();'><div id='HideShow"+i+"' style='position: absolute; z-index: 1; display: none;'><img src='"+resultData[i].productSrc+"' style='width:350px; height:466px'></div></div>";
            html += "<div style='width:100px; padding-left:10px; display:inline-block;'><div><strong class='productName'>"+resultData[i].productName+"</strong></div>";
            if (resultData[i].productType == "oriental") {
                html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>동양란</div>";
            } else if (resultData[i].productType == "house") {
                html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>관엽</div>";
            } else if (resultData[i].productType == "western") {
                html += "<div style='magin-top:5px;'><div style='font-size:11px; color:#FF9900; margin-top:3px;' class='productType'>서양란</div>";
            } else if (resultData[i].productType == "etc") {
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
            html += "<td><input type='button' name='updateProduct' class='btn' value='수정' onclick='goUpdateProduct(this)'><input type='button' class='btn' name='deleteProduct' value='삭제' onclick='deleteProduct(this)'></td>";
            html += "</tr>";
            $('.right-section table tbody').append(html);
        }
    }
    // 진열상태 변경
    $('.viewBtn').click(function() {
        var state = $(this).hasClass('on');
        var obj = $(this);
        if (state) {
            var viewMsg = {
                productId: $(this).parent().children(".productId").html(),
                viewState: 'Y'
            }
            var viewCallback = function(viewData) {
                if (viewData.resultCode == "0000") {
                    obj.removeClass('on');
                    obj.addClass('off');
                    obj.html('진열 안하기');
                    obj.parent().children(".view").removeClass('off');
                    obj.parent().children(".view").addClass('on');
                    obj.parent().children(".view").html("[진열상태]");
                } else {
                    alert("서버 오류입니다.");
                }
            }
            doPost("SET_PRODUCT_VIEWSTATE", viewMsg, viewCallback);
        } else { 
            var viewMsg = {
                productId: $(this).parent().children(".productId").html(),
                viewState: 'N'
            }
            var viewCallback = function(viewData) {
                if (viewData.resultCode == "0000") {
                    obj.removeClass('off');
                    obj.addClass('on');
                    obj.html('진열 하기');
                    obj.parent().children(".view").removeClass('on');
                    obj.parent().children(".view").addClass('off');
                    obj.parent().children(".view").html("[미진열상태]");
                } else {
                    alert("서버 오류입니다.");
                }
            }
            doPost("SET_PRODUCT_VIEWSTATE", viewMsg, viewCallback);
        }
    });
}
// 숫자만 입력
function checkNumber(obj) {
    obj.value = obj.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (obj.value > 100) {
        obj.value = 100;
    } else if (obj.value < 0) {
        obj.value = 0;
    }
}
// 삭제하기 product_list
function deleteProduct(obj) {
    if (confirm("해당 상품을 삭제하시겠습니까?")) {
        $(".spinner-wrap").show();
        var productId = $(obj).parent("td").parent("tr").children("td").children(".productId").html();
        var ajsonArray = new Array();
        var ajson = new Object();
        ajson.productId = productId;
        ajsonArray.push(ajson);
        var msg = {
            actionType: "DELETE",
            data: ajsonArray
        }
        var callback = function(data) {
            if (data.resultCode == "0000") {
                alert("상품이 삭제되었습니다.");
                location.replace('/product_list.html');
            } else {
                alert("서버 오류입니다.");
            }
        }
        doPost("SET_PRODUCT", msg, callback);
    }else {
        return;
    }
}
// 상품 전체 선택
function checkPListAll() {
    if (!productChk) {
        $("input[name='pList']").prop('checked', true);
        $("input:checkbox[name='pListAll']").prop('checked', true);
        productChk = true;
    } else {
        $("input[name='pList']").prop('checked', false);  
        $("input:checkbox[name='pListAll']").prop('checked', false); 
        productChk = false; 
    }
}
// 상품 선택 삭제하기
function deletePList() {
    var html = $("input[name='pList']:checked");
    var ajsonArray = new Array();
    for (i = 0; i < html.length; i++) {
        var ajson = new Object();
        ajson.productId = html.eq(i).val();
        ajsonArray.push(ajson);
    }
    if (ajsonArray.length == 0) {
        alert("삭제할 상품을 선택해주세요.");
    } else {
        if (confirm("선택한 상품을 삭제하시겠습니까?")) {
            $(".spinner-wrap").show();
            var msg = {
                actionType: "DELETE",
                data: ajsonArray
            }
            var callback = function(data) {
                if (data.resultCode == "0000") {
                    alert("상품이 삭제되었습니다.");
                    location.replace('/product_list.html');
                } else {
                    alert("서버 오류입니다.");
                }
            }
            doPost("SET_PRODUCT", msg, callback);
        }
    }
}
// 상품 수정페이지 가기
function goUpdateProduct(obj) {
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
/** list */
/** update */
// 상품 카테고리 중 분류 가져오기
function getCate(obj) {
    $("select[name='productCate']").empty();
    var categoryId = $(obj).val();
    var msg = {
        categoryId: categoryId
    }
    var callback = function(data) {
        var resultData = data.resultData;
        var resultLen = resultData.length;
        var html = "";
        for (var i = 0; i < resultLen; i++) {
            html += "<option value='"+resultData[i].categoryData+"'>"+resultData[i].categoryData+"</option>";
        }
        $("select[name='productCate']").append(html);
    }
    doPost("GET_CATEGORY", msg, callback);
}
// 상품 수정하기
function setUpdateProduct() {
    if (confirm("상품을 수정하시겠습니까?")) {
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
        var msg = {
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
        var callback = function(data) {
            if (data.resultCode == "0000") {
                alert("상품이 수정되었습니다.");
                location.replace('/product_list.html');
            } else {
                alert("서버 오류입니다.");
            }
        }
        doPost("SET_PRODUCT", msg, callback);
    }
}
/** update */
/** insert */
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
    if (productType == "") {
        alert("대 분류를 선택해주세요.");
        $("selecet[name='productName']").focus();
        return false;
    } else if (productCate == "") {
        alert("중 분류를 선택해주세요.");
        $("selecet[name='productName']").focus();
        return false;
    } else if (productName == "") {
        alert("상품명을 입력해주세요.");
        $("selecet[name='productName']").focus();
        return false;
    } else if (productInfo == "") {
        alert("간략한설명을 입력해주세요.");
        $("input[name='productInfo']").focus();
        return false;
    } else if (productSrc == "") {
        alert("대표이미지를 설정해주세요.");
        return false;
    } else if (productPrice == "") {
        alert("소비자 가격을 입력해주세요.");
        $("input[name='productPrice']").focus();
        return false;
    } else if (productPriceCom == "") {
        alert("기업가 가격을 입력해주세요.");
        $("input[name='productPriceCom']").focus();
        return false;
    } else if (productPriceFl == "") {
        alert("도매직발주가 가격을 입력해주세요.");
        $("input[name='productPriceFl']").focus();
        return false;
    } else if (shippingPriceExtra == "") {
        alert("추가시 발생하는 배송비를 입력해주세요.");
        $("input[name='shippingPriceExtra']").focus();
        return false;
    }
    var msg = {
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
    var callback = function(data) {
        if (data.resultCode == "0000") {
            alert("상품이 등록되었습니다.");
            location.replace('/product_list.html');
        } else {
            alert("서버 오류입니다.");
        }
    }
    doPost("SET_PRODUCT", msg, callback);
}
/** insert */
// 이미지 업로드
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
                $('.preview-image').addClass('on');
                var html="";
                html += "<div class='upload-thumb-wrap'><img src='"+e.target.result+"' class='upload-thumb'></div>"
                $('.upload-display').empty();
                $('.upload-display').append(html);
            }

            reader.readAsDataURL(obj.files[0]);
        }
    } else {
        alert('브라우저 버전을 업그레이드 해주세요.');
    }
}