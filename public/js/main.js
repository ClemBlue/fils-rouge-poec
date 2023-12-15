
function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return null;
}
function ouvrirBoiteModale () {
    

    var boiteModale = document.getElementById('maBoiteModale');
    if (getCookie('tata')!=""){
       
        var boiteModale = document.getElementById('maBoiteModale');
       boiteModale.style.display = 'none';
       
    }
    else {
        var boiteModale = document.getElementById('maBoiteModale');
        boiteModale.style.display = 'block';
        
    }
    
};


function fermerBoiteModale () {
    var boiteModale = document.getElementById('maBoiteModale');
    boiteModale.style.display = 'none';
    setCookie('tata','666', 24);
};
function setCookie(cookieName, cookieValue, expirationDays) {
    var d = new Date();
    d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}
function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    return decodedCookie;
}

