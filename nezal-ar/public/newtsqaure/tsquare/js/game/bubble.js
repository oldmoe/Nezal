var Bubble = Class.create(Unit,{
  initialize : function($super,scene,x,y,text){
    $super(scene,x,y)
    this.text = text
  },
  textInfo : function(){
    console.log(this.text)
    return this.text
  }
})
