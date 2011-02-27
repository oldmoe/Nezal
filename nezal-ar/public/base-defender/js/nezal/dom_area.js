var DomArea = Class.create({
  initialize : function(options){
    this.transparentImage = Loader.images.buildingModes["transparent.png"].clone();
    this.transparentImage.setAttribute('usemap', '#' + options.useMapId);
    this.map = $(document.createElement('map'));
    this.transparentImage.setStyle({width:options.size.width+"px",height:options.size.height+"px"})
    this.map.setAttribute('name', options.useMapId);
    this.area = $(document.createElement('area'));
    this.area.setAttribute('shape', options.shape);
    this.area.setAttribute('coords', options.coords);
    
    if( options.areaID ){
      this.area.setAttribute('id', options.areaID);
    }
    
    if( options.transparentImageStyle ){
      this.transparentImage.setStyle(options.transparentImageStyle);
    }
    
    this.map.appendChild(this.area);
    options.parentDiv.appendChild(this.transparentImage);
    options.mapParentDiv.appendChild(this.map);
  }
});