// 解密函数
function aesdecrypt(encryptedContent, enckey) {
    try {
        return {
            'verified': true,
            'content': CryptoJS.AES.decrypt(encryptedContent, enckey, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8)
        };
    } catch (e) {
        return {
            'verified': false,
            'exception': e
        }
    }
}

$(function () {
    $.get("./sensitive/sensitive.json", function (data) {
        var key = undefined;
        const reg = new RegExp('(^|&)key=([^&]*)(&|$)', 'i');
        const r = window.location.search.substring(1).match(reg);
        if (r != null) {
            key = r[2];
        }
        else return;
        const enckey = CryptoJS.enc.Utf8.parse(key);
        const decresult = aesdecrypt(data.probe, enckey);
        if (decresult.verified && decresult.content === 'wangqixuan') {
            var sensitive_data = JSON.parse(aesdecrypt(data.data, enckey).content);
            $("#a_email").attr("href", "mailto:" + sensitive_data.email).text(sensitive_data.email);
            $("#s_mobile").text(sensitive_data.mobile);
            $("#s_wechat").text(sensitive_data.wechat);
            $("#a_website").attr("href", sensitive_data.website).text(sensitive_data.website);
            $("#sensitive-area").show();
        }
    })
});