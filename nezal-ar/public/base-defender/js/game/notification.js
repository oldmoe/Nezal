var Notification = Class.create({
  game : null,
  
  initialize : function(game){
    this.game = game;
  },
  
  showAll : function(){
    var self = this;
    var notifications = this.game.user.data.notifications.queue;
    var notificationsHTML = "";
    notifications.each(function(notification){
      notificationsHTML += self.game.templatesManager.notification(notification.text, notification.id);
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
  $("alert").innerHTML = game.templatesManager.alert(message);
  $("alert").show();
  $('interaction').show();
}
Notification.notify = function(message){
	$("notify").innerHTML = game.templatesManager.alert(message);
  $("notify").show();
	$('interaction').show();
}
Notification.repair = function(message){
	if(Notification.repairShown) return 
	Notification.repairShown = true
	$("notify").innerHTML = game.templatesManager.notifyRepair(message);
  $("notify").show();
	$('interaction').show();
}
