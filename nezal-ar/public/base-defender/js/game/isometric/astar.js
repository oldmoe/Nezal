var Node = Class.create({
	x:0,
	y:0,
	terrainType :0,
	value :0,
  ignorePlace : false,
	h:0,
	g:0,
	f:0,
	closed :false,
	visited : false,
	node: null,
	parent : null,
	initialize : function(x,y){
		this.x=x
		this.y=y
	}
})
var AstarNode = Class.create({
	initialize : function(node){
		this.node = node
	}
})
var Astar = Class.create({
	Initialize : function(){
	
	},
	getOptimalPath :function(map, srcNode, dstNode){
		var openList = []
		openList.push(srcNode)
        while(openList.length > 0) {
            var lowInd = 0;
            for(var i=0; i<openList.length; i++) {
			    if(openList[i].f < openList[lowInd].f) { lowInd = i; }
		    }
		    var currentNode = openList[lowInd];
		    if(currentNode.x == dstNode.x && currentNode.y == dstNode.y) {
			    var curr = currentNode;
			    var ret = [];
			    while(curr.parent) {
				    ret.push(curr);
				    curr = curr.parent;
			    }
			    return ret;
		    }
		    openList.splice(lowInd,1);
		    currentNode.closed = true;
		    var neighbors = map.neighbors(currentNode);
		    for(var i=0; i<neighbors.length;i++) {
			    var neighbor = neighbors[i];
			    if(neighbor.closed) {
				    continue;
			    }
			    var gScore = currentNode.g + this.getDistance(currentNode,neighbor);
			    var gScoreIsBest = false;

			    if(!neighbor.visited) {
				    gScoreIsBest = true;
				    neighbor.h = this.getDistance(neighbor,dstNode)
				    neighbor.visited = true;
				    openList.push(neighbor);
			    }
			    else if(gScore < neighbor.g) {
				    gScoreIsBest = true;
			    }
			    if(gScoreIsBest) {
				    neighbor.parent = currentNode;
				    neighbor.g = gScore;
				    neighbor.f = neighbor.g + neighbor.h;
				}
		    }
        }
	},
	getDistance : function(node1,node2){
		return Math.sqrt(Math.pow((node1.x - node2.x), 2) + Math.pow((node1.y - node2.y), 2));
	}
})

function run(){
	var astar = new Astar()
	var startTime = new Date()
	var path = astar.getOptimalPath(map,map.grid[Number($('srcX').value)][Number($('srcY').value)],
	map.grid[Number($('destX').value)][Number($('destY').value)])
	
	var endTime = new Date()
	//$('time').innerHTML = (endTime - startTime) +" ms"
	if(path){
		for(var i=0;i<path.length;i++){
			//$$('.cell')[path[i].x*map.grid[0].length+path[i].y].addClassName('cellPath')
		}
	}
}
