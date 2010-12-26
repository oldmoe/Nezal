var TemplatesManager = Class.create({
  initialize : function(network){
    var templatesRootNode = document.createElement('div');
    
    network.fetchTemplate( "templates/templates.html", function(responseText){
      templatesRootNode.innerHTML = responseText;
      templatesRootNode.select('textarea').each(function(node){
        node.setAttribute('id', node.getAttribute('id') + "-template");
      });
    } );
    
    document.body.appendChild(templatesRootNode.hide());
  },
  
  buildingRemainingTime : function(time){
    return TrimPath.processDOMTemplate("building-remaining-time-template", {'remainingTime' : time});
  },
  
  //TODO change the function params to JSON
  townhallPanel : function(townhallName, buildingInProgress, coins){
    return TrimPath.processDOMTemplate("townhall-panel-template", {'townhallName' : townhallName, 'buildingInProgress' : buildingInProgress, 'coins' : coins});
  },

  //TODO change the function params to JSON
  resourceBuildingPanel : function(building){
    return TrimPath.processDOMTemplate(building.name + "-panel-template", {'building' : building});
  },
  
  //TODO change the function params to JSON
  resourceAmountInGamePanel : function(amount, resourcePerMinute){
    return TrimPath.processDOMTemplate("resource-amount-display-template", {'amount' : amount, 'resourcePerMinute' : resourcePerMinute});
  },
  
  friendRecord : function(friendId, serviceId, friendName){
    return TrimPath.processDOMTemplate("friend-record-template", {'friendId' : friendId, 'serviceId' : serviceId, 'friendName' : friendName});
  },
  
  notification : function(text, id){
    return TrimPath.processDOMTemplate("notification-template", {'notification_message' : text, 'id' : id});
  },

  questsList : function(questsList){
    return TrimPath.processDOMTemplate("quests-list-template", {'questsList' : questsList});
  }

});
