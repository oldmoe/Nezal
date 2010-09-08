/*
  This file is dedicated to describe creeps
  Each Creep is defined by its name, and contains a hash reflecting :
      * image : The name of the image of the creep
      * desc : Description and information about the creep
      Those information are to be displayed in missions to provide more citation 
      about creeps involved in the mission
*/
var CreepConfig = {
    "BlackTank" : { name : "A30 Avenger",
                    image : 'black_tank.png', 
                    skeleton : 'black_tank_skeleton.png',
                    desc : "The A30 is a heavy armored tank, it is not easy to get destroyed as it survives in difficult situations." },
    "RedTank" : { name : "M18 HellCat",
                  image : 'red_tank.png', 
                  skeleton : 'red_tank_skeleton.png',
                  desc : "The M18 is a gun motor carriage tank, it has high fire power that can cause mass destruction." },
    "Tank" : {  name : "M48 Patton",
                  image : 'tank.png', 
                  skeleton : 'tank_skeleton.png',
                  desc : "The M48 is a medium gun tank, it is mainly used as a reinforcement unit. It is a primary tank during war." },                  
    "TankI" : {  name : "M42 Duster",
                  image : 'tank_i.png', 
                  skeleton : 'tank_i_skeleton.png',
                  desc : "The M42 is a self-propelled medium tank, it acts as a basic main battle tank." },
    "TankII" : {  name : "M41 Walker",
                  image : 'tank_ii.png', 
                  skeleton : 'tank_ii_skeleton.png',
                  desc : "The M41 is a light tank, it has an extremely high speed that makes it move faster than any other tank." },
    "Humvee" : {  name : "Humveee",
                  image : 'humvee.png', 
                  skeleton : 'humvee_skeleton.png',
                  desc : "Humvee is a high mobility multipurpose wheeled vehicle, it is among the most capable all-terrain vehicles in the world." },
    "RedPlane" : {  name : "F-22 Raptor",
                    image : 'red_plane.png',
                    skeleton : 'red_plane_skeleton.png',
                    desc : "The F-22 is an air dominance fighter, It is widely regarded as the most advanced fighter in the world." },
    "Plane" : {  name : "F-15 Eagle",
                    image : 'plane.png',
                    skeleton : 'plane_skeleton.png',
                    desc : "The F-15 is an extremely maneuverable, tactical fighter designed to gain and maintain air superiority in combats." }
}
