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
    "Belcher" : {  name : 'Belcher', 
                  image : 'belecher.png', 
                  smallImage : 'belecher_small.png',
                  skeleton : 'belecher_skeleton.png',
                    desc : "Belcher, a fast machine gun tower, it has small range nozzle," + 
                          " and can be used to counter both air and ground units." +
                          " It uses bullets as its main ammunition and doesn't have any detection mechanism, but it will fire on sight." },
    "Reaper" : {
                  name : 'Reaper',
                  image : 'reaper.png', 
                  smallImage : 'reaper_small.png',
                  skeleton : 'reaper_skeleton.png',
                    desc : "Reaper, an upgraded version of the Belcher machine gun tower," + 
                           " it has two nozzles which enable it to attack with a higher rate than the Belcher." + 
                           " It is more effective than the Belcher as it secures more fire power against any hostile activities." },
    "Patriot" : { name : 'Patriot',
                  image : 'patriot.png', 
                  smallImage : 'patriot_small.png',
                  skeleton : 'patriot_skeleton.png',
                  desc : "Patriot , a long-range, all-altitude, surface-to-air missile (SAM) launcher." + 
                         " This air defense system is used to counter advanced aircraft." +
                         " It uses an advanced aerial interceptor missiles and high performance radar systems to destroy its target." },
    "Exploder" : {
                  name : 'Exploder',
                  image : 'exploder.png', 
                  smallImage : 'exploder_small.png',
                  skeleton : 'exploder_skeleton.png',
                  desc : "Exploder, a tactical surface-to-surface missile (SSM) launcher," +
                         " Its major use is as a general bombardment weapon to counter heavy land units." +
                         " It has a radar system for detecting its targets to destroy them." }
}
