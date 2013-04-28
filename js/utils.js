function log(logtext){
	try{
		if(typeof(console.log) != undefined){
			console.log(logtext);
		}		
	}catch(e) {
		return false;
	}
}

function setStorage(_name,_value){
    if(supports_local_storage()){
        localStorage[_name] = _value;
    }else{
        setCookie(_name, _value);
    }
}

function getStorage(_name){
    if(supports_local_storage()){
        return localStorage[_name];
    }else{
        return getCookie(_name);
    }
}


function supports_local_storage() {
    try {
        return ('localStorage' in window && window['localStorage'] !== null);
    } catch(e) {
        return false;
    }
}

function setCookie(c_name, value, exdays) {

    if(exdays == null || exdays == undefined){
        exdays = 365*100;
    }

    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for ( i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

