var Event = {
  
  url : "" ,

  fetch : function(){
    new Ajax.Request( this.url, { 
      method:'get', 
      onSuccess: function(transport, json){
        for(var i=0; i< json.length; i++){
          if(json[i]["type"]=="chat")
          {
            Chat.process(json[i]);
          }else if (json[i]["type"]=="room"){
            Room.process(json[i]);
          }else if (json[i]["type"]=="game"){
            game.process(json[i]);
          }
        }
        window.setTimeout("Event.fetch()", 5000);
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
