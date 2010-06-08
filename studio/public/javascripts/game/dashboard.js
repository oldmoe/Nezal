var Dashboard = {
	rounds : {
		first_round : {
			locations : [
					[0, 2], 
					[0, 1, 2, 3],
					[0, 1, 3],
					[0, 2, 3],
					[0, 1, 2],
					[1, 2, 3],
					[0, 2, 3],
					[0, 2, 3],
					[0, 1, 3],
					[0, 1, 3],
					[0, 1, 2],
					[0, 1, 2, 3],
					[0, 1, 2, 3],
					[0, 1, 2, 3],
					[0, 1, 2, 3]
			]
		},
		round_16 : {
			locations : [
				[0, 2],
				[1, 2],
				[0, 3],
				[1, 2]
			]
		},
		quarters : {
			locations : [
				[0, 2],
				[1, 3]
			]
		},
		semis : {
			locations : [
				[0, 2],
				[1, 3]
			]
		},
		finals : {
			locations : [
				[0, 2],
				[1, 3]
			]
		},
	}
}
$(document).observe('dom:loaded',function(){
	new Ajax.Request('matches', {method:'get', onComplete : function(req){
		Dashboard.data = (req.responseText).evalJSON()
		$$("#content #links div").each(function(div){
			div.observe('click', function(){
				$('content').className = div.className
			})
		})
	}})
})