var Animation = {

  show : function(div){
    Effect.Grow(div, {duration : 0.3});
  },

  hide : function(div){
    Effect.Shrink(div, {duration:0.3});
  }

}
