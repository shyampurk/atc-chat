export default(request) =>{
	// Required modules
	const db = require("kvstore"); // Database module
	const xhr = require("xhr"); // xmlHttprequest module
    const pubnub = require("pubnub");
	var date_const = new Date(); // Date constructor
	var message_dict = {};
	var url_fetched_data = null;
	var fetched_message_body = null;
	var database_value = null;
	var TimeLimit = 15;
	var weather_state = null;
	var minute = 60*60*24; // In minutes
	var diff_inminutes = null;

	var username = '88e9ca57-09f6-471d-be6e-a75d9c3c8700';
	var password = 'qTxtbhhxqA';

	var joincommand = "join";
	var leavecommand = "leave";
	var messagecommand = "message";


	// Air Traffic Control Station Location's Lattitude and Longitude
	var Location_data = {"Anchorage":{"lattitude":"49.3789762","longitude":"-130.5870698"},
	"Vancouver":{"lattitude":"49.2577142","longitude":"-123.1941156"},
	"Seattle":{"lattitude":"47.5536626","longitude":"-122.4378361"},
	"Portland":{"lattitude":"45.4363626","longitude":"-122.7286843"}};
	
	// Pubnub Publish channel on which we will broadcast the messages.
	var pubchannel = "chat_receive";

	/*
		Name - broadcastMessage
		Description - Function used to send message to users via pubnub
		Parameters - pubchannel : Channel for braodcasting the message
					 message : Message to be sent to users

	*/ 
	function broadcastMessage(pubchannel,message){

	// Broadcasting the Message to all the Users.
		pubnub.publish({
	    channel   : pubchannel,
	    message   : message,
	    callback  : function(e) { 
	        console.log( "SUCCESS!", e );
	    },
	    error     : function(e) { 
	        console.log( "FAILED! RETRY PUBLISH!", e );
	    }
	});	

}	
	/*
		Name - fetchLocationWeather
		Description - Function used to execute the external api call to fetch the wether state from the
						IBM weather company data.
		Parameters - location : The ATC Location Name.
	*/
	function fetchLocationWeather(location){

		console.log("RECEIVED ATC LOCATION",location);
		var lattitude = Location_data[location]["lattitude"]; //Extract Lattitude from the locally stored Object 
		var longitude = Location_data[location]["longitude"]; //Extract Longitude from the locally stored Object.
		
		// URL for the weather API
		const url = ('https://'+username+':'+password+'@twcservice.mybluemix.net:443/api/weather/v1/geocode/'+lattitude+'/'+longitude+'/observations.json?units=m&language=en-US');

		// Making an external api call for the weather data 
		xhr.fetch(url).then((url_fetched_data) =>{
			var fetched_message_body = JSON.parse(url_fetched_data.body);
			var weather_state = fetched_message_body.observation.wx_phrase;
			console.log("FETCHED WEATHER_DATA FOR RECEIVED ATC LOCATION --> ",weather_state);
			
			// Preparing Object with the Current Time and Weather State
			message_dict = {"lastupdatedTime":date_const.getTime(),"lastweatherUpdate":weather_state};
			
			// Inserting the Prepared Object with to the Database with location as key.
			db.set(location,message_dict);

		}).catch((err) => {
    	// handle request failure
		console.log("THE API CALL ERROR --> ",err);
		});
}

	/*
		First condition 
	
		Command - Join
		Description - Handles the Messages of type Join.
	*/
	if (request.message.command == joincommand){
		console.log("RECEIVED JOIN COMMAND");
		db.get(request.message.ATClocation).then((database_value)=>{
			console.log("FETCHED DATABASE VALUE",database_value);
			if (!database_value)

			{
				var location = request.message.ATClocation; // Extract the location from the incoming Message.
				fetchLocationWeather(location);
				console.log(request.message);
					
			}

		broadcastMessage(pubchannel,request.message); 		
		
	});// db call ending	

	} // First condition Ending

	/*
		Second Condition
		Command - message
		Description - Handles the Messages of type message
	*/
	if (request.message.command == messagecommand){
		console.log("RECEIVED MESSAGE COMMAND");
		db.get(request.message.ATClocation).then((database_value) =>{

			   
	            console.log("FETCHED DATABASE VALUE -->",database_value);

				var currentTime = date_const.getTime(); // Getting the Current time
				var lastupdatedTime = database_value.lastupdatedTime; // Extracting the Lastupdate time from the Database.

				diff_inminutes = Math.round((currentTime - lastupdatedTime)/minute); // Calculating Time difference
	            console.log("TIME DIFFERENCE IN MINUTES --> ",diff_inminutes);
	            
	            
	            // Checking for 15 min interval
	            if (diff_inminutes>=TimeLimit)
	            {
	            	var location = request.message.ATClocation;
      				 
      				fetchLocationWeather(location);
      				
      				db.get(location).then((database_value) => {
	                	request.message.weatherStatus = database_value.lastweatherUpdate;	                    
      					console.log("BROADCASTING MESSAGE WITH NOT AVAILABLE DATA -->",request.message);	            
      					broadcastMessage(pubchannel,request.message);
	            
	                });
      			}
	            else
	            {
	            	db.get(request.message.ATClocation).then((database_value) => {
	                    request.message.weatherStatus = database_value.lastweatherUpdate;
	                    console.log("BROADCASTING MESSAGE WITH AVAILABLE DATA -->",request.message);
	                    broadcastMessage(pubchannel,request.message);	
	                    });
	            }
	        
	            	
	    }); // db call ending  
	} // Second condition ending

	/*
		Third condition
		Command - Leave
		Description - Handles the Messages of type Leave  
	*/
	if (request.message.command == leavecommand){
		console.log("RECEIVED LEAVE COMMAND");
		console.log("BROADCASTING MESSAGE -->",request.message);
		broadcastMessage(pubchannel,request.message);
	} // Third condition ending
	return request.ok();
};
