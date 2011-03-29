var AttackManager = Class.create({
	noOfCreeps : 3,
	creepsDone :0,	
	attacking : false,
	initialize: function(game){
		this.creeps = {}
    var self = this;
		this.game = game;
    $("sendAttack").stopObserving("click");
    $("sendAttack").observe(game.mouseClickEvent, function(){
		Sounds.play(Sounds.gameSounds.click)
      	self.simulateAttack();
		$('attackDiv').show()
    });
	},
	simulateAttack : function(){
		if(this.attacking) return
		var creepsHash = {} 
		this.attacking = true
		for(var i=0;i<this.noOfCreeps;i++){
			var creep = this.game.creepFactory.newCreep("Car")
			this.creeps[creep.coords.x+ ":"+creep.coords.y] = creep
			creepsHash[creep.coords.x+ ":"+creep.coords.y] = "Car"
		}
		this.game.network.simulateAttack(creepsHash);
	},
	notifyDoneAttack : function(){
		this.creepsDone++
		var attackSuccess = false
		if(this.creepsDone == this.noOfCreeps){
			$('attackDiv').hide()
			for (creep in this.creeps) {
				console.log(this.creeps[creep].tickCounter)
			}
			for(creep in this.creeps){
				console.log(this.creeps[creep].tickCounter)
				if(this.creeps[creep].attacked){
					attackSuccess = true
					break
				}				
			}
			this.creeps = {}
			this.creepsDone = 0
			this.attacking = false
			if(attackSuccess){
				this.showRepairMsg()
			}else{
				this.showDefendCongratsMsg()
			}
		}	
	},
	showRepairMsg : function(){
		Notification.repair("You Have been attacked, Click repair to start repairing your buildings")
	},
	showDefendCongratsMsg : function(){
		Notification.notify("You have successfully defended your city")
	}
	
})
