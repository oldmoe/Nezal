var Animation = {
	show: function(div){
		Effect.Grow(div, {
			duration: 0.3
		});
	},
	
	hide: function(div){
		Effect.Shrink(div, {
			duration: 0.3
		});
	},
  springFade : function(div,yTransition){
    new Effect.Move(div, {mode : 'relative', y: yTransition, transition : Effect.Transitions.spring, afterFinish : function(){new Effect.Fade(div)}})
  }
}
