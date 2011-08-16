var Block = Class.create({
    //params contains x,y(initial @x, @y of the block) and @rows,@columns which are the dimensions of the block
    //params also contain elememnts which are the objects in the block
    elements: null,
    initialize : function(scene,params){
      this.elements = []
      this.addElementsToBlock(params)
    },
    addElementsToBlock : function(params){
      var counter = 0
      for(var i=0;i<params.rows;i++){
        this.elements[i] = []
        for (var j = 0; j < params.columns; j++) {
          this.elements[i][j] = params.elements[counter++]
          this.elements[i][j].coords.x = params.x + 40 * i
          this.elements[i][j].coords.y = params.y + 32 * j
        }
      }
    }
    
})
