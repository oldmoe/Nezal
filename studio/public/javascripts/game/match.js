Studio.match = null
Studio.data = null
Studio.teams = ['teamA', 'teamB']
Studio.player = null
Studio.play = function(movie){
	if(Studio.player){
		Studio.player.loadVideoById(movie);
		Studio.player.mute();
	}else{
		Studio.events.push(10, function(){Studio.play(movie)})
	}
}
function onYouTubePlayerReady(){
	Studio.player = document.getElementById("center_screen_content");
}

var DataLoader = {
  
    updateTime : function(){
        Studio.match.countdown["remain"] -= 1
        Studio.match.countdown["hour"] = parseInt(Studio.match.countdown["remain"] / (60*60))
        Studio.match.countdown["minute"] = parseInt((Studio.match.countdown["remain"] / (60)) % 60)
        Studio.match.countdown["second"] = parseInt(Studio.match.countdown["remain"])%60
        $("countdown").innerHTML = Studio.match.countdown["hour"] + " : " + Studio.match.countdown["minute"] + " : " + Studio.match.countdown["second"]
        window.setTimeout(DataLoader.updateTime, 1000)
    },
  
    load : function() {
      	var id = window.location.search.toString().split('?')[1].split('=')[1].split('&')[0]
	      new Ajax.Request('matches/'+id, {method:'get', onComplete : function(req){
		      Studio.data = (req.responseText).evalJSON()
		      Studio.match = Studio.data['match'][0]
		      Studio.match.status = Studio.data['status']
		      Studio.match.remaining = Studio.data['remaining']
		      Studio.match.kicks = Studio.data['kicks']
		      Studio.match.prediction = Studio.data['prediction'][0]
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
		      if(Studio.match.prediction)
		      {
            ["goals_a", "goals_b", "kicks_a", "kicks_b"].each( function(i) {
                                if( Studio.match.prediction[i] < 10 ) 
                                {
                                  Studio.match.prediction[i] = "0" + Studio.match.prediction[i]
                                }
		                          });
		        $("goalsA").innerHTML = Studio.match.prediction["goals_a"];
		        $("goalsB").innerHTML = Studio.match.prediction["goals_b"];
		        $("penaltiesA").innerHTML = Studio.match.prediction["kicks_a"];
		        $("penaltiesB").innerHTML = Studio.match.prediction["kicks_b"];
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
				  Studio.events.push([function(){console.log('firing');Studio.play(Studio.match[team].youtube_url.split('?v=')[1]);console.log('fired');}, 0])
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
			      if($('rankings_frame').src == null || $('rankings_frame').src == ''){
					$('rankings_frame').src = 'html/studio/ranking.html'
				  }
			      $('rankings_shade').setOpacity(0.8)
				  $('rankings').show();
      		})

		      Studio.match.countdown = { "remain" : parseInt(Studio.match.remaining), "hour" : 0, "minute" : 0, "second" : 0 };
			  window.setTimeout(DataLoader.updateTime,1000);
  	      
		      if( Studio.match.status == 'finished' )
		      {  
		        $("scoreA").innerHTML = Studio.match["goals_a"];
		        $("scoreB").innerHTML = Studio.match["goals_b"];
		        if ( Studio.match["kicks_a"] )
  		        $("penaltyA").innerHTML = Studio.match["kicks_a"] ;
		        if ( Studio.match["kicks_b"] )
  		        $("penaltyB").innerHTML = Studio.match["kicks_b"];
		      }
		      Studio.reactor.run(function(){Studio.timeline.run()})
	      }})
    }
}

$(document).observe('dom:loaded',function(){
   swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3", "center_screen_content", "250", "250", "9.0.0", null, null, { wmode : 'transparent', allowScriptAccess: "always" });
   FBConnect.init( function() {
				  DataLoader.load();
				  Comments.initialize();
	});
})