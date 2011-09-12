var EnemyDisplay = Class.create(Display,{

    hoveringIcons: {march: "march.png", circle: "circle.png", push: "push.png", hold: "lock.png"},
    
    initialize : function($super,owner){
        $super(owner) 
    },
    
    setHoveringIcon: function(icon){
      this.hoverIcon = Loader.images.hoveringIcons[icon]
    },

    switchHoveringIcon: function(icon){
      this.sprites.hoverIcon.replaceImg(Loader.images.hoveringIcons[icon].clone());
    }

});