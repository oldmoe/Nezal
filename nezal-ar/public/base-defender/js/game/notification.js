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

Notification.alert = function(message, OKCallback){
  $("alert").innerHTML = game.templatesManager.load("alert", {message : message});
  $('alert').hide();
  Animation.show("alert");
  $('interaction').show();
  if( OKCallback ){
    $("alertOK").stopObserving("click");
    $("alertOK").observe("click", OKCallback);
  }
}
Notification.prompt = function(message, options){
  $("prompt").innerHTML = game.templatesManager.load("prompt", {message : message});
  $("prompt").hide();
  Animation.show("prompt");
  $('interaction').show();
  if( options.yesCallback ){
    $("promptYes").stopObserving("click");
    $("promptYes").observe("click", options.yesCallback);
  }
  if( options.noCallback ){
    $("promptNo").stopObserving("click");
    $("promptNo").observe("click", options.noCallback);
  }
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
