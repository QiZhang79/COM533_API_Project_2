$("#city_form").on("submit", function(e) {
  var url = "https://api.citybik.es/v2/networks/";

  $.get(url, function(data) {
    var info_json = data["networks"];
    //this function enables users to input alias. Like in the original JSON file, 
    //it's "Chicago, IL", but users can also input "Chicago", "chicago" to find it.
    var city_alias = function(city_in){
	    var city_in_split = city_in.split(",");
	    var city_in_cut = city_in_split[0];
	    var city_in_cap = city_in_cut.toLowerCase();
	    return [city_in, city_in_cut, city_in_cap];
    };

    var country_in = $("#country").val();
    var city_in = $("#city").val();

    var output = false;//set a boolean at first, otherwise too many output.....
    for(var i = 0; i < info_json.length; i++) {
	    var country = info_json[i]["location"]["country"];
	    var city_li = city_alias(info_json[i]["location"]["city"]);

  	  if(country == country_in && city_li.indexOf(city_in) != -1) {
  		  $("#company_name").append("Yes! Here we have " +'<b id = "result_company">' + info_json[i]["id"].toUpperCase() + '</b>');
  		  $("#company_form").toggleClass('is-hidden');
  		  output = true;

  	  } 
    }

    if(output == false){
	    $("#result").append('Sorry, no public bikes here. How about try "Chicago", "US"?');
    }    

    $("#company_form").on("submit", function(e) {
      var result_company = $("#result_company").text().toLowerCase(); //here use .text() not .val()
      var new_url = "https://api.citybik.es/v2/networks/" + result_company;
      var address_input = $("#address").val();

      $.get(new_url, function(newdata) {
      	var station_json = newdata["network"]["stations"];
        var find = false;
      	for(var j = 0; j < station_json.length; j++){
      		var address = station_json[j]["name"];
      		if(address == address_input){
            find = true;
      		  $("#bikeresult").append('<li>Empty Slots:  ' + station_json[j]["empty_slots"] + '</li>');
            $("#bikeresult").append('<li>Free Bikes:  ' + station_json[j]["free_bikes"] + '</li>');
            $("#bikeresult").append('<li><a href=" https://www.google.com/maps/?q=' + station_json[j]["latitude"] + 
               ',' + station_json[j]["longitude"] +' ">' + "Location" + '</a></li>');
      		} 
      	}

        if(find == false){
          alert("Not found. Could you please try other address?");
        }
      });      
      e.preventDefault();
    });

  });

  e.preventDefault();

});

$("#city_form").on("reset", function(e) {
  $("#country").val("");
  $("#city").val("");
  $("#result").html("");
});




