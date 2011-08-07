var Game = Class.create({
  
  initialize: function(){
    this.startLoading()				
	},
  startLoading : function(){
    var self = this
    this.network = new Network()
    this.templatesManager = new TemplatesManager(this.network);
    new Loader().load([{images : ['logo.png'], path: 'images/loading/', store: 'loading'}],
                      {onFinish : function(){
                         $('inProgress').show();
                        $('inProgress').innerHTML = self.templatesManager.load("loadingScreen");
 					            self.addLoadedImagesToDiv('inProgress');
                        self.initializeGame();
                      }});
  },
	initializeGame : function(){
    $('inProgress').hide()
    $('gameCanvas').show()
    $('container').show()
    
    this.scene = new TsquareScene()
		
		var backgroundImages = ['skyline.png', 'skyline_transparent.png', 'cloud.jpg', 'road.jpg']
		var gameElementsImages = ['arrow_up.png','arrow_down.png', 'bubble.png', 'world.png']
    var characterImages = ['crowd_member.png','follower.png', 'npc.png']
    var enemiesImages = ['block.png']
		var self = this
		new Loader().load([{images: backgroundImages, path: 'images/background/', store: 'background'},
    {images: gameElementsImages, path: 'images/game_elements/', store: 'gameElements'},
    {images: characterImages, path: 'images/characters/', store: 'characters'},
    {images: enemiesImages, path: 'images/enemies/', store: 'enemies'}], {
      onProgress : function(progress){
                          if($$('#inProgress #loadingBarFill')[0])
                          $$('#inProgress #loadingBarFill')[0].style.width = Math.min(progress,88)+"%"
      },
      onFinish:function(){
			self.scene.start()
		}})

  },
  addLoadedImagesToDiv: function(divId){
    $$('#' + divId + ' .loadedImg').each(function(imgSpan){
      var classes = null
      if (imgSpan.getAttribute('imgClasses')) {
        var classes = imgSpan.getAttribute('imgClasses').split('-')
      }
      var imgPath = imgSpan.getAttribute('imgSrc').split('/')
      var imgPart = Loader
      for (var i = 0; i < imgPath.length; i++) {
        imgPart = imgPart[imgPath[i]]
      }
      var img = $(imgPart).clone()
      var parent = $(imgSpan.parentNode)
      img = parent.insertBefore(img, imgSpan)
      parent.removeChild(imgSpan)
      if (imgSpan.getAttribute('imgId')) 
        img.id = imgSpan.getAttribute('imgId')
      if (imgSpan.getAttribute('hidden') == "true") 
        img.setStyle({
          "display": 'none'
        });
      if (classes) {
        for (var i = 0; i < classes.length; i++) {
          img.addClassName(classes[i])
        }
      }
      var style = imgSpan.getAttribute('imgStyle')
      if (style) 
        img.setAttribute('style', style)
    })
  }
});