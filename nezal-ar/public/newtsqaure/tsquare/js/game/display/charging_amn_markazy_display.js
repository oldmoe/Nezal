var ChargingAmnMarkazyDisplay = Class.create(AmnMarkazyDisplay,{
    
  initialize : function($super,owner){
      $super(owner) 
  },
  
  createHoveringIcon: function(){
    this.hoverIcon = Loader.images.icons['lock.png']
  }


})
