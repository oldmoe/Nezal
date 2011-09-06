var Observer = Class.create({
    
    observers: null,
    
    initialize: function(){
        this.observers = {};
    },
    
  fire : function(event){
    if(this.observers[event]){
      var observers = Nezal.clone_obj(this.observers[event]);
      for(var i=0;i<observers.length;i++){
        observers[i]()
      }
    }
  },
  
  addObserver : function(event,func){
    if(!this.observers[event])this.observers[event] = []
    this.observers[event].push(func)
  }
    
    
});