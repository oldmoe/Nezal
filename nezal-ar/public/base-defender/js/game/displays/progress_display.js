/**
 * @author michaelyoussef
 */
var ProgressDisplay = Class.create({
  initialize : function(time, top, left, zIndex){
    this.time = time;
    this.elapsed = 0
    this.html = TrimPath.processDOMTemplate("progress-template");
    var div = document.createElement('DIV')
    div.innerHTML = this.html;
    div.addClassName('progressContainer')
    this.div = $($('gameCanvas').appendChild(div));
    this.div.setStyle({top:top+"px", left:left+"px","z-index" : zIndex});
    this.timeContainer = this.div.down('.progressTime')
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
    var string = ''
    var remainingTime = this.time - this.elapsed;
    var seconds = remainingTime % 60
    remainingTime = ((remainingTime - seconds) / 60)
    var minutes = remainingTime % 60
    remainingTime = ((remainingTime - minutes) / 60)
    var hours = remainingTime % 24
    remainingTime = ((remainingTime - hours) / 24)
    var days = Math.floor(remainingTime)
    if(days > 0){
      string = days + 'd ' + hours + 'h'
    }else if(hours > 0){
      string = hours + 'h ' + minutes + 'm'      
    }else if(minutes > 0){
      string = minutes + 'm ' + seconds + 's'
    }else{
      string = seconds + ' seconds'
    }
    return string;
  }
  
})
