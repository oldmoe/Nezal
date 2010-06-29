var Carousel = Class.create( {
    
    id : null,
    
    ulId : null,
    
    currIndex : 0,

    width : 0,
    
    scroll : 3,
    
    offset : 0,
    
    displayCount : 3,
    
    enabled : true,
    
    initialize : function(id){
        this.id = id;
        this.width = parseInt($$('#' + this.id + ' ul li')[0].getStyle('width'));
        this.ulId = $$('#' + this.id + ' ul')[0].id;
        this.listSize =  $$('#' + this.ulId + ' li').length;
        $(this.ulId).style.left = 0;
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
    
    destroy : function(){
        this.right.stopObserving('click');
        this.left.stopObserving('click');
    },
    
    scrollRight : function(){
        var distance = 0
        if (this.currIndex > 0)
        {
            if(!this.enabled) return;
            this.enabled = false;
            var newIndex = this.currIndex - this.scroll;
            if (newIndex < 0)
              newIndex = 0;
            var step = -1 * (newIndex - this.currIndex) * this.width;
            this.currIndex = newIndex;
            var carousel = this;
            new Effect.Move(this.ulId, {x: step, y: 0, mode: 'relative', duration: 0.5, afterFinish : function(){ carousel.enabled = true; } })
            this.checkButtons();              
        }
    },
    
    scrollLeft : function(){
        if (this.currIndex < this.listSize - this.displayCount )
        {
            if(!this.enabled) return;
            this.enabled = false;
            var newIndex = this.currIndex + this.scroll;
            if ( newIndex > this.listSize - this.displayCount )
                newIndex = this.listSize - this.displayCount;
            var step = -1 * (newIndex - this.currIndex) * this.width;
            this.currIndex = newIndex;
            var carousel = this;
            new Effect.Move(this.ulId, {x: step, y: 0, mode: 'relative', duration: 0.5, afterFinish : function(){ carousel.enabled = true; } })
            this.checkButtons();
        }
    },
    
    scrollTo : function(index){
        if(index > (this.listSize - this.displayCount))
            index = this.listSize - this.displayCount
        var distance = (this.currIndex - index) * this.width;
        this.currIndex = index;
        new Effect.Move(this.ulId, {x:distance, y: 0, mode: 'relative', duration: 0.5, afterFinish : function(){ }})
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
        if(this.currIndex == (this.listSize - this.displayCount ))
        {
            this.right.addClassName('rightOff');
            this.right.removeClassName('rightOn');
        }else{
            this.right.addClassName('rightOn');
            this.right.removeClassName('rightOff');
        }
    }
    
})
