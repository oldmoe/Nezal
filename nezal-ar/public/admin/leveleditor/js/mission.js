var Mission = {

  adminUrl : 'nezal-admin/',

  currMission : null,
  
  id : null,

  initialize : function(){
    this.id = parseInt(window.location.toString().split('?')[1].split('=')[1]);
    $$('#controls .saveButton')[0].stopObserving('click');
		$$('#controls .saveButton')[0].observe('click', function(){ Mission.saveToServer(); });
    new Ajax.Request( '/' + this.adminUrl + '/missions/' + this.id + '.json' , {
       method : 'get',
       onSuccess : function(response){
          Mission.currMission = JSON.parse(response.responseText);
          var levelLoader = new LevelLoader();
       }
    });
  },

  saveToServer : function(){
    var data = levelEditor.dataExporter.exportData();
    this.currMission.data = data;
    new Ajax.Request( '/' + this.adminUrl + '/missions/' + this.id + '.json' , {
                      method : 'put',
                      parameters : { "data" : JSON.stringify(Mission.currMission) },
                      onSuccess : function(response){
                        Mission.showSuccessMsg();
                        Mission.initialize();
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
