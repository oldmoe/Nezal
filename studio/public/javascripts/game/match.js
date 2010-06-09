Studio.match = null
Studio.data = null
Studio.teams = ['teamA', 'teamB']
Studio.player = null
function onYouTubePlayerReady(){
	Studio.player = document.getElementById("center_screen_content");
}

$(document).observe('dom:loaded',function(){
	swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3", "center_screen_content", "250", "250", "9.0.0", null, null, { wmode : 'transparent', allowScriptAccess: "always" });
	var id = window.location.search.toString().split('?')[1].split('=')[1].split('&')[0]
	new Ajax.Request('matches/'+id, {method:'get', onComplete : function(req){
		Studio.data = (req.responseText).evalJSON()
		Studio.match = Studio.data['match'][0]
		Studio.match.status = Studio.data['status']
		Studio.match.remaining = Studio.data['remaining']
		Studio.match.kicks = Studio.data['kicks']
		if(Studio.match.status == 'closed'){
			/* display the count down */
		}else if(Studio.match.status == 'open'){
			$('predictions').addClassName('on')
			$('predict').addClassName('on')
			if(Studio.match.kicks){
				$('penalties').addClassName('on')
			}
		}else if(Studio.match.status == 'started'){			
			$('predictions').addClassName('off')
			$('predict').addClassName('off')
			if(Studio.match.kicks){
				$('penalties').addClassName('off')
			}
		}else if(Studio.match.status == 'finished'){
			$('predictions').addClassName('off')
			//$('predict').addClassName('off')			
			if(Studio.match.kicks){
				$('penalties').addClassName('off')
			}			
		}
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
			Studio.events.push([function(){Studio.player.loadVideoById(Studio.match[team].youtube_url.split('?v=')[1]);Studio.player.mute();}, 0])
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
		if(Studio.match.status == 'open'){
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
		}
		$('ranks').observe('click', function(){
			$('rankings').innerHTML = "<iframe src='html/studio/ranking.html'></iframe>"
			$('rankings').show();
			//$('game').hide();
		})
		Studio.reactor.run(function(){Studio.timeline.run()})
	}})
})