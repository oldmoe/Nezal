Array.prototype.each = function(visitor){
	for(var i = 0; i < this.length; i++){visitor(this[i], i)}
	return this
}

Array.prototype.map = Array.prototype.each

Array.prototype.first = function(){
	return this[0]
}

Array.prototype.last = function(){
	return this[ this.length - 1 ]
}

Array.prototype.select = function(selector){
	result = []
	this.each(function(element, index){if(selector(element, index)){result.push(element)}})
	return result
}

Array.prototype.collect = function(collector){
	result = []
	this.each(function(element, index){result.push(collector(element, index))})
	return result
}

function Clone(){}

Object.prototype.clone = function(){
	Clone.prototype = this;
	return new Clone();
}

Math.rand = function(number){
	return Math.round(Math.random()*number)
}