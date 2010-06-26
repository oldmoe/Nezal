var ControlPanel = {
    top : 0,
    
    toggle : function(){
        state = $$('#controlpanel #title div')[1].getAttribute('class')
        if(state == 'open off')
        {
            $$('#controlpanel #title div')[1].setAttribute('class', 'open on');
            $$('#controlpanel #panel-content')[0].style.top = '-190px';
            new Effect.Move('panel-content', {x:33, y: 46, mode: 'absolute', duration: 0.5, afterFinish : function(){ }})
            
        }else{
            $$('#controlpanel #title div')[1].setAttribute('class', 'open off');
            new Effect.Move('panel-content', {x:33, y: -190, mode: 'absolute', duration: 0.5, afterFinish : function(){ }})
        }
    },
}
