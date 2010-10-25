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
  }
});