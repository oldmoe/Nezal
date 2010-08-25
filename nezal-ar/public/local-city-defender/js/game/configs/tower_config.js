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
                  image : 'Turret.png', 
                  skelaton : 'skil.png',
                    desc : "This is the black creep it is soooo destructive" },
    "DoubleTurret" : {  model : 'G-31',
                  image : 'DoubleTurret.png',
                  skelaton : 'skil.png', 
                    desc : "This is the Red plane creep it is soooo destructive" },
    "Patriot" : { model : 'G-32', 
                  image : 'Patriot.png', 
                  skelaton : 'skil.png',
                  desc : "This is the black creep it is soooo destructive" },
    "RocketLauncher" : { model : 'G-32',
                  image : 'RocketLauncher.png', 
                  skelaton : 'skil.png',
                  desc : "This is the black creep it is soooo destructive" }
}
