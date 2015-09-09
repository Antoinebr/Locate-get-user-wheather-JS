
var perso = {
  city: null,
  region: null,
  country: null,
  wheather: null,
  init:function(){
    this.getLocalisationData();
  },
  getLocalisationData:function(){
    var that = this;
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
    if(response !== "undefined") this.getLocation(response); else console.log('Erreur dans les datas de localisation');
  },
  getLocation:function(location){
    console.log(location);
    var locationFinded = false;

    if(typeof location.country !== "undefined") this.setCountry(location.country);

    if(typeof location.city !== "undefined"){
      this.setCity(location.city);
      this.setRegion(location.region);
      locationFinded = true;
      this.getMeteo(location.latitude,location.longitude);
    }

    if(typeof location.city === "undefined" && typeof location.region !== "undefined" && locationFinded !== true){
      this.getMeteo(location.latitude,location.longitude);
      locationFinded = true;
    }

    if(typeof location.city === "undefined" && typeof location.region === "undefined" && locationFinded !== true){
      // We can't find the city with Telize so we ask Google Map
      this.getDecodedAddresse(location.latitude,location.longitude);
    }

  },
  getDecodedAddresse: function(lat,long){
    console.log('Decodage by Google Map running...');
    var that = this;
    // var lati = lat;
    // var longi = long;
    $.ajax({
      type: "GET",
      url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'',
      async: true,
      dataType: "json",
      success: function(response){
        console.log(response);
        that.setRegion(response.results[0].address_components[4].long_name);
        that.setCity(response.results[0].address_components[2].long_name);
        that.getMeteo(lat,long);
      },
      error : function(request, errorType, errorMessage){
        console.log("Impossible de decoder les coord");
      },
      timeout:5000
    });
  },
  getMeteo: function(lat,long,byCity){
    if(byCity == 'undefined') byCity = null;
    var that = this;
    var endpoint = null;
    if(byCity === null ){
      endpoint = 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'';
    }else{
      endpoint = 'http://api.openweathermap.org/data/2.5/weather?q='+byCity;
    }
    $.ajax({
      type: "GET",
      url: endpoint,
      async: true,
      dataType: "json",
      success: function(response){
        // voir http://openweathermap.org/wiki/API/Weather_Condition_Codes
        if(response.cod =="404"){
          console.log('Impossible de récupérer la Meteo nouvelle essaie par la ville');
          that.getMeteo(null,null,that.getCity());
          return;
        }
        if(typeof response.weather[0].main !== "undefined"){
          if(response.weather[0].main == "Clouds") that.setWheather('Clouds');
          if(response.weather[0].main == "Clear" || "Mist") that.setWheather('Clear');
          if(response.weather[0].main == "Rain") that.setWheather('Rain');
          console.log('Le temps détécté : '+response.weather[0].main);
        }
      },
      error : function(request, errorType, errorMessage){
        console.log("Impossible d'obtenir la meteo");
      },
      timeout:5000
    });
  },
  setRegion: function(valueRegion){
    if(typeof valueRegion !== "undefined") this.region = valueRegion;
  },
  setCity: function(valueCity){
    if(typeof valueCity !== "undefined") this.city = valueCity;
  },
  setCountry: function(valueCountry){
    if(typeof valueCountry !== "undefined") this.country = valueCountry;
  },
  setWheather: function(valueWheather){
    if(typeof valueWheather !== "undefined") this.wheather = valueWheather;
  },
  getCity:function(){
    if (this.city !== null) return this.city;
  },
  getRegion: function(){
    if (this.region !== null) return this.region;
  },
  getCountry: function(){
    if(typeof this.country !== "undefined") return this.country;
  },
  isRaining: function(){
    if(this.wheather !== "undefined" && this.wheather == "Rain") return true; else return false;
  },
  isClear: function(){
    if(this.wheather !== "undefined" && this.wheather == "Clear") return true; else return false;
  },
  isCloudy: function(){
    if(this.wheather !== "undefined" && this.wheather == "Clouds") return true; else return false;
  }
};
