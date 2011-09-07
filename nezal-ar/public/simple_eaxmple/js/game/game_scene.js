var GameScene = Class.create(Scene, {
  x: 0,
  y: 0,
  width : 290,
  height : 440,
  groundLayer : null,
  buildingsLayer : null,
  
  initialize: function ($super, ctx){
  	$super();
  	this.ctx = ctx
  	this.buildingsLayer = new Layer(this.ctx)
  	this.buildingsLayer.clear = true
  	this.groundLayer = new Layer(this.ctx)
  	
  	this.layers.push(this.groundLayer)
  	this.layers.push(this.buildingsLayer)
  	
  },

  init: function(){
  	this.initCanvas()
  	this.turrets = []
 
 	this.jet = this.addJet()
 	
  	for (var i=0; i < 20; i++) {
		this.turrets.push(this.addHumvee(this.random(this.width-40), this.random(this.height-30), this.jet))
	}

  },	
  
  initCanvas: function(){
  	
 	var context = this.ctx
    context.strokeStyle = 'black';
    context.strokeRect(1, 1, this.width, this.height);

    context.fill();
    context.stroke();
 	
  },
  
  addJet: function(){
  	var jet = new Jet(200, 200, this);
  	this.objects.push(jet);
  	var jetDisplay = new JetDisplay(jet);
  	
  	this.buildingsLayer.attach(jetDisplay.sprite)
  },
  
  addHumvee: function(x, y, rotation){
  	var humvee = new Humvee(x, y, rotation);
  	this.objects.push(humvee);
  	var humveeDisplay = new HumveeDisplay(humvee);
  	
  	this.buildingsLayer.attach(humveeDisplay.sprite)
  },
  
  
  random: function(max){
  	return 20+Math.random() * max;
  }
	  
});