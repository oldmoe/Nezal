var A = Class.create({
  
  initialize: function(){
    this.foo();
  },
  
  foo: function(){
    console.log("A.foo");
  }
})


var B = Class.create(A,{

  initialize: function($super){
    $super();
    var t = new Aa();
    Object.extend(this, t);
    this.foo();
  },
  
  foo: function($super){
    $super();
  }
  
})


var Aa = Class.create({
  
  initialize: function(){
  },
  
  foo: function($super){
    $super();
  }
  
})


var Bb = Class.create({
  
})
