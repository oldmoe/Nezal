var Display = {
    fetch: function(url, place){
      new Ajax.Request(url, { method:'get',
                              onSuccess: function(t){
                                Display.alter(place, t.responseText);
                              },
                              onComplete: function(t){

                    		      }
                            });
    },
    alter: function(divId, newContent)
    {
      $(divId).replace(newContent);
    }
}

var FBConnect = {

    appIds : {
        		'local-studio' : '103040546410849',
        		'studio-sa' : '110624738982804',
	  },
	  
    channelPath : "/html/facebook/xd_receiver.html",
    
    url : function(){
		    /*var origDomain = document.domain
		    try{
			    document.domain = 'apps.facebook.com'
		    }catch(e){
		    }
		    alert(window.location)
		    */
		    var data = window.location
		    data = data.toString().split("/")
		    data = data[data.length-2]
		    //document.domain = origDomain
		    return data
	  },
	  
    init : function( successCallback ) {
        FB.init({
            appId  : FBConnect.appIds[FBConnect.url()],
            status : true, // check login status
            cookie : true, // enable cookies to allow the server to access the session
            xfbml  : false  // parse XFBML
        });
        FB.getLoginStatus(function(response) {
            if (response.session) {
              successCallback();
            }else{
              Display.fetch("/html/studio/placeHolder.html", "game");
            }
        });
    },
      
    connect : function() {
        FB.login(function(response) {
            if (response.session) {
                if (response.perms) {
                  // user is logged in and granted some permissions.
                  // perms is a comma separated list of granted permissions
                  //Display.fetch("/"+FBConnect.url()+"/matches", "placeHolder");
                  console.log(FB.getSession);
                } else {
                  alert("LOGGED IN BUT NOT ADDED")
                }
            } else {
                alert("LOGGED OUT")
            }
        }, {perms:'read_stream,publish_stream'});
    },  
    
    publish : function() {
        var loc = window.top.location.toString();

        FB.ui({
                method: 'stream.publish',
                message: '',
                attachment: {
                  name: 'South Africa vs Mexico 1-0',
                	'media': [{ 'type': 'image', 
                	            'src': 'http://173.192.39.215:5500/images/logo-3.png',
                	            'href': loc }],

                  description: (
                    'توقعت نتيجة 0-1 لمياراة جنوب أفريقياو المكسيك بكأس العالم 2010. توقع و لنري الاقرب لنتيجة المباراة'
                    ),
                    

                },
                action_links: [ {text:'توقع أنت', href: loc } ],
                user_message_prompt: 'تحدي أصدقائك لتوقع نتيجة المباراة'
              },
              function(response) {
                if (response && response.post_id) {
                  alert('Post was published.');
                } else {
                  alert('Post was not published.');
                }
              });
    },
      
    eventSubscribe : function() {
        FB.Event.subscribe('auth.sessionChange', function(response) {
          if (response.session) {
             console.log("LOGGED IN");
          } else {
            // The user has logged out, and the cookie has been cleared
            console.log("LOGGED OUT");
          }
        });
    }
}

