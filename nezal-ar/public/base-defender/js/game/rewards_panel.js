var RewardsPanel = Class.create({
  left: 0,
  noOfRewards : 0,
  rewardWidth : 185,
  rewardsDiv : null,
  rewards : null,
  initialize : function(game){
		this.game = game;
    this.rewards = this.game.user.data.reward_bags.queue
    if(!this.rewards)return
    this.noOfRewards = this.rewards.length
    var self = this
    this.rewards.each(function(reward){
      reward['valid'] = self.validateReward(reward)
    })
    var data = {rewards:this.rewards,
							buttons:{'next':Util.createButton({text:'Next'}), 'back':Util.createButton({'text':'Back'}), 'use':Util.createButton({text:'Use'})}
				   }
           
		$('rewardsContainer').innerHTML = game.templatesManager.load('rewards', data);
    this.rewardsDiv = $$('#rewardsContainer #rewards')[0]
    this.rewardsDiv.setStyle({width:this.rewardWidth*this.rewards.length+"px"})
    
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
  validateReward : function(reward){
    var totalStorage = this.game.quarryFactory.getTotalStorageCapacity()
    reward_data = reward.reward_data
     if(reward_data.rock+game.resources.rock <=totalStorage && 
        reward_data.lumber+game.resources.lumber <= totalStorage){
       return true
     }
    else return false
  },
  useReward:function(id){
    var self = this
    this.rewards.each(function(reward){
      if(reward.id==id){
        if(self.validateReward(reward)){
          self.game.network.useReward(id)
          self.game.reInitialize()
        }else{
          Notification.alert('You need more storage. Try to build or upgrade your storage buildings.')
        }
      }
    })
  }
})