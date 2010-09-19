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
	  
/*	    
	  http://www.facebook.com/connect/uiserver.php?app_id=110196392331352&next=http://apps.facebook.com/local-city-defender/&display=page&locale=en_US&return_session=0&fbconnect=0&canvas=1&legacy_return=1&method=permissions.request
	  
	  
	  http://www.facebook.com/connect/uiserver.php?app_id=113574023556&next=http%3A%2F%2Fapps.facebook.com%2Fdesktopdefender%2F&display=page&locale=en_US&return_session=0&fbconnect=0&canvas=1&legacy_return=1&method=permissions.request
	  
	  https://graph.facebook.com/oauth/authorize?client_id=110196392331352&redirect_uri=http://apps.facebook.com/local-city-defender
	  
	  http://www.facebook.com/r.php?referrer=112&app_id=110196392331352&app_data=http://apps.facebook.com/local-city-defender/
	  
	  http://www.facebook.com/login.php?v=1.0&app_id=110196392331352&next=http://apps.facebook.com/local-city-defender/&canvas=1
*/
	  
	  retry : 10,
	  
	  callback : null,
	  
	  user : null,
	  
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
                /* He is either not logged in or doesnt have the application added 
                 * First case he is not logged in : status = unknown
                 * He is logged in but hasnot added the application : status = notConnected
                 */
                var redirect_url = ''
                if(response.status == "unknown" )
                {
                    // redirect to login page 
                    redirect_url = "http://www.facebook.com/login.php?v=1.0&app_id=" +
                                   FBConnect.appIds[FBConnect.url()] + 
                                   "&canvas=1&next=http://apps.facebook.com/" + 
                                   FBConnect.url();
                }else if(response.status == "notConnected" )
                {
                    redirect_url = "http://www.facebook.com/connect/uiserver.php?app_id=" + 
                                   FBConnect.appIds[FBConnect.url()] +  
                                   "&next=http://apps.facebook.com/"+ 
                                   FBConnect.url() + "/" +
                                 "&display=page&locale=en_US&return_session=0&" +
                                 "fbconnect=0&canvas=1&legacy_return=1&method=permissions.request";
                }
                window.top.location = redirect_url;
            }
        });
    },
    
	  getUserInfo : function(callback) {
	      if(!FBConnect.user)
	      {
            FB.api( '/me', function(response)
                            {
                                FBConnect.user = response;
                                callback();                                      
                            });
        }else {
          callback();
        }
	  },
    
    bookmark : function(){
        FB.ui({ method: 'bookmark.add' });
    },
    
    publish : function(attachment, usePrompt, actionLink) {
        var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
        FB.ui(
              {
                method: 'stream.publish',
                display: 'dialog',
                message: '',
                attachment: attachment,
                action_links: actionLink,
                user_message_prompt: usePrompt
              }
        );
    },

}

