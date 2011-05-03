var ProgressDisplay = Class.create({
  initialize : function(time, top, left, zIndex, type){
    this.time = time;
    this.elapsed = 0
    this.html = game.templatesManager.load("progress");
    var div = document.createElement('DIV')
    div.innerHTML = this.html;
    div.addClassName('progressContainer')
    this.div = $($('gameCanvas').appendChild(div));
    //We are adding 100 to make sure that the progress bar is always above any parallel building
    this.div.setStyle({top:top+"px", left:left+"px", zIndex : zIndex+100});
    this.timeContainer = this.div.down('.progressTime')
    this.actionContainer = this.div.down('.progressAction')
    this.actionContainer.innerHTML = type
    this.progressBar = this.div.down('.progressBar')
  },
  
  render : function(elapsed){
    if (this.elapsed < this.time) {
      this.elapsed = elapsed;
      this.progressBar.setStyle({
        width: this.width()
      });
      this.timeContainer.innerHTML = this.timeRemaining();
    }
  },
  
  destroy : function(){
    if(this.div.parentNode){
      this.div = $(this.div.parentNode.removeChild(this.div))
    }
  },
  
  width : function(){
    var width = Math.round((this.elapsed / this.time)*100);
    return width >= 100 ? 100+'%' : width+'%' 
  },
  
  timeRemaining : function(){
    var remainingTime = this.time - this.elapsed;
  	return Util.timeDisplay(remainingTime)
  }
  
})
