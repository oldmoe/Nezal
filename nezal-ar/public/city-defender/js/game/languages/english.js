window.Text = {
	gameName: 'Defender of Arabia',
	towers : 'tower',
	superWeapons : 'Super Weapon',
    intro : {
        levelSelection : {
            msg : 'Defend a new country every week',
            title : 'Weekly Challenge',
            extraMaps : 'Previous Campaigns',
            tutorial : 'Tutorial',
            easy : 'Easy',
            medium : 'Medium',
            hard : 'Hard',
            score : 'x Score'
        },
        campaign : {
            back : 'back'          
        },
        mission : {
            msg : 'Intelligence information:',
            accept : 'Accept',
            or : 'or',
            goBack : 'back to campaign'
        },
        marketPlace : {
            add : 'Add',
            money : 'coins',
            addWeapon : 'Unlock and upgrade your super weapons',
            addTower : 'Unlock and upgrade your towers',
            back : 'back',
            ready : 'Ready',
            unlock : 'Unlock',
            upgrade : 'Upgrade',
            requiredRank : 'Required Rank'
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
                desc : 'Sends up to 10 rockets that targets biggest 10 enemy units.' 
            },
            Weak : {  
                name : 'Weak',
                desc :  'Reduce all units\’ health points over time.'
            },
            Hyper : { 
                name : 'Hyper',
                desc : 'Increase the attack speed of all your towers.' 
            },
            Nuke : {  
                name : 'Nuke',
                desc : 'Calls the nuke bomb to destroy all units on the map.' 
            },
            Heal : {  
                name : 'Heal',
                desc : 'Restores a percentage of all your towers health points.' 
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
            power : 'Power',
            rate : 'Rate',
            range : 'Range',
            maxHp : 'Shield',
            Heal : [ 
                    'Restores 20% of total HP. Cool down 90 seconds.',
					'Restores 40% of total HP. Cool down 90 seconds.',
					'Restores 60% of total HP. Cool down 90 seconds.',
                    'Restores 80% of total HP. Cool down 90 seconds.',
                    'Restores 100% of total HP. Cool down 90 seconds.'
                ],
            Weak : [
                    'Reduce 10% of current HP per second over 10 seconds. Cool down 60 seconds.',
					'Reduce 10% of current HP per second over 15 seconds. Cool down 60 seconds.',
					'Reduce 15% of current HP per second over 15 seconds. Cool down 60 seconds.',
                    'Reduce 15% of current HP per second over 20 seconds. Cool down 60 seconds.',
                    'Reduce 20% of current HP per second over 20 seconds. Cool down 60 seconds.'
                ],
            Nuke : [
                    'Cool down 240 seconds.', 
                    'Cool down 180 seconds.',
                    'Cool down 120 seconds.'
                ],
            Splash : [
                    'Cause damage equal to 20% of unit\'s health point. Cool down 120 seconds.',
					'Cause damage equal to 40% of unit\'s health point. Cool down 120 seconds.',
					'Cause damage equal to 60% of unit\'s health point. Cool down 120 seconds.',
                    'Cause damage equal to 80% of unit\'s health point. Cool down 120 seconds.',
                    'Cause damage equal to 100% of unit\'s health point. Cool down 120 seconds.'
                ],
            Hyper : [
                    'Increase attack speed by 50% over 10 seconds. Cool down 120 seconds.',
					'Increase attack speed by 50% over 20 seconds. Cool down 120 seconds.',
					'Increase attack speed by 100% over 20 seconds. Cool down 120 seconds.',
                    'Increase attack speed by 100% over 25 seconds. Cool down 120 seconds.',
                    'Increase attack speed by 100% over 30 seconds. Cool down 120 seconds.'
                ]
        }
    },
    facebook : {
        completeMession: [
              'courageously defended',
              'at',
              '&#39;s',
              'heroic efforts defended the city and scored',
              '. Can you top such efforts?'
        ],
        completeCampaign: [
              'with a legendary defense saved',
              'at',
              'showed bullet proof defense on the way to save', 
              '& earned',
              'points through out the journey. Can you out play that?'
        ],
        rankPromotion: [
              'has been promoted to become',
              'at',
              'In recognition of such outstanding defending skills at',
              'has been promoted to become',
              '. Salute is in due to such brave efforts.'
        ],
        unlockItem: [
              'unlocked',
              'at',
              'unlocked',
              'to gain massive tactical advantage on the battle.'
        ],
        campaignRanking: [
            'finished',
            'among friends &',
            'among all players while defending',
            'at',
            'has earned the',
            'rank among friends and',
            'rank among all players in the journey to save',
            '. Dare to challenge these efforts?'
        ],
        upgradeItem: [
            'upgraded',
            'at',
            'upgraded',
            'to gain massive tactical advantage on the battle.'
        ],
        userPrompt : 'Tell your friends about your accomplishment and get 5 coins',
		invite : {
            inviteMsg : 'Are you eager enough to defend the Arab land? ',
            userPrompt : 'invite your friends and earn 50 coins for each one who starts playing.'
        },
        like : ' Congratulations, you got 500 coins as a gift for liking us.',
        bookmark : 'Congratulations, you got 500 coins as a gift for bookmarking us.'
    },
	game : {
		tutorial : {
				msg1: 'Welcome to the academy of defense.'
		+'</br>During this training period, You will get all the required information and gain the basic skills needed'
		+' to defend your city against any hostile activities',
				msg2: '</br>Your goal is to kill all coming waves of enemy units and prevent them from passing to your city',
				msg3: 'You can always see your current rank at the top right of the map </br>'
		+'</br>The upper bar indicates your rank progress, the wave number, your score in the game'
		+' and the remaining enemy units to escape which indicates your loss</br>',
				msg4: 'Now it is time to place some towers. Click on the Belcher tower in the towers box.</br>'
		+'Notice that the tower information will be visible in the information box.',
				msg5: 'Click here to place the tower. ',
				msg6: 'Place more towers as long as you have enough money. Now you are ready to click the start button to start the battle.',
				msg7: 'You can always use super weapons on demand. ',
				msg8: 'Click on a tower to see its abilities, sell or upgrade it',
				msg9: 'Finally, there is an important hint you need to know before finishing this training. Air units do not respect any path, they simply fly over anything.',
				msg10:'That is it soldier, you are now ready to defend your city against any hostile activities. I am sure you will do your best to complete all missions assigned to you.'
		+'</br>Do not forget to like us and bookmark  us to get a nice reward. Good Luck.'
		},
		upperBar : {
			lives: 'Lives',
			score: 'Score',
			wave : 'Wave'
		},
		gameState:{
			start:'Start',
			pause:'Menu',
			resume:'Resume'
		},
		towerInfo:{
			power:'Power',
			shield:'Shield',
			rate: 'Rate',
			range:'Range',
			upgrade : "Upgrade",
			sell : "Sell"
		},
		ranks:{
			PVT :{ name:'Private' ,abbr : 'PVT'},
			LCpl:{ name:'Lance Corporal' ,abbr : 'LCpl'},
			Cpl:{ name:'Corporal' ,abbr : 'Cpl'},
			Sgt:{ name:'Sergant' ,abbr : 'Sgt'},
			SSgt:{ name:'Staff Sergant' ,abbr : 'SSgt'},
			GySgt:{ name:'Gunnery Sergant' ,abbr : 'GySgt'},
			MSgt:{ name:'Master Sergant' ,abbr : 'MSgt'},
			'1stSgt':{ name:'First Sergant' ,abbr : '1stSgt'},
			MGySgt:{ name:'Master Gunnery Sergant' ,abbr : 'MGySgt'},
			SgtMaj:{ name:'Sergant Major' ,abbr : 'SgtMaj'},
			'2ndLt':{ name:'Second Lieutenant' ,abbr : '2ndLt'},
			'1stLt':{ name:'First Lieutenant' ,abbr : '1stLt'},
			Capt:{ name:'Captain' ,abbr : 'Capt'},
			Maj:{ name:'Major' ,abbr : 'Maj'},
			LtCol:{ name:'Lieutenant Colonel' ,abbr : 'LtCol'},
			Col:{ name:'Colonel' ,abbr : 'Col'},
			BGen:{ name:'Brigadier General' ,abbr : 'BGen'},
			MajGen:{ name:'Major General' ,abbr : 'MajGen'},
			LtGen:{ name:'Lieutenant General' ,abbr : 'LtGen'},
			Gen:{ name:'General' ,abbr : 'Gen'}
		},
		result : {
			winMission1: 'You have successsfully defended ',
			winMission2: 'and drove the enemies away',
			loseMission: ' has fallen to the enemy forces. don\'t give up, you can try again.',
			coins: 'Coins',
			score: 'Score',
			enemies : 'Enemies',
			destroyed : 'Destroyed:',
			escaped : 'Escaped:',
			towers : 'Towers',
			built : 'Built:',
			playAgain :'Play again',
			exit : 'Continue Campaign'
		},
	towerDestroyedCreep :[
       'Who\'s next?!',
       'BRING IT ON!!!',
       'Die, Die, Die',
       'Did it hurt?',
       'Take that!'
    ],
    creepDestroyedTower: [
       'Oops, was that a tower?',
       'WE WILL CRUSH\'em!!!',
      'Die, Die, Die',
       'Hurray!',
       'Take that!',
       'FATALITY!'
    ],
    superWeaponsHeal: [
       'Just in time!',
       'Thanks Man!',
       'Feels Better!'
    ],
    superWeaponsWeak: [
       'I AM BLIND!',
       'Cough, cough!',
       'I feel s l e e p y!'
    ],
    superWeaponsSplash: [
       'What is this?!',
       'Run!!',
       'Rockets, Run!'
    ],
    superWeaponsNuke: [
       'Wha..',
       'Ru...',
       'I see a ...',
       'Lights ...',
       '#3aaaa..'
    ],
    superWeaponsHyper: [
       'COFFEE!!',
       'GOOD STUFF!!',
       'I AM HYPER!!',
      'WEEHAAAA!'
    ],
    creepEntered:[
       'Born to destroy!!',
       'ATTAAACK!!',
       'RUN THEM OVER!!',
       'CRUSH THEM!'
    ],
    creepEnteredTower: [
       'BRING IT ON!!',
       'HOLD!!',
       'STAND YOUR GROUND!!',
      'That\'s all you got?'
    ],
	controls: {
		exit : 'exit',
		reset : 'reset',
		like : 'like',
		bookmark : 'bookmark',
		soundon : 'sound on',
		soundoff: 'sound off',
		level:'level',
		roger:'roger'
	},
	promotion: {
		msg1 : 'Congratulations',
		msg2 : 'You have been promoted , you are now a ',
		okButton : 'Ok'
	}
  }
	
}


