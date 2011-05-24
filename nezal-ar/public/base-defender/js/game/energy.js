var Energy = Class.create({
  energy : null,
  bonusSeconds : null,
  maxHelpingPower : null,
  helpingPowerUnitEvery : null,
  xpLevel : null,
  seedTime : null,
  initialize : function(game){
    var self = this;
    this.game = game;
    var userDataSource = null;
    if( game.neighborGame ){
      var energySnapshot = game.energy.snapshot();
      this.seedTime = energySnapshot.seedTime;
      userDataSource = energySnapshot;
    } else {
      this.seedTime = new Date().getTime();
      userDataSource = game.user.data
    }
    this.xpLevel = userDataSource.xp_info.xp_level;
    this.energy = userDataSource.xp_info.energy;
    this.bonusSeconds = userDataSource.xp_info.bonus_seconds;
    this.maxHelpingPower = this.currentXPLevelData().max_helping_power;
    this.helpingPowerUnitEvery = this.currentXPLevelData().helping_power_unit_every;
    
    game.reactor.pushPeriodical(0,1,game.reactor.everySeconds(0.5), function(){self.tick()})
  },
  
  currentXPLevelData : function(){
    return this.game.data.xp_levels[ this.xpLevel ];
  },
  
  tick : function(){
    if( this.maxHelpingPower == this.energy ) return;
    var secondsPassed = (new Date().getTime() - this.seedTime)/1000;
    this.remainingTillNextEnergyUnit = this.helpingPowerUnitEvery - this.bonusSeconds - Math.floor(secondsPassed);
    if( this.remainingTillNextEnergyUnit <= 0 ){
      this.seedTime = new Date().getTime();
      this.bonusSeconds = 0;
      this.energy += 1;
    }
    if( this.remainingTillNextEnergyUnit <= 0 ) this.remainingTillNextEnergyUnit = this.helpingPowerUnitEvery;
  },
  
  snapshot : function(){
    return {
      xp_info: {
        xp_level: this.xpLevel,
        energy: this.energy,
        bonus_seconds: this.bonusSeconds
      },
      seedTime: this.seedTime
    };
  }
});
