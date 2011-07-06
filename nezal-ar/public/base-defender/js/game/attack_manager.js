var AttackManager = Class.create({
	noOfCreeps : 0,
	creepsDone :0,	
	attacking : false,
  stolenResources : {},
	initialize: function(game){
		this.creeps = []
    var self = this;
		this.game = game;
		//if (this.game.user.data.notifications) {
		if (!this.game.neighborGame) {
			this.showAttackNotifications()
		}
		//}
    $("sendAttack").stopObserving("click");
    $("sendAttack").observe(game.mouseClickEvent, function(){
		Sounds.play(Sounds.gameSounds.click);
      	self.simulateAttack();
		    $('attackDiv').show();
    });
	},
	simulateAttack : function(attackDirection,creeps){
		if(this.attacking) return
    if(!game.neighborGame) creeps = game.user.data.creeps
    this.stolenResources = {}
		var creepsArr = [] 
		this.attacking = true
    var creepId = 0
    this.noOfCreeps =0
    for(var c in creeps){
      var noOfCreeps = creeps[c]
      for(var i=0;i<noOfCreeps;i++){
			  var creep = this.game.creepFactory.newCreep(c.capitalize(),creepId++,attackDirection)
        this.noOfCreeps++
			  this.creeps.push({'x':creep.coords.x,'y':creep.coords.y, 'creep':creep})
			  creepsArr.push({'x':creep.coords.x,'y':creep.coords.y,'type':c.capitalize()})
		  } 
    }
		this.game.network.simulateAttack(creepsArr);
    
	},
	notifyDoneAttack : function(stolenResources){
		this.creepsDone++
    if(stolenResources)this.addStolenResources(stolenResources)
		var attackSuccess = false
		if(this.creepsDone == this.noOfCreeps){
			$('attackDiv').hide()
			for(var i=0;i<this.creeps.length;i++){
				if (this.creeps[i].creep.attacked) {
					attackSuccess = true
					break
				}	
			}
			
			this.creeps = []
			this.creepsDone = 0
			this.attacking = false
			if(attackSuccess){
			    if(this.game.neighborGame) this.showAttackSuccessMsg()
				else this.showRepairMsg()
			}else{
				if(this.game.neighborGame) this.showAttackFailMsg()
				this.showDefendCongratsMsg()
			}
		}	
	},
	showAttackNotifications : function(){
		var notifications = this.game.user.data.notifications.queue.findAll(function(n){
				return n['type'] == 'attack';
			});
			if (notifications) {
				notifications.each(function(notification){
					attacker_id = notification.data.attacker_id
					result = []
					result[attacker_id] = { "index" : 0 };
					serviceProvider.getUsersInfo([attacker_id], result, function(){
						if (result[attacker_id].name) {
							notification.text = TrimPath.parseTemplate(notification.text).process({
								name: result[attacker_id].name
							})
							Notification.attackNotification({
								text: notification.text,
								id: notification.id
							})
						}
					})
				})
			}		
	},
	showRepairMsg : function(){
		Notification.repair("You Have been attacked, Click repair to start repairing your buildings")
	},
	showDefendCongratsMsg : function(){
		Notification.notify("You have successfully defended your city")
	},
	showAttackSuccessMsg : function(){
		Notification.notify("Well done! you ate him.")
	},
	showAttackFailMsg : function(){
		Notification.notify("Attack failed, try again later.")
	},
  addStolenResources : function(resources){
    for(var resource in resources){
      if(!this.stolenResources[resource]){
        this.stolenResources[resource] = 0
      }
      this.stolenResources[resource]+=resources[resource]
    }
  }
})
