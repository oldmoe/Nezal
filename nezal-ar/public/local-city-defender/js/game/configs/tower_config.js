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
    "Cannon1" : { model : 'AT-4',
                  image : 'cannon1.png', 
                  skelaton : 'skil.png',
                    desc : "This is the black creep it is soooo destructive" },
    "Cannon2" : { model : 'AT-5',
                  image : 'cannon2.png', 
                  skelaton : 'skil.png',
                  desc : "This is the red tank creep it is soooo destructive" },
    "Cannon3" : {  model : 'G-31',
                  image : 'cannon3.png',
                  skelaton : 'skil.png', 
                    desc : "This is the Red plane creep it is soooo destructive" },
    "Cannon4" : { model : 'G-32', 
                  image : 'rocket.png', 
                  skelaton : 'skil.png',
                  desc : "This is the black creep it is soooo destructive" },
    "Rocket" : { model : 'G-32',
                  image : 'rocket.png', 
                  skelaton : 'skil.png',
                  desc : "This is the black creep it is soooo destructive" }
}

for(tower in TowerConfig){
  eval('var '+tower+ '={}')
}

var Turret = {}
var DoubleTurret = {}
var RocketLauncher = {}
var Patriot = {}
