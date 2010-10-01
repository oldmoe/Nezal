window.Text = {
	gameName: 'D�fenseur du monde arabe',
	towers : 'tour',
	superWeapon : 'Armes fatales',
    intro : {
        levelSelection : {
            msg : 'D�fends un nouveau pays chaque semaine',
            title : 'D�fit hebdomadaire',
            extraMaps : 'Missions pr�c�dentes',
            tutorial : 'Tutoriel',
            easy : 'Facile',
            medium : 'Moyenne',
            hard : 'Sup�rieure',
            score : 'x Score'
        },
        campaign : {
            back : 'Pr�c�dent'          
        },
        mission : {
            msg : 'Informations intelligentes:',
            accept : 'Accepter',
            or : 'ou',
            goBack : 'Retour � la mission'
        },
        marketPlace : {
            add : 'Rajouter',
            money : 'argent',
            addWeapon : 'D�verouiller et actualiser tes armes fatales',
            addTower : 'D�verouiller ET actualiser les tours',
            back : 'Pr�c�dent',
            ready : 'Pr�t',
            unlock : 'D�verouiller',
            upgrade : 'Actualiser',
            requiredRank : 'Grade exig�'
        },
        creeps : {
            BlackTank : {
                name : 'A30 Avenger',
                desc : 'Le A30 est un char blind� de poids lourd. Il est difficile � d�truire et endure les situations critiques.' 
            },
            RedTank : {
                name : 'M18 HellCat',
                desc : 'Le M18 est un aff�t de canons. Il est capable de destruction massive gr�ce � la puissance de ses feux.' 
            },
            Tank : {
                name : 'M48 Patton',
                desc : 'Le M48 est un char de taille moyenne. Il est surtout utilis� comme renfort. C\'est un char d\'ordre primordial dans la guerre.' 
            },
            TankI : {
                name : 'M42 Duster',
                desc : 'Le M42 est un char autopropuls� de taille moyenne. C\'est un char essentiel dans les batailles.' 
            },
            TankII : {
                name : 'M41 Walker',
                desc : 'Le M41 est un char l�ger. Il se caract�rise par sa grande vitesse qui lui permet de circuler plus rapidement que tout autre char.' 
            },
            Humvee : {
                name : 'Humveee',
                desc : 'Humvee est un v�hicule � rou�s polyvalent et se d�place facilement. Humvee est l\'un des v�hicules tout-terrain les plus puissants dans le monde.'
            },
            RedPlane :{
                name : 'F-22 Raptor',
                desc : 'Le F-22 est un combatant a�rien dominant, il est largement consid�r� comme le combattant le plus d�velopp� dans le monde.'
            },
            Plane : {
                name : 'F-15 Eagle',
                desc : 'Le F-15 est un combatant tactique, extr�mement manoeuvrable. Cr�e pour atteindre et maintenir des niveaux  sup�rieurs dans l\'air  pendant les combats.'
            }
        },
        superWeapons : {
            Splash : { 
                name : 'Explose',
                desc : 'Lance jusqu\'� 10 roquettes visant les 10 unit�s les plus grandes de l\'ennemie.' 
            },
            Weak : {  
                name : 'Faible',
                desc : 'Diminue l\'�nergie avec le temps.' 
            },
            Hyper : { 
                name : 'Hyper',
                desc : 'Augmente la rapidit� de l\'attaque des tours.' 
            },
            Nuke : {  
                name : 'Nucl�aire',
                desc : 'Choisis la bombe nucl�aire pour d�truire toutes les unit�s sur la carte.' 
            },
            Heal : {  
                name : 'Soin',
                desc : 'Recup�re un pourcentage de l\'energie de toutes les tours.' 
            }
        },
        towers : {
            Belcher : {  
                name : 'Cracheur', 
                desc : 'Le cracheur est une mitrailleuse rapide au bec �troit' + 
                       ' et qui peut �tre utilis�e contre les �l�ments � d�truire soit dans l\'air ou sur la terre.' +
                       ' Il fonctionne principalement avec les balles et ne contient aucun m�canisme de d�t�ction, mais il se d�clenche automatiquement.' 
            },
            Reaper : {
                name : 'La faucheuse',
                desc : 'La faucheuse est une version actualis�e du Cracheur.' + 
                         ' Elle a deux becs lui permettant d\'attaquer plus fr�quemment que le Cracheur.' + 
                         ' Elle est plus efficace que le Cracheur puisqu\'elle produit des flammes puissantes arr�tant ainsi toute activit� hostile.' 
            },
            Patriot : { 
                name : 'Patriote',
                desc : 'Patriote est un missile tactique Sol-air, toute-altitude � longue port�e.' + 
                       ' Ce syst�e de d�fense a�rien est utilis� contre les a�ronefs d�velopp�s.' +
                       ' Patriote se sert d\'une antenne d�velopp�e pour intercepter les missiles ainsi que d\'un syst�me de radar performant; pour d�truire sa cible ennemie.' 
            },
            Exploder : {
                name : 'L\'explosif',
                desc : 'L\'explosif est un missile tactique sol-sol (mss).' +
                       ' Utilis� principalement comme bombardier contre les �l�ments de poids lourd.' +
                       ' Il contient un syst�me de radar capable de d�t�cter les cibles � d�truire.' 
           }
        },
        upgrades : {
            power : '�nergie',
            rate : 'Taux',
            range : 'Distance',
            maxHp : 'Bouclier',
            Heal : [ 
                    'R�cup�re 20% du total de l\'�nergie. Attends 120 secondes.',
					'R�cup�re 40% du total de l\'�nergie. Attends 120 secondes.',
					'R�cup�re 60% du total de l\'�nergie. Attends 120 secondes.',
                    'R�cup�re 80% du total de l\'�nergie. Attends 120 secondes.',
                    'R�cup�re 100% du total de l\'�nergie. Attends 120 secondes.'
                ],
            Weak : [
                    'R�duit 10%  de l\'�nergie actuelle/seconde pendant 10 secondes. Attends 90 secondes.',
					'R�duit 10%  de l\'�nergie actuelle/seconde pendant 15 secondes. Attends 90 secondes.',
					'R�duit 15%  de l\'�nergie actuelle/seconde pendant 15 secondes. Attends 90 secondes.',
                    'R�duit 15%  de l\'�nergie actuelle/seconde pendant 20 secondes. Attends 90 secondes.',
                    'R�duit 20%  de l\'�nergie actuelle/seconde pendant 20 secondes. Attends 90 secondes.'
                ],
            Nuke : [
                    'Attends 240 secondes.', 
                    'Attends 180 secondes.',
                    'Attends 120 secondes.'
                ],
            Splash : [
                    'Ab�me  20% de l\'�nergie de l\'objet. Attends 120 secondes.',
					'Ab�me  40% de l\'�nergie de l\'objet. Attends 120 secondes.',
					'Ab�me  60% de l\'�nergie de l\'objet. Attends 120 secondes.',
                    'Ab�me  80% de l\'�nergie de l\'objet. Attends 120 secondes.',
                    'Ab�me  100% de l\'�nergie de l\'objet. Attends 120 secondes.'
                ],
            Hyper : [
                    'Augmente la rapidit� de l\'attaque de 50% pendant 10 secs. Attends 120 secondes.',
					'Augmente la rapidit� de l\'attaque de 50% pendant 20 secs. Attends 120 secondes.',
					'Augmente la rapidit� de l\'attaque de 100% pendant 20 secs. Attends 120 secondes.',
                    'Augmente la rapidit� de l\'attaque de 100% pendant 25 secs. Attends 120 secondes.',
                    'Augmente la rapidit� de l\'attaque de 100% pendant 30 secs. Attends 120 secondes.'
                ]
        }
    },
    facebook : {
        completeMession: [
              'courageously defended',
              'at',
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
        userPrompt : 'Raconte tes accomplissements � tes amis et gagne 5 pi�ces de monnaie.'
    },
	game : {
		tutorial : {
				msg1: 'Bienvenue pour l\'acad�mie de d�fense.'
		+'</br>Au long de cette p�riode de stage; tu vas recevoir toutes les informations n�cessaires, et tu vas acqu�rir les comp�tences essentielles'
		+' pour d�fendre ta ville contre tout acte d\'hostilit�.',
				msg2: '</br>Ton but sera d\'achever toutes les vagues d\'attaques venant de la part de l\'ennemie et de leur d�fendre de passer � travers ta ville.',
				msg3: 'Tu peux toujours v�rifier ton grade en haut � droite de la carte. </br>'
		+'</br>5.	La barre d\'outils sup�rieure indique le progr�s de ton grade, le nombre de vagues, ton score '
		+'et le nombre d\'ennemie que tu dois esquiver et qui indique ta perte.</br>',
				msg4: 'Maintenant, il est temps de mettre en place quelques tours. Clique sur la tour Cracheur qui se trouve dans la bo�te des tours.</br>'
		+'Tu vas remarquer que les informations s\'affichent dans la bo�te d\'infos.',
				msg5: 'Clique ici pour placer la tour. ',
				msg6: 'Mets en place des tours tant que tu poss�des assez d\'or. Maintenant, tu es pr�t � cliquer le bouton "commencer" pour d�clencher la bataille.',
				msg7: 'Tu peux toujours utiliser armes supers. ',
				msg8: 'Clique sur la tour pour afficher ses capacit�s, la vendre ou l\'actualiser.',
				msg9: 'Enfin, il y a un conseil que tu dois savoir avant de terminer ce stage. Les a�ronefs ne respectent aucun itin�raire, ils survolent simplement TOUT.',
				msg10:'C\'est bon, Soldat! Maintenant tu es pr�t � d�fendre ta ville contre toute preuve d\'hostilit�. Je suis certain que tu feras de ton mieux pour accomplir toutes les missions dont tu es charg�'
		+'</br>N\'oublie pas de nous favoriser et de nous marquer pour avoir ta r�compense. Bonne Chance!'
		},
		upperBar : {
			lives: 'Vies',
			score: 'Score',
			wave : 'Vague'
		},
		gameState:{
			start:'Commener',
			pause:'Arr�ter',
			resume:'R�cup�rer'
		},
		towerInfo:{
			power:'�nergie',
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
			winMission1: 'You have successsfully defended',
			winMission2: 'and protected',
			loseMission: 'has fallen to the enemy forces. don\'t give up, you can try again.',
			coins: 'argent',
			score: 'Score',
			enemies : 'Ennemis',
			destroyed : 'D�truits:',
			escaped : '�chapp�:',
			towers : 'tour',
			built : 'Construit:'
		},
		towerDestroyedCreep :{
      msg1 : 'Le suivant!!',
      msg2 : 'HOO viens l� salaud!!!',
      msg3 : 'meurs, meurs, meurs',
      msg4 : '�a fait mal hein?!',
      msg5 : 'Prends �a!'
    },
    creepDestroyedTower: {
      msg1 : 'Oups, c\'�tait une tour �a?',
      msg2 : 'ON VA LES �crabouiller!!!',
      msg3 : 'meurs, meurs, meurs',
      msg4 : 'YOUPIEEE!',
      msg5 : 'Prends �a!',
      msg6 : 'FATALIT�!'
    },
    superWeaponsHeal: {
      msg1 : 'Juste � temps!',
      msg2 : 'Merci Mec!',
      msg3 : '�a va mieux!'
    },
    superWeaponsWeak: {
      msg1 : 'JE SUIS AVEUGLE!',
      msg2 : 'Tousse, Tousse!',
      msg3 : 'J\'AI SOMMEIL!'
    },
    superWeaponsSplash: {
      msg1 : 'C\'est quoi �a?!',
      msg2 : 'Sauves-toi!!',
      msg3 : 'Des roquettes, cours!!'
    },
    superWeaponsNuke: {
      msg1 : 'c\'est qu..',
      msg2 : 'COU�',
      msg3 : 'Je vois...',
      msg4 : 'Lumi�res',
      msg5 : '#3aaaa..'
    },
    superWeaponsHyper: {
      msg1 : 'CAF���!!',
      msg2 : 'Que de bonnes choses!!',
      msg3 : 'Je carbure!!',
      msg4 : 'WIHAAAA!'
    },
    creepEntered:{
      msg1 : 'N� pour d�truire!!',
      msg2 : 'ATTAQUE!!',
      msg3 : '�crase-les!!',
      msg4 : '�crase-les!!'
    },
    creepEnteredTower: {
      msg1 : 'HOO viens l� salaud!!',
      msg2 : 'R�siste!',
      msg3 : 'Tiens bon!!',
      msg4 : 'C\'est tout ce que tu peux?!'
    }
  
  }
	
}


