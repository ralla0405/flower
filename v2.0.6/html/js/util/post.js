/**
 * HTTP POST json
 * @param {업무코드} code 
 * @param {데이터} inputData 
 * @param {콜백함수} result
 */
function doPost(code, inputData, result) {
    var request = $.ajax({
        url: serverUrl + "/appapi/" + code + "/appRequest.do",
        type: "POST",
        dataType: "json",
        data: inputData
    })

    request.done(result);
    request.fail(function(xhr, textStatus) {
        alert("POST 통신실패 " + textStatus);
    });
}