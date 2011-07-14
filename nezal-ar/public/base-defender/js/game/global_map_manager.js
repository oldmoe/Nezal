var GlobalMapManager = Class.create({
   //This should choose the suitable social network for the game
   friendIds : null,
   selectedNeighborId:null,
   global_map : null,
   initialize : function(game){
    this.game = game
    var self = this
    this.getFriends(function(){self.getNeighbors()})
    $('mapButton').observe('click',function(){
      self.getNeighbors(function(){self.displayWorldMap()})
    })
   },
   getFriends :function(callback){
        var self = this
				userID = FB.getSession().uid
				var	query = FB.Data.query("SELECT uid FROM user WHERE is_app_user=1 and uid IN (SELECT uid2 FROM friend WHERE uid1 = {0})", FB.getSession().uid);
				FB.Data.waitOn([query], function(){
					if(!query.value.length)query.value=[]
					self.friendIds = query.value.collect(function(row){return Number(row.uid)}) 
					self.friendIds.push(Number(FB.getSession().uid))
          if(callback)callback()
        })	
   },
   getNeighbors : function(callback){
     var self = this
     this.game.network.globalMap(this.friendIds,function(users){
     $('mapButton').show()
     self.globalMap = users
     var ids = []
     var mapping = {}
     if(!self.globalMap) return
     self.globalMap.each(function(user, index){
          mapping[user["service_id"]] = { "index" : index };
          ids[index]= user["service_id"]
        });
       serviceProvider.getUsersInfo(ids, mapping , function(){
          self.globalMap.each(function(user, i){
            if(mapping[user["service_id"]].name)
              user["name"] = mapping[user["service_id"]].name.split(" ")[0]
            else
              user["name"] = user["service_id"].split(" ")[0]
          });
           if(callback)callback()
        });
       })
   },
   list_map : function(){
      $('neighborListDisplay').innerHTML = this.game.templatesManager.load("neighbor-list", {'neighbors' : this.globalMap});
      $('interaction').show()
      $('neighborListDisplay').show()   
   },
   displayWorldMap : function(){
     var positions = this.spreadUsers()
     var length = Math.min(positions.length, this.globalMap.length)
     var toBeLoaded = []
     for(var i=0;i<length;i++){
       toBeLoaded[i] = this.globalMap[i]
       toBeLoaded[i]['position'] = positions[i]
     }
     $('globalMap').innerHTML = game.templatesManager.load('globalMap',{'neighbors':toBeLoaded,'userID':FB.getSession().uid})
     game.addLoadedImagesToDiv('globalMap')
     this.registerGlobalMapListeners()
     $('interaction').show()
     $('globalMap').show()
     $('energy_bar').show()
   },
    spreadUsers : function(){
  			var width = 760
  			var height = 500 
  			var noOfColumns = 4
  			var total = 16
  			var noOfRows = total/noOfColumns
  			var sqHeight = height / noOfRows
  			var sqWidth = width / noOfColumns
  			var positions = []
        var pages = [1,0,2]
        var positionsCounter = 0
        for (var k = 0; k < 3; k++) {
          var to_add = noOfColumns*pages[k]
          for (var i = 0; i < noOfRows; i++) {
            for (var j = 0; j < noOfColumns; j++) {
              var ind = j + to_add
              var x = ind * sqWidth + Math.floor(Math.random() * sqWidth / 2) + 30
              if (ind % noOfColumns == 0) x += 30
              else x -= 30
              var y = i * sqHeight + Math.floor(Math.random() * sqHeight / 2)
              positions[positionsCounter++] = {
                x: x,
                y: y + 25
              }
            }
          }
        }
        return positions		
  	},
    registerGlobalMapListeners : function(){
      this.worldPageNo = 1;
			var animated = false
      var self = this
			$$('#globalMap #leftArrow')[0].observe('click',function(){
		    if(!animated){
					if(self.worldPageNo == 2){
						$$('#globalMap #rightArrow img')[0].setStyle({marginLeft:"-36px"})
					}
					if(self.worldPageNo>0){
						animated = true
						new Effect.Move($$('#globalMap #globalMapNeigbors')[0],{x:-760, afterFinish : function(){animated = false}})
						self.worldPageNo--
					}
					if(self.worldPageNo == 0){
						$$('#globalMap #leftArrow img')[0].setStyle({marginLeft:"-72px"})
					}
				}
			})
			$$('#globalMap #rightArrow')[0].observe('click',function(){
				if(!animated){
					if(self.worldPageNo == 0){
						$$('#globalMap #leftArrow img')[0].setStyle({marginLeft:"0px"})
					}
					if(self.worldPageNo<2){
						animated = true
						new Effect.Move($$('#globalMap #globalMapNeigbors')[0],{x:760,afterFinish : function(){animated = false}})
						self.worldPageNo++
					}
					if(self.worldPageNo == 2){
						$$('#globalMap #rightArrow img')[0].setStyle({marginLeft:"-108px"})
					}
				}
			})
			$$('#globalMap #globalMapNeigbors .neighbor').each(function(div){
				div.observe('click', function(e){
          self.selectedNeighborId = parseInt(div.id.replace("neighbor",""))
          self.selectedNeighborNetworkId = div.getAttribute("serviceId")
          if (self.selectedNeighborNetworkId != FB.getSession().uid) {
            if (this.getAttribute('protected') == 'true') {
              $$('#globalMap #globalMapNeighborMenu #invadeButton img')[0].setStyle({
                marginTop:"-58px"
              })
            }else{
              $$('#globalMap #globalMapNeighborMenu #invadeButton img')[0].setStyle({
                marginTop:"0px"
              })
            }
            $$('#globalMap #globalMapNeighborMenu')[0].setStyle(
            {top: e.pointerY() + "px",left: e.pointerX() + "px"})
            $$('#globalMap #globalMapNeighborMenu')[0].show()
          }
				})
			})
      $$('#globalMap #globalMapNeighborMenuButtons .mapNeighborPanelButton').each(function(div){
				div.observe('mousedown', function(e){
          if ($$('#globalMapNeigbors #neighbor'+self.selectedNeighborId)[0].getAttribute('protected') == 'false') {
            $$('#globalMap #' + div.id + ' img')[0].setStyle({marginTop: "-38px"})
          }
				})
			})
      $$('#globalMap #globalMapNeighborMenuButtons .mapNeighborPanelButton').each(function(div){
				div.observe('mouseup', function(e){
          if ($$('#globalMapNeigbors #neighbor'+self.selectedNeighborId)[0].getAttribute('protected') == 'false') {
            $$('#globalMap #' + div.id + ' img')[0].setStyle({marginTop: "0px"})
            $('interaction').hide()
            $('globalMap').hide()
          }
				})
			})
      $$('#globalMap #globalMapNeighborMenuButtons .mapNeighborPanelButton').each(function(div){
				div.observe('mouseout', function(e){
          if ($$('#globalMapNeigbors #neighbor'+self.selectedNeighborId)[0].getAttribute('protected') == 'false') {
            $$('#globalMap #' + div.id + ' img')[0].setStyle({
              marginTop: "0px"
            })
          }
				})
			})
      $$('#globalMap #globalMapNeighborMenuButtons #invadeButton')[0].observe('mouseup',function(){
        if ($$('#globalMapNeigbors #neighbor'+self.selectedNeighborId)[0].getAttribute('protected') == 'false') {
          self.game.loadUserEmpire(self.selectedNeighborId,function(){
            self.game.attackIterfaceManager.show()  
          })          
        }
      })
      $$('#globalMap #globalMapNeighborMenuButtons #visitButton')[0].observe('mouseup',function(){
          self.game.loadUserEmpire(self.selectedNeighborId)
           $$('#globalMap #visitButton img')[0].setStyle({marginTop: "0px"})
           $('interaction').hide()
           $('globalMap').hide()
      })
    }

})
