$("#company_form").hide();

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
		  $("#company_name").append(info_json[i]["id"]);
		  $("#company_form").show();
		  output = true;

	  } 
    }
    if(output == false){
	  $("#result").append('Sorry, no public bikes here. How about try "Chicago", "US"?');
    }

    $("#company_form").on("submit", function(e) {
      //var new_url = "https://api.citybik.es/v2/networks/" + $("#company_name");
      var new_url = "https://api.citybik.es/v2/networks/divvy";
      var address_input = $("#address").val();

      $.get(new_url, function(newdata) {
      	var company_json = newdata["network"]["stations"];

      	var address = $("#address").val();
      	for(var j = 0; j < 583; j++){
      		var address = company_json[j]['extra']['name'];
      		if(address == address_input){
      		  $("#bike_result").append(company_json[j]["empty_slots"]);
      		}
      	}
      });      
      e.preventDefault();
    });

  });

  e.preventDefault();

});




