var Mission = {

  adminUrl : 'nezal-admin',

  currMission : {},
  
  id : null,

  initialize : function(){
    Mission.currMission.data = gameData;
    var levelLoader = new LevelLoader();
    
    this.id = parseInt(window.location.toString().split('?')[1].split('&')[0].split('=')[1]);
    this.game = window.location.toString().split('?')[1].split('&')[1].split('=')[1];
    $$('#controls .saveButton')[0].stopObserving('click');
		$$('#controls .saveButton')[0].observe('click', function(){ Mission.saveToServer(); });
    new Ajax.Request( '/' + this.adminUrl + "/" + this.game + '/missions/' + this.id + '.json' , {
       method : 'get',
       onSuccess : function(response){
          Mission.currMission = JSON.parse(response.responseText);
          var levelLoader = new LevelLoader();
       }
    });
  },

  saveToServer : function(){
    var data = levelEditor.dataExporter.exportData();
    if(Mission.currMission == null)
      Mission.currMission = {};
      
    Mission.currMission.data = data;
    new Ajax.Request( '/' + this.adminUrl + "/" + this.game + '/missions/' + this.id + '.json' , {
                      method : 'put',
                      parameters : { "data" : JSON.stringify(Mission.currMission) },
                      onSuccess : function(response){
                        Mission.showSuccessMsg();
                        // Mission.initialize();
                      },
                      onFailure : function(response){
                        Mission.showErrorMsg();
                      }
                     
                 });    
  },

  showSuccessMsg : function(){
    $('saveReqStatus').innerHTML = "Saved successfully"
    $('saveReqStatus').className = "success"
    $('saveReqStatus').show();
    window.setTimeout( function(){$('saveReqStatus').hide()}, 5000 )
  },

  showErrorMsg : function(){
    $('saveReqStatus').innerHTML = "Error, your changes are not saved!"
    $('saveReqStatus').className = "error"
    $('saveReqStatus').show();
    window.setTimeout( function(){$('saveReqStatus').hide()}, 10000 )
  }


}
