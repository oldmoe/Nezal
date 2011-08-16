var FBConnect = {

    appIds : {
        		'local-city-defender' : "110196392331352",
        		'city-defender' : "107418339291733",
        		'defenderofarabia' : "122519734470004",
        		'local-base-defender' : "156711934356799",
        		'base-defender' : "111103738948774",
			'tahrir-square' : "119464494818795"
	  },
	  
    channelPath : "xd_receiver.html",
    
    location : null,
    
    url : function(){
		    var data = FBConnect.location;
		    data = data.split("/");
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
	  
	  getUsersInfo : function(ids, result, callback){
			var	query2 = FB.Data.query("SELECT name,uid FROM user WHERE uid IN ({0})", ids);
			FB.Data.waitOn([query2], function(){
				if(!query2.value.length) 
				  query2.value=[]
				query2.value.each(function(row){
					result[row.uid].name = row.name
				})
				if(callback)callback()
			})
	  },
	  
    init : function( successCallback ) {
        FBConnect.location = window.location.toString();
        var fbRoot = document.createElement('div');
        fbRoot.setAttribute("id", "fb-root");
        var invite = document.createElement('iframe');
        invite.setAttribute("id", "invite");
        invite.setAttribute("src", "statics/blank.html");
        invite.style.display = 'none';
        document.body.appendChild(fbRoot);
        document.body.appendChild(invite);
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
                
                console.log(response);
                if( !response.perms || 
                    !JSON.parse(response.perms).extended || 
                    JSON.parse(response.perms).extended.indexOf('publish_stream') == -1 ) {
                      
                      var redirect_url = "http://www.facebook.com/connect/uiserver.php?app_id=" + 
                                   FBConnect.appIds[FBConnect.url()] +  
                                   "&next=http://apps.facebook.com/"+ 
                                   FBConnect.url() + "/" +
                                 "?display=page&locale=en_US&return_session=0&" +
                                 "fbconnect=0&canvas=1&legacy_return=1&method=permissions.request&perms=publish_stream";
                                 
                      window.top.location = redirect_url;
                      return;
                }
			          Ajax.Responders.register({
				          onCreate: function(req) {
      							var inviter = ''
      							var search = window.location.search
      							if(search){
      								search = search.split('?')[1]
      								if(search){
      									search = search.split('&').find(function(pair){ return pair.include('inviter')})
      										if(search){
      											inviter = search
      										}
      									}
      							}
  					        req.url += (req.url.include('?') ? '&' : '?') + Object.toQueryString(FBConnect.session) + '&' + inviter
  					        return true
				          }
			          });
                if(document.getElementsByTagName('fb:fan')[0]) 
                {
                    document.getElementsByTagName('fb:fan')[0].writeAttribute('profile_id', FBConnect.appIds[FBConnect.url()]);
                    FB.XFBML.parse();
                }
			          FBConnect.getUser();
			          FBConnect.getUserInfo(function(){});
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
                    var inviter = FBConnect.location.split("inviter")[1];
                    var appendParam = '';
                    if(inviter)
                    {
                        var id = inviter.split('&')[0];
                        appendParam = '?inviter' + id;
                    }
                    redirect_url = "http://www.facebook.com/connect/uiserver.php?app_id=" + 
                                   FBConnect.appIds[FBConnect.url()] +  
                                   "&next=http://apps.facebook.com/"+ 
                                   FBConnect.url() + "/" + appendParam +
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
	  
	  isFan : function(callback) {
	      var query = FB.Data.query("SELECT page_id FROM page_fan WHERE uid={0}", FB.getSession().uid);
        FB.Data.waitOn([query], function(){
            var fan = query.value.find(function(obj){
                if(obj.page_id == FB._apiKey){
                    return true;
                }
            });
            callback(fan);
        });
	  },
    
    bookmark : function(callback){
        FB.ui({ method: 'bookmark.add' },  
              function(response) {
                  if(response.bookmarked == 1)
                      callback();
              });
    },
    
    publish : function(attachment, usePrompt, actionLink, successCallback) {
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
                          }, 10000);
    },
    
    invite : function(inviteMsg, userPrompt, appName){
        $('invite').src = "html/invite.html?" +
                                "msg=" + escape(inviteMsg) + "&propmt=" + escape(userPrompt) + "&name=" + escape(appName)
        $('invite').show();
/*        var win = window.open( "html/invite.html?" +
                                "msg=" + escape(inviteMsg) + "&propmt=" + escape(userPrompt) + "&name=" + escape(appName) ,
                               'Invite',
                               'height=550,width=640, left=100, top =100');*/
                               
/*          var size = FB.UIServer.Methods['fbml.dialog'].size;
          FB.UIServer.Methods['fbml.dialog'].size.height = 500;*/
          
    }

}


