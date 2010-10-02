var FBConnect = {

    appIds : {
        		'local-city-defender' : "110196392331352",
        		'city-defender' : "107418339291733",
        		'defenderofarabia' : "122519734470004"
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
/*        Ajax.Responders.register({
				          onCreate: function(req) {					
                  req.url += (req.url.include('?') ? '&' : '?') +
                   "uid=750199343&session_key=2._q4N5Z7fbRHClFWAwy_BIg__.3600.1285282800-750199343&" +   
                   "secret=FUhyx41N5Ge_5iOhxDOQIw__&expires=1285282800&" + 
                   "access_token=110196392331352%7C2._q4N5Z7fbRHClFWAwy_BIg__.3600.1285282800-750199343%7ChjkI8VTeynvd1LQkEPVETWTptBw&sig=bd702b0e55ab50534a15ede456c262c3"
					        return true
				          }
			          });
        FBConnect.getUser();*/
        FB.getLoginStatus(function(response) {
			      if (response.session) {
			          FBConnect.session = response.session;
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
        FB.ui({ method: 'bookmark.add' },  
            function(response) {
             });
    },
    
    publish : function(attachment, usePrompt, actionLink, successCallback) {
        var loc = "http://apps.facebook.com/" + FBConnect.url() + "/";
        FB.ui(
              {
                  method: 'stream.publish',
                  display: 'dialog',
                  message: '',
                  attachment: attachment,
                  action_links: actionLink,
                  user_message_prompt: usePrompt
              }, 
              function(response) {
                  if (response && response.post_id) {
                      successCallback();
                  }
              }

        );
        window.setTimeout(function(){
                              var divs = $$('#fb-root .fb_dialog');
                              if( divs.length > 1 && (parseInt(divs.last().getStyle('top')) < 0 ))
                              {
                                  divs.last().style["top"] = "203.6px";
                                  divs.last().style["left"] = "82.5px";
                              }
                          }, 5000);
    },
    
    invite : function(userPrompt, inviteMsg){
        var appUrl = "http://apps.facebook.com/" + FBConnect.url();
        FB.api(
            {  method: 'friends.getAppUsers' },
            function(response) {
                var ids = response;
                FB.ui({
                    method:'fbml.dialog',
                    display: 'popup',
                    width:640, height:480,
                    fbml:'<fb:Fbml>   ' +
                              '<fb:request-form action="' + window.location + '"' + ' method="GET" invite="true" targer="_self" ' +
                                                'type="Studio SA 2010" content="I am predicting the results of the world cup 2010 on Studio S.A. Predict with me ' +
                                '<fb:req-choice url=\'' + appUrl + '\' ' +  'label=\'Play\' />" >' +
                                '<div style="width : 83%; margin:auto;"> ' +
                                  '<fb:multi-friend-selector  targer="_self" showborder="false"' + 'exclude_ids="' + ids + '"' + 'actiontext="Invite your friends to play Studio South Africa 2010 with you" cols="3" rows="1"/>' +         
                                '<div/> ' +
                                '</fb:request-form>' +
                          '</fb:Fbml> '
                });
            }
        );
    }

}

