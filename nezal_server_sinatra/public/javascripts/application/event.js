var Event = {
  
  url : "" ,

  fetch : function(){
    new Ajax.Request( this.url, { 
      method:'get', 
      onComplete : function(){
        Event.fetch();
      },
      onSuccess: function(transport, json){
        for(var i=0; i< json.length; i++){
          if(json[i]["type"]=="chat")
          {
            Chat.process(json[i]);
          }else if (json[i]["type"]=="room"){
            Room.process(json[i]);
          }else if (json[i]["type"]=="game"){
            GameEngine.process(json[i]);
          }
        }
      }
    });
  },
  
  send : function(eventType, eventData){
    new Ajax.Request( this.url, { 
      method:'post', 
      parameters: {type : eventType, data: eventData},
      onSuccess: function(transport, json){
        if(json.data != eventData)
        {
          Event.error("Error");            
        }
      },
      onFailure: function(){
          Event.error("Error"); 
      }
    });
  },
  
  error :  function( error){
    document.getElementById('errorMsg').innerHTML = "Something went wrong while sending message"
  },

}
