/**
 * @author michaelyoussef
 */
var ProgressDisplay = Class.create({
  initialize : function(time, elapsed){
    this.time = time;
    this.elapsed = elapsed || 0
    this.html = TrimPath.processDOMTemplate("progress-template");
    var div = document.createElement('DIV')
    div.innerHTML = this.html;
    div.addClassName('progressContainer')
    this.div = $(document.body.appendChild(div));
    this.timeContainer = this.div.down('.progressTime')
    this.progressBar = this.div.down('.progressBar')
  },
  
  render : function(){
    this.progressBar.setStyle({width:this.width()});
    this.timeContainer.innerHTML = this.timeRemaining();
    if( this.elaspsed >= this.time) {
      
    }
  },
  
  width : function(){
   return Math.round((this.elapsed / this.time)*100) + '%' 
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
