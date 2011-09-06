var FBConnect = {

    appIds : { 'thawragy' : "280248505323133",
               'local-thawragy' : "245272925509018" },
    
    location : null,
    
    url : function(){
		    var data = FBConnect.location;
		    data = data.split("/");
		    data = data[4];
		    return data;
	  },

	  retry : 10,
	  
	  callback : null,
	  
	  user : null,
	  
    getStatus : function(successCallback) {
        FB.getLoginStatus(function(response) {
		      if (response.status == "connected") {
		          FBConnect.session = response.authResponse;
        		  var	query = FB.Data.query("SELECT publish_stream FROM permissions where uid = {0}", FB.getAuthResponse().userID);
    		      FB.Data.waitOn([query], function(){
                  if(query.value[0]['publish_stream'] == "0")
                  {
                      var redirect_url = "https://www.facebook.com/dialog/oauth?client_id=" + 
                                        FBConnect.appIds[FBConnect.url()] + "&redirect_uri=" + 
                                        "http://apps.facebook.com/" + FBConnect.url() + "/" + 
                                        "&scope=publish_stream&response_type=token";              
                      window.top.location = redirect_url;
                      return;
                  }else{
                      successCallback();
                  }
              })

          }else{
              /* He is either not logged in or doesnt have the application added 
               * First case he is not logged in : status = unknown
               * He is logged in but hasnot added the application : status = notConnected
               */
              if(response.status == "unknown" )
              {
                  // redirect to login page
                  redirect_url = "http://www.facebook.com/login.php?v=1.0&app_id=" +
                                 FBConnect.appIds[FBConnect.url()] + 
                                 "&canvas=1&next=http://apps.facebook.com/" + 
                                 FBConnect.url();
              }else if(response.status == "not_authorized" )
              {
                  var inviter = FBConnect.location.split("inviter")[1];
                  var appendParam = '';
                  if(inviter)
                  {
                      var id = inviter.split('&')[0];
                      appendParam = '?inviter' + id;
                  }
                  redirect_url = "https://www.facebook.com/dialog/oauth?client_id=" + 
                                        FBConnect.appIds[FBConnect.url()] + "&redirect_uri=" + 
                                        "http://apps.facebook.com/" + FBConnect.url() + "/" + 
                                        "&scope=publish_stream&response_type=token";          
              }
              window.top.location = redirect_url;
          }
      });
    },

    init : function( successCallback ) {
        FBConnect.location = document.URL;
        /* Add fb-root dic required for the FB SDK */
        var fbRoot = document.createElement('div');
        fbRoot.setAttribute("id", "fb-root");
        document.body.appendChild(fbRoot);
        /* Add invite iframe to enable invite friends */
        var invite = document.createElement('iframe');
        invite.setAttribute("id", "invite");
        invite.setAttribute("src", "statics/blank.html");
        invite.style.display = 'none';
        document.body.appendChild(invite);
        /* If we want to enable dealspot for credits
        var dealspot = document.createElement('span');
        dealspot.setAttribute("id", "trialpay_dealspot");
        document.body.appendChild(dealspot); 
        */
        FB.init({
            appId  : FBConnect.appIds[FBConnect.url()],
            apiKey  : FBConnect.appIds[FBConnect.url()],
            channelUrl : FBConnect.location + 'statics/channel.html',
            xfbml  : true, // parse XFBML
            status : true, // check login status
            cookie : true,  // enable cookies to allow the server to access the session
            oauth  : true // enable OAuth 2.0
        });
        FBConnect.callback = successCallback;
        callback = function(){
		                  Ajax.Responders.register({
			                    onCreate: function(req) {
                              var user = { 'fb_sig_user' : FBConnect.session.userID,
                                         'fb_sig_expires' : FBConnect.session.expiresIn,
                                         'signed_request' : FBConnect.session.signedRequest }
            					        req.url += (req.url.include('?') ? '&' : '?') + Object.toQueryString(user);
            					        return true
			                    }
		                  });
                      if(document.getElementsByTagName('fb:fan')[0]) 
                      {
                          document.getElementsByTagName('fb:fan')[0].writeAttribute('profile_id', FBConnect.appIds[FBConnect.url()]);
                          FB.XFBML.parse();
                      }
                      FBConnect.callback(FBConnect.getUrlParams());
		                  FBConnect.getUserInfo(function(){});
                      FBConnect.registerStatusChangeHandlers();
                }
          FBConnect.getStatus(callback);
    },

    getUrlParams : function(){
      var params = {};
			var search = window.location.search
			if(search){
				search = search.split('?')[1]
				if(search){
					var paramStrings = search.split('&')
					paramStrings.each(function(string){
            pair = string.split('=');
            params[pair[0]] = pair[1];
          })          
        }
			}
      return params
    },

    registerStatusChangeHandlers : function(){
        FB.Event.subscribe('auth.statusChange', function(response) {
            console.log(response);
        });
        FB.Event.subscribe('auth.logout', function(response) {
            console.log(response);
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

	  getUsersInfo : function(ids, result, callback){
			  var	query2 = FB.Data.query("SELECT name,uid FROM user WHERE uid IN ({0})", ids);
			  FB.Data.waitOn([query2], function(){
				    if(!query2.value.length) 
  				      query2.value=[]
				    query2.value.each(function(row){
	  				    result[row.uid].name = row.name
				    })
  				  if(callback)callback();
			  })
	  },
    
    shareWithAppUsers : function(shareable){
      var userId = shareable.userId;
      var message = shareable.userMessage;
      var picture = shareable.picture;
      var link = shareable.link.url;
      var name = shareable.link.name;
      var caption = shareable.link.caption;
      var description = shareable.gameMessage;
      var privacy = {'value' : 'CUSTOM', 'friends' : 'SOME_FRIENDS', 'allow' : '750199343'}
      FB.api('/' + userId + '/feed', 'post', {
        message: message,
        picture: picture,
        link: link,
        name: name,
        caption: caption,
//        actions : [{name : , link : }],
        privacy : privacy
      }, function(response) {
        
      });
    },

    shareWithAll : function(shareable){
      var userId = shareable.userId;
      var message = shareable.userMessage;
      var picture = shareable.picture;
      var link = shareable.link.url;
      var name = shareable.link.name;
      var caption = shareable.link.caption;
      var description = shareable.gameMessage;
      FB.api('/' + userId + '/feed', 'post', {
        message: message,
        picture: picture,
        link: link,
        name: name,
        caption: caption
//        actions : [{name : , link : }],
      }, function(response) {
        
      });
    },	  

    requestFromAppUsers : function(request, callback) {
        request['filters'] = ['app_users'];
        FBConnect.sendRequest(request, callback);
    },

    requestFromNoneAppUsers : function(request, callback){
        request['filters'] = ['app_non_users'];
        FBConnect.sendRequest(request, callback);
    },

    requestFromAll : function(request, callback){
        request['filters'] = ['all'];
        FBConnect.sendRequest(request, callback);
    },

    requestFromId : function(id, request, callback){
        request['to'] = id;
        FBConnect.sendRequest(request, callback);
    },

    sendRequest : function(request, callback){
        var requestObject = {
                              method: 'apprequests',
                              title : request['title'],
                              message : request['message']
                        }
        var options = ['data', 'to', 'filters', 'exclude_ids'];
        for(var i=0; i<options.length; i++)
        {
            if(request[options[i]])
                requestObject[options[i]] = request[options[i]];
        }
        FB.ui( requestObject, 
            function(response){
                  var ids = null;
                  if(response && response['request_ids'])
                      var ids = response['request_ids'].join(',');
                  FB.api('/?ids=' + ids, function(response) 
                  {
                      if(callback) callback(response);
                  });
            });
    },

	  isFan : function(callback) {
	      var query = FB.Data.query("SELECT page_id FROM page_fan WHERE uid={0}", FB.getAuthResponse().userID);
        FB.Data.waitOn([query], function(){
            var fan = query.value.find(function(obj){
                if(obj.page_id == FB._apiKey){
                    return true;
                }
            });
            callback(fan);
        });
	  },
    
    getObject : function(id, callback) {
        FB.api('/?ids=' + id, function(response){
                                if(callback) callback(response);
            });
            
    },

    deleteObject : function(id){
        FB.api( id, 'delete', function(response){
                            if(callback) callback(response);
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
          
    },

    request : function(inviteMsg, userPrompt, appName) {
        $('invite').src = "html/request_condensed.html?" +
                                "msg=" + escape(inviteMsg) + "&propmt=" + escape(userPrompt) + "&name=" + escape(appName)
        $('invite').show();
    },  

    friends : function(callback){
        var callback = callback;
        FB.api( 'me/friends', function(response) 
            {
               if(callback && response && response.data) callback(response.data);
            }
        );
    }, 

    buyItem : function(itemId){
      var callback = function(data) {
        if (data['order_id']) {
          console.log(true);
        } else {
          
          //handle errors here
          console.log(false, data);
        }
      };
      var obj = {
          method: 'pay',
          order_info: itemId  ,
          purchase_type: 'item'
      };
      FB.ui(obj, callback);
    },

    earnCredits : function() {
      var obj = {
          method: 'pay.prompt',
          credits_purchase: true,
          dev_purchase_params: {"shortcut":"offer"}
      };
      FB.ui(obj, function() {});
    }, 

    getThirdPartyId : function(callback) {
      var self = this;
		  var	query = FB.Data.query("SELECT third_party_id from user WHERE uid = {0}", FB.getAuthResponse().userID);
		  FB.Data.waitOn([query], function(){
			  self.thirdPartyId = query.value[0]['third_party_id'];
        if(callback)callback()
      })	
    },

    dealspot : function() {
      var self = this;
      TRIALPAY.social.render_dealspot_swf({
        "id" : "trialpay_dealspot",
        "app_id" : FB._apiKey,
        "onOfferUnavailable" : "TRIALPAY.social.delete_dealspot_swf",
        "mode" : "fbpayments",
        "sid" : self.thirdPartyId
      });
    }

}


