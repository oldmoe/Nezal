var Carousel = Class.create( {
    
    id : null,
    
    ulId : null,
    
    currIndex : 0,

    width : 0,
    
    scroll : 3,
    
    offset : 0,
    
    displayCount : 3,
    
    enabled : true,
    
    images : {  'left' : "",
                'left-disabled' : "",
                'right' : "",
                'right-disabled' : "" },
    
    initialize : function(id, images, displayCount){
        this.id = id;
        this.images = images;
        var lis = $$('#' + this.id + ' ul li')
				if (lis[0] && lis[1]) {
          this.width = Math.abs(lis[1].cumulativeOffset().left - lis[0].cumulativeOffset().left );
        }else if(lis[0]){
          this.width = parseInt($$('#' + this.id + ' ul li')[0].getStyle('width')) +
          parseInt($$('#' + this.id + ' ul li')[0].getStyle('padding-left')) +
          parseInt($$('#' + this.id + ' ul li')[0].getStyle('padding-right'))
          if($$('#' + this.id + ' ul li')[0].getStyle('margin-left'))                 
                  this.width+=parseInt($$('#' + this.id + ' ul li')[0].getStyle('margin-left'))
          if($$('#' + this.id + ' ul li')[0].getStyle('margin-right')) 
                  this.width+=parseInt($$('#' + this.id + ' ul li')[0].getStyle('margin-right'));
        }else {
          this.width = $(this.id + "-container").getWidth()/displayCount;
        }
        this.displayCount = displayCount;
        this.scroll = displayCount;
        this.ulId = $$('#' + this.id + ' ul')[0].id;
        this.listSize =  $$('#' + this.ulId + ' li').length;
        $(this.ulId).style.left = 0;
        $(this.ulId).style.border = 'none';
        if($(this.ulId).getStyle('direction') == 'rtl')
        {
          this.direction = -1;
          $(this.ulId).setStyle('float', 'right');
        }
        else
        {
          this.direction = 1;
          $(this.ulId).setStyle('float', 'left');
        }
        this.offset = $(this.id).cumulativeOffset()[0];
        this.right = $$('#' + this.id +  ' .right img')[0];
        this.right.carousel = this;
        this.left = $$('#' + this.id +  ' .left img')[0];
        if($$('#' + this.id +  ' .first')[0]) this.first = $$('#' + this.id +  ' .first img')[0];
        if($$('#' + this.id +  ' .last')[0]) this.last = $$('#' + this.id +  ' .last img')[0];
        this.left.carousel = this;
        this.right.observe('click', function(event){    
                                                        Event.element(event).carousel.scrollLeft();
                                                    });
        this.left.observe('click', function(event){
                                                        Event.element(event).carousel.scrollRight();
                                                    });
        if(this.first) {
          this.first.carousel = this;
          this.first.observe('click', function(event){    
                                                          Event.element(event).carousel.scrollTo(0);
                                                      });
        }
        if(this.last) {
          this.last.carousel = this;
          this.last.observe('click', function(event){
                                                        Event.element(event).carousel.scrollTo(Event.element(event).carousel.listSize-1);
                                                    });
        }
        this.checkButtons()
    },
    
    destroy : function(){
        this.right.stopObserving('click');
        this.left.stopObserving('click');
        if(this.first) this.first.stopObserving('click');
        if(this.last) this.last.stopObserving('click');
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
            var step = -1 * this.direction * (newIndex - this.currIndex) * this.width;
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
            var step = -1 * this.direction * (newIndex - this.currIndex) * this.width;
            this.currIndex = newIndex;
            var carousel = this;
            new Effect.Move(this.ulId, {x: step, y: 0, mode: 'relative', duration: 0.3, afterFinish : function(){ carousel.enabled = true; } })
            this.checkButtons();
        }
    },
    
    scrollTo : function(index){
        if(index > Math.abs(this.listSize - this.displayCount))
            index = this.listSize - this.displayCount
        var distance = this.direction * (this.currIndex - index) * this.width;
        this.currIndex = index;
        new Effect.Move(this.ulId, {x:distance, y: 0, mode: 'relative', duration: 0.3, afterFinish : function(){ }})
        this.checkButtons();
    },
    
    checkButtons : function(){  
        if(this.currIndex == 0 )
        {
            this.left.addClassName('leftOff');
            this.left.src = this.images['left-disabled'];
            this.left.removeClassName('leftOn');
            if(this.first){
              this.first.addClassName('leftOff');
              this.first.removeClassName('leftOn');
            }
        }else{
            this.left.addClassName('leftOn');
            this.left.src = this.images['left'];
            this.left.removeClassName('leftOff');
            if(this.first){
              this.first.addClassName('leftOn');
              this.first.removeClassName('leftOff');
            }
        }
    		if( (this.currIndex == (this.listSize - this.displayCount )) || (this.listSize < this.displayCount))
        {
            this.right.addClassName('rightOff');
            this.right.src = this.images['right-disabled'];
            this.right.removeClassName('rightOn');
            if(this.last){
              this.last.addClassName('rightOff');
              this.last.removeClassName('rightOn');
            }
        }else{
            this.right.addClassName('rightOn');
            this.right.src = this.images['right'];
            this.right.removeClassName('rightOff');
            if(this.last){
              this.last.addClassName('rightOn');
              this.last.removeClassName('rightOff');
            }
        }
    }
    
})
