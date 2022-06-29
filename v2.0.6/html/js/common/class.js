/**
 * parameter
 */
var serverUrl = "https://www.sinho2016.com:444";
var webUrl = "https://www.sinho2016.com";
// var serverUrl = "http://127.0.0.1:1880";
// var webUrl = "http://127.0.0.1/main.html";
var userId = "";
var userData;
var authType = "";
var userType = "";
var productData = "";
var IMP;
var pricePercent = {
    company: 0, 
    consumer: 0, 
    advanced: 0, 
    highend: 0
};
/**
 * class
 */
class User {
    constructor (authType, userType, companyName, companyNumber, companyAddress, ceoName, userId, userPw, userPhone, userEmail, userTel, userFax, point, pwToken, pwTime, flag) {
        /**
         * 회사정보
         */
        this.authType = authType;
        this.companyName = companyName;
        this.companyNumber = companyNumber;
        this.companyAddress = companyAddress;
        this.ceoName = ceoName;
        /**
         * 사용자정보 
         */
        this.userType = userType;
        this.userId = userId;
        this.userPw = userPw;
        this.userPhone = userPhone;
        this.userEmail = userEmail;
        this.userTel = userTel;
        this.userFax = userFax;
        this.point = point;
        /**
         * 보안정보
         */
        this.pwToken = pwToken;
        this.pwTime = pwTime;
        this.flag = flag;
    }
}