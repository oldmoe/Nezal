var KConnect = {

    KON : null,

    init : function(callback) {
        // Load the API
        kongregateAPI.loadAPI( function (){
            // Set the global kongregate API object
            if(KConnect.KON == null)
            {
                KConnect.KON = kongregateAPI.getAPI();
            }
            KConnect.KON.services.connect();
            var isGuest = KConnect.KON.services.isGuest();
            if ( isGuest == false ) {
                var uid = KConnect.KON.services.getUserId();
                var authToken = KConnect.KON.services.getGameAuthToken();
                console.log(uid, authToken)
                Ajax.Responders.register({
                    onCreate: function(req) {
		                    req.url += (req.url.include('?') ? '&' : '?') + Object.toQueryString( {'uid' : uid, 'session_key' :authToken })
		                    return true
                    }
                });
                callback();
            }else{
                KConnect.KON.services.addEventListener("login", KDefender.init);
                KConnect.KON.services.showSignInBox();
            }
        });
    },
    
	  getUsersInfo : function(ids, result, callback){
			if(callback)callback()
	  },
  
}

