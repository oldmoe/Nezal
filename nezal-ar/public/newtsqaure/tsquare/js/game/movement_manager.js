var MovementManager = Class.create({
  UP : 0, DOWN : 1,
  move : [],
  movements : [],
  direction : 0,
  ticksPassed : 0,
  totalMoveTicks : 0,
  moveLength : 0,
  beatAccelaration : 0,
  lastMoveClicked : false,
  beatDelay : 15,
  moves : {march:{code:[0,0,0,0],index:0},retreat:{code:[1,1,1,1],index:1},circle:{code:[0,1,0,1],index:2}, hold:{code:[2],index:3}},  
  beatMoving: false,
  comboStart: false,
  currentCombos: 0,
  
  initialize : function(scene){
    this.scene = scene
    this.registerListeners()
    this.playSounds()
    this.scene.push(this)
  },

  playSounds : function(){
   if(this.ticksPassed > this.nextTick+10){
      this.reset()
   } 
   this.nextTick = this.beatDelay-this.beatAccelaration
   Sounds.play(Sounds.gameSounds.beat)
   var self = this
   $('beatFlash').show()
   var fadeDuration = (this.nextTick - 3)*this.scene.reactor.delay / 1000
   this.scene.reactor.push(0,function(){new Effect.Fade('beatFlash',{duration: fadeDuration})})
   this.scene.reactor.push(this.nextTick,function(){self.playSounds()})
  },
  
  reset : function(){
    this.move = [];
    this.beatMoving = false;
    this.comboStart = false;
    this.currentCombos = 0
    this.beatAccelaration = 0
    this.ticksPassed = 0
    this.scene.fire('wrongMove')
  },
  
  tick : function(){
    if(this.beatMoving){
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
      if(self.beatMoving){
        self.reset()
      }else if(self.scene.currentSpeed > 0){
        self.scene.comboStart = true
      }
      var click = -1
      if (e.keyCode == 39) {
        click = 0
      }else if (e.keyCode == 37) {
          click = 1
      }else if (e.keyCode == 32) {
          click = 2
      }
       if(click!=-1 && self.ticksPassed >= self.nextTick-10 && self.ticksPassed <= self.nextTick+10){		
            console.log('=')
      		  self.move.push(click)
      		  self.moveLength++
      }else if(self.ticksPassed <  self.nextTick-10){
            console.log('<')
            self.reset()
            self.moveLength = 1
      		  self.move = [click]
            self.totalMoveTicks =0
      }else if(self.ticksPassed > self.ticksPassed <= self.nextTick+10){
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
        self.beatAccelaration = 0
        self.playSounds(0,0)
      }else if(e.keyCode == 50){
        self.beatAccelaration = 0
        self.playSounds(1,0)
      }else if(e.keyCode == 51){
        self.beatAccelaration = 0
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
    var command = null
    for(var move in this.moves){
      var found = true
      var code = this.moves[move].code
      command = move
      for (var i = 0; i < self.moveLength; i++) {
       if (self.move[i] != code[i]) {
         found = false
         break
       }
     }
     if(found){
       break
     }
   }
   if(!found){
     self.reset()
     return
   }
   var code = this.moves[command].code
   if(code.length==self.move.length){
     this.move=[]
     this.startMove(this.moves[command].index,self.nextTick*code.length)
     this.moveLength = 0
     Sounds.play(Sounds.gameSounds.correct_move)
   }
  },
  
  startMove : function(commandIndex,noOfTicks){
//    if(this.conversationOn) return
    var collision = this.scene.detectCollisions()
    if(commandIndex == this.moves.march.index){
        if(this.scene.currentSpeed == 0)this.scene.increaseEnergy()
        this.scene.fire('march')
        if(collision){
          this.scene.decreaseEnergy()
          return
        }else{
          this.beatMoving = true    
        }
    }else if(commandIndex == this.moves.retreat.index){
        this.scene.fire('retreat')
    }else if(commandIndex == this.moves.circle.index){
        this.scene.fire('circle')
    }else if(commandIndex == this.moves.hold.index){
        this.scene.fire('hold')
    }

    var self = this
    this.scene.reactor.push(noOfTicks, function(){
      self.moveEnd()
    })
    
  },

  moveEnd : function(){
    if(this.comboStart){
        this.comboStart= false
        this.combos++
        if(this.beatAccelaration<9)this.beatAccelaration+=2
        this.currentCombos++ 
        this.scene.fire('comboSuccess')
        //this.createNextFollower()
      }
      this.beatMoving = false
  }
  
});
