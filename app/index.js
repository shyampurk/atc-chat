$(document).ready(function () {
	
	var chatPublishChannel = 'chat_send',
		chatSubscribeChannel = 'chat_receive',
	    inputMessage = $('#inputMessage'),
	    inputMessageSubmit = $("#inputMessageSubmit"),
	    messageList = $("#message-list"),
	    onlineUsersList = $("#onlineUsers"),
	    ATCUserName = $("#ATCUserName"),
	    ATCControlLoc = $("#ATCcontrol"),
	    ATClogin = $("#ATClogin"),
	    ATCleave = $("#leave"),
	    LoginScreen = $(".overlay"),
	    ATCuserlist = [],
	    pub_key = 'pub-c-578b72c9-0ca2-4429-b7d4-313bbdf9b335',
	    sub_key = 'sub-c-471f5e36-e1ef-11e6-ac69-0619f8945a4f',
		ATCusername,
		ATCctrlname;

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
				"Scattered Showers":45,"Scattered Snow Showers":46,"Scattered Thunderstorms":47,
				"Fair":26,"Fair / Windy":22
			}
			
	var pubnub = PUBNUB({
        publish_key : pub_key,
        subscribe_key : sub_key
    })

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

		if(m.command == "join"){
			ATCuserlist.push(m.user);

			var userData = {
				ATC_UserIcon : Math.floor(Math.random() * 8) + 1,
				ATC_UserName : m.user,
				ATC_Location : m.ATClocation
			}
			if(ATCuserlist.length == 1){
				var userTemplate = ['<li class="media clearList" id={{ATC_UserName}}>',
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
				var userTemplate = ['<li class="media clearList" id={{ATC_UserName}}>',
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

			for (var p in weather_states){
				if (p == m.weatherStatus){
					var weatherStatusIcon = weather_states[p];
					break;
				}
				else{
					var weatherStatusIcon = 44;
				}
			}
			var userData = {
					ATC_UserIcon : Math.floor(Math.random() * 8) + 1,
					ATC_UserName : m.user,
					ATC_Location : m.ATClocation
				}
			var count = 0;
			for (var i = 0; i < ATCuserlist.length; i++) {
				if (ATCuserlist[i] !== m.user){
					count++;
				}
				else{
					break;
				}
			};
			if(count == ATCuserlist.length){
				ATCuserlist.push(m.user);
				var userTemplate = ['<li class="media clearList" id={{ATC_UserName}}>',
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

				var userList = Mustache.render(userTemplate, userData);
		    	onlineUsersList.append(userList);
			}
			
			var messageData = {
				ATC_UserIcon 	: Math.floor(Math.random() * 8) + 1,
				userName 		: m.user,
				userATClocation : m.ATClocation,
		        userMessageBody : m.userMessage,
		        weatherIcon 	: weatherStatusIcon,
		        weatherReport 	: m.weatherStatus
		    }

			var messageTemplate = ['<li class="media clearMsgList" >',
	                            '<div class="media-body">',
	                                '<div class="media">',
	                                    '<a class="pull-left" href="#">',
	                                        '<img class="media-object img-circle" src="assets/img/userImages/{{ATC_UserIcon}}.png" alt="man1" height="40" width="40" />',
	                                    	'<p style="text-align:center;">{{userName}}</p>',
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

	    	var height = 0;
			$('div li').each(function(i, value){
			    height += parseInt($(this).height());
			});

			height += '';

			$('div').animate({scrollTop: height});
		
		}else if(m.command == "leave"){

			$( "li" ).remove( "#"+m.user );
		}
	};

	function send_message(){
		inputMessageSubmit.click(function (event) {
	        var chatMessage = {
	        					"command":"message",
	        					"user":ATCusername,
	        					"ATClocation":ATCctrlname,
	        					"userMessage":inputMessage.val()
	        				}
	        if(inputMessage.val().length != 0){
	        	pub_publish(chatMessage);
	        	inputMessage.val("");
	        }
	    });
	};

	ATClogin.on( "click", function() {
		pub_subscribe();
		setTimeout(function(){
			var loginData = {"command":"join","user":ATCUserName.val(),"ATClocation":ATCControlLoc.val()}
				ATCusername = ATCUserName.val();
				ATCctrlname = ATCControlLoc.val();
	        	pub_publish(loginData);
	        	LoginScreen.fadeOut(1000);
	        	setTimeout(function(){
	        		LoginScreen.css("z-index","-10");
	        		ATCUserName.val(""),
	        		ATCControlLoc.val("Select Your ATC Location")
	        	},1000);
        	document.getElementById('chat-header-username').innerHTML = ATCusername;
        	document.getElementById('chat-header-atcname').innerHTML = " - ATC-"+ATCctrlname;
		},1000);
	});

	ATCleave.on( "click", function() {
		var leaveData = {"command":"leave","user":ATCusername,"ATClocation":ATCctrlname};
		    pub_publish(leaveData);
		    $( "li" ).remove(".clearMsgList");
		    $( "li" ).remove(".clearList");
		    ATCuserlist.length = 0;
		    LoginScreen.css("z-index","10");
		    LoginScreen.fadeIn(1000);
		    pubnub.unsubscribe({
			    channel : chatSubscribeChannel,
			});
	});

	function pub_publish(pub_msg){
		pubnub.publish({
		    channel : chatPublishChannel,
		    message : pub_msg,
		    callback : function(m){
		        console.log(m)
		    }
		});
	};
	
	send_message();

});

