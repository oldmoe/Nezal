/*
  This file is dedicated to describe towers
  Each Tower is defined by its model, name, and contains a hash reflecting :
      * image : The image of the tower in the market place tower purchase
      * skilatone : The image of the skilaton of tower in the market place tower purchase
      * desc : Description and information about the creep
      Those information are to be displayed in missions to provide more citation 
      about creeps involved in the mission
*/
var TowerConfig = {
    "Turret" : { model : 'AT-4',
                  name : 'Turret', 
                  image : 'belecher.png', 
                  smallImage : 'belecher_small.png',
                  skeleton : 'belecher_skeleton.png',
                    desc : "This is the black creep it is soooo destructive" },
    "DoubleTurret" : {  model : 'G-31',
                  name : 'Double Turret',
                  image : 'reaper.png', 
                  smallImage : 'reaper_small.png',
                  skeleton : 'reaper_skeleton.png',
                    desc : "This is the Red plane creep it is soooo destructive" },
    "Patriot" : { model : 'G-32', 
                  name : 'Patriot',
                  image : 'patriot.png', 
                  smallImage : 'patriot_small.png',
                  skeleton : 'patriot_skeleton.png',
                  desc : "This is the black creep it is soooo destructive" },
    "RocketLauncher" : { model : 'G-32',
                  name : 'Rocket Launcher',
                  image : 'exploder.png', 
                  smallImage : 'exploder_small.png',
                  skeleton : 'exploder_skeleton.png',
                  desc : "This is the black creep it is soooo destructive" }
}
