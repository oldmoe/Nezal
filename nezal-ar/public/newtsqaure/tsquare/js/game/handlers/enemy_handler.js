var EnemyHandler = Class.create(UnitHandler, {
   type : "right",
   add: function($super, elem){
       $super(elem)
       if(elem.name == "block"){
          this.incomming[elem.lane][this.incomming[elem.lane].length-1].options.rows = elem.rows;
          this.incomming[elem.lane][this.incomming[elem.lane].length-1].options.columns = elem.columns;
          this.incomming[elem.lane][this.incomming[elem.lane].length-1].options.obj = elem.object;
       }
   }
   
});