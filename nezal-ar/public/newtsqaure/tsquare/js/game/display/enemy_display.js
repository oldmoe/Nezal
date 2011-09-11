var EnemyDisplay = Class.create(Display,{

    hoveringIcons: {march: "march.png", circle: "circle.png", push: "push.png", hold: "lock.png"},
    
    initialize : function($super,owner){
        $super(owner) 
    },

    switchHoveringIcon: function(icon){
        this.sprites.hoverIcon.replaceImg(Loader.images.icons[icon]);
    }

});