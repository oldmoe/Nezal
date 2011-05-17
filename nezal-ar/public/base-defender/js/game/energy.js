var Energy = Class.create({
  energy : null,
  bonusSeconds : null,
  maxHelpingPower : null,
  helpingPowerUnitEvery : null,
  xpLevel : null,
  seedTime : null,
  
  initialize : function(game){
    var self = this;
    this.seedTime = new Date().getTime();
    this.game = game;
    this.xpLevel = game.user.data.xp_info.xp_level;
    this.energy = game.user.data.xp_info.energy;
    this.bonusSeconds = game.user.data.xp_info.bonus_seconds;
    this.maxHelpingPower = this.currentXPLevelData().max_helping_power;
    this.helpingPowerUnitEvery = this.currentXPLevelData().helping_power_unit_every;
    new EnergyDisplay(this);
    game.reactor.pushPeriodical(0,1,game.reactor.everySeconds(0.5), function(){self.tick()})
  },
  
  currentXPLevelData : function(){
    return this.game.data.xp_levels[ this.xpLevel ];
  },
  
  tick : function(){
    if( this.maxHelpingPower == this.energy ) return;
    var secondsPassed = (new Date().getTime() - this.seedTime)/1000;
    this.remainingTillNextEnergyUnit = this.helpingPowerUnitEvery - this.bonusSeconds - Math.floor(secondsPassed);
    //console.log( this.bonusSeconds);
    if( this.remainingTillNextEnergyUnit <= 0 ){
      this.seedTime = new Date().getTime();
      this.bonusSeconds = 0;
      this.energy += 1;
    }
    if( this.remainingTillNextEnergyUnit <= 0 ) this.remainingTillNextEnergyUnit = this.helpingPowerUnitEvery;
    
  }
});