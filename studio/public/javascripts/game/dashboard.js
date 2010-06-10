var Dashboard = {
	months : [0,0,0,0,0,'يونيو','يوليو'],
	rounds : {
		first_round : {
			start : new Date('2010-06-11'),
			end : new Date('2010-06-25'),
			locations : [					
					[1, 0, 1, 0], 
					[1, 1, 0, 1], 
					[1, 1, 0, 1], 
					[1, 0, 1, 1],	
					[1, 1, 1, 0],
					[0, 1, 1, 1],
					[1, 0, 1, 1],	
					[1, 0, 1, 1],	
					[1, 1, 0, 1], 
					[1, 1, 0, 1], 
					[1, 1, 1, 0],
					[1, 1, 1, 1], 
					[1, 1, 1, 1], 
					[1, 1, 1, 1], 
					[1, 1, 1, 1]
			]
		},
		round_16 : {
			start : new Date('2010-06-26'),
			end : new Date('2010-06-29'),
			locations : [
				[1, 0, 1, 0],
				[0, 1, 1, 0],
				[1, 0, 0, 1],
				[0, 1, 1, 0]
			]
		},
		quarters : {
			start : new Date('2010-07-02'),
			end : new Date('2010-07-03'),
			locations : [
				[1, 0, 1, 0],
				[0, 1, 0, 1]
			]
		},
		semis : {
			start : new Date('2010-07-06'),
			end : new Date('2010-07-07'),
			locations : [
				[1, 0, 1, 0],
				[0, 1, 0, 1]
			]
		},
		finals : {
			start : new Date('2010-07-10'),
			end : new Date('2010-07-11'),
			locations : [
				[1, 0, 1, 0],
				[0, 1, 0, 1]
			]
		}
	},
	
	scrolling : true,
	
	setupScrolling : function(){
		$$('.previous_button')[0].observe('click', function(){
			if(!Dashboard.scrolling) return
			if(this.hasClassName('off')) return
			Dashboard.scrolling = false
			$$('.next_button')[0].removeClassName('off')
			new Effect.Move('groupsTable', {x:0, y: - 397, mode: 'relative', duration: 1.0 , afterFinish : function(){ Dashboard.scrolling = true }})
			myAudio.play('arrow_up_down')
			if(Number($('groupsTable').style.top.gsub('px','')) - 397 + $('groupsTable').getHeight() <= 397 ) this.addClassName('off')
		})
		$$('.next_button')[0].observe('click', function(){		
			if(!Dashboard.scrolling) return
			if(this.hasClassName('off')) return
			Dashboard.scrolling = false
			$$('.previous_button')[0].removeClassName('off')
			new Effect.Move('groupsTable', {x:0, y: 397, mode: 'relative', duration: 1.0 , afterFinish : function(){ Dashboard.scrolling = true }})
			myAudio.play('arrow_up_down')
			if(Number($('groupsTable').style.top.gsub('px','')) + 397 >= 0 ) this.addClassName('off')
		})
	},
	
	matchesForDay : function(date){
		var matches = []
		this.data.matches.each(function(match){
			match = match[0]
			if(date.getMonth() == match.date.getMonth() && date.getDate() == match.date.getDate()){
				matches.push(match)
			}
		})
		return matches
	},
	
	matchesToLocations : function(round){
		var locations = []
		var round = this.rounds[round]
		var self = this
		round.locations.each(function(location, index){
			var date = new Date(round.start) 
			date.setDate(date.getDate()+index)
			var matches = self.matchesForDay(date)
			var matchedLocations = []
			location.each(function(loc, i){
				if(loc == 1){
					matchedLocations.push(matches.shift())
				}else{
					matchedLocations.push({date:date, empty:true})
				}
			})
			locations.push(matchedLocations)
		})
		return locations
	},
	
	getTeamById :function(id){
		return this.data.teams.find(function(team){
			return team[0].id == id
		})[0]
	},
	
	getPredictionByMatchId :function(id){
		var prediction = this.data.predictions.find(function(p){
			return p[0].match_id == id
		})
		if(prediction) return prediction[0]
		return null
	},
	
}
$(document).observe('dom:loaded',function(){
	new Ajax.Request('matches', {method:'get', onComplete : function(req){
		Dashboard.data = (req.responseText).evalJSON()
		Dashboard.data.matches.each(function(match){
			match = match[0]
			time = match.start_time
			match.date = new Date(time.split(' ')[0])
			match.teamA = Dashboard.getTeamById(match.team_a_id)
			match.teamB = Dashboard.getTeamById(match.team_b_id)
			match.prediction = Dashboard.getPredictionByMatchId(match.id)
		})
		$('groupsTable').show()
		$('groupsTable').innerHTML = TrimPath.processDOMTemplate('table', {locations:Dashboard.matchesToLocations('first_round')})
		alert(1)
		Dashboard.setupScrolling();
		$('ranks').observe('click', function(){
			  if($('rankings_frame').src == null || $('rankings_frame').src == ''){
				$('rankings_frame').src = 'html/studio/ranking.html'
			  }
			  $('rankings_shade').setOpacity(0.8)
			  $('rankings').show();
      	})

		$$("#content #links div").each(function(div){
			div.observe('click', function(){
				//$('content').className = div.className
			})
		})
	}})
})