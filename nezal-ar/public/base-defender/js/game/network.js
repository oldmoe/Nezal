var Network = Class.create({
  initializeGame : function(callback){
    new Ajax.Request('metadata', {
      method : 'get',
      //asynchronous : false,
      onSuccess: function(response) {
        var gameStatus = JSON.parse(response.responseText);
        if(callback) callback( gameStatus );
      }
    });
  },
  
  contactTheBoss : function(params, callback){
    var done = true;
    var gameStatus = null;
    new Ajax.Request('metadata', {
      method : 'post',
      //asynchronous : false,
      parameters: { 'data' : Object.toJSON(params)},
      onSuccess: function(response) {
        gameStatus = JSON.parse(response.responseText);
        userProfile = gameStatus.user_data.metadata;
        if (userProfile['error']) {
          Notification.alert("Something went wrong, message : " + userProfile['error']);
          done = false;
        }
        if(callback) callback({'done' : done, 'gameStatus' : gameStatus});
      }
    });
  },
  
  genericPostRequest : function(request, params, callback){
    var done = true;
    var gameStatus = null;
    new Ajax.Request(request, {
      method : 'post',
      //asynchronous : true,
      parameters: { 'data' : Object.toJSON(params)},
      onSuccess: function(response) {},
      onComplete: function() {
        if(callback) callback();
      }
    });
    return {'done' : done, 'gameStatus' : gameStatus};
  },
  neighbourEmpire : function(user_id, callback){
    new Ajax.Request('generic', {
      method : 'get',
      //asynchronous : false,
      parameters: { 'data' : Object.toJSON({'user_id' : user_id, 'request' : 'neighbor_empire'})},
      onSuccess: function(response) {
        userData = JSON.parse(response.responseText).user_data;
        if(callback) callback( userData );
      }
    });
  },
  
  generate_creep :function(data, callback){
    this.genericPostRequest('generate_creep',data, callback)
  },
  cancel_creep_generation: function(data, callback){
    this.genericPostRequest('cancel_creep_generation',data, callback)
  },
  
  neighbourIDs : function(callback){
    new Ajax.Request('generic', {
      method : 'get',
      //asynchronous : false,
      parameters: { 'data' : Object.toJSON({'request' : 'friends'})},
      onSuccess: function(response) {
        IDs = JSON.parse(response.responseText);
        if(callback) callback(IDs);
      }
    });
  },
  
  globalMap : function(friendIds, callback){
    new Ajax.Request('global_map', {
      method : 'get',
      //asynchronous : false,
      parameters: {data: Object.toJSON({
        'friend_ids': friendIds
      })},
      onSuccess: function(response) {
         var users = JSON.parse(response.responseText);
         callback(users);
      }
    });
  },
  performNeighborAction : function(data, callback){
    var url = data['url'] || '';
    new Ajax.Request( 'neighbor' + '/' + url, {
      method : 'post',
      //asynchronous : false,
      parameters: { 'data' : Object.toJSON(data)},
      onSuccess: function(response) {
        userData = JSON.parse(response.responseText).user_data;
        if(callback) callback(userData);
      }
    });
  },

  resetEmpire : function(){
    new Ajax.Request('users/reset', {
      method : 'post',
      onSuccess: function(response) {
        window.location = window.location
      }
    });
  },
  
  notificationAck : function(id, callback){
    this.contactTheBoss({ 'event' :'notification_ack', 'id' : id }, callback);
  },
  
  upgradeBuilding : function(name, coords, callback){
    return this.contactTheBoss({ 'event' :'upgrade', 'building' : name, 'coords' : coords }, callback);
  },
	
	moveBuilding : function(name, coords, oldCoords, callback){
    return this.contactTheBoss({ 'event' :'move', 'building' : name, 'coords' : coords, 'oldCoords': oldCoords }, callback);
  },
  
  buyWorker : function(callback){
    return this.contactTheBoss({ 'event' :'buy_worker'}, callback);
  },
  
  useReward : function(rewardId, callback){
    return this.contactTheBoss({ 'event' :'use_reward','id':rewardId}, callback);
  },
  
  assignWorker : function(name, coords, callback){
    return this.contactTheBoss({ 'event' :'assign_worker', 'building' : name, 'coords' : coords }, callback);
  },
  
  collectResources : function(name, coords, callback){
		if(!game.neighborGame)
      return this.contactTheBoss({ 'event' :'collect_resources', 'building' : name, 'coords' : coords }, callback);
		else 	
      return this.performNeighborAction({ 'url' : 'building/collect', 'building' : name, 'coords' : coords, 'user_id':game.visitedNeighborId }, callback);
  },

	simulateAttack : function(creeps, callback){
		if(!game.neighborGame)
			return this.contactTheBoss({ 'event' : 'attack','creeps': creeps}, callback);
		else 	
			return this.contactTheBoss({ 'event' : 'attack','creeps': creeps ,'user_id':game.visitedNeighborId}, callback);
	},
	
	repairBuildings : function(callback){
		return this.contactTheBoss({ 'event' : 'repair_buildings'}, callback);
	},
  
  startResearch :function(researchName, callback){
    return this.contactTheBoss({ 'event' : 'start_research', name : researchName}, callback);
  },
  
  cancelResearch :function(researchName, callback){
    return this.contactTheBoss({ 'event' : 'cancel_research', name : researchName}, callback);
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
