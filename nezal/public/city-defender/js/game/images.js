var images = ['air_craft.png', 
              'air_craft_shade.png',
              'air_craft_in_action.png',
              'canon_1.png',
              'canon_2.png',
              'canon_1_in_action.png',
              'canon_2_in_action_right.png',
              'canon_2_in_action_left.png',
              'guide.jpg',
              'humvee_body.png',
              'humvee_tower.png',
              'humvee_trace_100.png',
              'humvee_trace_20.png',
              'humvee_trace_50.png',
              'humvee_tower_in_action.png',
              'rocket.png',
              'rocket_launcher.png',
              'tank_tower_in_action.png',
              'tank_1_tower_in_action.png',
              'tank_2_tower_in_action.png',
              'tank_body.png',
              'tank_tower.png',
              'tank_trace_20.png',
              'tank_trace_50.png',
              'tank_trace_100.png',
              'tower_base.png',
              'tank_1_2_body.png',
              'tank_1_tower.png',
              'tank_2_tower.png',
              ]
              
var cityDefenderImages = {};
var cityDefenderImageDir = '/city-defender/images/game/'

for ( var  i=0 ; i< images.length ; i++ )
{ 
  cityDefenderImages[images[i]] = new Image(); 
  cityDefenderImages[images[i]].src = cityDefenderImageDir + images[i]; 
} 

                                                    


