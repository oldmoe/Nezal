var Aspect = {
  before : function(object, funcName, advice){
    var oldFunc = object[funcName];
    object[funcName] = function(){
      advice.apply(object, arguments);
      return oldFunc.apply(object, arguments);
    }
  },
  
  after : function(object, funcName, advice){
    var oldFunc = object[funcName];
    object[funcName] = function(){
      var args = [oldFunc.apply(object, arguments)];
      for(var i = 0; i < arguments.length; i++){
        args.push(arguments[i])
      }
      return advice.apply(object, args);
    }
  },
  
  around : function(object, funcName, advice){
    var oldFunc = object[funcName];
    object[funcName] = function(){
      var args = [oldFunc];
      for(var i = 0; i < arguments.length; i++){
        args.push(arguments[i])
      }
      return advice.apply(object, args);
    }  
  }  
}
