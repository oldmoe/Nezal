BuildingFactory.SourceClasses = {
  townhall : { factory : TownhallFactory, klass : Townhall },
  lumbermill : { factory : LumbermillFactory, klass : Lumbermill },
  quarry : { factory : QuarryFactory, klass : Quarry },
  storage : { factory : StorageFactory, klass : Storage },
  house : { factory : BuildingFactory, klass : Building },  
  palm : { factory : BuildingFactory, klass : Building },
  defense_center : { factory : BuildingFactory, klass : Building },
  defense_research : { factory : BuildingFactory, klass : Building },
  military_research : { factory : BuildingFactory, klass : Building },
  garage : { factory : GarageFactory, klass : Garage },
  war_factory : { factory : WarFactoryFactory, klass : WarFactory },
  wedge : { factory : WedgeFactory, klass : Wedge },
  blue_wedge : { factory : WedgeFactory, klass : Wedge },
  green_wedge : { factory : WedgeFactory, klass : Wedge },
  gaddafi : { factory : WedgeFactory, klass : Gaddafi }
};

BuildingFactory.prototype.buildings = ['townhall', 'quarry', 'lumbermill','storage','defense_center',
  'palm','wedge','war_factory','house', 'gaddafi', 'garage', 'defense_research',
  'military_research', 'green_wedge', 'blue_wedge'];
BuildingFactory.prototype.wedges = ['wedge', 'green_wedge', 'blue_wedge', 'gaddafi'];
