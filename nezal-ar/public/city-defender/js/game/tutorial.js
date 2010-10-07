var Tutorial = Class.create({
	count: 0 ,
	initialize: function(scene,ctx){
		this.scene = scene
		this.scene.money = 60
		this.tutorialScene = new Scene(50)
		this.tutorialLayer = new Layer(ctx);
		this.tutorialLayer.clear = true
		this.tutorialScene.layers.push(this.tutorialLayer)
		var self =this
		var arr = ['Splash','Heal','Hyper','Weak','Nuke']
		this.tutorialScene.start()
		$$('#gameElements .superWeapons div').each(function(div){
			div.hide()
		})
		this.content = $$('#modalWindow .innerContent').first()
		this.ok = $$('#modalWindow #ok').first()
		this.step1()
	},
	hide : function(){
		$('modalWindow').hide()
	},
	step1 : function(){
		$('modalWindow').show()
		this.viewMessage(0)
		var self = this
		this.ok.observe('click',function(){
			self.ok.stopObserving('click')
			self.viewMessage(1)
			self.ok.observe('click',function(){
				self.ok.stopObserving('click')
				self.viewMessage(2)
				self.ok.observe('click',function(){
					self.viewMessage(3)
					self.ok.stopObserving('click')
					self.ok.observe('click',self.hide)
					self.placeTower()
				})
			})
		})
	},
	viewMessage: function(num){
		$('modalWindow').hide();	
		Effect.Appear('modalWindow',{duration:0.5});
		this.content.innerHTML = window.Text.game.tutorial['msg'+(num+1)]
	},
	
	placeTower: function(){
		this.ok.hide()
		this.validate = GhostTurret.validate
		GhostTurret.validate =function(){			
			GhostTurret.valid = true
			if((this.xGrid!=5||this.yGrid!=4)){
				GhostTurret.valid = false
			}
		}
		var anim = this.addArrowAnim(505,130)
		anim2 = this.addArrowAnim(500,400)
		var self = this
		$$('.towers .Turret').invoke('observe','click', function(){self.step2(this,anim,anim2)})
		
	},
	
	step2 : function(div,anim,anim2){
		$$('.towers .Turret').first().stopObserving('click')
		$$('.towers .Turret').first().observe('click',function(){
			GhostTurret.select(this)
		})
		$('modalWindow').show()
		anim.finish()
		anim2.finish()
		GhostTurret.select(div)
		var self = this
		self.ok.stopObserving('click')
		self.ok.observe('click',self.hide)
		self.viewMessage(4)					
		anim.finish()					
		anim = self.addVerticalArrowAnim(152,30)
		self.droppingGroundClick = GhostTurret.droppingGroundClick
		GhostTurret.droppingGroundClick = tutorialGroundClicked
		function tutorialGroundClicked(e){
			if(e.x){
				var x = Math.floor(e.layerX/32)
				var y = Math.floor(e.layerY/32)
			}else{
				var x = Math.floor(e.x/32)
				var y = Math.floor(e.y/32)
			}
			GhostTurret.validate(x, y);
			if(GhostTurret.valid){
				anim2 = self.addVerticalArrowAnim(50,350)
				GhostTurret.droppingGroundClick = self.droppingGroundClick
				self.droppingGroundClick(e)
				GhostTurret.validate = self.validate
				anim.finish()
				self.viewMessage(5)
			}
		}
		
		$$('#gameElements .start').first().observe('click', function(){self.startAttack(anim,anim2)})
		
	},
	startAttack : function(anim,anim2){
		this.ok.show()
		anim.finish()
		anim2.finish()
		$('modalWindow').hide()
		$$('#gameElements .start').first().stopObserving('click')
		$$('#gameElements .startText').first().innerHTML = "Playing"
		this.scene.sendWaves(this.scene.config)
	},
	initiateSuperWeapon : function(){
		var anim = this.addArrowAnim(440,130)
		var self = this
		this.scene.reactor.pause()
		$('modalWindow').show()
		this.viewMessage(6)
		this.ok.hide()
		$$('#gameElements .superWeapons .splash').first().show()
		$$('#gameElements .superWeapons .splash').first().observe('click', function(){self.fireSuperWeapon("splash",anim)})
	},
	fireSuperWeapon : function(weapon,anim){
		$('modalWindow').hide()
		this.scene.reactor.resume()
		anim.finish()
		this.scene.fire(weapon)
		var self = this	
		
	},
	planesAttack : function (){
		this.ok.show()
		$('modalWindow').show()
		var self = this
		self.viewMessage(8)
		self.scene.reactor.pause()
		self.ok.stopObserving('click')
		self.ok.observe('click',function(){self.scene.reactor.resume();self.hide()})
	},
	wishLuck : function (){
		this.ok.show()
		$('modalWindow').show()
		var self = this
		self.viewMessage(9)
		self.scene.reactor.pause()
		self.ok.stopObserving('click')
		self.ok.observe('click',function(){
			self.scene.reactor.pause()
			//self.scene.promoteUser()
			//$('popupClose').observe('click',function(){
			//	$('popup').hide()
				self.hide();Intro.newbieNoMore()
				$("gameStart").innerHTML = Intro.templates['game'];
			//})
			//$('popupOk').observe('click',function(){
			//	$('popup').hide()
			//	self.hide();Intro.newbieNoMore()
			//	$("gameStart").innerHTML = Intro.templates['game'];
			//})
			
		})
	},
	upgradeTower : function (){
		var self = this
		self.scene.reactor.pause()
		$('modalWindow').show()
		self.ok.stopObserving('click')
		self.ok.show()
		self.ok.observe('click',function(){self.scene.reactor.resume();self.hide()})
		self.viewMessage(7)
	},
	waveEffect : function (){
		$('modalWindow').show()
		var self = this
		self.viewMessage(10)
		self.scene.reactor.pause()
		self.ok.stopObserving('click')
		self.ok.observe('click',function(){
			self.scene.reactor.resume();
			self.hide()
			self.scene.push(120,function (){game.tutorial.initiateSuperWeapon()})
		})
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
	messages : ["Welcome to the academy of defense.</br>"
	+"</br>During this training period, you will get all the required information, and gain the basic skills that are needed to defend your city against any hostile activities. </br>"
	,"</br>Your goal is to kill all coming waves of enemy units and prevent them from passing to your city </br>",
	"You can always see your current rank at the top right of the map </br>"
	+"</br>The upper bar indicates your rank progress, the wave number, your score in this game and the remaining enemy units to escape that indicate your loss</br>",
	"Now it is time to place some towers. Click on the Belcher tower in the towers box.</br>"
	+"Notice that the tower information will be visible in the information box.",
	"Click on the highlighted area to place the tower. ",
	"Place more towers as long as you have enough gold. then press start to begin the battle",
	"You can always use super weapons on demand. ",
	"click on a tower to see it's abilities, sell or upgrade it",
	"Finally, there is an important hint you need to know before finishing this training. Air units do not respect any path, they simply fly over anything.",
	"That is it soldier, you are now ready to defend your city against any hostile activities. I am sure you will do your best to complete all missions assigned to you."
	+"</br>Do not forget to like us and bookmark  us to get a nice reward. Good Luck.",
	"After each wave enemies get stronger, so prepare yourself well"]
	
})
