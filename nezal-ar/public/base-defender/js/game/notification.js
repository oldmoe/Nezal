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
      //console.log(self.game.templatesManager.notification(notification.text, notification.id));
    });
    $('gameContainer').insert(notificationsHTML);
    this._AttachNotificationsAckTriggers();
  },
  
  _AttachNotificationsAckTriggers : function(){
    $$('.notification_ok').each(function(button){
      button.observe('click', function(){
        self.game.network.notificationAck( this.id );
        $("" + this.id).parentNode.hide();
      });
    });
  }
  
});