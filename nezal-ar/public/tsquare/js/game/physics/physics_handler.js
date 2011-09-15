var PhysicsHandler = Class.create({
    worlds : null,
    tearGasBombs : null,
    initialize : function(scene){
        this.scene = scene
        this.worlds = []
        this.tearGasBombs = []
        this.createWorlds()
        this.ctx = $('physics').getContext('2d')
    },
    createWorlds : function(scene){
       this.scene = scene
       for(var i=0;i<3;i++){
           this.worlds[i] = createWorld();
       } 
    },
    intitializeGrounds : function(){
      createBox(this.worlds[0],100,100,1000,10,false,"bg1")
      createBox(this.worlds[1],100,300,1000,10,false,"bg2")
      createBox(this.worlds[2],100,500,1000,10,false,"bg3")  
    },
    step : function(){
        var self = this
        this.ctx['clearRect'](0, 0, 760, 650);
        for(var i=0;i<3;i++){
           this.worlds[i].Step(1/30, 1);
           drawWorld(this.worlds[i], this.ctx);
           this.worlds[i] = createWorld();
        }
        game.scene.reactor.push(1,function(){self.step()})
    },
    createTearGasBomb : function(object){
        var box = createBox(this.worlds[0],objects.coords.x + object.getWidth(),object.coords.y+
        this.getHeight(),30,5,false,"bomb")
        this.tearGasBombs.push({box:box, obj:object})
    }
    
})
