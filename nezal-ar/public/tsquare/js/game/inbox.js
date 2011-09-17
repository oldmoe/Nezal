var Inbox = Class.create({
  requests : {help : [], gift : [], challenge : []},
  
  initialize : function(game){
    this.network = game.network;    
    this.templateManager = game.templateManager;
    $('send_requests').innerHTML = this.templateManager.load('send_requests');
    this.requestTrigger("help");
    this.requestTrigger("gift");
    this.requestTrigger("challenge");
    this.getInboxRequests();
  },
  
  requestTrigger : function(requestType){
    $("request_" + requestType + "_button").observe("click", function(event){
      var request = {};
      request['data'] = {type : requestType};
      request['message'] = "Can you please " + requestType + " me?";
      request['title'] = requestType + " me!"
      socialEngine.requestFromAll( request, function(response){
        //Here we should contact the server to save the request details, for exclusion and timeout conditions
        console.log( response );
      } )
    })
  },
  
  getInboxRequests : function(){
    var self = this;
     socialEngine.getAppRequests(function(requests){
       requests.each(function(request){
         var data = JSON.parse( request.data )
         console.log(request)
         self.requests[ data.type ].push( request );
       });
       $('inbox').innerHTML = self.templateManager.load('inbox', { inbox : self});
     });
  }
});
