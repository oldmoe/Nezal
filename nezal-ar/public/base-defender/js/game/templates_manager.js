var TemplatesManager = Class.create({
  initialize : function(network){
    var templatesRootNode = document.createElement('div');
    network.fetchTemplate( "templates/templates.html", function(responseText){
      templatesRootNode.innerHTML = responseText;
      network.fetchTemplate( "templates/quests.html", function(responseText){
        templatesRootNode.innerHTML += responseText;
        templatesRootNode.select('textarea').each(function(node){
          node.setAttribute('id', node.getAttribute('id') + "-template");
        });
        /* Fetch the locale based file for texts .. 
           Should be inhanced to get the user locale and fetch the appropriate file accordingly 
        */
      });
    });
    
    document.body.appendChild(templatesRootNode.hide());
  },

  load : function(name, params){
    return TrimPath.processDOMTemplate(name + "-template", params);
  }
});
