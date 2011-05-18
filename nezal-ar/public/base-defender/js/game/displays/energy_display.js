var EnergyDisplay = Class.create({
  maxMiddleBarWidth : 211,
  
  initialize : function(energyObject){
    this.owner = energyObject;
    Object.extend(this.owner,this);
  },
  
  render : function(){
    $$('#energy_bar #energy_text')[0].innerHTML = this.owner.energy + "/" + this.owner.maxHelpingPower;
    if( this.owner.energy > 0 ){
      $('energy_fill_bar_left').addClassName('anyEnergy');
    }
    if( this.owner.energy == 0 ){
      $('energy_fill_bar_left').removeClassName('anyEnergy');
    }
    
    if( this.owner.energy >= this.owner.maxHelpingPower ){
      $('energy_fill_bar_right').addClassName('full');
    } else {
      $('energy_fill_bar_right').removeClassName('full');
    }
    
    if( this.owner.energy < this.owner.maxHelpingPower ){
      $$('#energy_bar #more_energy_text')[0].innerHTML = Util.timeDisplay(this.owner.remainingTillNextEnergyUnit);
    } else {
      $$('#energy_bar #more_energy_text')[0].innerHTML = "";
    }
    
    var energyDisplayUnitWidth = this.maxMiddleBarWidth / this.owner.maxHelpingPower;
    var middleBarWidth = energyDisplayUnitWidth * this.owner.energy;
    $('energy_fill_bar_middle').setStyle({width : middleBarWidth+"px"});
  }
});