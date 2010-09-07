//loads images and store them in memory for later use
var rank = 'surgeont'

var Loader = Class.create({
	initialize: function (){
		this.loadedResources =0
	},
	/*
	this method loads the images
		@imageNames 		    array of names of the images for ex: ['tank.png','creep.png']
		path 					the path that contains the images for ex: c:/images/
		onProgress			  	a callback that takes a parameter "progress" and it's called each time an image is loaded
		onFinish				a callback that is called after all images are loaded
	*/
	setLength : function(resources){
		this.currentLength = 0
		var self = this
		resources.each(function(resource){
			Loader.resourceTypes.each(function(type){
				if(resource[type]){
					self.currentLength += resource[type].length
				}
			})
		})
	},	

	load : function(resources, options){
		this.setLength(resources)
		var self = this
		var objects = []
		resources.each(function(resource){
			Loader.resourceTypes.each(function(type){
				if(resource[type]){
					var path = resource.path || type+'/game/'
					var store = resource.store
					var names = resource[type]
					if(!Loader[type][store])Loader[type][store] = {}
					for ( var  i=0 ; i < names.length ; i++ ){
					  if(!Loader[type][store][names[i]]){	
						var src = ''
						src = path + names[i]
						Loader[type][store][names[i]] = self['load_'+type](src, options);
					  }else{
						self.loadedResources++
					  }
					  objects[names[i]] = Loader[type][store][names[i]]
					}
			  if(self.loadedResources == self.currentLength){
			      if(options.onFinish){
				      options.onFinish()
			      }
			      self.loadedResources = 0
		      }	 
				}
			})
		})
		return objects
	},
	onload: function(options){
		this.loadedResources++;
		if(options.onProgress) options.onProgress(Math.round((this.loadedResources/this.currentLength)*100))
		if(this.loadedResources == this.currentLength){
			if(options.onFinish){
				options.onFinish()
			}
			this.loadedResources = 0
		}	
	},
	
	load_images : function(src, options){
		var image = new Image();
		var self = this
		image.onload = function(){self.onload(options);}
		image.src = src
		return image
	},
	
	load_sounds : function(src, options){
		var audio = new Audio();
		audio.onload = this.onload(options);
		audio.src = src
		return audio
	},
	load_animations :function(src,options){
		return this.load_images(src,options)
	}
})
var imageNames = ['humvee_body.png','humvee_tower.png','humvee_tower_in_action.png','tank_body.png','tank_tower.png','tank_tower_in_action.png',
'tank_1_body.png','tank_1_tower.png','tank_1_tower_in_action.png','tank_2_body.png','tank_2_tower.png','tank_2_tower_in_action.png',
'black_tank_body.png','black_tank_tower.png','black_tank_tower_in_action.png','red_tank_body.png','red_tank_tower.png','red_tank_tower_in_action.png'
,'red_air_craft.png','red_air_craft_in_action.png','air_craft_shade.png','air_craft.png','air_craft_in_action.png','tower_base.png','cannon_1.png'
,'cannon_1_in_action.png','rank_1.png','rank_2.png', 'rank_3.png', 'cannon_2.png','cannon_2_in_action_right.png','cannon_2_in_action_left.png',
'patriot_launcher.png','patriot_launcher_in_action_right.png','patriot_launcher_in_action_left.png','patriot_rocket.png','rocket_in_action.png',
'weak.png','rocket_launcher.png','rocket.png']

var bgImages = ['l_shape.png', 'win.png','lose.png','path.png','play_again.png','exit.png','pause.png','start.png','resume.png',
'snow.gif','heal_button.png','heal_button_off.png','splash_button.png','splash_button_off.png','nuke_button.png','nuke_button_off.png',
'hyper_button.png','hyper_button_off.png','weak_button.png','weak_button_off.png','Turret_button.png','DoubleTurret_button.png','Patriot_button.png',
'RocketLauncher_button.png','mystry_button.png','status_bar.png']

var upgradeImages = ['arrow.png','block_upgrade.png', 'bullets_upgrade_1.png','bullets_upgrade_2.png','bullets_upgrade_2_off.png',
              'rockets_upgrade_1.png','rockets_upgrade_2.png','rockets_upgrade_2_off.png',
              'shields_upgrade_1.png','shields_upgrade_2.png','shields_upgrade_2_off.png',
              'purchased_stamp.png','bullets_upgrade_button.png','rockets_upgrade_button.png',
			  'shields_upgrade_button.png','upgrade_button_inactive.png'
			 ]

function imageNumbers(length){
	var arr = []
	for(var i=0; i<length;i++){
		arr[i] = (i+1)+'.png'
	}
	return arr

}
function onFinish(){
	$('gameElements').style.visibility = 'visible'
	$('canvasContainer').style.visibility = 'visible'
	$('rank').style.backgroundImage  = "url("+'images/user/'+rank+'.png'+")"; 
	window.setTimeout(function(){
		Effect.Fade('splashScreen')
		$('gameElements').show();
		$('canvasContainer').show();
		$('static').show();
		$('waitScreen').hide()
		Effect.Fade('static',{duration: 2.0})
	},1000)
}
function loadGameImages(loader){
	try{
		loader.load([{images : imageNames, store :'game'}, {animations: imageNumbers(16), path: 'images/animations/health_point/', store: 'heal'},
		{animations: imageNumbers(15), path: 'images/animations/creep_boom/', store: 'creepBoom'},
		{animations: imageNumbers(12), path: 'images/animations/coins/', store: 'coins'},
		{animations: imageNumbers(19), path: 'images/animations/nuke_boom/', store: 'nuke'},
		{animations: imageNumbers(1), path: 'images/animations/arrow/', store: 'arrow'},
		{animations: imageNumbers(1), path: 'images/animations/vertical_arrow/', store: 'verticalArrow'},
		{images: bgImages, path: 'images/background/', store: 'background'},
		{images: [rank+'.png'], path: 'images/user/', store: 'rank'},
		{images: upgradeImages, path: 'images/background/', store: 'upgrades'}
		], {onProgress: function(progress){$('loading_bar').style.width = ''+progress+'%';}, onFinish : onFinish })
		
	}catch(e){}
}
function initLoadImages(loader){
	loader.load([{images: ['interface.png','loading_bar_down.png','loading_bar_up.png'], path: 'images/background/', store: 'background'}],
	{onProgress: function(progress){},onFinish:function(){$('waitScreen').hide();Effect.Appear('splashScreen');loadGameImages(loader);}})
}
Loader.images ={}
Loader.sounds = {}
Loader.animations = {}
Loader.resourceTypes = ['images', 'sounds','animations']
//initLoadImages()
