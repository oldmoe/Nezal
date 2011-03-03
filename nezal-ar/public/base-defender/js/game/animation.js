var Animation = {

  show : function(div){
    Effect.Grow(div, {duration : 0.2});
  },

  hide : function(div){
    Effect.Shrink(div, {duration:0.2});
  }

}
