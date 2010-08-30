/*
  This file is dedicated to describe creeps
  Each Creep is defined by its name, and contains a hash reflecting :
      * image : The name of the image of the creep
      * desc : Description and information about the creep
      Those information are to be displayed in missions to provide more citation 
      about creeps involved in the mission
*/
var CreepConfig = {
    "BlackTank" : { name : "Black Tank",
                    image : 'cannon1.png', 
                    skelaton : 'skil.png',
                    desc : "This is the black creep it is soooo destructive" },
    "RedTank" : { name : "Red Tank",
                  image : 'cannon2.png', 
                  skelaton : 'skil.png',
                  desc : "This is the red tank creep it is soooo destructive" },
    "RedPlane" : {  name : "Red Plan",
                    image : 'cannon3.png',
                    skelaton : 'skil.png', 
                    desc : "This is the Red plane creep it is soooo destructive" },
    "TankII" : {  name : "Tank II",
                  image : 'rocket.png', 
                  skelaton : 'skil.png',
                  desc : "This is the black creep it is soooo destructive" },
    "TankI" : {  name : "Tank I",
                  image : 'rocket.png', 
                  skelaton : 'skil.png',
                  desc : "This is the black creep it is soooo destructive" },
    "Tank" : {  name : "Tank",
                  image : 'rocket.png', 
                  skelaton : 'skil.png',
                  desc : "This is the black creep it is soooo destructive" },                  
    "Humvee" : {  name : "Humveee",
                  image : 'cannon2.png', 
                  skelaton : 'skil.png',
                  desc : "This is the humvee creep it is soooo destructive" },
    "RedPlane" : {  name : "Red Plane",
                    image : 'cannon3.png',
                    skelaton : 'skil.png', 
                    desc : "This is the Red plane creep it is soooo destructive" },
    "Plane" : {  name : "Plane",
                    image : 'cannon3.png',
                    skelaton : 'skil.png', 
                    desc : "This is the Red plane creep it is soooo destructive" }
}
/*
for(creep in CreepConfig){
  eval('var '+creep+ '={}')
}

var Tank = {}
var TankI = {}
var Plane = {}
*/
