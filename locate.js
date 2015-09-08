var city = null;
var perso = {
  init:function(){
    this.getLocalisationData();
  },
  getLocalisationData:function(){
    var that = this
    $.ajax({
      type: "GET",
      url: 'http://www.telize.com/geoip/',
      async: true,
      dataType: "json",
      success: function(response){
        that.verifyResponse(response);
      },
      error : function(request, errorType, errorMessage){
        setTimeout(that.getLocalisationData(), 200);
      },
      timeout:5000
    });
  },
  verifyResponse:function(response){
    if(response !== "undefined") this.getLocation(response); else alert(response);
  },
  getLocation:function(location){
    var locationFinded = false;
    if(typeof location.city !== "undefined"){
      $('h1').text('Vous êtes localisé à '+location.city);
      city = location.city;
      locationFinded = true;
      this.getMeteo(location.latitude,location.longitude);
    }

    if(typeof location.city === "undefined" && typeof location.region !== "undefined" && locationFinded !== true){
      $('h1').text('Vous êtes localisé en '+location.region);
      this.getMeteo(location.latitude,location.longitude);
      locationFinded = true;
    }

    if(typeof location.city === "undefined" && typeof location.region === "undefined" && locationFinded !== true){
      $('h1').text('Vous êtes localisé aux coord '+location.latitude+' '+location.longitude);
      this.getMeteo(location.latitude,location.longitude);
    }

  },
  getMeteo: function(lat,long){
    var that = this;
    $.ajax({
      type: "GET",
      url: 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'',
      async: true,
      dataType: "json",
      success: function(response){
        //afterAajaxCall(response);
        if(response.weather[0].main !== "undefined"){
          if(response.weather[0].main == "Clouds") that.isCloudy();
          if(response.weather[0].main == "Clear") that.isClear();
          if(response.weather[0].main == "Rain") that.isRaining();
        }
      },
      error : function(request, errorType, errorMessage){
        console.log("Impossible d'obtenir la meteo");
      },
      timeout:5000
    });
  },
  isRaining: function(){
    // start test
    $('h1').after('<h2>Il pleut chez vous :( </h2>');
  },
  isClear: function(){
    // start test
    $('h1').after('<h2>Il fait beau chez vous :) </h2>');
  },
  isCloudy: function(){
    // start test
    $('h1').after('<h2>C\'est nuageux chez vous :/ </h2>');
  },
};
