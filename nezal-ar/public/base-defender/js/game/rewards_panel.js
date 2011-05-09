var RewardsPanel = Class.create({
  left: 0,
  noOfRewards : 0,
  rewardWidth : 185,
  rewardsDiv : null,
  rewards : null,
  initialize : function(game){
		this.game = game;
    this.rewards = this.game.user.data.reward_bags.queue
    this.noOfRewards = this.rewards.length
    var data = {rewards:this.rewards,
							buttons:{'next':this.createButton({text:'Next'}), 'back':this.createButton({'text':'Back'}), 'use':this.createButton({text:'Use'})}
				   }
           
		$('rewardsContainer').innerHTML = game.templatesManager.load('rewards', data);
    this.rewardsDiv = $$('#rewardsContainer #rewards')[0]
    this.rewardsDiv.setStyle({width:this.rewardWidth*this.rewards.length+"px"})
    var self = this
    $('rewardsBag').observe(game.mouseClickEvent,function(){
      $('rewardsContainer').show()
    })
    $$('#rewards .reward .next').each(function(div){
      div.observe(game.mouseClickEvent,function(){
        self.next()
      })
    })
    $$('#rewards .reward .closeRewards').each(function(div){
      div.observe(game.mouseClickEvent,function(){
        $('rewardsContainer').hide()
      })
    })

    $$('#rewards .reward .back').each(function(div){
      div.observe(game.mouseClickEvent,function(){
        self.previous()
      })
    })
    $$('#rewards .reward .useReward').each(function(div){
      div.observe(game.mouseClickEvent,function(){
        self.useReward(div.parentNode.id)
      })
    })
  },
  next: function(){
    if(this.left>-(this.noOfRewards-1)*this.rewardWidth){
      this.left-=this.rewardWidth
      this.rewardsDiv.setStyle({marginLeft:this.left+'px'})
    }
  },
  previous : function(){
    if(this.left <= -this.rewardWidth){
      this.left+=this.rewardWidth
      this.rewardsDiv.setStyle({marginLeft:this.left+'px'})
    }
  },
  useReward:function(id){
    var totalStorage = this.game.quarryFactory.getTotalStorageCapacity()
    this.rewards.each(function(reward){
      if(reward.id==id){
        reward_data = reward.reward_data
        console.log(reward_data.rock,game.resources.rock,totalStorage)
        console.log(reward_data.lumber,game.resources.lumber,totalStorage)
        if(reward_data.rock+game.resources.rock <=totalStorage && 
        reward_data.lumber+game.resources.lumber <= totalStorage){
          this.game.network.useReward(id)
          this.game.reInitialize()
        }else{
          Notification.alert('You need more storage. Try to build or upgrade your storage buildings.')
        }
      }
    })
  },
  createButton: function(attributes){
		   var link = document.createElement('a')		   
		   var linkStyleClass = attributes.linkClass || 'defualtButton'
		   link.addClassName(linkStyleClass)
		   var textSpan = document.createElement('SPAN')
		   textSpanStyleClass = attributes.spanClass || 'defaultButtonText'
		   textSpan.addClassName(textSpanStyleClass)
		   textSpan.innerHTML = attributes.text || '';
		   link.appendChild(textSpan);
		   return this.game.domConverter.getHTML(link);
	}
  
})