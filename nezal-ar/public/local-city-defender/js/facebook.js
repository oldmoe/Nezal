var Display = {
    fetch: function(url, place){
        new Ajax.Request(url, {   method:'get',
                                  onSuccess: function(t){
                                    Display.alter(place, t.responseText);
                                  },
                                  onComplete: function(t){}
                              });
    },
    alter: function(divId, newContent)  {
        $(divId).replace(newContent);
    }
}

var FBConnect = {

    appIds : {
        		'local-city-defender' : "110196392331352",
        		'city-defender' : "107418339291733"
	  },
	  
    channelPath : "xd_receiver.html",
    
    url : function(){
		    var data = window.location;
		    data = data.toString().split("/");
		    data = data[4];
		    //document.domain = origDomain
		    return data;
	  },
	  
	  retry : 10,
	  
	  callback : null,
	  
	  getUser : function() {
        FBConnect.retry --;
        FBConnect.callback();
	  },
	  
    init : function( successCallback ) {
        fbRoot = document.createElement('div');
        fbRoot.setAttribute("id", "fb-root");
        document.body.appendChild(fbRoot);
        FB.init({
            appId  : FBConnect.appIds[FBConnect.url()],
            apiKey  : FBConnect.appIds[FBConnect.url()],
            status : true, // check login status
            cookie : true // enable cookies to allow the server to access the session
        });
        FBConnect.callback = successCallback;
        FB.getLoginStatus(function(response) {
			      if (response.session) {
			          FBConnect.session = response.session
			          Ajax.Responders.register({
				          onCreate: function(req) {					
					        req.url += (req.url.include('?') ? '&' : '?') + Object.toQueryString(FBConnect.session)
					        return true
				          }
			          });
                if(document.getElementsByTagName('fb:fan')[0]) 
                {
                    document.getElementsByTagName('fb:fan')[0].writeAttribute('profile_id', FBConnect.appIds[FBConnect.url()]);
                    FB.XFBML.parse();
                }
                FBConnect.getUser();
              }else{
                Display.fetch("connect.html", "game");
            }
        });
    },
    connect : function() {
        FB.login(function(response) {
            if (response.session) {
                if (response.perms) {
                  // user is logged in and granted some permissions.
                  // perms is a comma separated list of granted permissions
                  window.location = window.location;
                } else {
                }
            } else {
                alert("You have to log in to facebook to play the game");
            }
        }, {perms:'read_stream,publish_stream'});
    }

}

