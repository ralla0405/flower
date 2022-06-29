$(function() {
    var request = new Request();
    var startDate = request.getParameter('startDate');
    var endDate = request.getParameter('endDate');

    findAll(startDate, endDate, 'off');
    $('#label_onoff').click(function() {
        var status = $('#fail_list').attr('class');
        if (status == 'off') {
            $('#fail_list').removeClass('off');
            $('#fail_list').addClass('on');
            findAll(startDate, endDate, 'on');
        } else if (status == 'on') {
            $('#fail_list').removeClass('on');
            $('#fail_list').addClass('off');
            findAll(startDate, endDate, 'off');
        }
    });
})
//배달목록 가져오기
function findAll(start, end, type) {
    var msg = {
        startDate: start,
        endDate: end
    }
    var callback = function(data) {
        if (data.resultCode == "0000") {
            $('#fail_list').empty();
            var resultData = data.resultData;
            var mapContainer = document.getElementById('map'),
                mapOption = {
                    center: new kakao.maps.LatLng(37.51218422061408, 126.97896863010982),
                    level: 9 //지도의 레벨 (확대, 축소 정도)
                };
            const map = new kakao.maps.Map(mapContainer, mapOption); //지도 생성

            const geocoder = new kakao.maps.services.Geocoder();

            const createFailList = (ship) => {
                $('#fail_list').append("<span>" + ship.no + "번</span><br>");
            }
            const createOverlay = (result, ship) => {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords,
                    title: result[0].address_name
                });
                if (type == 'off') {
                    marker.setMap(map);
                } else if(type == 'on') {
                    const infowindow = new kakao.maps.InfoWindow({
                        content: '<div style="padding-left:5px;font-size:11px;"><span>' + ship.no + '번 ' + ship.shipDate + '</span><span>' + ship.shipProduct + '</span></div>'
                    });
                    infowindow.open(map, marker);
                }
            }

            const addressSearch = address => {
                return new Promise((resolve, reject) => {
                    geocoder.addressSearch(address, function(result, status) {
                        if (status === kakao.maps.services.Status.OK) {
                            resolve(result);
                        } else {
                            resolve("fail");
                        }
                    })
                })
            }

            (async () => {
                try {
                    for (var i = 0; i < resultData.length; i++) {
                        if (resultData[i].delCheck == "off") {
                            const result = await addressSearch(resultData[i].shipAddress);
                            const ship = {
                                no: resultData[i].no,
                                shipDate: resultData[i].shipDate,
                                shipProduct: resultData[i].shipProduct
                            }
                            if (result == "fail") {
                                createFailList(ship);
                            } else {
                                createOverlay(result, ship);                            
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            })();            
        }   
    }
    doPost("GET_SHIP", msg, callback);
}