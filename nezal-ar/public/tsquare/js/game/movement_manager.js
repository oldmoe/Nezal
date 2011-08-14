var MovementManager = Class.create({
  moves : [[0,0,0,0],[1,1,1,1],[0,1,0,1],[1,1,1,1]],
  UP : 0, DOWN : 1,
  move : [],
  movements : [],
  turnOn : false,
  ticksPassed : 0,
  totalMoveTicks : 0,
  moveLength : 0,
  extraSpeed : 0,
  lastMoveClicked : false,
  moveSpeed : 15,
  initialize : function(scene){
    this.scene = scene
    this.registerListeners()
    this.playSounds()
    this.scene.push(this)
  },
  
  playSounds : function(){
   if(this.ticksPassed > this.nextTick+5){
      this.reset()
   } 
   this.nextTick = this.moveSpeed-this.extraSpeed
    Sounds.play(Sounds.gameSounds.beat)
    var self = this
    this.scene.reactor.push(this.nextTick,function(){self.playSounds()})
  },
  reset : function(){
    this.turnOn = false
    this.move = []
    this.scene.moving = false
    this.scene.beatMoving = false
    this.scene.comboStart = false
    this.scene.currentCombos = 0
    this.scene.speed = 3
    if(this.scene.energy > 0)this.scene.energy-=this.scene.energyIncrease
    this.extraSpeed = 0
    this.ticksPassed = 0
  },
  tick : function(){
    if(this.scene.beatMoving){
      this.ticksPassed = 0
      return
    }
    this.ticksPassed++
    this.totalMoveTicks++  
  },
  
  registerListeners  : function(){
    var self = this
    document.stopObserving('keydown')
    document.observe('keydown', function(e){
      if(self.scene.beatMoving){
        self.scene.moving = false
        self.scene.beatMoving = false
        self.reset()
      }else if(self.scene.moving){
        self.scene.comboStart = true
      }
      var click = -1
      if (e.keyCode == 39) {
        click = 0
      }
      else if (e.keyCode == 37) {
          click = 1
        }
      if(!self.turnOn) self.turnOn = true
      console.log(self.ticksPassed, self.nextTick)
       if(click!=-1 && self.ticksPassed >= self.nextTick-5 && self.ticksPassed <= self.nextTick+5){		
            console.log('=')
      		  self.move.push(click)
      		  self.moveLength++
      }else if(self.ticksPassed <  self.nextTick-5){
            console.log('<')
            self.reset()
            self.moveLength = 1
      		  self.move = [click]
            self.totalMoveTicks =0
      }else if(self.ticksPassed > self.ticksPassed <= self.nextTick+5){
            console.log('>')
            self.reset()
            self.moveLength = 1
			      self.move = [click]
            self.totalMoveTicks =0
      }else{
            alert('!!!')            
      }
      self.checkMove()
      self.ticksPassed = 0
  		if(e.keyCode == 49){
        self.extraSpeed = 0
        self.playSounds(0,0)
      }else if(e.keyCode == 50){
        self.extraSpeed = 0
        self.playSounds(1,0)
      }else if(e.keyCode == 51){
        self.extraSpeed = 0
        self.playSounds(2,0)
      }
		})
  },
  getNextMoveIndex : function(){
    return 0
  },
  checkMove : function(){
  	var index = 0
    var found = false
    var moveIndex = this.getNextMoveIndex()
    var self = this
    var found  = false
    var moveIndex = 0
   for (moveIndex = 0; moveIndex < this.moves.length; moveIndex++) {
     var m = this.moves[moveIndex]
     found = true
     for (var i = 0; i < self.moveLength; i++) {
       if (self.move[i] != m[i]) {
         found = false
         break
       }
     }
     if(found){
       break
     }
   }
   console.log(this.move)
   if(!found){
     self.reset()
     return
   }
   var m = this.moves[moveIndex]
   if(m.length==self.move.length){
     this.move=[]
     this.moveLength = 0
     this.scene.startMove(moveIndex,self.nextTick*m.length)
     Sounds.play(Sounds.gameSounds.correct_move)
   }
  }
});
