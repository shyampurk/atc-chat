$(document).ready(function () {
		
    // $('#auth-overlay').css('display','block');
	
	var chatPublishChannel = 'chat-send',
		chatSubscribeChannel = 'chat-receive',
	    inputMessage = $('#inputMessage'),
	    inputMessageSubmit = $("#inputMessageSubmit"),
	    messageList = $("#message-list"),
	    onlineUsersList = $("#onlineUsers"),
	    ATCUserName = $("#ATCUserName"),
	    ATCcontrolname = $("#ATCcontrol"),
	    ATClogin = $("#ATClogin"),
	    ATCleave = $("#leave"),
	    ATCuserlist = [];
	
	// var ATCusername = ATCUserName.val();
	// var ATCctrlname = ATCcontrolname.val();
	var ATCusername = "lee";
	// var ATCctrlname = ATCcontrolname.val();
	
	// console.log(ATCusername,ATCctrl)

	var pubnub = PUBNUB({
        publish_key : 'pub-c-39cb0d0f-3bac-461a-b236-3ce3be7c27b8',
        subscribe_key : 'sub-c-50696b6a-e1fb-11e6-8e68-02ee2ddab7fe'
    })

	// Subscribe to a channel
	function pub_subscribe(){
		pubnub.subscribe({
		    channel : chatSubscribeChannel,
		    message : function(m){
		        console.log(m)
		        message_listing(m);
		    },
		    error : function (error) {
		        console.log(JSON.stringify(error));
		    }
		});
	}; 

	function message_listing(m){
		console.log("message_listing :",m.user)
		if(m.command == "join"){
			ATCuserlist.push(m.user);
			console.log(ATCuserlist);
			var userData = {
				ATC_UserIcon : Math.floor(Math.random() * 8) + 1,
				ATC_UserName : m.user,
				ATC_Location : m.ATClocation
			}
			if(ATCuserlist.length == 1){
				var userTemplate = ['<li class="media" id={{ATC_UserName}}>',
	                                '<div class="media-body" style="background:#d5e5e1">',
	                                    '<div class="media">',
	                                        '<a class="pull-left" href="#">',
	                                            '<img class="media-object img-circle" style="max-height:40px;" src="assets/img/userImages/{{ATC_UserIcon}}.png" />',
	                                        '</a>',
	                                        '<div class="media-body" >',
	                                            '<h5>{{ATC_UserName}}</h5>',
	                                            '<small class="text-muted" style="text-transform: uppercase;">ATC-{{ATC_Location}}</small>',
	                                        '</div>',
	                                    '</div>',
	                                '</div>',
	                            '</li>'].join("\n");
			}else{
				var userTemplate = ['<li class="media" id={{ATC_UserName}}>',
	                                '<div class="media-body">',
	                                    '<div class="media">',
	                                        '<a class="pull-left" href="#">',
	                                            '<img class="media-object img-circle" style="max-height:40px;" src="assets/img/userImages/{{ATC_UserIcon}}.png" />',
	                                        '</a>',
	                                        '<div class="media-body" >',
	                                            '<h5>{{ATC_UserName}}</h5>',
	                                            '<small class="text-muted" style="text-transform: uppercase;">ATC-{{ATC_Location}}</small>',
	                                        '</div>',
	                                    '</div>',
	                                '</div>',
	                            '</li>'].join("\n");
			}
			var userList = Mustache.render(userTemplate, userData);
	    	onlineUsersList.append(userList);
		
		}else if(m.command == "message"){
			var weather_states = {
				"Tornado":0,"Tropical Storm":1,"Hurricane":2,"Strong Storms":3,
				"Rain to Snow Showers":5,"Rain / Sleet":6,"Wintry Mix Snow":7,
				"Freezing Drizzle":8,"Drizzle":9,"Freezing Rain":10,"Light Rain":11,
				"Rain":12,"Scattered Flurries":13,"Light Snow":14,"Blowing / Drifting Snow":15,
				"Snow":16,"Hail":17,"Sleet":18,"Blowing Dust / Sandstorm":19,
				"Foggy":20,"Haze / Windy":21,"Smoke / Windy":22,"Breezy":23,
				"Blowing Spray / Windy":24,"Frigid / Ice Crystals":25,"Cloudy":26,
				"Mostly Cloudy":27,"Mostly Cloudy":28,"Partly Cloudy":29,"Partly Cloudy":30,
				"Clear":31,"Sunny":32,"Fair / Mostly Clear":33,"Fair / Mostly Sunny":34,
				"Mixed Rain & Hail":35,"Hot":36,"Isolated Thunderstorms":37,"Thunderstorms":38,
				"Scattered Showers":39,"Heavy Rain":40,"Scattered Snow Showers":41,
				"Heavy Snow":42,"Blizzard":43,"Not Available (N/A)":44,
				"Scattered Showers":45,"Scattered Snow Showers":46,"Scattered Thunderstorms":47,}
			
	
				for (var p in weather_states){
					if (p == m.weatherStatus){
						var weatherStatusIcon = weather_states[p]
						console.log(weatherStatusIcon)
					}
				}
			

			var messageData = {
				ATC_CurrentUser : ATCusername,
				ATC_UserIcon : Math.floor(Math.random() * 8) + 1,
				userName : m.user,
				userATClocation : m.ATClocation,
		        userMessageBody : m.userMessage,
		        weatherIcon : weatherStatusIcon,
		        weatherReport : m.weatherStatus
		    }
		    console.log(messageData)
			var messageTemplate = ['<li class="media {{ATC_CurrentUser}}" >',
	                            '<div class="media-body">',
	                                '<div class="media">',
	                                    '<a class="pull-left" href="#">',
	                                        '<img class="media-object img-circle" src="assets/img/userImages/{{ATC_UserIcon}}.png" alt="man1" height="40" width="40" />',
	                                    	'<p>{{userName}}</p>',
	                                    '</a>',
	                                    '<div class="media-body" >{{userMessageBody}}',
	                                       ' <br />',
	                                       '<small class="text-muted" style="text-transform: uppercase;"> ATC-{{userATClocation}} <img height="30" width="30" src="assets/img/weather/png/{{weatherIcon}}.png"> {{weatherReport}} </small>',
	                                        '<hr />',
	                                    '</div>',
	                                '</div>',
	                            '</div>',
	                        '</li>'].join("\n");
	        var list = Mustache.render(messageTemplate, messageData);
	    	messageList.append(list);
		
		}else if(m.command == "leave"){
			console.log(m.user);
			$( "li" ).remove( "#"+m.user );
			$( "li" ).remove("."+ATCusername);
		}
	}

	function send_message(){
		inputMessageSubmit.click(function (event) {
	        var chatMessage = {
	        					"command":"message",
	        					"user":ATCusername,
	        					"ATClocation":ATCctrlname,
	        					"userMessage":inputMessage.val()
	        				}
	        console.log(chatMessage)
	        pub_publish(chatMessage);
	    });
	}

	// ATClogin.submit(function (event){
	ATClogin.on( "click", function() {
		var loginData = {"command":"join","user":ATCUserName.val(),"ATClocation":ATCcontrol.val()}
			console.log(loginData)
        	pub_publish(loginData);
        	// $('#auth-overlay').hide();
        	// $('#auth-overlay').remove();
        	// $('#app-ui').css('display','block');
	})

	ATCleave.on( "click", function() {
		var leaveData = {"command":"leave","user":ATCusername,"ATClocation":ATCctrlname};
			console.log(leaveData)
		    pub_publish(leaveData);
		    // $('#app-ui').remove();
		    // $('#auth-overlay').show();
		    // $('#auth-overlay').css('display','block');
	});

	function pub_publish(pub_msg){
		pubnub.publish({
		    channel : chatPublishChannel,
		    message : pub_msg,
		    callback : function(m){
		        console.log(m)
		    }
		});
	}
	
	send_message();
	pub_subscribe();

});

/*
{"command":"join","user":"jake","ATClocation":"Seattle"}
{"command":"leave","user":"jake","ATClocation":"Seattle"}
{"command":"message","user":"jake","ATClocation":"Seattle","userMessage":"Quantas flyby","weatherStatus":"Freezing Rain"}
*/