var Animation = {
	show: function(div){
		new Effect.Grow(div, {
			duration: 0.3
		});
	},
	
	hide: function(div){
		new Effect.Shrink(div, {
			duration: 0.3
		});
	},
  springFade : function(div,yTransition,afterFinishFn){
    if(this.sf)this.sf.cancel()
    this.sf = new Effect.Move(div, {
      mode: 'relative',
      y: yTransition,
      transition: Effect.Transitions.spring,
      afterFinish: function(){
        new Effect.Fade(div, {
          afterFinish: function(){
            if (afterFinishFn) 
              afterFinishFn()
          }
        })
      }
    })
    
  }
}
