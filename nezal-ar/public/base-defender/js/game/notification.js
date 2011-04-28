var Notification = Class.create({
  game : null,
  
  initialize : function(game){
    this.game = game;
  },
  
  showAll : function(){
    var self = this;
    var notificationsHTML = "";
    this.game.user.data.notifications.queue.each(function(notification){
	      notificationsHTML += self.game.templatesManager.load("notification",
                               {notificationMessage : notification.text, id : notification.id});
	   					   
    });
    $('gameContainer').insert(notificationsHTML);
    this._AttachNotificationsAckTriggers();
  },
  
  _AttachNotificationsAckTriggers : function(){
    $$('.notification_ok').each(function(button){
      button.observe('click', function(){
        self.game.network.notificationAck( this.id );
        this.parentNode.remove();
      });
    });
  }
});

Notification.alert = function(message){
  $("alert").innerHTML = game.templatesManager.load("alert", {message : message});
  $('alert').hide()
  Animation.show("alert")
  $('interaction').show();
}
Notification.notify = function(message){
	$("notify").innerHTML = game.templatesManager.load("alert", {message : message});
	$("notify").hide()
	$('interaction').show();
	Animation.show("notify")
}
Notification.repair = function(message){
	$("notify").innerHTML = game.templatesManager.load("repair", {message : message});
	$("notify").hide()
	$('interaction').show();
	Animation.show("notify")
}
Notification.attackNotification = function(msg){
	$("notify").innerHTML = game.templatesManager.load("attackNotification", {msg : msg});
	$("notify").hide()
	$('interaction').show();
	Animation.show("notify")
	
}
