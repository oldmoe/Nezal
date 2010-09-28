window.Text = {
    intro : {
        levelSelection : {
            msg : 'defend a new country every week',
            title : 'Weekly challenge',
            extraMaps : 'Extra Maps',
            tutorial : 'Tutorial',
            easy : 'easy',
            medium : 'medium',
            hard : 'hard',
            score : 'x score'
        },
        campaign : {
            back : 'back'          
        },
        mission : {
            msg : 'Intelligence suggests the enemy is sending these forces :',
            accept : 'accept',
            or : 'or',
            goBack : 'go back to campaign'
        },
        marketPlace : {
            add : 'add',
            money : 'money',
            addWeapon : 'unlock and upgrade your super weapons',
            addTower : 'unlock and upgrade your towers',
            back : 'back',
            ready : 'ready',
            unlock : 'unlock',
            upgrade : 'upgrade',
            requiredRank : 'required rank'
        },
        creeps : {
            BlackTank : {
                name : 'A30 Avenger',
                desc : 'The A30 is a heavy armored tank, it is not easy to get destroyed as it survives in difficult situations.' 
            },
            RedTank : {
                name : 'M18 HellCat',
                desc : 'The M18 is a gun motor carriage tank, it has high fire power that can cause mass destruction.' 
            },
            Tank : {
                name : 'M48 Patton',
                desc : 'The M48 is a medium gun tank, it is mainly used as a reinforcement unit. It is a primary tank during war.' 
            },
            TankI : {
                name : 'M42 Duster',
                desc : 'The M42 is a self-propelled medium tank, it acts as a basic main battle tank.' 
            },
            TankII : {
                name : 'M41 Walker',
                desc : 'The M41 is a light tank, it has an extremely high speed that makes it move faster than any other tank.' 
            },
            Humvee : {
                name : 'Humveee',
                desc : 'Humvee is a high mobility multipurpose wheeled vehicle, it is among the most capable all-terrain vehicles in the world.'
            },
            RedPlane :{
                name : 'F-22 Raptor',
                desc : 'The F-22 is an air dominance fighter, It is widely regarded as the most advanced fighter in the world.'
            },
            Plane : {
                name : 'F-15 Eagle',
                desc : 'The F-15 is an extremely maneuverable, tactical fighter designed to gain and maintain air superiority in combats.'
            }
        },
        superWeapons : {
            Splash : { 
                name : 'Splash',
                desc : 'Sends up to 10 rockets that targets biggest 10 enemy units, each deal 2000 damage. Can be used 10 times.' 
            },
            Weak : {  
                name : 'Weak',
                desc : 'Reduces all units\' health point by 10% per second. Lasts for 10 seconds. Can be used 10 times.' 
            },
            Hyper : { 
                name : 'Hyper',
                desc : 'Doubles the attack speed of all your towers. Lasts for 30 seconds. Can be used 10 times.' 
            },
            Nuke : {  
                name : 'Nuke',
                desc : 'Call the nuke bomb to destroy all units on the map. Can be used 5 times.' 
            },
            Heal : {  
                name : 'Heal',
                desc : 'Restores all your towers\' full health point . Can be used 10 times.' 
            }
        },
        towers : {
            Belcher : {  
                name : 'Belcher', 
                desc : 'Belcher, a fast machine gun tower, it has small range nozzle,' + 
                       ' and can be used to counter both air and ground units.' +
                       ' It uses bullets as its main ammunition and doesn\'t have any detection mechanism, but it will fire on sight.' 
            },
            Reaper : {
                name : 'Reaper',
                desc : 'Reaper, an upgraded version of the Belcher machine gun tower,' + 
                         ' it has two nozzles which enable it to attack with a higher rate than the Belcher.' + 
                         ' It is more effective than the Belcher as it secures more fire power against any hostile activities.' 
            },
            Patriot : { 
                name : 'Patriot',
                desc : 'Patriot , a long-range, all-altitude, surface-to-air missile (SAM) launcher.' + 
                       ' This air defense system is used to counter advanced aircraft.' +
                       ' It uses an advanced aerial interceptor missiles and high performance radar systems to destroy its target.' 
            },
            Exploder : {
                name : 'Exploder',
                desc : 'Exploder, a tactical surface-to-surface missile (SSM) launcher,' +
                       ' Its major use is as a general bombardment weapon to counter heavy land units.' +
                       ' It has a radar system for detecting its targets to destroy them.' 
           }
        },
        upgrades : {
            power : 'power',
            rate : 'rate',
            range : 'range',
            maxHp : 'shield',
            Heal : [ 
                    'upgrade 1', 
                    'upgrade 2',
                    'upgrade 3'
                ],
            Weak : [
                    'upgrade 1', 
                    'upgrade 2',
                    'upgrade 3'
                ],
            Nuke : [
                    'upgrade 1', 
                    'upgrade 2',
                    'upgrade 3'
                ],
            Splash : [
                    'upgrade 1', 
                    'upgrade 2',
                    'upgrade 3'
                ],
            Hyper : [
                    'upgrade 1', 
                    'upgrade 2',
                    'upgrade 3'
                ]
        }
    },
	game : {
		tutorial : {
				msg1: 'Welcome to the academy of defense'
		+'</br>During this training period, you will get all the required information, and gain the basic skills that are needed'
		+'to defend your city against any hostile activities',
				msg2: '</br>Your goal is to kill all coming waves of enemy units and prevent them from passing to your city',
				msg3: 'You can always see your current rank at the top right of the map </br>'
		+'</br>The upper bar indicates your rank progress, the wave number, your score in this game'
		+'and the remaining enemy units to escape that indicate your loss</br>',
				msg4: 'Now it is time to place some towers. Click on the Belcher tower in the towers box.</br>'
		+'Notice that the tower information will be visible in the information box.',
				msg5: 'Click here to place the tower. ',
				msg6: 'Place more towers as long as you have enough gold. then press start to begin the battle',
				msg7: 'You can always use super weapons on demand. ',
				msg8: 'click on a tower to see it\'s abilities, sell or upgrade it',
				msg9: 'Finally, there is an important hint you need to know before finishing this training. Air units do not respect any path, they simply fly over anything.',
				msg10:'That is it soldier, you are now ready to defend your city against any hostile activities. I am sure you will do your best to complete all missions assigned to you.'
		+'</br>Do not forget to like us and bookmark  us to get a nice reward. Good Luck.',
				msg11: 'After each wave enemies get stronger, so prepare yourself well'
		},
		upperBar : {
			lives: 'Lives',
			score: 'Score',
			wave : 'Wave'
		},
		gameState:{
			start:'Start',
			pause:'Pause',
			resume:'Resume'
		},
		towerInfo:{
			power:'Power',
			shield:'Shield',
			rate: 'Rate',
			range:'Range'
		},
		ranks:{
			PVT :{ name:'Private' ,abbr : 'PVT'},
			LCpl:{ name:'Private' ,abbr : 'PVT'},
			Cpl:{ name:'Private' ,abbr : 'PVT'},
			Sgt:{ name:'Private' ,abbr : 'PVT'},
			SSgt:{ name:'Private' ,abbr : 'PVT'},
			GySgt:{ name:'Private' ,abbr : 'PVT'},
			MSgt:{ name:'Private' ,abbr : 'PVT'},
			'1stSgt':{ name:'Private' ,abbr : 'PVT'},
			MGySgt:{ name:'Private' ,abbr : 'PVT'},
			SgtMaj:{ name:'Private' ,abbr : 'PVT'},
			'2ndLt':{ name:'Private' ,abbr : 'PVT'},
			'1stLt':{ name:'Private' ,abbr : 'PVT'},
			Capt:{ name:'Private' ,abbr : 'PVT'},
			Maj:{ name:'Private' ,abbr : 'PVT'},
			LtCol:{ name:'Private' ,abbr : 'PVT'},
			Col:{ name:'Private' ,abbr : 'PVT'},
			BGen:{ name:'Private' ,abbr : 'PVT'},
			MajGen:{ name:'Private' ,abbr : 'PVT'},
			LtGen:{ name:'Private' ,abbr : 'PVT'},
			Gen:{ name:'Private' ,abbr : 'PVT'}
		}
	}
	
}


