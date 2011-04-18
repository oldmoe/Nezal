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
    this.game = game;
    this.obj = params['object'];
    var rotated = params['rotated'];
    var position = Element.cumulativeOffset(this.obj);
    $('hand').removeClassName('rotated');
    this.direction = 1;
    if(rotated) 
    {
      this.direction = -1;
      $('hand').addClassName('rotated');
    }
    this.moveDirection = this.direction * -1 ;
    this.render();
		this.game.scene.pushToRenderLoop('hand', this);
    $('hand').show(); 
  },

  render : function(){
    var position = Element.cumulativeOffset(this.obj);
    this.topOffset = position[1] - 60 * this.direction;
    this.leftOffset = position[0] - 25;
    this.topOffset = this.topOffset + 6*this.moveDirection*this.direction;
    this.leftOffset = this.leftOffset + 6*this.moveDirection;
    $('hand').setStyle({zIndex : 1001,  top : this.topOffset + "px", left : this.leftOffset + "px" });
    var parents = this.obj.ancestors();
    var visible = true;
    for(var i = 0; i < parents.length; i++)
    {
      parent = parents[i];
      parentOffset = Element.cumulativeOffset(parent);
      if(parent.getStyle('overflow') == 'hidden')
      {
        if(position.top < parentOffset.top || position.top > parentOffset.top + parent.getStyle('height'))
        {
          visible = false;
          break;
        }
        if(position.left < parentOffset.left || position.left > parentOffset.left + parent.getStyle('height'))
        {
          visible = false;
          break;
        }
      }
    }
    if(visible)
      $('hand').show();      
    else
      $('hand').hide();
    this.moveDirection *= -1;
  },

  hide : function(){
    this.game.scene.clearRenderLoop('hand');
    $('hand').hide();
  }

}
