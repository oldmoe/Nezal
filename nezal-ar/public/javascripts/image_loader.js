//loads images and store them in memory for later use
var ImageLoader = {
	loadedImages : 0,
	images : [],
	/*
	this method loads the images
		@imageNames 		    array of names of the images for ex: ['tank.png','creep.png']
		@path 					the path that contains the images for ex: c:/images/
		@onProgressCallBack  	a callback that takes a parameter "progress" and it's called each time an image is loaded
		@onFinishCallBack		a callback that is called after all images are loaded
	*/
	load : function(imageNames,path,onProgressCallBack,onFinishCallBack){
		returnedImages = []
		for ( var  i=0 ; i< imageNames.length ; i++ ){
		  if(!ImageLoader.images[imageNames[i]]){
		  ImageLoader.images[imageNames[i]] = ImageLoader.loadImage(path + imageNames[i],imageNames.length,onProgressCallBack,onFinishCallBack);
		   }
		   else ImageLoader.loadedImages++
		  returnedImages[imageNames[i]] = ImageLoader.images[imageNames[i]]
		} 
		return returnedImages
	},
	onloadImage: function(totalImages,onProgressCallBack,onFinishCallBack){
		ImageLoader.loadedImages++;
		onProgressCallBack(Math.round((ImageLoader.loadedImages/totalImages)*100))
		if(ImageLoader.loadedImages == totalImages){
			onFinishCallBack()
			ImageLoader.loadedImages = 0
		}
		
	},
	
	loadImage : function(src,totalImages,onProgressCallBack,onFinishCallBack){
		var image = new Image();
		image.onload = ImageLoader.onloadImage(totalImages,onProgressCallBack,onFinishCallBack);
		image.src = src
		return image
	},
	
}
