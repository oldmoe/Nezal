var DomConverter = Class.create({
  initialize : function(){
    $$("body")[0].insert("<div id='dom_converter' style='display:none;'></div>");
  },
  
  convert : function(htmlSnippet){
    $('dom_converter').innerHTML = htmlSnippet;
  },
  getHTML : function(child){
    $('dom_converter').innerHTML = '';
    $('dom_converter').appendChild(child);
    return $('dom_converter').innerHTML
  }
});