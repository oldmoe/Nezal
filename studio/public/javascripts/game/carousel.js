var Carousel = Class.create( {
    
    id : null,
    
    ulId : null,
    
    currIndex : 0,

    width : 0,
    
    scroll : 3,
    
    offset : 0,
    
    displayCount : 3,
    
    initialize : function(id){
        this.id = id;
        this.width = parseInt($$('#' + this.id + ' ul li')[0].getStyle('width'));
        this.ulId = $$('#' + this.id + ' ul')[0].id;
        this.offset = $(this.id).cumulativeOffset()[0];
        this.right = $$('#' + this.id +  ' .right')[0];
        this.right.carousel = this;
        this.left = $$('#' + this.id +  ' .left')[0];
        this.left.carousel = this;
        this.right.observe('click', function(event){
                                                        Event.element(event).carousel.scrollLeft();
                                                    });
        this.left.observe('click', function(event){
                                                        Event.element(event).carousel.scrollRight();
                                                    });
    },
    
    scrollRight : function(){
        if (this.currIndex > this.displayCount )
        {
            var distance = this.scroll * this.width
            this.currIndex -= this.scroll;
            new Effect.Move(this.ulId, {x:distance, y: 0, mode: 'relative', duration: 0.3, afterFinish : function(){ }})          
            this.checkButtons();
            console.log(this.currIndex)
        }else if (this.currIndex > 0){
            var distance = this.currIndex * this.width
            this.currIndex -= this.currIndex;
            new Effect.Move(this.ulId, {x:distance, y: 0, mode: 'relative', duration: 0.3, afterFinish : function(){ }})          
            this.checkButtons();
        }
    },
    
    scrollLeft : function(){
        if(this.currIndex < ($$('#' + this.ulId + ' li').length - this.displayCount - this.scroll ))
        {
          var distance = -1 * this.scroll * this.width;
          this.currIndex += this.scroll;
          new Effect.Move(this.ulId, {x:distance, y: 0, mode: 'relative', duration: 0.3, afterFinish : function(){ }})
          this.checkButtons();
          console.log(this.currIndex)
        }else if(this.currIndex < ($$('#' + this.ulId + ' li').length - this.displayCount ))
        {
            var step = $$('#' + this.ulId + ' li').length - this.displayCount - this.currIndex;
            this.currIndex += step
            var distance = -1 * step * this.width;
            new Effect.Move(this.ulId, {x:distance, y: 0, mode: 'relative', duration: 0.3, afterFinish : function(){ }});
            this.checkButtons(); 
        }
    },
    
    scrollTo : function(index){
        if(index > ($$('#' + this.ulId + ' li').length - this.displayCount))
            index = $$('#' + this.ulId + ' li').length - this.displayCount
        var distance = (this.currIndex - index) * this.width;
        this.currIndex = index;
        new Effect.Move(this.ulId, {x:distance, y: 0, mode: 'relative', duration: 0.3, afterFinish : function(){ }})
        this.checkButtons();
    },
    
    checkButtons : function(){  
        if(this.currIndex == 0 )
        {
            this.left.addClassName('leftOff');
            this.left.removeClassName('leftOn');
        }else{
            this.left.addClassName('leftOn');
            this.left.removeClassName('leftOff');
        }
        if(this.currIndex == ($$('#' + this.ulId + ' li').length - this.displayCount ))
        {
            this.right.addClassName('rightOff');
            this.right.removeClassName('rightOn');
        }else{
            this.right.addClassName('rightOn');
            this.right.removeClassName('rightOff');
        }
    }
    
})
