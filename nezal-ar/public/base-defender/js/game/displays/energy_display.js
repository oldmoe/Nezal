var EnergyDisplay = Class.create({
  maxMiddleBarWidth : 198,
  
  initialize : function(game){
    this.game = game;
    Object.extend(game.energy, this);
  },
  
  render : function(){
    var energyObject = this.game.energy;
    $$('#energy_bar #energy_text')[0].innerHTML = energyObject.energy + "/" + energyObject.maxHelpingPower;
    if( energyObject.energy > 0 ){
      $('energy_fill_bar_left').addClassName('anyEnergy');
    }
    if( energyObject.energy == 0 ){
      $('energy_fill_bar_left').removeClassName('anyEnergy');
    }
    
    if( energyObject.energy >= energyObject.maxHelpingPower ){
      $('energy_fill_bar_right').addClassName('full');
    } else {
      $('energy_fill_bar_right').removeClassName('full');
    }
    
    if( energyObject.energy < energyObject.maxHelpingPower ){
      $$('#energy_bar #more_energy_text')[0].innerHTML = Util.timeDisplay(energyObject.remainingTillNextEnergyUnit);
    } else {
      $$('#energy_bar #more_energy_text')[0].innerHTML = "";
    }
    
    var energyDisplayUnitWidth = this.maxMiddleBarWidth / energyObject.maxHelpingPower;
    var middleBarWidth = energyDisplayUnitWidth * energyObject.energy;
    $('energy_fill_bar_middle').setStyle({width : middleBarWidth+"px"});
  }
});