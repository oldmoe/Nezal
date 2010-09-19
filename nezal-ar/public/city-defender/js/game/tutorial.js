var Tutorial = Class.create({
	count: 0 ,
	initialize: function(scene,ctx){
		this.scene = scene
		this.scene.money = 30
		this.tutorialScene = new Scene(50)
		this.tutorialLayer = new Layer(ctx);
		this.tutorialLayer.clear = true
		this.tutorialScene.layers.push(this.tutorialLayer)
		this.tutorialScene.start()
		this.content = $$('#modalWindow .content').first()
		this.ok = $$('#modalWindow #ok').first()
		this.step1()
	},
	step1 : function(){
		$('modalWindow').show()
		this.viewMessage(0)
		var self = this
		var next = false
		function scroll(){
			self.content.scrollTop +=2			
			if(self.content.scrollTop<490&&!next)self.scene.push(100,scroll)
		}
		this.scene.push(50,scroll)
		this.ok.observe('click',function(){
		next = true
		self.placeTower()
		self.viewMessage(1)
		self.ok.stopObserving('click')
		/*
			self.viewMessage(1);
			self.ok.stopObserving('click')
			self.ok.observe('click',function(){
				self.ok.stopObserving('click')
				self.viewMessage(2)
				self.ok.observe('click',function(){
					self.ok.stopObserving('click')
					self.viewMessage(3)
					var anim = self.addArrowAnim(440,40)		
					self.ok.observe('click',function(){
						self.ok.stopObserving('click')
						anim.finish()
						self.viewMessage(4)
						self.ok.observe('click',function(){
							self.ok.stopObserving('click')
							
						})
					})				
				})
			})
			*/
		})
	},
	viewMessage: function(num){
		new Effect.Appear(this.content,{duration:0.5});
		this.content.innerHTML = this.messages[num]
	},
	
	placeTower: function(){
		this.validate = GhostTurret.validate
		GhostTurret.validate =function(x, y, tower){			
			GhostTurret.valid = true
			if((x!=4||y!=4)){
				GhostTurret.valid = false
			}
		}
		var anim = this.addArrowAnim(490,130)
		anim2 = this.addArrowAnim(490,400)
		var self = this
		$$('.towers .Turret').invoke('observe','click', function(){self.step2(this,anim,anim2)})
		
	},
	
	step2 : function(div,anim,anim2){
		anim.finish()
		anim2.finish()
		GhostTurret.select(div)
		var self = this
		$('modalWindow').show()
		self.ok.stopObserving('click')
		self.viewMessage(2)					
		anim.finish()					
		anim = self.addVerticalArrowAnim(100,50)
		$('droppingGround').observe('click',function(e){
			var x = Math.floor(e.layerX/32)
			var y = Math.floor(e.layerY/32)
			GhostTurret.validate(x, y);
			if(GhostTurret.valid){
				GhostTurret.validate = self.validate
				anim.finish()
				self.viewMessage(3)
			}
		})
		
		$$('.towers .tower1').invoke('stopObserving','click')
		$$('#gameElements .start').first().observe('click', function(){self.step3(anim)})
		
	},
	step3 : function(anim){
		if(this.count == 1){
			var anim = this.addArrowAnim(440,150)
			var self = this
			this.scene.pause()
			$('modalWindow').show()
			this.viewMessage(4)
			$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){div.observe('click', function(){self.step4(div.className,anim)})}
			})
		} else{
			anim.finish()
			$('modalWindow').hide()
			$$('#gameElements .start').first().stopObserving('click')
			this.scene.startAttack()
			this.count ++;
			this.tutorialScene.push(10000,this.step3, this)
		}
	},
	step4 : function(weapon,anim){
		$('modalWindow').hide()
		this.scene.resume()
		anim.finish()
		this.scene.fire(weapon)
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){div.stopObserving('click')}
		})
		this.scene.money = 120
		this.viewMessage(11)
		var self = this
		$$('#gameElements .upgrades .upgrade.next').invoke('observe', 'click', function(){self.step5(anim)})	
		$$('#gameElements .upgrades .upgradeItem').invoke('observe', 'click', Upgrades.select)
		
	},
	step5 : function(anim){
		anim.finish()
		Upgrades.upgrade()
		Intro.newbieNoMore(); 											//after tutorial is done
		$$('#gameElements .upgrades .upgrade.next').invoke('stopObserving', 'click')	
		$$('#gameElements .upgrades .upgradeItem').invoke('stopObserving', 'click')			

	},
	addArrowAnim : function(x,y){
		var anim = new ArrowAnimation(x, y)
		this.tutorialLayer.attach(anim)
		this.tutorialScene.objects.push(anim)
		return anim
	},
	addVerticalArrowAnim : function(x,y){
		var anim = new VerticalArrowAnimation(x, y)
		this.tutorialLayer.attach(anim)
		this.tutorialScene.objects.push(anim)
		return anim
	},
	messages : ["</br></br></br></br></br>Welcome RANK NAME to the academy of defense.</br>"
	+"</br>During this training period, you will get all the required information, and gain the basic skills that are needed to defend your city against any hostile activities. </br>"
	+"</br></br>Your goal is to kill all coming waves of enemy units and prevent them from passing to your city </br>"
	+"</br></br>You can always see your current rank at the top right of the map </br>"
	+"</br></br>The upper bar indicates your rank progress, the wave number, your score in this game and the remaining enemy units to escape that indicate your loss</br>",
	"</br></br>Now it is time to place some towers. Click on the Belcher tower in the towers box.</br>"
	+"Notice that the tower information are now visible in the information box.",
	"Click here to place the tower. ",
	"Place more towers as long as you have enough gold. then press start to begin the battle",
	"You can always use super weapons on demand. ",
	"As a tower kills more enemy units, it gets auto promotion that makes it stronger.",
	"Finally, there is an important hint you need to know before finishing this training. Air units do not respect any path, they simply fly over anything.",
	"That is it soldier, you are now ready to defend your city against any hostile activities. I am sure you will do your best to complete all missions assigned to you.",
	"Do not forget to like us and bookmark  us to get a nice reward. Good Luck."]
	
})
