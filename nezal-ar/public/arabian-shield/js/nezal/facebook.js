var FBConnect = {

    appIds : {
      "local-arabian-shield" : {id : "323491894330124", redirectPath : "http://127.0.0.1:4000/fb-games/"},
      "arabian-shield" : {id : "179518805477513", redirectPath : "http://games.nezal.com:11500/fb-games/"}
    },
    
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

    userId : function(){
        return FBConnect.session.userID;
    },    

    getStatus : function(successCallback) {
        FB.getLoginStatus(function(response) {
          FB.Canvas.setSize({height:860});
          if (response.status == "connected") {
              FBConnect.session = response.authResponse;
              var query = FB.Data.query("SELECT publish_stream FROM permissions where uid = {0}", FB.getAuthResponse().userID);
              // FB.Data.waitOn([query], function(){
                  // if(query.value[0]['publish_stream'] == "0")
                  // {
                      // var redirect_url = "https://www.facebook.com/dialog/oauth?client_id=" + 
                                        // FBConnect.appIds[FBConnect.url()].id + "&redirect_uri=" + 
                                        // FBConnect.appIds[FBConnect.url()].redirectPath + FBConnect.url() + "/" + 
                                        // "&scope=publish_stream&response_type=token";              
                      // window.top.location = redirect_url;
                      // return;
                  // }else{
                      successCallback();
                  // }
              // })

          }else{
              /* He is either not logged in or doesnt have the application added 
               * First case he is not logged in : status = unknown
               * He is logged in but hasnot added the application : status = notConnected
               */
              if(response.status == "unknown" )
              {
                  // redirect to login page
                  redirect_url = "http://www.facebook.com/login.php?v=1.0&app_id=" +
                                 FBConnect.appIds[FBConnect.url()].id + "&canvas=1&next=" 
                                 + FBConnect.appIds[FBConnect.url()].redirectPath + FBConnect.url();
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
                                        FBConnect.appIds[FBConnect.url()].id + "&redirect_uri=" + 
                                        FBConnect.appIds[FBConnect.url()].redirectPath + FBConnect.url() + "/" + 
                                        "&response_type=token";          
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
            appId  : FBConnect.appIds[FBConnect.url()].id,
            apiKey  : FBConnect.appIds[FBConnect.url()].id,
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
                              var trackingCode = FBConnect.getUrlParams()['tc']
                              if (trackingCode) {
                                user['Trackingcode'] = trackingCode
                              }
                              req.url += (req.url.include('?') ? '&' : '?') + Object.toQueryString(user);
                              return true
                          }
                      });
                      if(document.getElementsByTagName('fb:fan')[0]) 
                      {
                          document.getElementsByTagName('fb:fan')[0].writeAttribute('profile_id', FBConnect.appIds[FBConnect.url()].id);
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
                                FBConnect.user['uid'] = FBConnect.user['id'];
                                callback();                                      
                            });
        }else {
          callback(FBConnect.user);
        }
    },

    getUsersInfo : function(ids, callback){
        var query = FB.Data.query("SELECT uid, pic_square, name, first_name, last_name, profile_url FROM user WHERE uid IN ({0})", ids);
        FB.Data.waitOn([query], function(){
            if(!query.value.length) query.value=[]
            if(callback)callback(query.value);
        })
    },
    
    shareWithAppUsers : function(shareable){
      var userId = shareable.userId;
      var message = shareable.userMessage;
      var picture = shareable.picture;
      var link = shareable.link.url;
      var name = shareable.link.name;
      var caption = shareable.link.caption;
      var description = shareable.link.description;
      var privacy = {'value' : 'CUSTOM', 'friends' : 'SOME_FRIENDS', 'allow' : '750199343'}
      FB.api('/' + userId + '/feed', 'post', {
        message: message,
        picture: picture,
        link: link,
        name: name,
        caption: caption,
        description : description
//        actions : [{name : , link : }],
//        privacy : privacy
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
        description : description,
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
    
    getAppRequests : function(callback){
      FB.api( "/me/apprequests", function(response){
        callback( response['data'] );
      } )
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
                      ids = response['request_ids'].join(',');
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

    deleteObject : function(id, callback){
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
    
    friends : function(callback){
        var callback = callback;
        FB.api( 'me/friends', function(response) 
            {
               if(callback && response && response.data) callback(response.data);
            }
        );
    }, 

    friendsAppUsers : function(callback){
        var callback = callback;
        var query = FB.Data.query("SELECT uid, pic_square, name, first_name, last_name, profile_url FROM user" + 
                            " WHERE is_app_user=1 and (uid IN (SELECT uid2 FROM friend WHERE uid1 = {0}) or uid={0})", FB.getAuthResponse().userID);
        FB.Data.waitOn([query], function(){
            if(!query.value.length) query.value=[]
            if(callback && query.value) callback(query.value);
        });
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
      var query = FB.Data.query("SELECT third_party_id from user WHERE uid = {0}", FB.getAuthResponse().userID);
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
