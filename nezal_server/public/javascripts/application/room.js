var Room = {

  process : function(data) {
    var roomEvents = document.getElementById('event');
    roomEvents.setAttribute('class' , "" );
    roomEvents.innerHTML = data.user + " " + data.data  + " the room ";
    window.setTimeout("Room.hideEvent()", 5000);
  },
  
  hideEvent : function() {
    var roomEvents = document.getElementById('event');
    roomEvents.setAttribute('class' , "invisible" );
  },
    
}
