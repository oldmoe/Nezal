window.Text = {
	gameName: 'Défenseur du monde arabe',
	towers : 'tour',
  payments : {
    daopay : {
      description : 'Pay with your mobile. It is fast, secure and easy. No credit card required!',
      packageCommand : 'Pay *price* EUR and get *reward* coins'
    }
  },
	superWeapons : 'Armes fatales',
    intro : {
        levelSelection : {
            msg : 'Défends un nouveau pays chaque semaine',
            title : 'Défit hebdomadaire',
            extraMaps : 'Missions précédentes',
            tutorial : 'Tutoriel',
            easy : 'Facile',
            medium : 'Moyenne',
            hard : 'Supérieure',
            score : 'x Score'
        },
        campaign : {
            back : 'Précédent'          
        },
        mission : {
            msg : 'Informations intelligentes:',
            accept : 'Accepter',
            or : 'ou',
            goBack : 'Retour à la mission'
        },
        marketPlace : {
            add : 'Rajouter',
            money : 'argent',
            addWeapon : 'Déverouiller et actualiser tes armes fatales',
            addTower : 'Déverouiller ET actualiser les tours',
            back : 'Précédent',
            ready : 'Prêt',
            unlock : 'Déverouiller',
            upgrade : 'Actualiser',
            requiredRank : 'Grade exigé'
        },
        creeps : {
            BlackTank : {
                name : 'A30 Avenger',
                desc : 'Le A30 est un char blindé de poids lourd. Il est difficile à détruire et endure les situations critiques.' 
            },
            RedTank : {
                name : 'M18 HellCat',
                desc : 'Le M18 est un affût de canons. Il est capable de destruction massive grâce à la puissance de ses feux.' 
            },
            Tank : {
                name : 'M48 Patton',
                desc : 'Le M48 est un char de taille moyenne. Il est surtout utilisé comme renfort. C\'est un char d\'ordre primordial dans la guerre.' 
            },
            TankI : {
                name : 'M42 Duster',
                desc : 'Le M42 est un char autopropulsé de taille moyenne. C\'est un char essentiel dans les batailles.' 
            },
            TankII : {
                name : 'M41 Walker',
                desc : 'Le M41 est un char léger. Il se caractérise par sa grande vitesse qui lui permet de circuler plus rapidement que tout autre char.' 
            },
            Humvee : {
                name : 'Humveee',
                desc : 'Humvee est un véhicule à roués polyvalent et se déplace facilement. Humvee est l\'un des véhicules tout-terrain les plus puissants dans le monde.'
            },
            RedPlane :{
                name : 'F-22 Raptor',
                desc : 'Le F-22 est un combatant aérien dominant, il est largement considéré comme le combattant le plus développé dans le monde.'
            },
            Plane : {
                name : 'F-15 Eagle',
                desc : 'Le F-15 est un combatant tactique, extrêmement manoeuvrable. Crée pour atteindre et maintenir des niveaux  supérieurs dans l\'air  pendant les combats.'
            }
        },
        superWeapons : {
            Splash : { 
                name : 'Explose',
                desc : 'Lance jusqu\'à 10 roquettes visant les 10 unités les plus grandes de l\'ennemie.' 
            },
            Weak : {  
                name : 'Faible',
                desc : 'Diminue l\'énergie avec le temps.' 
            },
            Hyper : { 
                name : 'Hyper',
                desc : 'Augmente la rapidité de l\'attaque des tours.' 
            },
            Nuke : {  
                name : 'Nucléaire',
                desc : 'Choisis la bombe nucléaire pour détruire toutes les unités sur la carte.' 
            },
            Heal : {  
                name : 'Soin',
                desc : 'Recupère un pourcentage de l\'energie de toutes les tours.' 
            }
        },
        towers : {
            Belcher : {  
                name : 'Cracheur', 
                desc : 'Le cracheur est une mitrailleuse rapide au bec étroit' + 
                       ' et qui peut être utilisée contre les éléments à détruire soit dans l\'air ou sur la terre.' +
                       ' Il fonctionne principalement avec les balles et ne contient aucun mécanisme de détéction, mais il se déclenche automatiquement.' 
            },
            Reaper : {
                name : 'La faucheuse',
                desc : 'La faucheuse est une version actualisée du Cracheur.' + 
                         ' Elle a deux becs lui permettant d\'attaquer plus fréquemment que le Cracheur.' + 
                         ' Elle est plus efficace que le Cracheur puisqu\'elle produit des flammes puissantes arrêtant ainsi toute activité hostile.' 
            },
            Patriot : { 
                name : 'Patriote',
                desc : 'Patriote est un missile tactique Sol-air, toute-altitude à longue portée.' + 
                       ' Ce systèe de défense aérien est utilisé contre les aéronefs développés.' +
                       ' Patriote se sert d\'une antenne développée pour intercepter les missiles ainsi que d\'un système de radar performant; pour détruire sa cible ennemie.' 
            },
            Exploder : {
                name : 'L\'explosif',
                desc : 'L\'explosif est un missile tactique sol-sol (mss).' +
                       ' Utilisé principalement comme bombardier contre les éléments de poids lourd.' +
                       ' Il contient un système de radar capable de détécter les cibles à détruire.' 
           }
        },
        upgrades : {
            power : 'énergie',
            rate : 'Taux',
            range : 'Distance',
            maxHp : 'Bouclier',
            Heal : [ 
                    'Récupère 20% du total de l\'énergie. Attends 120 secondes.',
					'Récupère 40% du total de l\'énergie. Attends 120 secondes.',
					'Récupère 60% du total de l\'énergie. Attends 120 secondes.',
                    'Récupère 80% du total de l\'énergie. Attends 120 secondes.',
                    'Récupère 100% du total de l\'énergie. Attends 120 secondes.'
                ],
            Weak : [
                    'Réduit 10%  de l\'énergie actuelle/seconde pendant 10 secondes. Attends 90 secondes.',
					'Réduit 10%  de l\'énergie actuelle/seconde pendant 15 secondes. Attends 90 secondes.',
					'Réduit 15%  de l\'énergie actuelle/seconde pendant 15 secondes. Attends 90 secondes.',
                    'Réduit 15%  de l\'énergie actuelle/seconde pendant 20 secondes. Attends 90 secondes.',
                    'Réduit 20%  de l\'énergie actuelle/seconde pendant 20 secondes. Attends 90 secondes.'
                ],
            Nuke : [
                    'Attends 240 secondes.', 
                    'Attends 180 secondes.',
                    'Attends 120 secondes.'
                ],
            Splash : [
                    'Abîme  20% de l\'énergie de l\'objet. Attends 120 secondes.',
					'Abîme  40% de l\'énergie de l\'objet. Attends 120 secondes.',
					'Abîme  60% de l\'énergie de l\'objet. Attends 120 secondes.',
                    'Abîme  80% de l\'énergie de l\'objet. Attends 120 secondes.',
                    'Abîme  100% de l\'énergie de l\'objet. Attends 120 secondes.'
                ],
            Hyper : [
                    'Augmente la rapidité de l\'attaque de 50% pendant 10 secs. Attends 120 secondes.',
					'Augmente la rapidité de l\'attaque de 50% pendant 20 secs. Attends 120 secondes.',
					'Augmente la rapidité de l\'attaque de 100% pendant 20 secs. Attends 120 secondes.',
                    'Augmente la rapidité de l\'attaque de 100% pendant 25 secs. Attends 120 secondes.',
                    'Augmente la rapidité de l\'attaque de 100% pendant 30 secs. Attends 120 secondes.'
                ]
        }
    },
    facebook : {
        invite : {
            inviteMsg : ' Check this game out ',
            userPrompt : 'Invite your friends and earn 50 coins for each friend that start playing'
        },
        completeMession: [
              'courageously defended',
              'at',
              '\'s',
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
              'unlocked the',
              'at',
              'unlocked the',
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
            'upgraded the',
            'at',
            'upgraded the',
            'to gain massive tactical advantage on the battle.'
        ],
        userPrompt : 'Raconte tes accomplissements à tes amis et gagne 5 pièces de monnaie.',
		invite : {
            inviteMsg : 'Es-tu assez motivé pour défendre les terres arabes?',
            userPrompt : 'Invite tes amis et gagne 50 pièces de monnaie par joueur.'
        },
        like : 'Félicitations, tu as gagné 500 pièces de monnaie pour avoir aimé notre jeu',
        bookmark : 'Félicitations, tu as gagné 500 pièces de monnaie pour avoir ajouté notre signet.'
    },
	game : {
		tutorial : {
				msg1: 'bienvenue à l\'academie de défense'
		+'<br/>Au long de cette période de stage; tu vas recevoir toutes les informations nécessaires, et tu vas acquérir les compétences essentielles'
		+' pour défendre ta ville contre tout acte d\'hostilité.',
				msg2: '</br>Ton but sera d\'achever toutes les vagues d\'attaques venant de la part de l\'ennemie et de leur défendre de passer à travers ta ville.',
				msg3: 'Tu peux toujours vérifier ton grade en haut à droite de la carte. </br>'
		+'<br/> La barre d\'outils supérieure indique le progrès de ton grade, le nombre de vagues, ton score '
		+'et le nombre d\'ennemie que tu dois esquiver et qui indique ta perte.<br/>',
				msg4: 'Maintenant, il est temps de mettre en place quelques tours. Clique sur la tour Cracheur qui se trouve dans la boîte des tours.</br>'
		+'Tu vas remarquer que les informations s\'affichent dans la boîte d\'infos.',
				msg5: 'Clique ici pour placer la tour. ',
				msg6: 'Mets en place des tours tant que tu possèdes assez d\'or. Maintenant, tu es prêt à cliquer le bouton "commencer" pour déclencher la bataille.',
				msg7: 'Tu peux toujours utiliser armes supers. ',
				msg8: 'Clique sur la tour pour afficher ses capacités, la vendre ou l\'actualiser.',
				msg9: 'Enfin, il y a un conseil que tu dois savoir avant de terminer ce stage. Les aéronefs ne respectent aucun itinéraire, ils survolent simplement TOUT.',
				msg10:'C\'est bon, Soldat! Maintenant tu es prêt à défendre ta ville contre toute preuve d\'hostilité. Je suis certain que tu feras de ton mieux pour accomplir toutes les missions dont tu es chargé'
		+'<br/>N\'oublie pas de nous favoriser et de nous marquer pour avoir ta récompense. Bonne Chance!'
		},
		upperBar : {
			lives: 'Vies',
			score: 'Score',
			wave : 'Vague'
		},
		gameState:{
			start:'Commencer',
			pause:'Arrêter',
			resume:'Récupérer'
		},
		towerInfo:{
			power:'énergie',
			shield:'Bouclier',
			rate: 'Taux',
			range:'Distance',
			upgrade : "Actualiser",
			sell : "vendre"
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
			winMission1: 'Tu as réussi à défendre',
			winMission2: 'et tu as chassé les ennemis.',
			loseMission: 'a été conquise. Ne cède pas, tu peux réessayer.',
			coins: 'argent',
			score: 'Score',
			enemies : 'Ennemis',
			destroyed : 'Détruits:',
			escaped : 'échappé:',
			towers : 'tour',
			built : 'Construit:',
			playAgain :'Play again',
			exit : 'Continue Campaign'
		},

		towerDestroyedCreep :[
      'Le suivant!!',
       'HOO viens là salaud!!!',
       'meurs, meurs, meurs',
       'Ça fait mal hein?!',
       'Prends ça!'
    ],
    creepDestroyedTower: [
       'Oups, c\'était une tour ça?',
       'ON VA LES Écrabouiller!!!',
       'meurs, meurs, meurs',
       'YOUPIEEE!',
       'Prends ça!',
       'FATALITé!'
    ],
    superWeaponsHeal: [
       'Juste à temps!',
       'Merci Mec!',
       'ça va mieux!'
    ],
    superWeaponsWeak: [
      'JE SUIS AVEUGLE!',
       'Tousse, Tousse!',
       'J\'AI SOMMEIL!'
    ],
    superWeaponsSplash: [
      'C\'est quoi ça?!',
       'Sauves-toi!!',
       'Des roquettes, cours!!'
    ],
    superWeaponsNuke: [
      'c\'est qu..',
       'COU…',
       'Je vois...',
       'Lumières',
       '#3aaaa..'
    ],
    superWeaponsHyper: [
      'CAFééé!!',
      'Que de bonnes choses!!',
       'Je carbure!!',
      'WIHAAAA!'
    ],
    creepEntered:[
       'Né pour détruire!!',
       'ATTAQUE!!',
       'Écrase-les!!',
       'Écrase-les!!'
    ],
    creepEnteredTower: [
		'HOO viens là salaud!!',
        'Résiste!',
        'Tiens bon!!',
        'C\'est tout ce que tu peux?!'
    ], 
	controls: {
		exit : "sortir",
		reset : "remise",
		like : 'J\'aime',
		bookmark : 'Signet',
		soundon : 'Son activé',
		soundoff: 'Son desactivé',
		level:'Niveau',
		roger:'Entendu'
	},
	promotion: {
		msg1 : 'Félicitations ',
		msg2 : 'Tu as eu une promotion; maintenant tu es ',
		okButton : 'Ok'
	}
  }
	
}


