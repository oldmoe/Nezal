var Hand = {

  topOffset : 0,

  leftOffset : 0,

  direction : null,

  moveDirection : null,
  
  game : null,
  /*  
    Takes as params : hash { 'object', 'rotated' }
     - object : the html object to point at 
     - rotated : whether it should look up or down, true for up
   */
  point : function(game, params) {
    console.log(game, params);
    this.game = game;
    var obj = params['object'];
    var rotated = params['rotated'];
    var position = Element.cumulativeOffset(obj);
    $('hand').removeClassName('rotated');
    this.direction = 1;
    if(rotated) 
    {
      this.direction = -1;
      $('hand').addClassName('rotated');
    }
    this.moveDirection = this.direction * -1 ;
    this.topOffset = position[1] - 60 * this.direction;
    this.leftOffset = position[0] - 25;
    $('hand').setStyle({ top : this.topOffset + "px", left : this.leftOffset  + "px" });
		this.game.scene.pushToRenderLoop('hand', this);
    $('hand').show(); 
  },

  render : function(){
    this.topOffset = this.topOffset + 8*this.moveDirection*this.direction;
    this.leftOffset = this.leftOffset + 8*this.moveDirection;
    $('hand').setStyle({zIndex : 1001,  top : this.topOffset + "px", left : this.leftOffset + "px" });
    this.moveDirection *= -1;
  },

  hide : function(){
    this.game.scene.removeFromRenderLoop('hand',this);
    $('hand').hide();
  }

}
