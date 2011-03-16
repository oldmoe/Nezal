var Network = Class.create({
  initializeGame : function(){
    var gameStatus = null;
    new Ajax.Request('metadata', {
      method : 'get',
      asynchronous : false,
      onSuccess: function(response) {
        gameStatus = JSON.parse(response.responseText)
      }
    });
    return gameStatus;
  },
  
  contactTheBoss : function(params){
    var done = true;
    var gameStatus = null;
    new Ajax.Request('metadata', {
      method : 'post',
      asynchronous : false,
      parameters: { 'data' : Object.toJSON(params)},
      onSuccess: function(response) {
        gameStatus = JSON.parse(response.responseText);
        userProfile = gameStatus.user_data.metadata;
        if (userProfile['error']) {
          Notification.alert("The server refused to do your action, what have you did?, ya la2eem ;), message : " + userProfile['error']);
          done = false;
        }
      }
    });
    return {'done' : done, 'gameStatus' : gameStatus};
  },
  
  neighbourEmpire : function(user_id){
    var userData = {};
    new Ajax.Request('generic', {
      method : 'get',
      asynchronous : false,
      parameters: { 'data' : Object.toJSON({'user_id' : user_id, 'request' : 'neighbor_empire'})},
      onSuccess: function(response) {
        userData = JSON.parse(response.responseText).user_data;
      }
    });
    return userData;
  },
  
  neighbourIDs : function(){
    var IDs = [];
    new Ajax.Request('generic', {
      method : 'get',
      asynchronous : false,
      parameters: { 'data' : Object.toJSON({'request' : 'friends'})},
      onSuccess: function(response) {
        IDs = JSON.parse(response.responseText);
      }
    });
    return IDs;
  },


  resetEmpire : function(){
    new Ajax.Request('users/reset', {
      method : 'post',
      onSuccess: function(response) {
        window.location = window.location
      }
    });
  },
  
  notificationAck : function(id){
    this.contactTheBoss({ 'event' :'notification_ack', 'id' : id });
  },
  
  upgradeBuilding : function(name, coords){
    return this.contactTheBoss({ 'event' :'upgrade', 'building' : name, 'coords' : coords });
  },
	
	moveBuilding : function(name, coords, oldCoords){
    return this.contactTheBoss({ 'event' :'move', 'building' : name, 'coords' : coords, 'oldCoords': oldCoords });
  },
  
  buyWorker : function(){
    return this.contactTheBoss({ 'event' :'buy_worker'});
  },
  
  assignWorker : function(name, coords){
    return this.contactTheBoss({ 'event' :'assign_worker', 'building' : name, 'coords' : coords });
  },
  
  collectResources : function(name, coords){
    return this.contactTheBoss({ 'event' :'collect_resources', 'building' : name, 'coords' : coords });
  },

	simulateAttack : function(creeps){
		return this.contactTheBoss({ 'event' : 'attack','creeps': creeps})	
	},
	
	repairBuildings : function(){
		return this.contactTheBoss({ 'event' : 'repair_buildings'})
	},
	
  fetchTemplate : function(path, callBack){
    new Ajax.Request(path, {
      method : 'get',
      asynchronous : false,
      onSuccess: function(response) {
        callBack(response.responseText);
      }
    })
  }
});
