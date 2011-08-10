var TsquareScene = Class.create(Scene,{
	laneMiddle : 57,
  tileWidth : 80,
  energy : 0,
  maxEnergy : 30,
  conversationOn : false,
  coords: {x:200,y:10},
  moveBack : false,
  moving : false,
  beatMoving : false,
	initialize: function($super,game){
		$super(game)
    this.network = new Network()
    this.crowdMembers = []
    this.npcs = []
		this.width = 760
		this.height = 550
		this.createRenderLoop('skyline',1)
    this.createRenderLoop('characters',2)
    this.xPos = 0
    this.speed = 1
    this.moving = false
    var self = this
    this.bubbles = []
    this.inObstacles = []
    this.inCrowdMembers = []
    this.inScenarios = []
    this.inEvents = []
    //this.network.fetchTemplate('missions/1.json',function(response){
      self.data = gameData.data
      self.noOfLanes = self.data.length
      for(var i =0;i<self.data.length;i++){
        self.inObstacles[i] = []
        self.inCrowdMembers[i] = []
        self.crowdMembers[i] = []
        for(var j=0;j<self.data[i].length;j++){
          var elem = self.data[i][j] 
          if(elem.name=='block')self.inObstacles[i].push({'name':elem.name, x:elem.x*self.tileWidth,y:self.laneMiddle*2*i+self.laneMiddle})
          else if(elem.name=='crowd')self.inCrowdMembers[i].push({'name':elem.name, x:elem.x*self.tileWidth,y:i})
          else if(elem.name=='scenario')self.inScenarios.push({'name':elem.name, x:elem.x*self.tileWidth,y:self.laneMiddle*2*i+self.laneMiddle, "scenario":
          elem.scenario})
        }
      }
      self.inEvents = gameData.events
    //})
    this.obstacles = []
	},
  addNpcs : function(){
    var rand = Math.random()
    if(rand < 0.0001){
      var direction = Math.randomSign()
      var x = 0
      if(direction==-1)x = this.width
      var y = this.laneMiddle + Math.round(Math.random()*(this.noOfLanes-1))*this.laneMiddle*2
      var npc = this.addObject({name:'npc','x':x,y:y, 'options':{direction:direction}})
      this.npcs.push(npc)
    }
    var self = this
    this.reactor.push(10,function(){self.addNpcs()})
  },
  addCrowdMember : function(x,laneNumber){
   var crowdMember = new CrowdMember(this,x,laneNumber*this.laneMiddle*2+this.laneMiddle)
   var crowdMemberDisplay = new CrowdMemberDisplay(crowdMember)
   this.crowdMembers[laneNumber].push(crowdMember)
   this.pushToRenderLoop('characters',crowdMemberDisplay)
  },
	tick : function($super){
    $super()
    var self = this
    if (this.moving) {
      if(this.moveBack)this.xPos -= this.speed
      else this.xPos += this.speed
    }
    this.checkObstacles()
    //this.checkNpcs()
    //this.checkScenarios()
    this.checkCrowdMembers()
    //this.checkEvents()
    this.tickObjects(this.npcs)
    this.crowdMembers.each(function(laneCrowdMembers){self.tickObjects(laneCrowdMembers)})
    this.obstacles.each(function(laneObstacles){self.tickObjects(laneObstacles)})
  },
  checkEvents : function(){
    for(var i=0;i<this.inEvents.length;i++){
        if(this.energy>=this.inEvents[i].energy){
          this.showMsg(this.inEvents[i].message)
          this.inEvents.splice(i,1)
        }
     }
  },
  showMsg : function(msg){
    $$('#modalWindowMsg #contents')[0].innerHTML =  msg
    $('modalWindowMsg').show()
    this.reactor.pause()
  },
  resumeGame : function(){
    $('modalWindowMsg').hide()
    this.reactor.resume()
  },
  checkScenarios : function(){
    var firstConversation = this.inScenarios[0]
    if(firstConversation && firstConversation.x == this.xPos){
      new Scenario(this,firstConversation.scenario)
      this.inScenarios.splice(0,1)
    }    
  },
  checkCrowdMembers : function(){
    for (var i = 0; i < this.crowdMembers.length; i++) {
      for (var j = 0; j < this.crowdMembers[i].length; j++) {
         if(this.crowdMembers[i][j].dead){
           this.crowdMembers[i][j].destroy()
           this.crowdMembers[i].splice(j, 1)
           j--
         }  
      }
    }
    for(var i=0;i<this.inCrowdMembers.length;i++){
      for(var j=0;j<this.inCrowdMembers[i].length;j++){
        if (this.inCrowdMembers[i][j].x < this.xPos + this.width) {
          this.addCrowdMember(this.inCrowdMembers[i][j].x, this.inCrowdMembers[i][j].y)
          this.inCrowdMembers[i].splice(0, 1)
          j--;
        }
        else {
          break
        }
      }
    }
  },
  checkNpcs : function(){
    var self = this
    var remainingObjects = []
    this.npcs.each(function(obj){
      if(obj.coords.x>=0 && obj.coords.x <=self.width && !obj.dead) remainingObjects.push(obj)
      else obj.destroy()        
    })
    this.npcs = remainingObjects
  },
  checkObstacles : function(){
    var remainingObstacles = []
    for(var i=0;i<this.obstacles.length;i++){
      remainingObstacles[i] = []
      for (var j = 0; j < this.obstacles[i].length; j++) {
        if (this.obstacles[i][j].coords.x > 0 && !this.obstacles[i][j].dead) 
          remainingObstacles[i].push(this.obstacles[i][j])
        else {
          this.obstacles[i][j].destroy()
        }
      }
    }
    this.obstacles = remainingObstacles
    for (var i = 0; i < this.inObstacles.length; i++) {
      if(!this.obstacles[i]) this.obstacles[i] = []
      for (var j = 0; j < this.inObstacles[i].length; j++) {
        if (this.inObstacles[i][j].x < this.xPos + this.width) {
          this.obstacles[i].push(this.addObject(this.inObstacles[i][j]))
          this.inObstacles[i].splice(0, 1)
          j--;
        }
        else {
          break;
        }
      }
    }
  },
  addObject : function(objHash){
     var klassName = objHash.name.capitalize()
     var klass = eval(klassName)
     var obj = new klass(this,objHash.x - this.xPos,objHash.y,objHash.options)
     var displayKlass =eval(klassName+"Display") 
     var objDisplay = new displayKlass(obj)
     this.pushToRenderLoop('characters',objDisplay)
     return obj
  },
  addBubble : function(crowdMemberIndex,laneNumber, msg){
    var crowdMember = this.crowdMembers[laneNumber][crowdMemberIndex]
    var bubble = new Bubble(this,crowdMember.coords.x,crowdMember.coords.y,msg)
    this.bubbles.push(bubble) 
    var bubbleDisplay = new BubbleDisplay(bubble)
  },
  tickObjects : function(objects){
    try{
			var remainingObjects = []
			var self = this
			objects.each(function(object){
				if(!object.finished){
					object.tick()
					remainingObjects.push(object)
				}
			})
			objects = remainingObjects
		}catch(x){//console.log(x)
		}
		return this
  },
	init: function(){
    this.createEnergyBar()
    this.canvasWidth = $('gameCanvas').getWidth()
    this.canvasHeight = $('gameCanvas').getHeight()
		this.skyLine = new SkyLine(this)
    this.movementManager = new MovementManager(this)
    this.addNpcs()
	},
  createEnergyBar : function(){
    var self = this
    var energySprite = new DomMeterSprite(this,{styleClass:{empty:'energyEmpty',full:'energyFull'},shiftZ:1000,
    width : 350,
    shiftX : 100,
    'meterFunc': function(){
      return self.energy/self.maxEnergy
    }})
    this.pushToRenderLoop('characters',energySprite)
  },
  startMove : function(commandIndex,noOfTicks){
    if(this.conversationOn) return
    var moves = {forward:0,backward:1,rotating:2}
    var collision = this.detectCollisions()
    if(commandIndex == moves.forward){
      this.moveBack = false
      if(collision){
        this.moving = false
        return
      }else{
        this.moving = this.beatMoving = true    
      }
    }else if(commandIndex == moves.backward){
        this.moveBack = true
        this.moving = this.beatMoving = true
    }else if(this.commandIndex == moves.rotating){
      collision.crowd.rotate(collision.obstacle)
    }
    var self = this
    if (commandIndex == moves.forward || commandIndex == moves.backward) {
      this.reactor.push(noOfTicks, function(){
        self.beatMoving = false
        self.energy += 3
      })
    }
  },
  detectCollisions : function(){
    for(var i=0;i<this.crowdMembers.length;i++){
      for(var j=0;j<this.crowdMembers[i].length;j++){
        for (var k = 0; k < this.obstacles[i].length; k++) {
          if (this.crowdMembers[i][j].coords.x + this.crowdMembers[i][j].imgWidth > this.obstacles[i][k].coords.x) {
            this.moving = false
            return {
              crowd: this.crowdMembers[i][j],
              obstacle: this.obstacles[i][k]
            }
          }
        } 
      }
    }
    return null
  }
  
});