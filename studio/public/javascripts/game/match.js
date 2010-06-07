Studio.match = null
Studio.data = null
Studio.teams = ['teamA', 'teamB']

$(document).observe('dom:loaded',function(){
	var id = window.location.search.toString().split('?')[1].split('=')[1].split('&')[0]
	new Ajax.Request('matches/'+id, {method:'get', onComplete : function(req){
		Studio.data = JSON.parse(req.responseText)
		Studio.match = Studio.data['match'][0]
		
		Studio.events.push([function(){Studio.right.speak('أهلاً بكم، نستعرض معا طرفي مباراة '+Studio.data.teamA[0].name_ar+' و '+Studio.data.teamB[0].name_ar)}, 25])	
		Studio.events.push([function(){Studio.right.unspeak()}, 25])	
		Studio.teams.each(function(team, index){
			Studio.match[team] = Studio.data[team][0]
			var image = new Image
			image.src = '../images/flags/'+Studio.match[team].abrv.toLowerCase()+'.png'			
			image.onload = function(){
				$(team+'_flag').appendChild(image)
			}
			$(team+'_name').innerHTML = Studio.match[team].name_ar
			var talk = Studio.match[team].info.split('\n')
			var side = [Studio.right, Studio.left][index]
			talk.each(function(line){
				Studio.events.push([function(){side.speak(line)}, 25])
				Studio.events.push([function(){side.unspeak()}, 25])	
			})
		})
			
		Studio.teams.each(function(team, index){
			var name = Studio.match[team].name_ar
			var side = [Studio.right, Studio.left][index]
			Studio.events.push([function(){side.speak(' كل التوفيق لـ'+' '+name)}, 25])
			Studio.events.push([function(){side.unspeak()}, 25])	
		})
		Studio.reactor.run(function(){Studio.timeline.run()})
		$$("#predictions .dial").each(function(button){
			button.observe('click', function(event){
				var right = $('goalsA');
				var left = $('goalsB') 
				var target = this.hasClassName('left') ?  left : right 
				var multiplier = this.hasClassName('up') ? 1 : -1
				var value = new Number(target.innerHTML)
				var newValue = value + 1 * multiplier
				if(newValue < 0) newValue = 0
				if(newValue > 99) newValue = 99
				if(newValue < 10) newValue = "0"+newValue
				target.innerHTML = newValue
				left.innerHTML == right.innerHTML ? $('penalties').show() :	$('penalties').hide();
			});
		})
		$$("#penalties .dial").each(function(button){
			button.observe('click', function(event){
				var right = $('penaltiesA');
				var left = $('penaltiesB') 
				var target = this.hasClassName('left') ?  left : right 
				var multiplier = this.hasClassName('up') ? 1 : -1
				var value = new Number(target.innerHTML)
				var newValue = value + 1 * multiplier
				if(newValue < 0) newValue = 0
				if(newValue > 99) newValue = 99
				if(newValue < 10) newValue = "0"+newValue
				target.innerHTML = newValue
			});
		})
	}})
})