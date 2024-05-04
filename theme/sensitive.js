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
    $.get(window.siteurl + "/static/sensitive/sensitive.json", function (data) {
        let key = undefined;
        const reg = new RegExp('(^|&)key=([^&]*)(&|$)', 'i');
        const r = window.location.search.substring(1).match(reg);
        if (r != null) {
            key = r[2];
        } else {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.indexOf('key=') === 0) {
                    key = decodeURIComponent(cookie.substring('key='.length));
                }
            }
            if (key === undefined) key = "ABCDEFGHIJKLMNOP"; //默认key
        }
        const enckey = CryptoJS.enc.Utf8.parse(key);
        const decresult = aesdecrypt(data.probe, enckey);
        if (decresult.verified && decresult.content === 'probe') {
            document.cookie = "key=" + key;
            var sensitive_data = JSON.parse(aesdecrypt(data.data, enckey).content);
            $("#top_github").attr("href", sensitive_data.github);
            $("#top_email").attr("href", "mailto:" + sensitive_data.email);
            new QRCode($("#qrcode")[0], "https://u.wechat.com/" + sensitive_data["wechat-qrcode"]);
            $("#social-ul").show();
            $("#a_email").attr("href", "mailto:" + sensitive_data.email).text(sensitive_data.email);
            $("#s_mobile").text(sensitive_data.mobile);
            $("[span-data=s_wechat]").text(sensitive_data.wechat);
            $("#a_website").attr("href", sensitive_data.website).text(sensitive_data.website);
            $("#sensitive-area").show();
        }
    })
});