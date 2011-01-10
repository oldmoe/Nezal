var Hand = {

  topOffset : 0,

  leftOffset : 0,

  direction : -1,

  moveDirection : -1,
  
  game : null,
  /*  
    Takes as params : hash { 'object', 'rotated' }
     - object : the html object to point at 
     - rotated : whether it should look up or down, true for up
   */
  point : function(game, params) {
    this.game = game;
    var obj = params['object'];
    var rotated = params['rotated'];
    var position = Element.cumulativeOffset(obj);
    $('hand').removeClassName('rotated');
    if(rotated) 
    {
      this.direction = 1;
      $('hand').addClassName('rotated');
    }
    this.moveDirection = this.direction;
    this.topOffset = position[1] + 60 * this.direction;
    this.leftOffset = position[0];
    $('hand').setStyle({ top : this.topOffset + "px", left : this.leftOffset  + "px" });
		this.game.scene.pushToRenderLoop('hand', this);
    $('hand').show(); 
  },

  render : function(){
    var topOffset = this.topOffset + 5*this.moveDirection;
    var leftOffset = this.leftOffset + 5*this.moveDirection
    $('hand').setStyle({ top : topOffset + "px", left : leftOffset + "px" });
    console.log(topOffset, leftOffset )
    this.moveDirection *= -1;
  },

  hide : function(){
    this.game.scene.removeFromRenderLoop('hand',this);
    $('hand').hide();
  }

}
