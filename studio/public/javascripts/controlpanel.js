var ControlPanel = {
    top : 0,
    
    toggle : function(){
        state = $$('#controlpanel #title div')[1].getAttribute('class')
        if(state == 'open off')
        {
            $$('#controlpanel #title div')[1].setAttribute('class', 'open on');
            $$('#controlpanel #title div')[0].setAttribute('class', 'close off');
            $$('#controlpanel #panel-content')[0].style.top = '-225px';
            new Effect.Move('panel-content', {x:33, y: 46, mode: 'absolute', duration: 0.5, afterFinish : function(){ }})
            
        }else{
            $$('#controlpanel #title div')[0].setAttribute('class', 'close on');
            $$('#controlpanel #title div')[1].setAttribute('class', 'open off');
            new Effect.Move('panel-content', {x:33, y: -225, mode: 'absolute', duration: 0.5, afterFinish : function(){ }})
        }
    },
}
