var AttackManager = Class.create({
	noOfCreeps : 6,
	creepsDone :0,	
	attacking : false,
	initialize: function(game){
		this.creeps = []
    var self = this;
		this.game = game;
    $("sendAttack").stopObserving("click");
    $("sendAttack").observe(game.mouseClickEvent, function(){
		Sounds.play(Sounds.gameSounds.click);
      	self.simulateAttack();
		$('attackDiv').show();
    });
	},
	simulateAttack : function(){
		if(this.attacking) return
		var creepsArr = [] 
		this.attacking = true
		for(var i=0;i<this.noOfCreeps;i++){
			var creep = this.game.creepFactory.newCreep("Car",i)
			this.creeps.push({'x':creep.coords.x,'y':creep.coords.y, 'creep':creep})
			creepsArr.push({'x':creep.coords.x,'y':creep.coords.y,'type':"Car"})
		}
		this.game.network.simulateAttack(creepsArr);
	},
	notifyDoneAttack : function(){
		this.creepsDone++
		var attackSuccess = false
		if(this.creepsDone == this.noOfCreeps){
			$('attackDiv').hide()
			for(var i=0;i<this.creeps.length;i++){
				console.log(this.creeps[i].creep.tickCounter)
				if (this.creeps[i].creep.attacked) {
					attackSuccess = true
					break
				}	
			}
			
			this.creeps = []
			this.creepsDone = 0
			this.attacking = false
			if(attackSuccess){
					console.log('!!!!!!!')
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
