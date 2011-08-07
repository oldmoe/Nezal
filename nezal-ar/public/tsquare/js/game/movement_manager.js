var MovementManager = Class.create({
  moves : [[0,0,0,0],[1,1,1,0],[0,1,0,1],[1,1,1,1]],
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
    this.scene.reactor.push(this.moveSpeed-this.extraSpeed,function(){self.playSounds()})
  },
  reset : function(){
    this.turnOn = false
    this.move = []
    this.scene.moving = false
    this.extraSpeed = 0
    this.ticksPassed = 0
  },
  tick : function(){
    if(this.scene.moving){
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
      if(self.scene.moving){
        self.scene.moving = false
        self.reset()
      }
      var click = -1
      if (e.keyCode == 38) {
        click = 0
      }
      else if (e.keyCode == 40) {
          click = 1
        }
      if(!self.turnOn) self.turnOn = true
       if(click!=-1 && self.ticksPassed >= self.nextTick-5 && self.ticksPassed <= self.nextTick+5){
      				self.move.push(click)
      			  self.moveLength++
      }else if(self.ticksPassed < 2){
              self.reset()
              self.moveLength = 1
      				self.move = [click]
              self.totalMoveTicks =0
      }else if(self.ticksPassed > 14){
              self.extraSpeed = 0
              self.reset()
              self.moveLength = 1
      			  self.move = [click]
              self.totalMoveTicks =0
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
    var m = this.moves[moveIndex]
    console.log(self.move)
  	for(var i=0;i<self.moveLength;i++){
  		if(self.move[i]!=m[i]){
        self.moveLength = 0
        self.totalMoveTicks = 0
  			self.move = []
        self.extraSpeed = 0
  			self.turnOn = false
  			return
  		}
  	}
    if(m.length==self.move.length){
     this.move=[]
     this.moveLength = 0
     this.scene.startMove(moveIndex,self.nextTick*m.length)
     Sounds.play(Sounds.gameSounds.correct_move)
    }
  }
});
