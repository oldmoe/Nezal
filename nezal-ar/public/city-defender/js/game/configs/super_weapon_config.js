/*
  This file is dedicated to describe super weapons
  Each super weapon is defined by its name, and contains a hash reflecting :
      * image : The image of the tower in the market place tower purchase
      * skilatone : The image of the skilaton of tower in the market place tower purchase
      * desc : Description and information about the creep
      Those information are to be displayed in missions to provide more citation 
      about creeps involved in the mission
*/
var SuperWeaponConfig = {
    "Splash" : { name : "Splash",
                 image : 'splash.png', 
                 skeleton : 'splash.png',
                    desc : "Sends up to 10 rockets that targets biggest 10 enemy units, each deal 2000 damage. Can be used 10 times." },
    "Weak" : {  name : "Weak",
                image : 'weak.png', 
                skeleton : 'weak.png',
                desc : "Reduces all units' health point by 10% per second. Lasts for 10 seconds. Can be used 10 times." },
    "Hyper" : { name : "Hyper",
                image : 'hyper.png',
                skeleton : 'hyper.png',
                desc : "Doubles the attack speed of all your towers. Lasts for 30 seconds. Can be used 10 times." },
    "Nuke" : {  name : "Nuke",
                image : 'nuke.png', 
                skeleton : 'nuke.png',
                desc : "Call the nuke bomb to destroy all units on the map. Can be used 5 times." },
    "Heal" : {  name : "Heal",
                image : 'heal.png', 
                skeleton : 'heal.png',
                desc : "Restores all your towers' full health point . Can be used 10 times." }
}
