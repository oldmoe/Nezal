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
          Notification.alert("Something went wrong, message : " + userProfile['error']);
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
  
  globalMap : function(friendIds){
    var user = null
    new Ajax.Request('global_map', {
      method : 'get',
      asynchronous : false,
      parameters: {data: Object.toJSON({
        'friend_ids': friendIds
      })},
      onSuccess: function(response) {
         users = JSON.parse(response.responseText);
      }
    });
    return users;
  },
  performNeighborAction : function(data){
    var userData = {};
    var url = data['url'] || '';
    new Ajax.Request( 'neighbor' + '/' + url, {
      method : 'post',
      asynchronous : false,
      parameters: { 'data' : Object.toJSON(data)},
      onSuccess: function(response) {
        userData = JSON.parse(response.responseText).user_data;
      }
    });
    return userData;
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
  
  useReward : function(rewardId){
    return this.contactTheBoss({ 'event' :'use_reward','id':rewardId});
  },
  
  assignWorker : function(name, coords){
    return this.contactTheBoss({ 'event' :'assign_worker', 'building' : name, 'coords' : coords });
  },
  
  collectResources : function(name, coords){
		if(!game.neighborGame)
      return this.contactTheBoss({ 'event' :'collect_resources', 'building' : name, 'coords' : coords });
		else 	
      return this.performNeighborAction({ 'url' : 'building/collect', 'building' : name, 'coords' : coords, 'user_id':game.visitedNeighborId });
  },

	simulateAttack : function(creeps){
		if(!game.neighborGame)
			return this.contactTheBoss({ 'event' : 'attack','creeps': creeps})
		else 	
			return this.contactTheBoss({ 'event' : 'attack','creeps': creeps ,'user_id':game.visitedNeighborId})
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
