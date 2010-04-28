var images = [
		      'air_craft.png', 
              'air_craft_shade.png',
              'air_craft_in_action.png',
              'cannon_1.png',
              'cannon_2.png',
              'cannon_1_in_action.png',
              'cannon_2_in_action_right.png',
              'cannon_2_in_action_left.png',
              'humvee_body.png',
              'humvee_tower.png',
              'humvee_tower_in_action.png',
              'rocket.png',
              'rocket_in_action.png',
              'rocket_launcher.png',
              'tank_tower_in_action.png',
              'tank_1_tower_in_action.png',
              'tank_2_tower_in_action.png',
              'tank_body.png',
              'tank_tower.png',
              'tank_1_2_body.png',
              'tank_1_tower.png',
              'tank_2_tower.png',
              'tower_base.png',
			  'patriot_launcher.png',
			  'patriot_launcher_in_action_right.png',
			  'patriot_launcher_in_action_left.png',
			  'patriot_rocket.png'
             ]
              
Game.images = {};
//Game.imagesDir = '/city-defender/images/game/'
Game.imagesDir = 'images/game/'

for ( var  i=0 ; i< images.length ; i++ )
{ 
  Game.images[images[i]] = new Image(); 
  Game.images[images[i]].src = Game.imagesDir + images[i]; 
} 

                                                    


