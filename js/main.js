/**
 * Created with JetBrains WebStorm.
 * User: bilelz
 * Date: 17/04/13
 * Time: 22:24
 * To change this template use File | Settings | File Templates.
 */

var isAutocompleted = false;

$(document).ready(function() {
    autocompleteInit();
                       log("init");
    /* search */
    $('form').submit(function() {
        if(!isAutocompleted){
            $("#search").blur();
            getLatlngFromCity($("#search").val());
            log("typed from input search");
        }

        isAutocompleted = false; /* reset boolean value */
        return false;
    });


	/* geo localisation */
	
	// script for print geo link when focus in searchbox
	// $("#search").focus(function() {
		// $("#geo").addClass("show");
	// });	
	// $("#search").blur(function() {
		// $("#geo").removeClass("show");
	// });

	$("#geo").click(function(e) {
		$("#geo").removeClass("show");
		$("#container").removeClass("blur");

		infoGeo("Géolocalisation en cours ...");
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
		} else {
			infoGeo("Votre navigateur ne prend pas en compte la géolocalisation HTML5");
		}

		function successCallback(position) {
			
			getCityFromCoord(position.coords.latitude, position.coords.longitude);
			
			infoGeo("Géolocalisation réussie :-)");
			infoHide();			
		};

		function errorCallback(error) {
			// if(getStorage("lastId") != undefined){
				// id = getStorage("lastId");
			// }else{		
				// id = "2988507" // Paris;
			// }			
			// getWeatherById(id);
			
			switch(error.code) {
				case error.PERMISSION_DENIED:
					infoGeo("L'utilisateur n'a pas autorisé l'accès à sa position");
					break;
				case error.POSITION_UNAVAILABLE:
					infoGeo("L'emplacement de l'utilisateur n'a pas pu être déterminé");
					break;
				case error.TIMEOUT:
					infoGeo("Le service n'a pas répondu à temps");
					break;
			}			
		};
		
		return false;
	});
	
	/* geo localisation */

    /* print on not  #cityClearSearch button */
    $("#search").keyup(function() {
        if ($.trim($(this).val()) != "") {
            $("#cityClearSearch").removeClass("hide");
        } else {
            $("#cityClearSearch").addClass("hide");
            $(this).val(""); // trim space
        }
    });

    $("#search").on("blur", function (){
        $("#search").keyup();
    });

    $("#search").on("focus", function (){
        $("#search").keyup();
    });

    /* end : print on not #cityClearSearch button */



    $("#multiCityList").on("click", "a", function (){
        $('#multiCityList').html("").hide();
        updateMap($.trim($(this).text()), $(this).attr("lat"), $(this).attr("lng"));
        return false;
    });

    $("#multiCityList").on("click",".removeCityList", function (){
        $('#multiCityList').html("").hide();
    });

    $("*[type=reset]").on("click",function (){
        $('#multiCityList').html("").hide();
    });
});
function autocompleteInit() {


    var map;
    var geocoder;
    var input = document.getElementById('search');
    var options = {
        types : ['(cities)']
    };

    var autocomplete = new google.maps.places.Autocomplete(input, options);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        try {

            var placeLat = getLatFromStr(autocomplete.getPlace().geometry.location.toString());
            var placeLng = getLngFromStr(autocomplete.getPlace().geometry.location.toString());



            updateMap($("#search").val(), placeLat, placeLng)
            $("#search").val("").blur();
            $('#multiCityList').html("").hide();
            log("autocomplete");
            isAutocompleted = true;
        } catch(e) {
            isAutocompleted = false;
            $('form').submit();
            log("catch maps autocomplete");
            log(e);
        }
    });

    google.maps.event.addDomListener(input, 'keydown', function(e) {
        if (e.keyCode == 13) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                /* nothing */
            }
        }
    });
}

function updateMap(city, lat, lng){

    var tmpl = $("#map-tmpl").html();
    var html = Mustache.render(tmpl, {city:city, lat:lat, lng:lng});
    $("#map-html").html("").append(html);
}