var RewardsPanel = Class.create({

  images : {
              'left' : 'images/quests/arrows_horizontal.png',
              'left-disabled' : 'images/quests/arrows_horizontal.png',
              'right' : 'images/quests/arrows_horizontal.png',
              'right-disabled' :'images/quests/arrows_horizontal.png'
            },
  left: 0,
  noOfRewards : 0,

  initialize : function(game){
		this.game = game;
    if(this.game.reInitializationNotifications)
    {
      if($('rewardsContainer').getStyle("display") == "block")
      {
        var self = this;
        this.game.reInitializationNotifications.push(function(){
                                                      if($('questDisplay').getStyle("display") == 'none' &&          
                                                          $('msg').getStyle("display") == 'none')
                                                        self.updateMenu();
                                                    })
      } 
    }
  },

  destroy : function(){
    if(this.rewardsCarousel)
      this.rewardsCarousel.destroy();
    $('rewardsContainer').innerHTML = "";  
    $('rewardsContainer').style.top = "80px"
    $('rewardsContainer').style.top = "80px"
  },

  handleRewards : function(){
    if($('rewardsBag')){
      $('rewardsBag').stopObserving(game.mouseClickEvent);
      $('rewardsBag').stopObserving('mouseover');
      $('rewardsBag').stopObserving('mouseout');
    }
    if(!this.game.neighborGame)
    {
      $('neighborRewardsBag').hide();
      $('rewardsBag').innerHTML = game.templatesManager.load('reward-bags');
      this.game.addLoadedImagesToDiv('rewardsBag');
      $$('#rewardsBag .clickable').each( function(button){
                                              $$( "#rewardsBag " + " .shadow")[0].hide();
                                              button.observe( 'mouseover', function(){
                                                                             $$("#rewardsBag " + " .shadow")[0].show();
                                                                          });
                                              button.observe( 'mouseout', function(){
                                                                             $$("#rewardsBag " + " .shadow")[0].hide();
                                                                        });
                                        });
      var self = this;
      $('rewardsBag').observe(game.mouseClickEvent,function(){
        self.displayRewardsMenu();
      });
      $('rewardsBag').show();
    } else {
      $('rewardsBag').hide();
      $('neighborRewardsBag').innerHTML = game.templatesManager.load('neighbor-reward-bags');
      this.game.addLoadedImagesToDiv('neighborRewardsBag');
      $('neighborRewardsBag').show();
    }
  },

  displayRewardsMenu : function(){
    this.updateMenu();
    if($('emptyQuest')) Animation.hide('emptyQuest');
    if($('congratesMsg')) Animation.hide('congratesMsg');
    if($('buildingDisplay')) Animation.hide('buildingDisplay');
    if($('questDisplay')) Animation.hide('questDisplay');
    Animation.show($('rewardsContainer'));
  },

  updateMenu : function(){
    this.destroy();
    this.rewards = this.game.user.data.reward_bags.queue
    if(!this.rewards)return
    this.noOfRewards = this.rewards.length
    var self = this
    var data = {rewards:this.rewards}
		$('rewardsContainer').innerHTML = game.templatesManager.load('rewards', data);
    this.game.addLoadedImagesToDiv('rewardsContainer');
    this.rewardsCarousel = new Carousel("rewards", this.images, 4);
    this.rewardsCarousel.checkButtons();
  },

  closeRewardMenu : function(){
    Animation.hide($('rewardsContainer'));
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
  },

  bagCount : function(){
    if(this.game.neighborGame)
      return this.game.collectedRewardBags;
    return this.game.user.data.reward_bags.queue.length
  }

})
