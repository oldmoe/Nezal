
FBDefender={imagesUrl:'http://tunisia.nezal.com:3500/tunisia-defender/images/',gameName:function(){return Text.gameName;},isMarket:false,publish:function(attachment,userPrompt,actionLinks,onPublishSuccess){$("publishScreen").innerHTML=Intro.templates.publishConfirm[1].process();$("publishScreen").show();$$("#publishScreen #okButton")[0].observe('click',function(){FBConnect.publish(attachment,userPrompt,actionLinks,onPublishSuccess);$("publishScreen").hide();})},invite:function(){FBConnect.invite(Text.facebook.invite.inviteMsg,Text.facebook.invite.userPrompt,FBDefender.gameName());_gaq.push(['_trackEvent','Social','Invite',navigator.userAgent]);},bookmark:function(){FBConnect.bookmark(function(){new Ajax.Request('users/bookmark',{method:'post',onSuccess:function(t,json){_gaq.push(['_trackEvent','Social','Bookmark',navigator.userAgent]);var data=JSON.parse(t.responseText);var oldCoins=Intro.userData.coins
Intro.userData.coins=data['user_data'].coins;if(oldCoins!=data['user_data'].coins)
{Intro.userData.bookmarked=true;Intro.showBookmarkCongrates();}
if(Intro.currentPage==Intro.pages['marketPlace'].index&&FBDefender.isMarket==true)
Intro.select('marketPlace');}});});},subscribe:function(){FBConnect.subscribe(function(){new Ajax.Request('users/subscribe',{method:'post',onSuccess:function(t,json){_gaq.push(['_trackEvent','Social','Subscribe',navigator.userAgent]);var data=JSON.parse(t.responseText);var oldCoins=Intro.userData.coins
Intro.userData.coins=data['user_data'].coins;if(oldCoins!=data['user_data'].coins)
{Intro.userData.subscribed=true;Intro.showSubscribeCongrates();}
if(Intro.currentPage==Intro.pages['marketPlace'].index&&FBDefender.isMarket==true)
Intro.select('marketPlace');}});});},isFan:function(){FBConnect.isFan(function(status){if(status&&status.page_id)
{new Ajax.Request('users/like',{method:'post',onSuccess:function(t,json){_gaq.push(['_trackEvent','Social','Like',navigator.userAgent]);var data=JSON.parse(t.responseText);var oldCoins=Intro.userData.coins
Intro.userData.coins=data['user_data'].coins;if(oldCoins!=data['user_data'].coins)
{Intro.userData.like=true;Intro.showLikeCongrates();}
if($$('#intro #marketPlace')[0].visible())
Intro.select('marketPlace');}});}});},onPublishSuccess:function(){},publishMissionCompletion:function(mission){_gaq.push(['_trackEvent','Publish','Mission complection',navigator.userAgent]);FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:Text.facebook.completeMession[0]+" "+
TunisiaCities[game.scene.config.mission.path]+" "+
Text.facebook.completeMession[1]+" ",href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+'facebook/logo.png','href':loc}],caption:FBConnect.user.first_name+Text.facebook.completeMession[2]+" "+Text.facebook.completeMession[3]+" "+mission.score+" "+Text.facebook.completeMession[4]};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=false;FBDefender.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});},publishCampaignCompletion:function(campaign){_gaq.push(['_trackEvent','Publish','Campaign completion',navigator.userAgent]);FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:FBConnect.user.first_name+" "+Text.facebook.completeCampaign[0]+" "+
Intro.campaignData.campaignInfo['name'].toUpperCase()+" "+
Text.facebook.completeCampaign[1]+" "+
FBDefender.gameName(),href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+'facebook/medal.png','href':loc}],caption:FBConnect.user.first_name+" "+Text.facebook.completeCampaign[2]+" "+
campaign.name.toUpperCase()+" "+Text.facebook.completeCampaign[3]+" "+
campaign.score+" "+Text.facebook.completeCampaign[4]};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=false;FBDefender.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});},publishRankPromotion:function(info){_gaq.push(['_trackEvent','Publish','Promotion',navigator.userAgent]);FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:FBConnect.user.first_name+" "+Text.facebook.rankPromotion[0]+" "+
Text.game.ranks[info.name]['name']+" "+Text.facebook.rankPromotion[1]+" "+
FBDefender.gameName(),href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+'facebook/ranks/'+info.image,'href':loc}],caption:Text.facebook.rankPromotion[2]+" "+
FBDefender.gameName()+", "+
FBConnect.user.first_name+" "+Text.facebook.rankPromotion[3]+" "+
Text.game.ranks[info.name]['name']+" "+Text.facebook.rankPromotion[4]};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=false;FBDefender.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});},publishUnlockedItem:function(info){_gaq.push(['_trackEvent','Publish','Unlock Item',navigator.userAgent]);FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:FBConnect.user.first_name+" "+Text.facebook.unlockItem[0]+" "+
Text.intro[info.type][info.name]['name']+" "+Text[info.type]+" "+Text.facebook.unlockItem[1]+" "+FBDefender.gameName(),href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+info.image,'href':loc}],caption:FBConnect.user.first_name+" "+Text.facebook.unlockItem[2]+" "+
Text.intro[info.type][info.name]['name']+" "+Text[info.type]+" "+Text.facebook.unlockItem[3]};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=true;FBDefender.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});},publishUpgradedItem:function(info){_gaq.push(['_trackEvent','Publish','upgrade item',navigator.userAgent]);FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:FBConnect.user.first_name+" "+Text.facebook.upgradeItem[0]+" "+
Text.intro[info.type][info.name]['name']+" "+Text[info.type]+" "+Text.facebook.upgradeItem[1]+" "+FBDefender.gameName(),href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+info.image,'href':loc}],caption:FBConnect.user.first_name+" "+Text.facebook.upgradeItem[2]+" "+
Text.intro[info.type][info.name]['name']+" "+Text[info.type]+" "+Text.facebook.upgradeItem[3]};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=true;FBDefender.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});},publishCampaignRanking:function(info){FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:FBConnect.user.first_name+" "+Text.facebook.campaignRanking[0]+" "+
info.ranking+" "+Text.facebook.campaignRanking[1]+" "+
info.rankingGlobal+" "+Text.facebook.campaignRanking[2]+" "+" "+Text.facebook.campaignRanking[3]+" "+
FBDefender.gameName(),href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+'facebook/medal.png','href':loc}],caption:FBConnect.user.first_name+" "+Text.facebook.campaignRanking[4]+" "+
info.ranking+" "+Text.facebook.campaignRanking[5]+" "+
info.rankingGlobal+" "+Text.facebook.campaignRanking[6]+" "+
info.campaignName.toUpperCase()+" "+Text.facebook.campaignRanking[6]+" "};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=false;FBDefender.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});},publishSnapshot:function(img){var post=""
post+="--kkkk\r\nContent-Disposition: form-data; name=\"file\"; filename=\"file1.png\"\r\n"
post+="Content-Type: image/png\r\n"
post+="Content-Transfer-Encoding: base64\r\n\r\n"
post+=img
var request={'Content-type':"multipart/form-data; boundary=--kkkk",body:post}
var values={message:'the caption',filename:'image.png',image:img}
FB.api('/'+FBConnect.session.uid+'/photos?access_token='+FBConnect.session.access_token,function(){alert(1)},values,'post')}}
var CreepConfig={"BlackTank":{image:'black_tank.png',skeleton:'black_tank_skeleton.png'},"RedTank":{image:'red_tank.png',skeleton:'red_tank_skeleton.png'},"Tank":{image:'tank.png',skeleton:'tank_skeleton.png'},"TankI":{image:'tank_i.png',skeleton:'tank_i_skeleton.png'},"TankII":{image:'tank_ii.png',skeleton:'tank_ii_skeleton.png'},"Humvee":{image:'humvee.png',skeleton:'humvee_skeleton.png'},"RedPlane":{image:'red_plane.png',skeleton:'red_plane_skeleton.png'},"Plane":{image:'plane.png',skeleton:'plane_skeleton.png'}}
var TowerConfig={"Belcher":{name:'Belcher',image:'belecher.png',smallImage:'belecher_small.png',skeleton:'belecher_skeleton.png',desc:"Belcher, a fast machine gun tower, it has small range nozzle,"+" and can be used to counter both air and ground units."+" It uses bullets as its main ammunition and doesn't have any detection mechanism, but it will fire on sight."},"Reaper":{name:'Reaper',image:'reaper.png',smallImage:'reaper_small.png',skeleton:'reaper_skeleton.png',desc:"Reaper, an upgraded version of the Belcher machine gun tower,"+" it has two nozzles which enable it to attack with a higher rate than the Belcher."+" It is more effective than the Belcher as it secures more fire power against any hostile activities."},"Patriot":{name:'Patriot',image:'patriot.png',smallImage:'patriot_small.png',skeleton:'patriot_skeleton.png',desc:"Patriot , a long-range, all-altitude, surface-to-air missile (SAM) launcher."+" This air defense system is used to counter advanced aircraft."+" It uses an advanced aerial interceptor missiles and high performance radar systems to destroy its target."},"Exploder":{name:'Exploder',image:'exploder.png',smallImage:'exploder_small.png',skeleton:'exploder_skeleton.png',desc:"Exploder, a tactical surface-to-surface missile (SSM) launcher,"+" Its major use is as a general bombardment weapon to counter heavy land units."+" It has a radar system for detecting its targets to destroy them."}}
var SuperWeaponConfig={"Splash":{name:"Splash",image:'splash.png',skeleton:'splash.png',desc:"Sends up to 10 rockets that targets biggest 10 enemy units, each deal 2000 damage. Can be used 10 times."},"Weak":{name:"Weak",image:'weak.png',skeleton:'weak.png',desc:"Reduces all units' health point by 10% per second. Lasts for 10 seconds. Can be used 10 times."},"Hyper":{name:"Hyper",image:'hyper.png',skeleton:'hyper.png',desc:"Doubles the attack speed of all your towers. Lasts for 30 seconds. Can be used 10 times."},"Nuke":{name:"Nuke",image:'nuke.png',skeleton:'nuke.png',desc:"Call the nuke bomb to destroy all units on the map. Can be used 5 times."},"Heal":{name:"Heal",image:'heal.png',skeleton:'heal.png',desc:"Restores all your towers' full health point . Can be used 10 times."}}
var UpgradeConfig={"Bullets":{name:"Bullets",image:'upgrade1.png',smallImage:'upgrade1.png',skeleton:'upgrade1.png',desc:"Increases attack speed of all bullets towers by 50%."},"Rockets":{name:"Rockets",image:'upgrade2.png',smallImage:'upgrade2.png',skeleton:'upgrade2.png',desc:"Increases attack speed of all rocket towers by 50%."},"Shields":{name:"Shields",image:'upgrade3.png',smallImage:'upgrade3.png',skeleton:'upgrade3.png',desc:"Increases the health point of all towers by 50% and restores towers' full health point."}}
var ChallengeSelector={challenges:[],selected:0,list:function(element){$(Intro.pages[Intro.currentPage]).style['cursor']="progress"
element.style['cursor']="progress"
new Ajax.Request('challenges',{method:'get',onComplete:function(t,json){ChallengeSelector.challenges=JSON.parse(t.responseText);$('challenges').innerHTML=Intro.templates.challenges[1].process({"challenges":ChallengeSelector.challenges});Intro.next();}})},select:function(challenge,callback){new Ajax.Request('challenges'+challenge+"/city.info",{method:'get',onComplete:function(t,json){ChallengeSelector.city=JSON.parse(t.responseText);$('cityInfo').innerHTML=Intro.templates.cityInfo[1].process({"city":ChallengeSelector.city,"path":challenge});callback();}})}}
﻿window.Text={gameName:'درع تونس',towers:'',payments:{daopay:{description:'إدفع بواسطة بطاقة الإئتمان، لشراء نقود لتتمكن من تطوير اسلحتك',packageCommand:'ادفع *price* دولار وأحصل على *reward* من النقود'},success:'مبروك، لقد قمت بشراء *coins* من النقود، سوف يتم اضافتها إلى رصيد نقودك خلال بضع ثواني',contactUsMessage:'For any issue, please',contactUsTrigger:'contact us',contactUsFormTitle:'Explain your issue :',contactUsFormSend:'Send',makeSure:'تأكد من انتهاء المكالمه',contactUsFormPostSubmissionSuccess:'We will revise your issue soon. Thanks you for your patience.',contactUsFormPostSubmissionFailure:'Your issue is not posted successfully, please try again later.'},superWeapons:'',intro:{levelSelection:{msg:'دافع عن بلد جديد كل أسبوع',title:'التحدي الإسبوعي',extraMaps:'الحملات السابقة',tutorial:'الآكاديمية الحربية',easy:'سهل',medium:'متوسط',hard:'صعب',score:'X النقاط'},campaign:{back:'ارجع'},mission:{msg:'معلومات استخباراتية:',accept:'موافق',or:'أو',goBack:'ارجع إلى البلد'},marketPlace:{add:'اشتري',money:'نقود',addWeapon:'اشتري أو طور اسلحتك الخاصة',addTower:'اشتري أو طور مدافعك',back:'ارجع',ready:'مستعد',unlock:'افتح',upgrade:'طوّر',requiredRank:'الرتبة المطلوبة'},creeps:{BlackTank:{name:'أ 30 افينجر',desc:'دبابة ثقيلة ليس من السهل تدميرها وتستطيع الهرب في المواقف الصعبة'},RedTank:{name:'م 18 هيلكات',desc:'تتميز هذه الدبابة بقوة تدميرها العالية ويمكن ان تسبب دمارا هائلا'},Tank:{name:'م 48 باتون',desc:'دبابة أساسية في الحروب وتستخدم في الاساس في عمليات الدعم'},TankI:{name:'م 42 دستر',desc:'دبابة متوسطة القوة تستخدم للدعم أو المناورات'},TankII:{name:'م 41 والكر',desc:'دبابة خفيفة تتميز بسرعتها العالية حيث تستطيع التحرك أسرع من أي دبابة أخرى'},Humvee:{name:'همفي',desc:'مركبة متعددة الوظائف لها القدرة على الحركة في جميع أنواع الأراضي'},RedPlane:{name:'ف 22 رابتر',desc:'تعتبر هذه الطائرة من أقوى الطائرات الموجودة في العالم حيث تمتاز بسرعتها العالية وقوة تدميرها'},Plane:{name:'ف 15 إيجل',desc:'تمتاز هذه الطائرة بقدرتها على المناورة للسيطرة على المعارك الجوية'}},superWeapons:{Splash:{name:'غارة',desc:'يرسل 10 صواريخ بحد اقصى تستهدف أكبر 10 وحدات من العدو'},Weak:{name:'إضعاف',desc:'يقلل من نقاط قوة العدو بمرور الوقت'},Hyper:{name:'سرعة',desc:'يزيد من سرعة اطلاق جميع مدافعك'},Nuke:{name:'نووي',desc:'يرسل قنبلة نووية تدمر جميع الأعداء على الخريطة'},Heal:{name:'اصلاح',desc:'يصلح جميع مدافعك بزيادة نسبة مئوية من نقاط قوتهم'}},towers:{Belcher:{name:'بدر 1',desc:'مدفع سريع الطلقات قصير المدى ويحتوي على ماسورة اطلاق واحدة'+'  ويمكن ان يستخدم كمضاد للدبابات والطائرات.'+' يستخدم الرصاص كذخيرة أساسية ولا يوجد به أي جهاز توجيه'},Reaper:{name:'بدر 2',desc:'يعتبر بدر 2 نسخة مطورة من مدفع بدر 1'+' يحتوي على ماسورتين اطلاق مما يضاعف معدل اطلاقه للنيران عنه لدى بدر 1'+' ويعتبر هذا المدفع أكثر فاعلية من بدر 1 ضد وحدات العدو'},Patriot:{name:'صقر',desc:'مدفع صواريخ أرض جو بعيدة المدى'+' يستخدم كدفاع جوي ضد طائرات العدو'+' ولديه نظام اعتراض صاروخي موجه عن طريق رادار عالي الدقة لتدمير اهدافه'},Exploder:{name:'شهاب',desc:'مدفع صواريخ أرض أرض'+' يستخدم كمضاد لجميع الدبابات الثقيلة.'+' ولديه نظام رادار لإستهداف الوحدات الأرضية لتدميرها'}},upgrades:{power:'تدمير',rate:'سرعة',range:'مدى',maxHp:'نقاط القوة',Heal:['يعيد 20% من نقاط القوة. يمكن اعادة استخدامه كل 90 ثانية','يعيد 40%من نقاط القوة. يمكن اعادة استخدامه كل 90 ثانية','يعيد 60%من نقاط القوة. يمكن اعادة استخدامه كل 90 ثانية','يعيد 80%من نقاط القوة. يمكن اعادة استخدامه كل 90 ثانية','يعيد 100%من نقاط القوة. يمكن اعادة استخدامه كل 90 ثانية'],Weak:['يقلل 10% من نقاط قوة العدو الحالية لمدة 10 ثواني. يمكن اعادة استخدامه كل 60 ثانية','يقلل 10% من نقاط قوة العدو الحالية لمدة 15 ثانية. يمكن اعادة استخدامه كل 60 ثانية','يقلل 15% من نقاط قوة العدو الحالية لمدة 15 ثانية. يمكن اعادة استخدامه كل 60 ثانية','يقلل 15% من نقاط قوة العدو الحالية لمدة 20 ثانية. يمكن اعادة استخدامه كل 60 ثانية','يقلل 20% من نقاط قوة العدو الحالية لمدة 20 ثانية. يمكن اعادة استخدامه كل 60 ثانية'],Nuke:['يمكن اعادة استخدامه كل 180 ثانية','يمكن اعادة استخدامه كل 150 ثانية','يمكن اعادة استخدامه كل 120 ثانية','يمكن اعادة استخدامه كل 90 ثانية','يمكن اعادة استخدامه كل 60 ثانية'],Splash:['قوة التدمير تساوي 20% من نقاط قوة العدو. يمكن اعادة استخدامه كل 120 ثانية','قوة التدمير تساوي 40% من نقاط قوة العدو. يمكن اعادة استخدامه كل 120 ثانية','قوة التدمير تساوي 60% من نقاط قوة العدو. يمكن اعادة استخدامه كل 120 ثانية','قوة التدمير تساوي 80% من نقاط قوة العدو. يمكن اعادة استخدامه كل 120 ثانية','قوة التدمير تساوي 100% من نقاط قوة العدو. يمكن اعادة استخدامه كل 120 ثانية'],Hyper:['يزيد من سرعة اطلاق المدفع بنسبة 50% لمدة 10 ثواني. يمكن اعادة استخدامه كل 120 ثانية','يزيد من سرعة اطلاق المدفع بنسبة 50% لمدة 20 ثانية. يمكن اعادة استخدامه كل 120 ثانية','يزيد من سرعة اطلاق المدفع بنسبة 100% لمدة 20 ثانية. يمكن اعادة استخدامه كل 120 ثانية','يزيد من سرعة اطلاق المدفع بنسبة 100% لمدة 25 ثانية. يمكن اعادة استخدامه كل 120 ثانية','يزيد من سرعة اطلاق المدفع بنسبة 100% لمدة 30 ثانية. يمكن اعادة استخدامه كل 120 ثانية']}},facebook:{completeMession:['لقد دافعت بشجاعة عن','','','دافع ببطولة عن المدينة وحصل على','نقطة. هل يمكنك ان تحطم هذا الرقم؟'],completeCampaign:['بدفاع أسطوري أنقذ','في','اظهر دفاع بطولي لإنقاذ','وحصل على','نقطة خلال رحلة الدفاع. هل يمكنك تحقيق هذا الانجاز؟'],rankPromotion:['تمت ترقيته ليصبح','في','تقديرا لمهاراته الدفاعية في','تمت ترقيته ليصبح','. نهنئه لشجاعته ومجهوداته العظيمة'],unlockItem:['اشترى','في','اشترى','ليحصل على ميزة اضافية في المعارك'],campaignRanking:['أنهى في المركز','بين اصدقاؤه و','بين جميع اللاعبين خلال دفاعه عن','في','حصل على المركز','بين اصدقاؤه و المركز','بين جميع اللاعبين خلال رحلة دفاعه عن','. هل يمكنك ان تحطم هذا الرقم؟'],upgradeItem:['طور','في','طور','ليحصل على ميزة اضافية في المعارك'],userPrompt:'أخبر اصدقائك عن انجازك ',invite:{inviteMsg:'هل انت شجاع بما فيه الكفاية للدفاع عن اراضى العرب ؟ ',userPrompt:'ادع اصدقاؤك و اكسب 500 من النقود لكل صديق يبدأ اللعب'},like:'مبروك . لقد كسبت 1000 من النقود لتفضيلك لنا',bookmark:'مبروك، لقد كسبت 1000 من النقود كهدية الاضافتك لنا الى قائمة اشاراتك',subscribe:'مبروك، لقد كسبت 1000 من النقود كهدية الاضافتك لنا الى قائمة اشاراتك'},game:{tutorial:{msg1:'أهلا بك في اكاديمية الدفاع'
+'<br/>خلال فترة التدريب سوف  تحصل على المعلومات اللازمة و تكتسب المهارات الأساسية المطلوبة'
+' لتتمكن من الدفاع عن مدينتك ضد أي اعتداءات',msg2:'</br>سيكون هدفك هو تدمير جميع وحدات العدو ومنعها من الوصول إلى المدينة',msg3:'يمكنك متابعة رتبتك الحالية من خلال العلامة الموجودة أعلى يمين الشاشة </br>'
+'<br/>يمكنك أيضًا متابعة مجموع نقاطك وعدد الوحدات المتبقية ومدى تقدمك في الرتبة'
+' من خلال الشريط الموجود أعلى الشاشة</br>',msg4:'و الان حان الوقت لوضع بعض المدافع. اضغط على مدفع بدر الموجود في مربع المدافع<br/>'
+'لاحظ ظهور المعلومات الخاصة بالمدفع بعد الضغط عليه في المربع الخاص بالمعلومات',msg5:'اضغط هنا لوضع المدفع في هذا المكان',msg6:'أضف المزيد من المدافع طالما تملك مايكفي من المال. و الان انت على استعداد لبدء المعركة اضغط ابدأ',msg7:'يمكنك ان تستعمل الاسلحة الخاصة في أي وقت تحتاجه',msg8:'اضغط على المدفع لترى قدراته وتطوره أو تبيعه',msg9:'واخيرا قبل انتهاء التدريب لا بد ان تعلم ان الطائرات لا تلتزم بأي مسار مرسوم بل تطير فوق كل شيء',msg10:'الان انت على استعداد لتدافع عن مدينتك ضد أي اعتداءات و أنا واثق من انك سوف تبذل كل الجهد لتنفيذ المهام المكلف بها. حظا موفقا'
+'<br/>لا تنسى ان تعجب بنا و تضيفنا إلى قائمة اشاراتك لتربح جائزة جيدة'},upperBar:{lives:'باقي',score:'النقاط',wave:'موجة'},gameState:{start:'ابدأ',pause:'اوقف',resume:'استأنف'},towerInfo:{power:'تدمير',shield:'القوة',rate:'سرعة',range:'مدى',upgrade:"طوّر",sell:"بيع"},ranks:{PVT:{name:'جندي',abbr:'جندي'},LCpl:{name:'عريف',abbr:'عريف'},Cpl:{name:'عريف أول',abbr:'عريف أول'},Sgt:{name:'صول',abbr:'صول'},SSgt:{name:'أمين',abbr:'أمين'},GySgt:{name:'رقيب',abbr:'رقيب'},MSgt:{name:'رقيب أول',abbr:'رقيب أول'},'1stSgt':{name:'مساعد',abbr:'مساعد'},MGySgt:{name:'مساعد أول',abbr:'مساعد أول'},SgtMaj:{name:'ملازم',abbr:'ملازم'},'2ndLt':{name:'ملازم أول',abbr:'ملازم أول'},'1stLt':{name:'نقيب',abbr:'نقيب'},Capt:{name:'رائد',abbr:'رائد'},Maj:{name:'مقدم',abbr:'مقدم'},LtCol:{name:'عقيد',abbr:'عقيد'},Col:{name:'عميد',abbr:'عميد'},BGen:{name:' لواء',abbr:' لواء'},MajGen:{name:'فريق',abbr:'فريق'},LtGen:{name:'‎ فريق أول',abbr:'‎ فريق أول'},Gen:{name:'مشير',abbr:'مشير'}},result:{winMission1:' لقد نجحت في الدفاع عن',winMission2:' و انقذتها من الاعداء',loseMission:' سقطت في ايدي الأعداء . لا تستسلم وحاول مرة أخرى',coins:'نقود',score:'النقاط',enemies:'اعداء',destroyed:'تدمر:',escaped:'هرب:',towers:'مدافع',built:'بني:',playAgain:'العب مره اخري',exit:'استمر في الدفاع'},towerDestroyedCreep:['من التالي؟؟!!','فلتبدأ الحرب!!!','عاشت تونس','ألست قويا؟','خذ هذا!!','تحيا الثورة','يسقط الطغاة','لن تدخلوا تونس','يحيا شعب تونس','إرحلوا يا جبناء'],creepDestroyedTower:['هل كان هذا مدفع؟!!','سندمرهم!!!','ملاعيييين!!!','خذ هذا!!','كارثة!!!','تونس ملكي أنا','أنا تونس و تونس أنا','أنا و ليلى و فقط','تموت تونس و أحيا أنا','تونس بن علي'],superWeaponsHeal:['في الوقت المناسب!','شكرا!','اشعر بتحسن!!'],superWeaponsWeak:['لقد وقعنا في الفخ!!!','لقد وقعنا في الفخ!!!'],superWeaponsSplash:['ماهذا؟!','اهرب!!','صواريخ اهرب!!!!'],superWeaponsNuke:['ما.....','اهر.....','اااااااااه....','لاااااا.....','اااااااااه....'],superWeaponsHyper:['منشطات!!!','رائع!!','أنا سرييييع!!!','منشطات!!!'],creepEntered:['سأدمركم!!','اضرب!!!','دمرهم!!!','اسحقهم!!!','تونس ملكي أنا','أنا تونس و تونس أنا','أنا و ليلى و فقط','تموت تونس و أحيا أنا','تونس بن علي'],creepEnteredTower:['فلتبدأ الحرب!!!','دافع!!','دافع عن ارضك!!!!','هذا كل مالديك؟!','تحيا الثورة','يسقط الطغاة','لن تدخلوا تونس','يحيا شعب تونس','إثبتوا يا رجال تونس','إرحلوا يا جبناء'],controls:{exit:'خروج',reset:'اعاده',like:'اعجبني',bookmark:'اضف الى قائمة اشاراتك',soundon:'صوت',soundoff:'بدون صوت',level:'المستوى',roger:'حسنا',ok:'موافق',cancel:'الغاء'},promotion:{msg1:'مبروك',msg2:'لقد تم ترقيتك و اصبحت الان ',okButton:'موافق'}}}
var GameConfigs={level:1,campaign:'tunisia',missionPath:'cairo',mapImage:'',waves:[],map:[],mapEntry:[],towers:[],superWeapons:[],upgrades:[],weaponsPackage:{},language:'arabic'}
var ResourceLoader=Class.create({resources:null,loadedCount:0,addResource:function(resource)
{if(!this.resources)
{this.resources=new Hash();}
if(!this.resources.get(resource))
{this.resources.set(resource,null);}},resetResource:function(resource)
{this.resources.set(resource,null);},load:function(callback,errorCallback)
{var self=this;this.resources.each(function(resource){if(!resource[1])
{new Ajax.Request(resource[0],{method:'get',onSuccess:function(t){self.resources.set(resource[0],t.responseText);self.loadedCount++;if(self.loadedCount==self.resources.keys().length)
{self.loadedCount=0;callback();}},onFailure:function(){if(errorCallback)
errorCallback();}});}else{self.loadedCount++;if(self.loadedCount==self.resources.keys().length)
{self.loadedCount=0;callback();}}});}})
var Config=GameConfigs;var PathConfigs={introTemplate:"templates/intro/intro.tpl",gameTemplate:"templates/game.tpl",playerProgressTemplate:"templates/playerProgress.tpl",}
var Intro={dirty:false,currentPage:0,nextPageIndex:1,sound:null,campLoader:new ResourceLoader(),missionLoader:new ResourceLoader(),sequence:["levelSelection","campaign","marketPlace"],templates:{congrates:["congratesTemplate",0],challenges:["challengesTemplate",0],levelSelection:["levelSelectionTemplate",0],campaign:["campaignTemplate",0],mission:["missionTemplate",0],marketPlace:["marketItemsTemplate",0],marketplaceItem:["marketItemDetailsTemplate",0],marketScroll:["marketScrollerTemplate",0],publishConfirm:["publishConfirmTemplate",0]},initialize:function(){Intro.currentPage=0;Intro.retrieveTemplates();},start:function(){if(Intro.doneLoading&&Loader.events.intro.loaded){Intro.next();}},retrieveTemplates:function(){var loader=new ResourceLoader();loader.addResource(PathConfigs.introTemplate);loader.addResource(PathConfigs.gameTemplate);loader.addResource('metadata');loader.load(function(){$('introTemplates').innerHTML=loader.resources.get(PathConfigs.introTemplate);for(var template in Intro.templates){Intro.templates[template][1]=TrimPath.parseDOMTemplate(Intro.templates[template][0]);}
$("gameStart").innerHTML=Intro.templates['game']=loader.resources.get(PathConfigs.gameTemplate);var data=JSON.parse(loader.resources.get('metadata'));GameConfigs.currentCampaign=data['game_data']['current_campaign'];GameConfigs.campaign=data['game_data']['current_campaign'];Intro.gameData=JSON.parse(data['game_data']['metadata']);for(var i in Intro.gameData.towers)
{Intro.gameData.towers[i].upgrades=JSON.parse(Intro.gameData.towers[i].upgrades);}
for(var i in Intro.gameData.weapons)
{Intro.gameData.weapons[i].upgrades=JSON.parse(Intro.gameData.weapons[i].upgrades);}
Intro.userData=data['user_data'];Intro.userData["metadata"]=JSON.parse(data['user_data']['metadata']);Intro.ranks=data['ranks'];Intro.doneLoading=true;$('intro').addClassName(GameConfigs.language);$('congrates').addClassName(GameConfigs.language);$('publishScreen').addClassName(GameConfigs.language);Intro.start();});},retrievePrevCampaigns:function(){new Ajax.Request('statics/campaigns.json',{method:'get',onSuccess:function(t){Intro.prevCampaigns=JSON.parse(t.responseText)
$('previousCampaigns').innerHTML=TrimPath.parseTemplate($('prevChallengesTemplate').value).process({campaigns:Intro.prevCampaigns})
$('levelSelection').hide()
$('previousCampaigns').show()}});},retrieveData:function(callback){new Ajax.Request('metadata',{method:'get',onSuccess:function(t){var data=JSON.parse(t.responseText);Intro.gameData=JSON.parse(data['game_data']['metadata']);Intro.userData=data['user_data'];Intro.userData["metadata"]=JSON.parse(data['user_data']['metadata']);Intro.ranks=data['ranks'];callback();}});},campPath:function(){return"challenges/"+GameConfigs.campaign+"/"+GameConfigs.language;},missionPath:function(){return"/"+GameConfigs.missionPath;},toLabels:function(hash,labelsHash){for(i in hash)
{labelsHash[i]=[];for(j in hash[i])
{labelsHash[i].push(hash[i][j]['name']);}}},pages:{levelSelection:{index:0,onSelect:function(){var loader=new ResourceLoader();Language.getLanguage(Intro.userData.locale,function(){GameConfigs.language="arabic";loader.addResource('js/game/languages/'+GameConfigs.language+'.js');loader.load(function(){eval(loader.resources.get('js/game/languages/'+GameConfigs.language+'.js'));Language.langsNames.each(function(lang){$('intro').removeClassName(lang[0]);$('congrates').removeClassName(lang[0]);})
$('intro').addClassName(GameConfigs.language)
$('congrates').addClassName(GameConfigs.language)
$('levelSelection').innerHTML=Intro.templates.levelSelection[1].process();$$('.languageSelector').each(function(div){div.observe('click',function(){Intro.selectLanguage(this)})})
if(Intro.userData.newbie){Intro.displayTutorial();}else{Intro.show();}
if(!Intro.userData.like){FBDefender.isFan()}});});}},campaign:{index:1,onSelect:function(campaign){if(!Intro.userData.like)FBDefender.isFan();$('previousCampaigns').hide();$$('.levels').each(function(div){div.hide()});if(campaign)GameConfigs.campaign=campaign.name
Intro.enablePauseScreen();var loader=Intro.campLoader;var campMetadata=GameConfigs.campaign+"/metadata";loader.resources=new Hash()
loader.addResource(campMetadata);loader.load(function(){Intro.campaignData=JSON.parse(loader.resources.get(campMetadata));loader.resetResource(campMetadata);$('campaign').innerHTML=Intro.templates.campaign[1].process({"camp":Intro.campaignData});$$('.camp-header .market-link .button')[0].observe('mouseover',function(){$$('.camp-header .market-link .button img')[0].show();})
$$('.camp-header .market-link .button')[0].observe('mouseout',function(){$$('.camp-header .market-link .button img')[0].hide();})
$$('.camp-header .market-link .button')[0].observe('mousedown',function(){$$('.camp-header .market-link .button img')[1].hide();$$('.camp-header .market-link .button img')[2].show();});$$('.camp-header .market-link .button')[0].observe('mouseup',function(){$$('.camp-header .market-link .button img')[1].show();$$('.camp-header .market-link .button img')[2].hide();Sounds.play(Sounds.gameSounds.click);Intro.select('marketPlace');})
$$('#missions .clickableButton').each(function(button){var mission=button.getAttribute('path');button.observe('mouseover',function(){$$('#missions #'+mission+' .mission-hover img')[0].show();});button.observe('mouseout',function(){$$('#missions #'+mission+' .mission-hover img')[0].hide();});button.observe('mousedown',function(){$$('#missions #'+mission+' .mission-normal img')[0].hide();$$('#missions #'+mission+' .mission-normal img')[1].show();});button.observe('mouseup',function(){Intro.selectMission(button);$$('#missions #'+mission+' .mission-normal img')[0].show();$$('#missions #'+mission+' .mission-normal img')[1].hide();Intro.finish();})});Intro.show();$('intro').show();Intro.disablePauseScreen();if(!Intro.sound)
{Sounds.gameSounds.game[0].stop()
Sounds.gameSounds.game[0].play()
Intro.sound=1;}
$('gameStart').hide();$('scores').src='scores/friends.html?'+Object.toQueryString(FBConnect.session)});}},mission:{index:2,onSelect:function(){var creepInfo=[];Intro.setupGameConfigs();GameConfigs['waves'].each(function(element){for(var i=0;i<element.length;i++)
{creepInfo=creepInfo.concat([element[i]['category']]);}})
var missionCreeps=creepInfo.uniq();var loader=Intro.missionLoader;var missionPath=Intro.campPath()+Intro.missionPath()+"/mission.info";loader.addResource(missionPath)
loader.load(function(){var mission=JSON.parse(loader.resources.get(missionPath));mission.creeps=missionCreeps;$('mission').innerHTML=Intro.templates.mission[1].process({"city":mission,"path":Intro.missionPath(),"creepConfig":CreepConfig});var images={'left':Loader.images.intro['mission/carousel/left.png'].getAttribute('data'),'left-disabled':Loader.images.intro['mission/carousel/left-disabled.png'].getAttribute('data'),'right':Loader.images.intro['mission/carousel/right.png'].getAttribute('data'),'right-disabled':Loader.images.intro['mission/carousel/right-disabled.png'].getAttribute('data')};Intro.creepsCarousel=new Carousel("creeps-scroll",images,4);Intro.show();});},setFloatBgInfo:function(element){$$("#mission #floatBg div span")[0].innerHTML=Text.intro.creeps[element.getAttribute("creepid")].name;$$("#mission #floatBg div span")[1].innerHTML=Text.intro.creeps[element.getAttribute("creepid")].desc;$$("#mission #floatBg .skeleton img")[0].src=Loader.images.intro["creeps/"+
CreepConfig[element.getAttribute("creepid")].skeleton].getAttribute('data');}},marketPlace:{index:2,emptySpots:5,onSelect:function(){var gameData=[];Intro.toLabels(Intro.gameData,gameData)
data={"gameData":gameData,"userData":Intro.userData,"name":'towers'};data["gameData"]["empty"]={};data["userData"]["empty"]={};data["gameData"]["empty"]["towers"]=$A($R(0,5-data["gameData"]["towers"].length-1));data["gameData"]["empty"]["weapons"]=$A($R(0,5-data["gameData"]["weapons"].length-1));$('marketPlace').innerHTML=Intro.templates.marketPlace[1].process({"type":"towers","data":data});$$('#marketPlace .addMoney')[0].observe('mouseover',function(){$$('#marketPlace .addMoney img')[2].show();});$$('#marketPlace .addMoney')[0].observe('mouseout',function(){$$('#marketPlace .addMoney img')[2].hide();});$$('#marketPlace .addMoney')[0].observe('mousedown',function(){$$('#marketPlace .addMoney img')[0].hide();$$('#marketPlace .addMoney img')[1].show();});$$('#marketPlace .addMoney')[0].observe('mouseup',function(){$$('#marketPlace .addMoney img')[0].show();$$('#marketPlace .addMoney img')[1].hide();Sounds.play(Sounds.gameSounds.click);Intro.showPaymentBg();});$('weaponsDisplay').innerHTML=Intro.templates.marketScroll[1].process({"type":"weapons","data":data,"itemConfig":SuperWeaponConfig});$('towersDisplay').innerHTML=Intro.templates.marketScroll[1].process({"type":"towers","data":data,"itemConfig":TowerConfig});var images={'left':Loader.images.intro['market/carousel/left.png'].getAttribute('data'),'left-disabled':Loader.images.intro['market/carousel/left-disabled.png'].getAttribute('data'),'right':Loader.images.intro['market/carousel/right.png'].getAttribute('data'),'right-disabled':Loader.images.intro['market/carousel/right-disabled.png'].getAttribute('data')};Intro.weaponsCarousel=new Carousel("weapons-scroll",images,5);Intro.towersCarousel=new Carousel("towers-scroll",images,5);Intro.show();},setFloatBgInfo:function(element){var id=element.getAttribute('itemid');var type=element.getAttribute('type');var upgrade=element.getAttribute('upgrade');var itemConfig=TowerConfig;var translateName="towers"
if(type=="weapons")
{itemConfig=SuperWeaponConfig;translateName="superWeapons";}
var item_rank;var cost=Intro.gameData[type][id].cost;var exp=Intro.gameData[type][id].exp;var currUpgrade=0;var nextUpgrade=0;if(upgrade)
{if(Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']])
{cost=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['cost'];exp=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['exp'];nextUpgrade=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']];currUpgrade=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']-1];for(var rank in Intro.ranks)
{if((Intro.ranks[rank][0]<=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['exp'])&&(Intro.ranks[rank][1]>=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['exp']))
{item_rank=rank;break;}}}else{currUpgrade=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']-1];nextUpgrade=currUpgrade;}}else{for(var rank in Intro.ranks)
{if(Intro.ranks[rank][0]<=Intro.gameData[type][id].exp&&Intro.ranks[rank][1]>=Intro.gameData[type][id].exp)
{item_rank=rank;break;}}}
var data={'coins':Intro.userData.coins,'exp':Intro.userData.exp,'configs':itemConfig,'itemid':id,'type':type,'upgrade':upgrade,'translateName':translateName,'nextUpgrade':nextUpgrade,'currUpgrade':currUpgrade,'cost':cost,'rank':[exp,item_rank]}
$$("#marketPlace #floatBg")[0].innerHTML=Intro.templates['marketplaceItem'][1].process({"data":data});$$('#marketPlace #floatBg .clickSound').each(function(element){element.observe('click',function(){Sounds.play(Sounds.gameSounds.click)})})}}},selectLanguage:function(element)
{var lang=element.getAttribute('language')
Intro.enablePauseScreen();Language.select(lang,function(){Intro.userData.locale=Language.userLanguage;Intro.select('levelSelection')});},selectMission:function(element){GameConfigs.missionPath=element.getAttribute('path');},unlockItem:function(element){var type=element.getAttribute('type');var itemid=element.getAttribute('itemid');if(Intro.userData.coins>=parseInt(Intro.gameData[type][itemid]['cost'])&&Intro.userData.exp>=parseInt(Intro.gameData[type][itemid]['exp']))
{Intro.enablePauseScreen();new Ajax.Request('metadata',{method:'post',parameters:{'data':Object.toJSON({'type':type,'item_id':itemid,'event':'unlock'})},onSuccess:function(t,json){var data=JSON.parse(t.responseText);Intro.userData=data['user_data'];Intro.userData["metadata"]=JSON.parse(data['user_data']['metadata']);var typeName='towers';var itemConfig=TowerConfig;if(type=="weapons")
{itemConfig=SuperWeaponConfig;typeName="superWeapons";}
Intro.select('marketPlace');Intro.disablePauseScreen();}});}else{}},upgradeItem:function(element){var type=element.getAttribute('type');var itemid=element.getAttribute('itemid');var cost=Intro.gameData[type][itemid].upgrades[Intro.userData.metadata[type][itemid]['upgrades']]['cost'];var exp=Intro.gameData[type][itemid].upgrades[Intro.userData.metadata[type][itemid]['upgrades']]['exp'];if(Intro.userData.coins>=cost&&Intro.userData.exp>=exp)
{Intro.enablePauseScreen();new Ajax.Request('metadata',{method:'post',parameters:{'data':Object.toJSON({'type':type,'item_id':itemid,'event':'upgrade'})},onSuccess:function(t,json){var data=JSON.parse(t.responseText);Intro.userData=data['user_data'];Intro.userData["metadata"]=JSON.parse(data['user_data']['metadata']);var typeName='towers';var itemConfig=TowerConfig;if(type=="weapons")
{itemConfig=SuperWeaponConfig;typeName="superWeapons";}
Intro.select('marketPlace');Intro.disablePauseScreen();}});}else{}},sendScore:function(score,win,stars,callback){new Ajax.Request(GameConfigs.campaign+"/metadata",{method:'post',parameters:{'data':Object.toJSON({'mission':GameConfigs.mission.order,'win':win,'level':(GameConfigs.level).toString(),'stars':stars,'score':score})},onSuccess:function(t,json){var data=JSON.parse(t.responseText);Intro.campaignData.user_data.metadata=data['user_data']['metadata'];Intro.userData.rank=data['user_data'].rank;Intro.userData.exp=data['user_data'].exp;Intro.userData.coins=data['user_data'].coins;Intro.setupGameConfigs();callback();}});},newbieNoMore:function(){new Ajax.Request('users/newbie',{method:'post',onSuccess:function(t,json){Intro.userData.newbie=false;data=JSON.parse(t.responseText);Intro.userData.exp=data['user_data']['exp'];var oldRank=Intro.userData.rank;Intro.userData.rank=data['user_data']['rank'];Intro.show();$("intro").show();$('gameStart').hide();if(oldRank!=Intro.userData.rank)
FBDefender.publishRankPromotion({name:Intro.userData.rank,image:"fb-"+Intro.userData.rank+'.png'});}});},setupGameConfigs:function(){var missions=Intro.campaignData.camp_data.metadata
var mission=missions.find(function(mission){if(GameConfigs.missionPath==mission['path'])return true;})
GameConfigs.mission=mission;var map=Intro.campaignData.user_data.metadata.missions[mission['order']-1]['map'];var mapFlipped=[];for(var i=0;i<map[0].length;i++)
{mapFlipped[i]=[];}
for(var i=0;i<map.length;i++)
{for(var j=0;j<map[i].length;j++)
{mapFlipped[j][i]=map[i][j];}}
var towers=[],towerUpgrades={};for(var j in Intro.userData.metadata.towers)
{towers.push(j);towerUpgrades[j]=Intro.userData.metadata.towers[j]['upgrades'];}
var weapons=[],weaponUpgrades={};for(var j in Intro.userData.metadata.weapons)
{weapons.push(j);weaponUpgrades[j]=Intro.userData.metadata.weapons[j]['upgrades'];}
GameConfigs.map=mapFlipped;GameConfigs.mapEntry=Intro.campaignData.user_data.metadata.missions[mission['order']-1]['mapEntry'];GameConfigs.mapImage='challenges/'+GameConfigs.campaign+'/images'+Intro.missionPath()+'/path.png';GameConfigs.waves=Intro.campaignData.user_data.metadata.missions[mission['order']-1]['waves'];GameConfigs.towers=towers;GameConfigs.towerUpgrades=towerUpgrades;GameConfigs.weaponUpgrades=weaponUpgrades;GameConfigs.superWeapons=weapons;GameConfigs.rank=Intro.userData.rank;GameConfigs.exp=Intro.userData.exp;},showLikeCongrates:function(){$('congrates').innerHTML=Intro.templates.congrates[1].process({"msg":Text.facebook.like});$$('#congrates .ok .button')[0].observe('mousedown',function(){$$('#congrates .ok .button img')[1].show();$$('#congrates .ok .button img')[0].hide();});$$('#congrates .ok .button')[0].observe('mouseup',function(){$$('#congrates .ok .button img')[0].show();$$('#congrates .ok .button img')[1].hide();});likeButton=$$('#marketPlace .like')[0];if(likeButton)likeButton.hide();$$('#congrates .clickSound').each(function(element){element.observe('click',function(element){Sounds.play(Sounds.gameSounds.click)})});$('congrates').show()},showSubscribeCongrates:function(){$('congrates').innerHTML=Intro.templates.congrates[1].process({"msg":Text.facebook.subscribe});$$('#congrates .clickSound').each(function(element){element.observe('click',function(element){Sounds.play(Sounds.gameSounds.click)})});$('congrates').show()},showBookmarkCongrates:function(){$('congrates').innerHTML=Intro.templates.congrates[1].process({"msg":Text.facebook.bookmark});$$('#congrates .clickSound').each(function(element){element.observe('click',function(element){Sounds.play(Sounds.gameSounds.click)})});$('congrates').show()},hideCongrates:function(){$('congrates').hide()},showFloatBg:function(element){Intro.pages[Intro.sequence[Intro.currentPage]].setFloatBgInfo(element);$$("#"+Intro.sequence[Intro.currentPage]+" #"+"floatBg")[0].show();},hideFloatBg:function(){$$("#"+Intro.sequence[Intro.currentPage]+" #"+"floatBg")[0].hide();},hidePublishScreen:function(){$('publishScreen').hide();},enablePauseScreen:function(){$('pause').show()},startFileLoading:function(fileName){fileName=fileName.replace("_dumb","")
Intro.fileLoading=true
$$('#pause #fileName').first().innerHTML="Loading "+fileName.split('?')[0].split('/')[1]+"....."
Intro.enableProgressbar(0,100,fileName)},enableProgressbar:function(percentage,timeout,fileName){if(Loader.loaded[fileName]||percentage==91){$$('#pause #loadingPercentage').first().innerHTML="100 %"
$$('#pause  #loadingBarEmpty #loadingBarFill').first().style.width="89%"
return}
$$('#pause #loadingPercentage').first().innerHTML=percentage+" %"
$$('#pause  #loadingBarEmpty #loadingBarFill').first().style.width=percentage+"%"
window.setTimeout(function(){Intro.enableProgressbar(percentage+1,timeout*1.1,fileName)},timeout)},disablePauseScreen:function(){$('pause').hide()},doDisplayTutorial:function(){Intro.disablePauseScreen();Intro.userData.newbie=true;city_defender_start();$('gameStart').show();$("intro").hide();onFinish()},displayTutorial:function(){if(Loader.events.tutorial.loaded){Intro.doDisplayTutorial()}else{Loader.events.tutorial.onLoad=Intro.doDisplayTutorial}},show:function(){$$('.clickSound').each(function(element){element.observe('click',function(element){Sounds.play(Sounds.gameSounds.click)})});$$('.acceptSound').each(function(element){element.observe('click',function(element){Sounds.play(Sounds.gameSounds.accept)})})
$$('.rejectSound').each(function(element){element.observe('click',function(element){Sounds.play(Sounds.gameSounds.reject)})})
window.setTimeout(Intro.display,200);},display:function(){Intro.disablePauseScreen();if(Intro.currentPage>=0){$(Intro.sequence[Intro.currentPage]).hide();}
Intro.currentPage=Intro.nextPageIndex;$(Intro.sequence[Intro.currentPage]).style['display']="block";$("intro").style['cursor']='auto';},next:function(currentIndex){Intro.disabled=false;Intro.enablePauseScreen();if(currentIndex!=null){Intro.nextPageIndex=currentIndex}else{Intro.nextPageIndex=Intro.currentPage+1;}
if(Intro.nextPageIndex==Intro.sequence.length){Intro.finish();}else{Intro.pages[Intro.sequence[Intro.nextPageIndex]].onSelect();}},previous:function(current){Intro.disabled=false;Intro.enablePauseScreen();Intro.nextPageIndex=Intro.currentPage-1;var callback=function(){Intro.pages[Intro.sequence[Intro.currentPage-1]].onSelect();}
callback();},select:function(page){Intro.disabled=false;Intro.enablePauseScreen();var index=Intro.pages[page].index
Intro.nextPageIndex=index;$("intro").style['curspr']='progress';var callback=function(){Intro.pages[Intro.sequence[index]].onSelect();}
callback();},replay:function(){Intro.select('campaign');},showLevelSelection:function(){$('previousCampaigns').hide()
$('levelSelection').innerHTML=Intro.templates.levelSelection[1].process();$('levelSelection').show()},finish:function(){Sounds.gameSounds.game[0].stop()
Intro.sound=null;var image=new Image();Intro.enablePauseScreen();image.onload=function(){Loader.challenges[GameConfigs.missionPath+"/path.png"]=image;if(Loader.events.game.loaded){Intro.doFinish();}else{Loader.events.game.onLoad=function(){Intro.doFinish()}}}
image.src="challenges/"+GameConfigs.campaign+"/images/"+GameConfigs.missionPath+"/path.png";},doFinish:function(){Intro.setupGameConfigs();city_defender_start();Intro.disablePauseScreen();$('gameStart').show();$("intro").hide();onFinish()},showPaymentBg:function(){$('payments-container').innerHTML=TrimPath.parseTemplate($('payment-options-template').value).process();$$('#payments-container .clickSound').each(function(element){element.stopObserving('click');});payment.activateMiddlePackage();$('paymentFloatBg').show();},hidePaymentBg:function(){$('paymentFloatBg').hide();},paymentSuccess:function(coins){$('congrates').innerHTML=Intro.templates.congrates[1].process({"msg":Text.payments.success.replace('*coins*',coins)});$$('#congrates .ok .button')[0].observe('mousedown',function(){$$('#congrates .ok .button img')[1].show();$$('#congrates .ok .button img')[0].hide();});$$('#congrates .ok .button')[0].observe('mouseup',function(){$$('#congrates .ok .button img')[0].show();$$('#congrates .ok .button img')[1].hide();});$$('#congrates .clickSound').each(function(element){element.observe('click',function(element){Sounds.play(Sounds.gameSounds.click)})});$('congrates').show();var coinSync=function(){new Ajax.Request("sync/coins",{method:'get',onSuccess:function(t){Intro.userData.coins=Number(t.responseText);$$('#intro #marketPlace .money .text')[0].innerHTML=Intro.userData.coins
Sounds.play(Sounds.gameSounds.add_money)}})}
setTimeout(coinSync,3000);},hidePaymentSuccess:function(){$('paymentSuccessContainer').hide();},showContactUsForm:function(){var self=this;$('contactUsFloatBg').innerHTML=TrimPath.parseTemplate($('contactUsTemplate').value).process();$('contactUsFloatBg').show();},submitContactUsForm:function(){$('contact-us-form').request({onFailure:function(t){$('contact-us-post-submission').update(Text.payments.contactUsFormPostSubmissionFailure);},onSuccess:function(t){$('contact-us-post-submission').update(Text.payments.contactUsFormPostSubmissionSuccess);},onComplete:function(t){$('contact-us-form').remove();}});},hideContactUsBg:function(){$('contactUsFloatBg').hide();}}
var Baloon=Class.create(Sprite,{x:0,y:0,initialize:function(num,owner){this.owner=owner
this.parent=$('gameElements');this.div=document.createElement('div');this.div.setOpacity(1)
var divIdName='baloon';this.div.setAttribute('class',divIdName);this.div.style.position='absolute';var img=Element.clone(Loader.images.game["baloon"+num+".png"]);this.text=document.createElement("div");this.text.style.color="white";this.text.style.position="absolute"
this.text.style.fontSize="11px"
this.text.style.fontWeight="bold"
this.text.style.width="77px"
this.text.style.textAlign="center"
img.style.position="relative"
this.div.style.left=this.owner.x+"px"
this.div.style.top=this.owner.y+"px"
this.text.style.top="8px";this.text.style.left="3px"
img.style.top=0;img.style.left=0
this.div.appendChild(img)
this.div.appendChild(this.text)
this.parent.appendChild(this.div);},render:function(ctx){if(!this.owner||this.owner.dead){return this.destroy()}
this.div.style.left=this.owner.x+"px"
this.div.style.top=(this.owner.y-70)+"px"},destroy:function($super){if(this.div)
this.parent.removeChild(this.div)
$super()}})
var Sounds={turret:{fire:[],reload:[],rocketPrepare:[],rocketLaunch:[],patriotLaunch:[]},doubleTurret:{fire:[]},boom:{unit:[]},plane:{move:[]},superWeapons:{weak:[],heal:[],nuke:[],hyper:[]},gameSounds:{},channels:[],maxChannels:10,muted:false,musicOn:true,mute:function(){Sounds.muted=true
soundManager.mute()
$$('.sound').first().stopObserving('click')
$$('.sound').first().removeClassName('on')
$$('.sound').first().addClassName('off')
$$('.sound').first().observe('click',Sounds.soundOn)},soundOn:function(){Sounds.muted=false
soundManager.unmute()
$$('.sound').first().stopObserving('click')
$$('.sound').first().removeClassName('off')
$$('.sound').first().addClassName('on')
$$('.sound').first().observe('click',Sounds.mute)},switchmusic:function(){if(Sounds.musicOn){Sounds.musicOn=false
Sounds.stopTrack()
$$('.music').first().removeClassName('on')
$$('.music').first().addClassName('off')}
else{Sounds.musicOn=true
Sounds.resumeTrack()
$$('.music').first().removeClassName('off')
$$('.music').first().addClassName('on')}},garbageCollect:function(){newChannels=[]
time=new Date
Sounds.channels.each(function(sound){if(sound[0][0].duration<=time-sound[1]){sound[0][2]--}else{newChannels.push(sound)}})
Sounds.channels=newChannels},resumeTrack:function(){if(!Sounds.gameSounds.game||Sounds.muted||!Sounds.musicOn)return
if(Sounds.gameSounds.game[0].muted){Sounds.gameSounds.game[0].unmute()}else{Sounds.gameSounds.game[0].play()}},pauseTrack:function(){if(!Sounds.gameSounds.game||Sounds.muted)return
Sounds.gameSounds.game[0].mute()},togglePauseTrack:function(){if(!Sounds.gameSounds.game||Sounds.muted||!Sounds.musicOn)return
if(Sounds.gameSounds.game[0].muted){Sounds.gameSounds.game[0].unmute()}else{Sounds.gameSounds.game[0].mute()}},stopTrack:function(){if(!Sounds.gameSounds.game||Sounds.muted)return
Sounds.gameSounds.game[0].stop()},play:function(store,direct){try{if(!store)return
if(Sounds.muted)return
if(direct){store[0].play()
return}else{this.garbageCollect();if(Sounds.channels.length>=Sounds.channelsMax){return}else if(store[2]>=store[1]){return}else{Sounds.channels.push([store,new Date])
store[2]++
store[0].play()}}}catch(e){}},checkFinishedAudio:function(){var notFinished=[]
Sounds.channels.each(function(channel){if(channel.audio.ended){channel.audio.load()
channel.store.push(channel.audio)}else{notFinished.push(channel)}})
Sounds.channels=notFinished},path:function(){return'sounds/sfx/'},format:'mp3'}
var soundNames=['accept','pause','wash','add_item','plane','add_money','rank_promotion','win','lose','reject','wrong_tower','click','correct_tower']
function createSounds(){createAudioElements(5,Sounds.turret.fire,"bullet")
createAudioElements(5,Sounds.turret.rocketLaunch,"rocket");createAudioElements(5,Sounds.turret.patriotLaunch,"patriot");createAudioElements(5,Sounds.boom.unit,"explosion")
createAudioElements(1,Sounds.superWeapons.heal,"heal")
createAudioElements(1,Sounds.superWeapons.hyper,"hyper")
createAudioElements(1,Sounds.superWeapons.nuke,"nuke")
createAudioElements(1,Sounds.superWeapons.weak,"weak")
for(var i=0;i<soundNames.size();i++){Sounds.gameSounds[soundNames[i]]=[]
createAudioElements(3,Sounds.gameSounds[soundNames[i]],soundNames[i])}
createBackgroundMusic()}
function createAudioElements(count,store,url,loops){if(!store)store=[]
var attributes={id:url,url:'sounds/sfx/mp3/'+url+'.mp3',autoLoad:true,autoPlay:false,volume:50}
if(loops)attributes.loops=loops
var sound=soundManager.createSound(attributes);store.push(sound)
store.push(count)
store.push(0)}
function createBackgroundMusic(){var gameSound=soundManager.createSound({id:"gameSound",url:'sounds/sfx/mp3/game.mp3',autoLoad:true,autoPlay:false,volume:50,loops:10000});Sounds.gameSounds.game=[]
Sounds.gameSounds.game.push(gameSound)}
soundManager.onready(function(){if(soundManager.supported()){createSounds()}});var Loader={dumb:false,callbacks:{},events:{intro:{loaded:false,onLoad:function(){Intro.start();}},tutorial:{loaded:false,onLoad:null},game:{loaded:false,onLoad:null},challenge:{loaded:false,onLoad:null}},loaded:{},fire:function(event){Loader.events[event].loaded=true;if(Loader.events[event].onLoad)Loader.events[event].onLoad();},fileLoading:null,notify:function(win,resources,dumb){if(Loader.toLoad[Loader.index]&&Loader.toLoad[Loader.index].split)Loader.loaded[Loader.toLoad[Loader.index].split('.')[0]]=true
if(!dumb){for(var i=0;i<resources.length-1;i++){var image=new Image
var resource=resources[i]
var id=resource[0]
var parts=id.split('#')
if(!Loader[parts[0]][parts[1]])Loader[parts[0]][parts[1]]={}
image.setAttribute('data',resource[1])
image.src=resource[1]
Loader[parts[0]][parts[1]][parts[2]]=image;}}else{for(var i=0;i<resources.length;i++){var image=new Image
var resource=resources[i]
var id=resource.id
var parts=id.split('#')
if(!Loader[parts[0]][parts[1]])Loader[parts[0]][parts[1]]={}
image.setAttribute('data',resource.src)
image.src=resource.src
Loader[parts[0]][parts[1]][parts[2]]=image;}}
if(Loader.toLoad[Loader.index+1]&&Loader.toLoad[Loader.index+1].constructor==Function){this.index++
Loader.toLoad[Loader.index]()}
if(this.index>=this.toLoad.length-1){this.index++
if(development){city_defender_start()
onFinish()}else{Loader.doneLoading=true;}}else if(this.index<this.toLoad.length-1){var found=false
this.toLoad.each(function(url){if(url.constructor==Function)return
if(win.document.URL.indexOf(url.split('?')[0])>=0){found=true}})
if(found){this.index++
Intro.startFileLoading(Loader.toLoad[Loader.index].split('.')[0])
$('iframe').src=Loader.toLoad[Loader.index]}}
var callbackKey=win.document.URL.split('/').pop();if(this.callbacks[callbackKey]){this.fire('challenge')
this.callbacks[callbackKey]();this.callbacks[callbackKey]=null;}},loadPage:function(page,callback){page=Loader.dumb?page+'_dumb':page
this.callbacks[page+".html"]=callback;$('pages').src="html_resources/"+page+".html"}}
Loader.images={}
Loader.sounds={}
Loader.animations={}
Loader.challenges={}
Loader.resourceTypes=['images','sounds','animations']
Loader.index=0
var HealthSprite=Class.create(Sprite,{layer:null,initialize:function(owner){this.owner=owner},render:function(ctx){if(this.owner.dead){return this.destroy()}
if(!this.visible)return
ctx.save()
if(this.rotation!=0){ctx.rotate(this.rotation)}
ctx.translate(Math.round(this.owner.x),Math.round(this.owner.y))
ctx.fillStyle='red'
ctx.fillRect(-16,-22,32,3)
ctx.fillStyle='green'
ctx.fillRect(-16,-22,32*this.owner.hp/this.owner.maxHp,3)
ctx.restore()}})
var CompositeUnitSprite=Class.create(Sprite,{rotation:0,visible:true,layer:null,cannonRotation:0,render:function(ctx){if(this.owner.dead){return this.destroy()}
try{ctx.save();ctx.translate(Math.round(this.owner.x),Math.round(this.owner.y))
ctx.rotate(Math.PI/180*this.owner.rotation)
ctx.drawImage(this.images.base,-48,-16)
ctx.fillStyle='red'
ctx.fillRect(-22,10,3,-20)
ctx.fillStyle='green'
ctx.fillRect(-22,10,3,-20*this.owner.hp/this.owner.maxHp)
ctx.translate(-4,0)
ctx.rotate(Math.PI/180*this.owner.cannonTheta)
if(!this.owner.fired)ctx.drawImage(this.images.cannon,-44,-16)
else ctx.drawImage(this.images.fire,-44,-16)
ctx.restore();}catch(e){console.log(e)}}})
var CityDefenderScene=Class.create(Scene,{fistCreep:false,startGame:false,firstHit:false,nukeCount:2,healCount:2,weakCount:2,splashCount:2,hyperCount:2,promoted:true,initialize:function($super,config,delay,replay){this.creeps=[]
this.turrets=[]
this.objects=[]
this.towerMutators=[]
this.creepMutators=[]
this.animations=[]
this.rockets=[]
this.events=[]
this.selectedTower=null
this.stats={towersCreated:0,towersDestroyed:0,creepsDestroyed:0}
this.waveNumber=1
$super(delay);this.scenario=new Scenario(this)
this.scenario.start()
if(!replay){this.randomizer=new Randomizer()
this.replayEvents=[]
this.startTick=0
this.replay=false}else{this.replay=true
this.randomizer=new Randomizer(replay.randoms)
for(var i=0;i<replay.replayEvents.length;i++){var event=replay.replayEvents[i]
this.pushReplayEvent(event[0]-replay.startTick,event[1],event[2])}}
this.config=Nezal.clone_obj(config)
this.usedWeapons={}
var self=this;this.exp=this.config.exp
this.wavesCount=this.config.waves.length
if(!development&&this.config.ranks){this.minExp=this.config.ranks[this.config.rank][0]
this.maxExp=this.config.ranks[this.config.rank][1]}else{this.minExp=this.maxExp=0}
this.nuke=new Nuke(this,{count:2,type:'nuke'})
this.heal=new Heal(this,{count:2,type:'heal'})
this.weak=new Weak(this,{count:2,type:'weak'})
this.splash=new Splash(this,{count:2,type:'splash'})
this.hyper=new Hyper(this,{count:2,type:'hyper'})
this.coins=this.config.coins
this.rank=Config.rank},init:function(){},addTurret:function(klass_name,x,y){var klass=eval(klass_name)
if(!this.replay){this.replayEvents.push([this.reactor.ticks,'addTurret',[klass_name,x,y]])}
var turret=new klass(x,y,this)
this.towerMutators.each(function(mutator){mutator.action(turret)})
this.turrets.push(turret)
this.stats.towersCreated++
this.money-=turret.price
Map.grid[turret.gridX][turret.gridY].tower=turret
return turret},addCreep:function(creep){creep.range+=1
creep.maxHp=creep.maxHp/2
creep.hp=creep.maxHp
creep.price=creep.price*Math.pow(1.1,this.waveNumber)
creep.hp=Math.round(creep.hp*Math.pow(this.creepMultiplier[Math.floor((this.config.mission.order-1)/6)],this.waveNumber))
creep.power=Math.round(creep.power*Math.pow(this.creepPowerMultiplier[Math.floor((this.config.mission.order-1)/6)],this.waveNumber))
creep.maxHp=creep.hp
this.creeps.push(creep)
return this},addPlane:function(plane){plane.range+=1
plane.maxHp=plane.maxHp/2
plane.hp=plane.maxHp
plane.price=plane.price*Math.pow(1.1,this.waveNumber)
plane.hp=Math.round(plane.hp*Math.pow(this.creepMultiplier[Math.floor((this.config.mission.order-1)/6)],this.waveNumber))
plane.power=Math.round(plane.power*Math.pow(this.creepPowerMultiplier[Math.floor((this.config.mission.order-1)/6)],this.waveNumber))
plane.maxHp=plane.hp
return this},addRocket:function(rocket){this.rockets.push(rocket)},addPatriotRocket:function(patriotRocket){this.rockets.push(patriotRocket)},tick:function(){this.objects=this.invokeTick(this.objects);this.turrets=this.invokeTick(this.turrets);this.creeps=this.invokeTick(this.creeps);this.rockets=this.invokeTick(this.rockets);return this},invokeTick:function(arr){var newArr=[]
arr.each(function(obj){if(!obj.dead){obj.tick()
newArr.push(obj)}})
return newArr},fire:function(name){if(!this.replay){this.replayEvents.push([this.reactor.ticks,"fire",[name]])}
this[name].fire()},doFire:function(name){},startAttack:function(){if(!this.replay){this.startTick=this.reactor.ticks
this.replayEvents.push([this.startTick,'startAttack'])}
this.sendWaves(this.config)
this.checkStatus()},checkStatus:function(){var self=this
if(this.running&&this.escaped>=this.maxEscaped){this.uploadScore(false,function(){self.end("lose")})
return}else if(this.config&&this.playing){if(this.config.waves.length==0&&this.creeps.length==0&&this.waitingCreeps==0){this.uploadScore(true,function(){self.end("win");})
return}else if(this.creeps.length==0&&this.waitingCreeps==0&&this.config.waves.length>0&&!this.wavePending&&this.running){this.advanceWave()}}
var self=this
this.push(2,function(){self.checkStatus()})},advanceWave:function(){this.waveNumber++
var score=this.waveNumber*(25-Math.round((this.reactor.ticks-this.startTime)*this.reactor.delay/1000))
if(score>0)
this.score+=score
this.startTime=this.reactor.ticks
this.planeAttack=false
this.push(40,function(){this.sendWave(this.config.waves.pop())},this)
this.money=Math.round(this.money*this.moneyMultiplier[this.config.level-1])
this.wavePending=true},uploadScore:function(win,callback){callback()},storeReplay:function(){if(!this.replay){var self=this
var replay={"startTick":self.startTick,"replayEvents":self.replayEvents,"randoms":self.randomizer.randoms}
new Ajax.Request('replay',{method:'post',parameters:{'replay':Object.toJSON(replay),'score':self.score,'camp_name':Config.campaign,'mission_name':Config.mission.name,'level':Config.level},onSuccess:function(t){}});}},end:function(state){this.reactor.stop()
this.running=false
return this.score},start:function(){this.running=true
this.init()
this.reactor.run()
var self=this
this.push(1,function(){self._tick()})
return this.score},sendWave:function(wave){this.wave++
var slots=[]
for(var i=0;i<Map.height;i++){slots[i]=i;}
var delay=0
var entry=Map.entry[0]
var theta=0
var x=0;var y=0;if(entry[0]==0){theta=0
x=0}else if(entry[0]==Map.width-1){theta=180
x=Map.width-1}else if(entry[1]==0){theta=90
y=0}else if(entry[1]==Map.height-1){theta=270
y=Map.height-1}
var self=this
wave.each(function(creep){var creepCat=eval(creep.category)
for(var i=0;i<creep.count;i++){self.creepsCount++
var entry=Map.entry[Math.round(self.randomizer.next()*(Map.entry.length-1))]
if(creepCat==Plane||creepCat==RedPlane){var arr=[0,90,180,270]
theta=arr[0]
creep.theta=theta
self.issueCreep(creep,(theta==90||theta==270)?Math.round(self.randomizer.next()*(Map.width-1)):x,(theta==0||theta==180)?(Math.round(self.randomizer.next()*(Map.height-2))+1):y,delay/self.reactor.delay,i==(creep.count-1))}else{self.issueCreep(creep,entry[0],entry[1],delay/self.reactor.delay,i==(creep.count-1))}
delay+=70*(32/creepCat.prototype.speed)+10
self.waitingCreeps++;}})},sendWaves:function(config){if(this.playing)return;this.playing=true;this.wave=0
this.startTime=this.reactor.ticks
var wave=config.waves.pop()
if(wave){this.sendWave(wave);this.wavePending=true}},issueCreep:function(creep,x,y,delay,last){var self=this
var creepCat=eval(creep.category)
this.push(delay,function()
{var obj=null
if(creepCat==Plane||creepCat==RedPlane){obj=new creepCat(0,y,self,creep.values)
self.addPlane(obj)}
else{obj=new creepCat(x,y,self,creep.values)
self.addCreep(obj)}
self.creepMutators.each(function(mutator){mutator.action(obj)})
self.waitingCreeps--
if(last)self.wavePending=false;return obj})},sellSelectedTower:function(){if(!this.replay){this.replayEvents.push([this.reactor.ticks,"sellSelectedTower"])}
this.money+=Math.round(this.selectedTower.price*0.75*this.selectedTower.hp/this.selectedTower.maxHp)
Map.grid[this.selectedTower.gridX][this.selectedTower.gridY].tower=null
this.selectedTower.destroy()
this.selectedTower=null},takeSnapShot:function(type){try{this.reactor.pause()
var tmpCanvas=document.createElement('canvas');tmpCanvas.setAttribute('id','snap')
var img=new Image
img.src=$('gameForeground').toDataURL("image/png");img.onload=function(){$('snapshotWindow').show()
var backgroundImg=Loader.challenges[Config.campaign]['images/'+Config.missionPath+'/path.png']
var tmpCanvas=document.createElement('canvas');tmpCanvas.width=backgroundImg.width
tmpCanvas.height=backgroundImg.height
var ctx=tmpCanvas.getContext('2d')
ctx.drawImage(backgroundImg,0,0)
ctx.drawImage(img,0,0)
var data=tmpCanvas.toDataURL("image/png")
$$('#snapshotWindow #snapshot')[0].setAttribute('data',data);$$('#snapshotWindow #snapshot')[0].src=data
$('snapshotWindow').show()}}catch(e){console.log(e)}},shareSnapshot:function(){FBDefender.publishSnapshot($$('#snapshotWindow #snapshot')[0].getAttribute('data'))
$('snapshotWindow').hide()
this.reactor.resume()},saveSnapshot:function(){$('snapshotWindow').hide()
document.location.href=strData=$$('#snapshotWindow #snapshot')[0].src.replace("image/png","image/octet-stream")
this.reactor.resume()},closeSnapshot:function(){$('snapshotWindow').hide()
this.reactor.resume()},upgradeSelectedTower:function(){if(!this.replay){this.replayEvents.push([this.reactor.ticks,"upgradeSelectedTower"])}
var upgraded=this.selectedTower.upgrade()
var tower=this.selectedTower
if(tower&&!tower.statechange&&tower.upgrades[tower.rank]&&tower.upgrades[tower.rank].price>this.money){tower.statechange=true
tower.upgradable=false}
if(upgraded){this.towerMutators.each(function(mutator){mutator.action(tower)})}
return upgraded},replayScene:function(){game.reset({startTick:this.startTick,replayEvents:this.replayEvents,randoms:this.randomizer.randoms})},pushReplayEvent:function(ticks,method,params){var self=this
if(ticks<0)ticks=0
self.reactor.push(ticks,function(){if(params){self[method].apply(self,params)}else{self[method]()}})},resetScene:function(){this.creeps.invoke('destroy')
this.creeps=[]
this.turrets.invoke('destroy')
this.turrets=[]
this.animations.invoke('finish')
this.animations=[]
this.objects.invoke('finish')
this.objects=[]},selectTower:function(x,y){if(!this.replay)this.replayEvents.push([this.reactor.ticks,'selectTower',[x,y]])
this.selectedTower=Map.grid[x][y].tower
var tower=this.selectedTower
if(tower&&!tower.statechange&&tower.upgrades[tower.rank]&&tower.upgrades[tower.rank].price>this.money){tower.statechange=true
tower.upgradable=false}
this.selectedTowerHp=Map.grid[x][y].tower.hp},waitingCreeps:0,wavePending:false,escaped:0,ctx:null,topCtx:null,maxEscaped:20,money:200,delay:25,fps:0,score:0,moneyMultiplier:[1.1,1.1,1.1],creepMultiplier:[1.1,1.12,1.14,1.16],creepPowerMultiplier:[1.05,1.1,1.13,1.15],wave:0,sound:true,wavesCount:0,skipFrames:0,statTextIndex:0})
var DisplayScene=Class.create(CityDefenderScene,{initialize:function($super,config,delay,baseCtx,upperCtx,replay){$super(config,delay,replay)
this.templates={}
this.baseCtx=baseCtx;this.upperCtx=upperCtx;this.upgraded=false
this.templates['towerInfo']=TrimPath.parseTemplate($('towerInfoTemplate').value)
this.templates['towerInfo']=TrimPath.parseTemplate($('towerInfoTemplate').value)
this.templates['stats']=TrimPath.parseTemplate($('statsTemplate').value)
IncomingWaves.init($("container"),$("wavesTemplate"),"incomingWaves",this.reactor)
this.resultTemplate=TrimPath.parseTemplate($('resultTemplate').value)
this.displays=[]},init:function($super){$super()
this.skipFrames=0
this.creepsLayer=new Layer(this.upperCtx);this.creepsLayer.clear=true
this.layers.push(this.creepsLayer);this.basesLayer=new Layer(this.upperCtx)
this.rangesLayer=new Layer(this.upperCtx)
this.towerCannonLayer=new Layer(this.upperCtx)
this.rocketsLayer=new Layer(this.upperCtx)
this.towerHealthLayer=new Layer(this.upperCtx)
this.rankLayer=new Layer(this.upperCtx)
this.layers.push(this.rangesLayer)
this.layers.push(this.basesLayer)
this.layers.push(this.towerCannonLayer)
this.layers.push(this.towerHealthLayer)
this.layers.push(this.rocketsLayer)
this.layers.push(this.rankLayer)
var self=this
this.config.superWeapons.each(function(weapon){weapon=weapon.toLowerCase()
var div=$$('#gameElements .superWeapons div.'+weapon)[0].setOpacity(1)})
this.renderData()
$('InGamecityName').innerHTML=TunisiaCities[game.scene.config.mission.path]
return this},addTurret:function($super,klass,x,y){var owner=$super(klass,x,y)
Sounds.play(Sounds.gameSounds.correct_tower)
var displayklass=eval(klass+"Display")
var towerDisplay=new displayklass(owner)
owner.display=towerDisplay
this.displays.push(towerDisplay)
this.rangesLayer.attach(towerDisplay.rangeSprite)
this.basesLayer.attach(towerDisplay.baseSprite)
this.towerCannonLayer.attach(towerDisplay.cannonSprite)
this.towerHealthLayer.attach(towerDisplay.healthSprite)
if(towerDisplay.rocketSprite){this.towerHealthLayer.attach(towerDisplay.rocketSprite)}
this.rankLayer.attach(towerDisplay.rankSprite)
return this},addRocket:function($super,rocket){$super(rocket)
var rocketDisplay=new RocketDisplay(rocket)
rocket.display=rocketDisplay
this.displays.push(rocketDisplay)
this.towerHealthLayer.attach(rocketDisplay.rocketSprite)
return this},addPatriotRocket:function($super,rocket){$super(rocket)
var rocketDisplay=new PatriotRocketDisplay(rocket)
rocket.display=rocketDisplay
this.displays.push(rocketDisplay)
this.towerHealthLayer.attach(rocketDisplay.rocketSprite)
return this},addCreep:function($super,creep){$super(creep)
var displayKlass=eval(creep.name+"Display")
var creepDisplay=new displayKlass(creep)
creep.display=creepDisplay
this.displays.push(creepDisplay)
this.scenario.notify({name:"creepEntered",method:false,unit:creep})
if(this.turrets[0])this.scenario.notify({name:"creepEnteredTower",method:false,unit:this.turrets[0]})
this.creepsLayer.attach(creepDisplay.sprite)},addPlane:function($super,plane){$super(plane)
if(!this.planeAttack){Sounds.play(Sounds.gameSounds.plane)
this.planeAttack=true}
var planeDisplay=null
if(plane.constructor==Plane)planeDisplay=new PlaneDisplay(plane)
else if(plane.constructor==RedPlane)planeDisplay=new RedPlaneDisplay(plane)
this.rocketsLayer.attach(planeDisplay.shadowSprite);this.rocketsLayer.attach(planeDisplay.cannonSprite);this.rocketsLayer.attach(planeDisplay.healthSprite);this.displays.push(planeDisplay)
this.creeps.push(plane)},render:function($super){if(this.skipFrames==0){var startTime=new Date
$super()
GhostTurret.render(this.upperCtx)
if(typeof FlashCanvas!="undefined"){if(game.ctx.ready)game.ctx._myPostCommands();if(game.topCtx.ready)game.topCtx._myPostCommands();if(game.tutorialCtx.ready)game.tutorialCtx._myPostCommands();}
var delay=new Date-startTime
this.fps=Math.round(1000/(delay))
if(delay>this.delay){this.skipFrames=Math.ceil(delay/this.delay)}}else{this.skipFrames--;}
this.displays.invoke('update')
this.removeFinishedDisplays()},removeFinishedDisplays:function(){var remainedDisplays=[]
this.displays.each(function(display){if(!display.owner.dead)remainedDisplays.push(display)})
this.displays=remainedDisplays},renderData:function(){$('money').innerHTML=this.money;$('lives').innerHTML=window.Text.game.upperBar.lives+" "+Math.max(this.maxEscaped-this.escaped,0);$('score').innerHTML=window.Text.game.upperBar.score+" "+this.score;var self=this
$('waves').innerHTML=window.Text.game.upperBar.wave+" "+this.wave+'/'+this.wavesCount;$('towerInfo').show()
if(this.selectedTower&&this.selectedTower.display){if(this.selectedTowerHp!=this.selectedTower.hp){$$('#towerInfo #sellValue').first().innerHTML="$"+Math.round(this.selectedTower.price*0.75*this.selectedTower.hp/this.selectedTower.maxHp)+""}}
if(this.selectedTower&&this.selectedTower.display&&this.selectedTower.dead){this.selectedTower=null
$('towerInfo').innerHTML=""}
var tower=this.selectedTower
if(tower&&!tower.statechange&&tower.upgrades[tower.rank]&&tower.upgrades[tower.rank].price<=this.money){tower.statechange=true
tower.upgradable=true}
if(this.selectedTower&&this.selectedTower.statechange){this.selectedTower.statechange=false
this.processTowerInfoTemplate()}
var self=this
this.push(15,function(){self.renderData()})},startAttack:function($super){$super()
this.renderStartAttack()},renderStartAttack:function(){var self=this
$$('#gameElements .superWeapons div').each(function(div){if(Config.superWeapons.indexOf(div.className.capitalize())!=-1){self[div.className].active=true
div.observe('click',function(){self.fire(div.className)})}})
Sounds.play(Sounds.gameSounds.pause)
var startDev=$$('#gameElements .start').first()
$$(".startText").first().innerHTML=window.Text.game.gameState.pause
startDev.stopObserving('click')
$$(".start").first().observe('click',function(){self.pause()})},renderPause:function(){Sounds.pauseTrack()
$$('#gameElements #gameMenu').first().show()
$('pauseWindow').show()
Sounds.play(Sounds.gameSounds.pause)},renderResume:function(){Sounds.togglePauseTrack()
$$('#gameElements #gameMenu').first().hide()
$('pauseWindow').hide()
Sounds.play(Sounds.gameSounds.pause)},displayStats:function(){$$('#score #scoreValue').first().innerHTML=this.score
$$('#coins #coinsValue').first().innerHTML=Intro.userData.coins-this.coins},promoteUser:function(win){},end:function($super,state){if(game.scene.config.mission.order==24)$('nextCity').hide()
$('result').innerHTML=this.resultTemplate.process()
game.registerResultHandlers()
var self=game.scene
self.push(40,function(){game.scene.running=false
$("result").addClassName(state);if(state=="win"){function win(){$('pauseWindow').style.zIndex=299
$('pauseWindow').hide()
$('popup').hide()
$('popupOk').stopObserving('click')
$$('#result #lose').first().hide()
$$('#result #win').first().show()
new Effect.Appear("static")
$('droppingGround').addClassName('off')
new Effect.SwitchOff('static');new Effect.Appear("result",{delay:3.0})
game.scene.push(60,function(){Sounds.play(Sounds.gameSounds[state])
Sounds.stopTrack()
$('pauseWindow').show()})
game.scene.push(60,function(){self.displayStats()})
game.scene.push(80,function(){FBDefender.publishMissionCompletion({name:GameConfigs.missionPath,score:self.score});});}
win()}
else{$$('#result #win').first().hide()
$$('#result #lose').first().show()
new Effect.Appear("static")
$('droppingGround').addClassName('off')
new Effect.SwitchOff('static');new Effect.Appear("result",{delay:3.0})
game.scene.push(60,function(){$('pauseWindow').show()
Sounds.stopTrack()
Sounds.play(Sounds.gameSounds[state])})
game.scene.push(60,function(){self.displayStats()})}
$('scores').src='scores/friends.html?'+Object.toQueryString(FBConnect.session)})},updateMeters:function(){var tower=this.selectedTower
if(tower&&tower.upgrades[tower.rank]){if(tower.upgrades[tower.rank].power)
$('powerMeter').style.borderRight=Math.ceil((tower.upgrades[tower.rank].power-tower.power)*60/450)+"px solid #B30000"
if(tower.upgrades[tower.rank].rate)
$('rateMeter').style.borderRight=Math.ceil((tower.upgrades[tower.rank].rate-tower.rate)*60/1)+"px solid #B30000"
if(tower.upgrades[tower.rank].range)
$('rangeMeter').style.borderRight=Math.ceil((tower.upgrades[tower.rank].range-tower.range)*60/6)+"px solid #B30000"
if(tower.upgrades[tower.rank].maxHp){$('shieldsMeter').style.borderRight=Math.ceil((tower.upgrades[tower.rank].maxHp-tower.maxHp)*60/10000)+"px solid #B30000"}}},uploadScore:function(win,callback){if(this.replay)game.exit()
else{var currRank=Config.rank;onSuccess=function(){callback();}
var stars=0;if(win){if(this.escaped==0)stars=3;else if(this.escaped<10)stars=2;else stars=1;}
this.stars=stars
Intro.sendScore(this.score,win,stars,onSuccess);}},selectTower:function(x,y){if(!this.replay)this.replayEvents.push([this.reactor.ticks,'selectTower',[x,y]])
if(this.selectedTower){if(this.selectedTower.display&&this.selectedTower.display.rangeSprite){this.selectedTower.display.rangeSprite.visible=false}}
this.selectedTower=Map.grid[x][y].tower
var tower=this.selectedTower
if(tower&&!tower.statechange&&tower.upgrades[tower.rank]&&tower.upgrades[tower.rank].price>this.money){tower.statechange=true
tower.upgradable=false}
this.selectedTowerHp=Map.grid[x][y].tower.hp
this.selectedTower.display.rangeSprite.visible=true
this.processTowerInfoTemplate()},advanceWave:function($super){var oldMoney=this.money
var oldScore=this.score
$super()
var score=this.score-oldScore
var anim=new MoneyAnimation(341,462,this.money-oldMoney)
anim.totalMovement=90
var msg="+"+(this.money-oldMoney)+"  مال"
if(score>0)msg+="<br/>+"+score+"   نقاط"
anim.enlarge(msg)
this.objects.push(anim)
IncomingWaves.nextWave()},showHintMsg:function(msg){$('modalWindow').show()
$$('#modalWindow .content .innerContent')[0].innerHTML=msg
$$('#modalWindow #ok')[0].show()
$$('#modalWindow #ok #rogerText')[0].innerHTML="Roger"
this.reactor.pause()
var self=this
$$('#modalWindow #ok')[0].observe('click',function(){$('modalWindow').hide()
self.reactor.resume()})},upgradeSelectedTower:function($super){if(!this.upgraded)_gaq.push(['_trackEvent','GamePlay','upgraded',navigator.userAgent]);this.upgraded=true
if(this.selectedTower.upgradable)Sounds.play(Sounds.gameSounds.click)
$super()
this.selectedTower.display.upgrade()
this.processTowerInfoTemplate()},processTowerInfoTemplate:function(){$('towerInfo').innerHTML=this.templates['towerInfo'].process({tower:this.selectedTower})
game.registerTowerStatus("upgradeTower");game.registerTowerStatus("sellTower");this.updateMeters()},sellSelectedTower:function($super){$super()
Sounds.play(Sounds.gameSounds.click)},resetScene:function($super){$super()
this.render()}})
var TutorialScene=Class.create(DisplayScene,{initialize:function($super,config,delay,baseCtx,upperCtx,replay){$super(config,delay,baseCtx,upperCtx,replay)
_gaq.push(['_trackEvent','Tutorial','started tutorial',navigator.userAgent]);this.splash.factor1=1;$$('#gameElements .superWeapons div').each(function(div){})},addCreep:function($super,creep){if(this.waveNumber==2){creep.hp=creep.maxHp=80}else{creep.hp=creep.maxHp=20}
$super(creep)},addPlane:function($super,plane){plane.hp=plane.maxHp=20
$super(plane)},sendWave:function($super,wave){if(this.waveNumber==1){}
else if(this.waveNumber==2){_gaq.push(['_trackEvent','Tutorial','completed wave 1',navigator.userAgent]);this.push(120,function(){game.tutorial.initiateSuperWeapon()})}
else if(this.waveNumber==3){_gaq.push(['_trackEvent','Tutorial','completed wave 2',navigator.userAgent]);game.tutorial.upgradeTower()}
else if(this.waveNumber==4){_gaq.push(['_trackEvent','Tutorial','completed wave 3',navigator.userAgent]);game.tutorial.planesAttack()}
else if(this.waveNumber==5){}
$super(wave)},end:function(status){game.started=false
game.tutorial.wishLuck()
Sounds.gameSounds.game[0].togglePause()
_gaq.push(['_trackEvent','Tutorial','Finished tutorial',navigator.userAgent]);},uploadScore:function(win,callback){callback()},showHintMsg:function(msg){}})
var Map={pitch:32,width:20,height:15,grid:[],bgGrid:[[2,2,2,2,0,0,0,0,0,0,2,2,2,2,2],[2,2,2,2,0,0,0,0,0,0,0,2,2,2,2],[2,2,1,1,0,0,0,0,0,0,0,0,2,2,2],[2,2,1,1,0,0,0,0,0,0,0,0,0,2,0],[1,1,1,1,0,0,0,0,0,0,0,1,1,1,1],[1,1,1,1,0,0,0,0,0,0,0,1,1,1,1],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,2,2,0,0,0,0,1,1,0,0],[0,0,1,1,0,2,2,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],[0,0,0,0,0,0,0,0,0,0,0,0,2,2,2]],entry:[[4,0],[5,0]],init:function(){for(var i=0;i<this.width;i++){this.grid[i]=[]
for(var j=0;j<this.height;j++){this.grid[i][j]=[]
this.grid[i][j].tower=null}}},value:function(x,y){return Map.bgGrid[Math.abs(Math.floor(x/Map.pitch))][Math.abs(Math.floor(y/Map.pitch))]},findTile:function(x,y){return[Math.abs(Math.floor(x/this.pitch)),Math.abs(Math.floor(y/this.pitch))]},transform:function(x){return Math.abs(Math.floor(x/this.pitch)*this.pitch)},empty:function(x,y){if(!this.grid[x])return false;if(!this.grid[x][y])return true;return this.grid[x][y].tower==null}}
var tutorialConfig={campaign:"tunisia",exp:29,level:3,mapImage:"challenges/tunisia/sfax/images/path.png",superWeapons:["Splash","Hyper","Nuke","Weak","Heal"],towers:["Turret"],weaponUpgrades:{"Splash":1,"Hyper":1,"Weak":1,"Heal":1,"Nuke":1},towerUpgrades:{"Turret":1},upgrades:["Bullets","Shields"],waves:[[{category:"Tank",count:"5"}],[{category:"Tank",count:"10"}],[{category:"Tank",count:"10"}],[{category:"Plane",count:"3"}]],rank:"PVT",map:[[2,2,2,2,0,0,0,0,0,0,2,2,2,2,2],[2,2,2,2,0,0,0,0,0,0,0,2,2,2,2],[2,2,2,0,0,0,0,0,0,0,0,0,2,2,2],[2,2,0,0,0,0,0,0,0,0,0,0,0,2,0],[1,1,1,1,0,0,0,0,0,0,0,1,1,1,1],[1,1,1,1,0,0,0,0,0,0,0,1,1,1,1],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,2,2,0,0,0,0,1,1,0,0],[0,0,1,1,0,2,2,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],[0,0,0,0,0,0,0,0,0,0,0,0,2,2,2]],mapEntry:[[4,0],[5,0]],towerUpgrades:{"Belcher":4}}
var T={start:"start",resume:"resume",pause:"pause"}
var Game=Class.create({started:false,initialize:function(delay){},start:function(replay){if(!game.started){Config.ranks=Intro.ranks
Config.coins=Intro.userData.coins
game.started=true
Map.init();Config=GameConfigs
this.prepareConfig()
this.config=Nezal.clone_obj(Config)
this.config.waves.reverse()
$$('#game #scores').first().show()
if(!replay){this.scene=new DisplayScene(this.config,33,this.ctx,this.topCtx,replay);this.registerHandlers();}
else if(Nezal.replay){this.scene=new DisplayScene(this.config,33,this.ctx,this.topCtx,replay);}
else{this.scene=new CityDefenderScene(this.config,33,replay);}
if(Config.map)Map.bgGrid=Config.map
if(Config.mapEntry)Map.entry=Config.mapEntry
GhostTurret=new Turret(0,0,this.scene,ghostTurretFeatures)
$$('.startText').first().innerHTML=window.Text.game.gameState.start
$('pauseWindow').hide()
$$('#gameReset #resetText').first().innerHTML=window.Text.game.controls.reset
$$('#gameExit #exitText').first().innerHTML=window.Text.game.controls.exit
$$('#gameResume #resumeText').first().innerHTML=window.Text.game.gameState.resume
var arr=['Splash','Heal','Hyper','Weak','Nuke']
arr.each(function(weapon){if(Config.superWeapons.indexOf(weapon)==-1){game.scene[weapon.toLowerCase()].deactivate()}
else{game.scene[weapon.toLowerCase()].end()}})
this.scene.start();}},flip:function(map){var mapFlipped=[];for(var i=0;i<map[0].length;i++)
{mapFlipped[i]=[];}
for(var i=0;i<map.length;i++)
{for(var j=0;j<map[i].length;j++)
{mapFlipped[j][i]=map[i][j];}}
return mapFlipped},prepareConfig:function(){var inputNames=["Belcher","Reaper","Exploder","Patriot"]
var replacement=["Turret","DoubleTurret","RocketLauncher","Patriot"]
var upgradeValues=["maxHp","power","range","rate","price"]
for(var i=0;i<inputNames.length;i++){var ind=Config.towers.indexOf(inputNames[i])
if(ind!=-1){Config.towers[ind]=replacement[i]
var values=null
if(Nezal.replay)
values=JSON.parse(Intro.gameData.towers[inputNames[i]].upgrades)
else values=Intro.gameData.towers[inputNames[i]].upgrades
var upgrades=[]
upgradeValues.each(function(upgradeValue){eval(replacement[i]).prototype[upgradeValue]=values[0][upgradeValue]})
eval(replacement[i]).prototype.maxRank=Config.towerUpgrades[inputNames[i]]-1
for(var j=1;j<values.length;j++){var value=values[j]
var upgrade={}
upgradeValues.each(function(upgradeValue){upgrade[upgradeValue]=value[upgradeValue]})
upgrades.push(upgrade)}
eval(replacement[i]).prototype.upgrades=upgrades}}
var weaponValues=Intro.gameData.weapons
Config.superWeapons.each(function(weapon){eval(weapon).prototype.factor1=weaponValues[weapon].upgrades[Config.weaponUpgrades[weapon]-1].factor1
eval(weapon).prototype.factor2=weaponValues[weapon].upgrades[Config.weaponUpgrades[weapon]-1].factor2
eval(weapon).prototype.cooldown=weaponValues[weapon].upgrades[Config.weaponUpgrades[weapon]-1].cooldown})
if(Config.superWeapons.indexOf('Splash')!=-1&&Config.superWeapons[0]!="Splash"){var x=Config.superWeapons[0]
var y=Config.superWeapons.indexOf("Splash")
Config.superWeapons[0]="Splash"
Config.superWeapons[y]=x}},setGameImages:function(){if(game.started)return;Config=GameConfigs
game.prepareConfig()
Config.towers.each(function(tower){var div=document.createElement("div");div.style.cursor="pointer"
div.setAttribute('class',tower);$$(".towers").first().appendChild(div)})
for(var i=0;i<10-Config.towers.length;i++){var div=document.createElement("div");$$(".towers").first().appendChild(div)}
var arr=['Splash','Heal','Hyper','Weak','Nuke']
arr.each(function(weapon){var wCapital=weapon
weapon=weapon.toLowerCase()
var div=document.createElement("div");div.style.cursor="pointer"
div.setAttribute('class',weapon);$$(".superWeapons").first().appendChild(div)
var div2=document.createElement("div");div2.setAttribute('class',weapon);$$(".superWeaponsOff").first().appendChild(div2)})
Loader.images.background['start_hover.png'].setAttribute('class','startImgHover')
$$('.start').first().appendChild(Loader.images.background['start_hover.png'])
$$('.startImgHover')[0].hide();Loader.images.background['start.png'].setAttribute('class','startImg')
$$('.start').first().appendChild(Loader.images.background['start.png'])
$('gameElements').appendChild(Loader.images.background['l_shape.png'])
$('canvasContainer').appendChild(Loader.challenges[Config.missionPath+'/path.png'])
Config.towers.each(function(turret){$$('.'+turret).first().appendChild(Loader.images.background[turret.toLowerCase()+'_button.png'])})
var img9=document.createElement("IMG");$$('#gameElements .superWeapons div').each(function(div){if(div.className!=''){div.appendChild(Loader.images.background[div.className+'_button.png'])}})
$$('#gameElements .superWeaponsOff div').each(function(div){if(div.className!=''){div.appendChild(Loader.images.background[div.className+'_button_off.png'])}})
var image1=new Image()
var image2=new Image()
var image3=new Image()
image1.src=Loader.images.intro['button_middle.png'].getAttribute('data')
image2.src=Loader.images.intro['button_middle.png'].getAttribute('data')
image3.src=Loader.images.intro['button_middle.png'].getAttribute('data')
$('gameReset').appendChild(image1)
$('gameExit').appendChild(image2)
$('gameResume').appendChild(image3)
$$('#snapshotWindow #background')[0].src=Loader.images.background['pop_up.png'].getAttribute('data')
$('popup').appendChild(Loader.images.background['pop_up.png'])
if(Sounds.muted)Sounds.mute()},registerHandlers:function(){var self=this
$$('.towers div').each(function(div){if(div.className!=''){div.observe('click',function(){Sounds.play(Sounds.gameSounds.click);GhostTurret.select(div)})}})
$$('#gameElements .superWeapons div').each(function(div){if(div.className!=''){div.observe('click',function(){self.scene.fire(div.className)})
self.scene[div.className].active=false}})
$$('#gameElements .start').first().observe('click',function(){self.scene.startAttack()})
$$('#gameElements .start').first().observe('mouseover',function(){$$(".startImgHover")[0].show()})
$$('#gameElements .start').first().observe('mouseout',function(){$$(".startImgHover")[0].hide()})
$('gameExit').observe('click',function(){game.exit()})
$('gameReset').observe('click',function(){game.reset()})
$('gameResume').observe('click',function(){game.scene.resume()})
$$('.sound').first().observe('click',Sounds.mute)
$$('.music').first().observe('click',Sounds.switchmusic)
$$('.snapshot').first().observe('click',function(){game.scene.takeSnapShot()})
$$('.snapshot').first().hide()
$$('#snapshotWindow #save').first().observe('click',function(){game.scene.saveSnapshot()})
$$('#snapshotWindow #share').first().observe('click',function(){game.scene.shareSnapshot()})
$$('#snapshotWindow #close').first().observe('click',function(){game.scene.closeSnapshot()})},registerTowerStatus:function(buttonName){if($(buttonName)&&$(buttonName+"ImgHover")){$(buttonName).observe('mouseover',function(){$(buttonName+"ImgHover").show();})
$(buttonName).observe('mouseout',function(){$(buttonName+"ImgHover").hide();})}},reset:function(replay){game.started=false
game.scene.displays=[]
game.scene.resetScene()
$$('#gameElements #gameMenu').first().hide()
$('pauseWindow').hide()
new Effect.Fade('static')
$$('#gameElements .start').first().stopObserving('click')
$$('#gameElements .start').first().removeClassName('resumed')
$$('#gameElements .start').first().removeClassName('paused')
game.unRegisterHandlers()
Sounds.resumeTrack()
$('droppingGround').removeClassName('off')
$('result').hide()
$$('#gameElements .superWeapons div').each(function(div){if(div.className!=''){div.stopObserving('click')}})
game.scene.reactor.stop()
game.start(replay)},exit:function(){game.started=false
$$('#gameElements #gameMenu').first().hide()
Sounds.stopTrack()
Intro.enablePauseScreen();$("gameStart").innerHTML=Intro.templates['game'];game.scene.reactor.stop()
Sounds.resumeTrack()
$('gameStart').hide()
Intro.replay();},unRegisterHandlers:function(){$$('.towers div').invoke('stopObserving','click')
$$('#gameElements .start').first().stopObserving('click')
$$('#gameElements .superWeapons div').each(function(div){if(div.className!=''){div.stopObserving('click')}})
$('gameExit').stopObserving('click')
$('gameReset').stopObserving('click')
$('gameResume').stopObserving('click')
$$('.sound').first().stopObserving('click')
$$('.music').first().stopObserving('click')},registerResultHandlers:function(){$$('.playAgain').each(function(div){div.observe('click',function(){Sounds.stopTrack()
game.reset();})})
$$('.exit').each(function(div){div.observe('click',function(){game.exit();})})
$$('#win .nextCity')[0].observe('click',function(){GameConfigs.missionPath=Intro.campaignData.camp_data.metadata[game.scene.config.mission.order].path
game.exit()
Intro.finish()})
$$('#win .playAgain')[0].observe('mouseover',function(){$$('#win .playAgain .hover')[0].show()})
$$('#lose .playAgain')[0].observe('mouseover',function(){$$('#lose .playAgain .hover')[0].show()})
$$('#win .exit')[0].observe('mouseover',function(){$$('#win .exit .hover')[0].show()})
$$('#lose .exit')[0].observe('mouseover',function(){$$('#lose .exit .hover')[0].show()})
$$('#win .nextCity')[0].observe('mouseover',function(){$$('#win .nextCity .hover')[0].show()})
$$('#win .playAgain')[0].observe('mouseout',function(){$$('#win .playAgain .hover')[0].hide()})
$$('#lose .playAgain')[0].observe('mouseout',function(){$$('#lose .playAgain .hover')[0].hide()})
$$('#win .exit')[0].observe('mouseout',function(){$$('#win .exit .hover')[0].hide()})
$$('#lose .exit')[0].observe('mouseout',function(){$$('#lose .exit .hover')[0].hide()})
$$('#win .nextCity')[0].observe('mouseout',function(){$$('#win .nextCity .hover')[0].hide()})},unregisterResultHandlers:function(){$$('.playAgain').each(function(div){div.stopObserving('click')})
$$('.exit').each(function(div){div.stopObserving('click')})}});var game=new Game()
function city_defender_start(replay){$$("canvas").each(function(canvas){canvas.width=Map.width*Map.pitch
canvas.height=Map.height*Map.pitch})
game.setGameImages()
Upgrades.init();var fg=$('gameBackground');var top=$('gameForeground')
var tutorialg=$('droppingGround')
if(typeof FlashCanvas!="undefined"){FlashCanvas.initElement(fg)
FlashCanvas.initElement(top)
FlashCanvas.initElement(tutorialg)}
var totorialTop=tutorialg.getContext('2d')
game.tutorialCtx=totorialTop
game.canvas=fg
game.ctx=fg.getContext('2d')
game.topCtx=top.getContext('2d')
game.start(replay);Upgrades.selectDefault();}
function onFinish(){$('gameElements').style.visibility='visible'
$('canvasContainer').style.visibility='visible'
window.setTimeout(function(){$('gameElements').show();$('canvasContainer').show();Sounds.gameSounds.game[0].stop()
Sounds.resumeTrack()
$('static').show();Effect.Fade('static',{duration:1.0})},100)}
var TunisiaCities={'sidi_bouzid':'سيدي بوزيد','tozeur':'توزر','tataouine':'تطاوين','kebili':'قبلي','zaghouan':'زغوان','siliana':'سليانة','kef':'الكاف','beja':'باجة','gafsa':'قفصة','gabes':'قابس','monastir':'المنستير','mahdia':'المهدية','jendouba':'جندوبة','ariana':'أريانة','medenine':'مدنين','kasserine':'القصرين','manouba':'منوبة','kairouan':'القيروان','ben_arous':'بن عروس','bizerte':'بنزرت','sousse':'سوسة','nabeul':'نابل','sfax':'صفاقس','tunis':'تونس'}
var Unit=Class.create({initialize:function(x,y,scene,extension){this.gridX=x
this.gridY=y
this.x=Map.pitch*(x+0.5)
this.y=Map.pitch*(y+0.5)
if(extension){Object.extend(this,extension)}
this.scene=scene
this.maxHp=this.hp
return this},target:function(){if(this.dead)return
if(this.fired)this.fired=false
if(!this.reloaded){this.toFire+=this.rate;if(this.toFire>=1){this.reloaded=true;this.toFire-=1}}
var targets=[]
for(var i=this.gridX-this.range;i<this.gridX+this.range+1;i++){for(var j=this.gridY-this.range;j<this.gridY+this.range+1;j++){if(Map.grid[i]&&Map.grid[i][j]){this.getTargetfromCell(Map.grid[i][j],targets)}}}
if(targets.length>=1){this.pickTarget(targets)}else{this.targetUnit=null}
return this;},getTargetfromCell:function(cell,targets){},pickTarget:function(targets){},takeHit:function(power){if(this.dead)return
this.hp-=power
if(this.hp<=0){this.killed=true
this.dead=true;this.die();}
return this;},die:function(){alert('die not implemented')},hp:100,maxHp:100,rate:0.2,toFire:0,reloded:true,fired:false,power:2.5,range:2,x:0,y:0,gridX:0,gridY:0})
var Creep=Class.create(Unit,{parent:"creep",speeds:[0,1.08,2.245,4.852,6.023,7.945,11.71,22.625],angles:[0,3.75,7.5,15,18,22.5,30,45],cannonTheta:0,olderTheta:0,oldestTheta:0,hp:100,maxHp:100,speed:4,price:4,evading:false,direction:0,rate:0.1,power:1.0,cannonDisplacement:[-4,0],turningPoint:[0,0],range:1,initialize:function($super,x,y,scene,extension){$super(x,y,scene,extension)
Map.grid[x][y].push(this)
if(x==0){this.rotation=0
this.top=this.y-Map.entry[0][1]*Map.pitch
this.bottom=(Map.entry[1][1]+1)*Map.pitch-this.y}else if(y==0){this.rotation=90
this.top=(Map.entry[1][0]+1)*Map.pitch-this.x
this.bottom=this.x-Map.entry[0][0]*Map.pitch}else if(x==(Map.width-1)){this.rotation=180
this.bottom=this.y-Map.entry[0][1]*Map.pitch
this.top=(Map.entry[1][1]+1)*Map.pitch-this.y}else if(y==Map.height-1){this.rotation=270
this.top=this.x-Map.entry[0][0]*Map.pitch
this.bottom=(Map.entry[1][0]+1)*Map.pitch-this.x}},topBottomValues:function(){if(this.rotation==0){return[Map.value(this.x,this.y-this.top-1),Map.value(this.x,this.y+this.bottom+1)]}else if(this.rotation==90){return[Map.value(this.x+this.top+1,this.y),Map.value(this.x-this.bottom-1,this.y)]}else if(this.rotation==180){return[Map.value(this.x-1,this.y+this.top+1),Map.value(this.x-1,this.y-this.bottom-1)]}else if(this.rotation==270){return[Map.value(this.x-this.top-1,this.y-1),Map.value(this.x+this.bottom+1,this.y-1)]}},shouldNotTurn:function(ref){if(this.rotation==0){return this.x<(this.turningPoint[0]+ref-16)}else if(this.rotation==90){return this.y<(this.turningPoint[1]+ref-16)}else if(this.rotation==180){return this.x>(this.turningPoint[0]-ref+16)}else if(this.rotation==270){return this.y>(this.turningPoint[1]-ref+16)}},tick:function(){if(this.dead)return
var move=false
if(!this.rotating){var values=this.topBottomValues()
var top=values[0]
var bottom=values[1]
if(top!=1&&bottom!=1){move=true
this.turningPoint=[0,0]}else{if(this.turningPoint[0]==0&&this.turningPoint[1]==0){this.turningPoint=[this.x,this.y]}else if(bottom==1&&(this.shouldNotTurn(this.bottom))){move=true}else if(top==1&&(this.shouldNotTurn(this.top))){move=true}else{var b=bottom>1?0:bottom
var t=top>1?0:top
this.direction=b-t
this.rotating=true
this.oldTheta=this.rotation
this.oldSpeed=this.speed
var self=this
this.index=this.speeds.collect(function(speed,index){return[Math.abs(self.speed-speed),index];}).select(function(t){if(t[0]<=self.speed)return true}).sort(function(a,b){return a[0]-b[0];})[0][1]
this.speed=this.speeds[this.index]
this.rotation+=this.direction*this.angles[this.index]
this.x+=this.speed*Math.cos(this.rotation*Math.PI/180);this.y+=this.speed*Math.sin(this.rotation*Math.PI/180);}}}else{this.rotation+=this.direction*this.angles[this.index]
this.x+=this.speed*Math.cos(this.rotation*Math.PI/180);this.y+=this.speed*Math.sin(this.rotation*Math.PI/180);if(Math.abs(this.rotation-this.oldTheta)>=90){this.rotation=this.oldTheta+this.direction*90
if(this.rotation<0)this.rotation+=360;if(this.rotation>=360)this.rotation-=360;this.speed=this.oldSpeed
this.rotating=false
this.x=Math.round((this.x/4))*4
this.y=Math.round((this.y/4))*4
this.turningPoint=[0,0]}}
if(move){if(this.rotation==0){this.x+=this.speed}else if(this.rotation==90){this.y+=this.speed}else if(this.rotation==180){this.x-=this.speed}else if(this.rotation==270){this.y-=this.speed}}
var newGridX=Math.floor(this.x/Map.pitch)
var newGridY=Math.floor(this.y/Map.pitch)
if(newGridX>=Map.width||newGridY>=Map.height||newGridX<0||newGridY<0){this.scene.escaped+=1
this.destroy()}else if(this.gridX!=newGridX||this.gridY!=newGridY){var oldArr=Map.grid[this.gridX][this.gridY]
oldArr.splice(oldArr.indexOf(this),1);this.gridX=newGridX
this.gridY=newGridY
if(newGridX<Map.width){Map.grid[newGridX][newGridY].push(this);}else{}}
this.target();},getTargetfromCell:function(cell,targets){if(cell.tower){targets.push(cell.tower)}},pickTarget:function(targets){if(this.dead)return
targets.sort(function(a,b){return a.hp-b.hp})
var target=targets[0]
var dx=this.x-target.x
var dy=this.y-target.y
var theta=Math.atan(dy/dx)*180/Math.PI
if(dx<0){this.cannonTheta=theta-this.rotation}else{this.cannonTheta=theta-this.rotation+180}
if(this.reloaded){target.takeHit(this.power)
if(target.dead&&this.scene.scenario)this.scene.scenario.notify({name:"creepDestroyedTower",method:false,unit:this})
this.reloaded=false;this.fired=true;}},die:function(){this.destroy()
this.killed=true
this.scene.money+=Math.round(this.price);this.scene.stats.creepsDestroyed++
this.scene.score+=Math.round(this.maxHp/20)*this.scene.config.level},destroy:function(){var cell=Map.grid[this.gridX][this.gridY];cell.splice(cell.indexOf(this),1);this.dead=true}})
var Turret=Class.create(Unit,{theta:0,cannonTheta:0,rank:0,stateChange:false,upgradable:true,maxRank:3,canHitFlying:true,canHitGround:true,name:'Belcher',targets:'Air &<br/>Ground',facilities:'Fires Bullets',type:'Turret',cssClass:'tower',hp:500,maxHp:500,power:10,rate:0.2,price:30,range:2,upgradeValues:['maxHp','power','rate','range'],upgrades:[{maxHp:1100,power:18,price:3},{maxHp:1300,power:22,price:8,range:3},{maxHp:1600,power:26,rate:0.3,price:21,range:4}],initialize:function($super,x,y,scene,extension){this.display=null
this.hp=this.maxHp
$super(x,y,scene,extension)},upgrade:function(){if(this.rank==this.maxRank)return false
var upgrade=this.upgrades[this.rank]
if(this.scene.money<upgrade.price)return false
this.rank+=1
var self=this
var oldHp=this.maxHp
this.upgradeValues.each(function(v){if(upgrade[v])self[v]=upgrade[v]})
this.price+=upgrade.price
this.hp*=this.maxHp/oldHp
this.scene.money-=upgrade.price
return true},getTargetfromCell:function(cell,targets){cell.each(function(obj){targets.push(obj)})},tick:function(){this.target()
this.modifySprites()},modifySprites:function(){this.changeFireState()},pickTarget:function(targets){this.fired=false
targets.sort(function(a,b){return a.hp-b.hp})
if(!this.canHitFlying){targets=targets.select(function(t){return!t.flying})}
if(!this.canHitGround){targets=targets.select(function(t){return t.flying})}
if(targets.length==0)return
var target=targets[0]
var dx=this.x-target.x
var dy=this.y-target.y
var distance=Math.sqrt(dx*dx+dy*dy)
var theta=Math.acos(dx/distance)*180/Math.PI
if(dy>=0){this.cannonTheta=theta-this.theta}else{this.cannonTheta=this.theta-theta}
if(dy==0&&dx==0){this.cannonTheta=this.theta}
if(this.reloaded){this.fire(target)
this.reloaded=false;this.fired=true;}
this.targetUnit=target},fire:function(target){var power=this.power
target.takeHit(power)
if(target.dead){this.scene.scenario.notify({name:"towerDestroyedCreep",method:false,unit:this})}},die:function(){this.destroy()
Map.grid[this.gridX][this.gridY]=[];this.scene.stats.towersDestroyed++;},changeFireState:function(){},destroy:function(){this.dead=true}})
var DoubleTurret=Class.create(Turret,{name:'Reaper',type:'DoubleTurret',cssClass:'doubleTower',firing_turn:0,hp:900,power:15,rate:0.4,price:30,range:2,upgrades:[{maxHp:1550,power:18,price:5},{maxHp:1875,power:22,price:10,rate:0.5},{maxHp:1600,power:26,rate:0.6,price:30,range:3}],initialize:function($super,x,y,scene,extension){$super(x,y,scene,extension)},changeFireState:function(){if(this.fired){this.firing_turn=1-this.firing_turn}}})
var RocketLauncher=Class.create(Turret,{name:'Exploder',targets:'Ground<br/>Only',facilities:'Fires Rockets',cssClass:'rocketLauncher',reloaded:true,type:'RocketLauncher',canHitFlying:false,canHitGround:true,hp:1700,power:150,rate:0.05,price:40,range:3,maxHp:1200,upgrades:[{maxHp:2100,power:200,price:13},{maxHp:2500,power:300,price:17},{maxHp:3000,power:410,range:4,price:45}],initialize:function($super,x,y,scene,extension){$super(x,y,scene,extension)},tick:function($super){$super()},changeFireState:function(){if(this.fired){this.fired=false
var power=this.power
this.scene.addRocket(new Rocket(this.x,this.y,this.scene,{parent:this,theta:this.cannonTheta,targetUnit:this.targetUnit,x:this.x,y:this.y,power:this.power}))}},fire:function(){},destroySprites:function($super){$super()
this.rocketSprite.destroy()}})
var Patriot=Class.create(Turret,{name:'Patriot',targets:'Air<br/>Only',facilities:'Fires Rockets',type:'Patriot',firing_turn:0,canHitFlying:true,canHitGround:false,cssClass:'patriot',hp:1200,power:40,rate:0.3,price:60,range:4,maxHp:1200,upgrades:[{maxHp:1450,power:50,price:12},{maxHp:1730,power:60,price:30,range:5},{maxHp:2075,power:70,rate:0.4,price:55}],initialize:function($super,x,y,scene,extension){$super(x,y,scene,extension)},changeFireState:function(){if(this.fired){this.firing_turn=1-this.firing_turn
var rocketX=this.x
var rocketY=this.y+(this.firing_turn==0?(5):(-5))
var power=this.power
this.scene.addPatriotRocket(new PatriotRocket(this.x,this.y,this.scene,{parent:this,theta:this.cannonTheta,targetUnit:this.targetUnit,x:rocketX,y:rocketY,power:this.power}))}},fire:function(target){}})
var Rocket=Class.create(Unit,{speed:12,step:0,power:20,lastTargetX:0,lastTargerY:0,initialize:function($super,x,y,scene,extension){$super(x,y,scene,extension)
if(this.parent)this.range=this.parent.range+1;this.dead=false},tick:function(){if(this.targetUnit){this.lastTargetX=this.targetUnit.x
this.lastTargetY=this.targetUnit.y}
var dx=this.x-this.lastTargetX;var dy=this.y-this.lastTargetY;var distance=Math.sqrt(dx*dx+dy*dy);var theta=Math.acos(dx/distance)*180/Math.PI;if(dy>=0){this.theta=theta;}else{this.theta=-theta;}
this.step++;if(distance-(this.speed*this.step)<=this.speed){if(!this.targetUnit.dead){this.targetUnit.takeHit(this.power);if(this.targetUnit.dead){if(this.parent&&!this.parent.dead){this.scene.scenario.notify({name:"towerDestroyedCreep",method:false,unit:this.parent})}}}
this.splash()
this.die();}},splash:function(){var grid=Map.findTile(this.x,this.y)
gridX=grid[0]
gridY=grid[1]
var targets=[]
for(var i=gridX-this.range;i<gridX+this.range+1;i++){for(var j=gridY-this.range;j<gridY+this.range+1;j++){if(Map.grid[i]&&Map.grid[i][j]){this.parent.getTargetfromCell(Map.grid[i][j],targets)}}}
var power=this.power
var targetUnit=this.targetUnit
targets.each(function(target){if(target!=targetUnit){target.takeHit(Math.round(power*0.2))}})},die:function(){this.dead=true}})
var PatriotRocket=Class.create(Rocket,{speed:10,splash:function(){}})
var ghostTurretFeatures={validate:function(){this.valid=true
try{if(Map.grid[this.xGrid]&&Map.grid[this.xGrid][this.yGrid])
if(this.xGrid==Map.bgGrid.length-1||Map.grid[this.xGrid][this.yGrid].tower||Map.bgGrid[this.xGrid][this.yGrid]>0||game.scene.money<this.tower.prototype.price||this.yGrid==0){this.valid=false}}
catch(e){console.log("error in map in ",x,y,e)}
game.scene.push(20,this.validate,this)},checkMap:function(x,y){if(!Map.empty(x,y-1)||!Map.empty(x,y)||!Map.empty(x,y+1)){this.valid=false;}},droppingGroundClick:function(e){var x=0,y=0
var self=GhostTurret
if(e.layerX){x=e.layerX;y=e.layerY}
else{x=e.x;y=e.y}
self.xGrid=Math.floor(x/32)
self.yGrid=Math.floor(y/32)
self.validate();if(self.valid&&self.selected){self.selected=true
game.scene.addTurret(self.towerName,Math.floor(x/32),Math.floor(y/32))}
else if(Map.grid[self.xGrid][self.yGrid].tower){self.selected=false
game.scene.selectTower(self.xGrid,self.yGrid)}
else{Sounds.play(Sounds.gameSounds.wrong_tower)}
if(game.scene.selectedTower)
game.scene.processTowerInfoTemplate()},select:function(div){$('droppingGround').stopObserving("mouseenter")
var self=GhostTurret
if(game.scene.selectedTower&&game.scene.selectedTower.display){game.scene.selectedTower.display.rangeSprite.visible=false}
var tower=game.config.towers.find(function(tower){return tower==div.className})
self.towerName=tower
if(tower==null){return;}
var towerCategory=eval(tower)
var towerDisplay=eval(tower+"Display")
game.scene.selectedTower=towerCategory.prototype
self.images=towerDisplay.prototype.images
self.initImages=towerDisplay.prototype.initImages
self.range=towerCategory.prototype.range
self.initImages(1)
self.selected=true;$('droppingGround').observe("mouseenter",function(e){self.isIn=true
var x=0,y=0
if(e.layerX){x=e.layerX;y=e.layerY}
else{x=e.x;y=e.y}
self.x=x
self.y=y
this.observe("mousemove",function(e){var x=0,y=0
if(e.layerX){x=e.layerX;y=e.layerY}
else{x=e.x;y=e.y}
self.x=x
self.y=y
self.xGrid=Math.floor(x/32)
self.yGrid=Math.floor(y/32)
if(Map.grid[self.xGrid]&&Map.grid[self.xGrid][self.yGrid]&&Map.grid[self.xGrid][self.yGrid].tower){self.hoverXgrid=self.xGrid
self.hoverYGrid=self.yGrid
self.towerHovered=true}
else{self.towerHovered=false}
self.tower=towerCategory
self.validate()}).observe("click",function(e){GhostTurret.droppingGroundClick(e)})}).observe("mouseleave",function(e){self.isIn=false
this.stopObserving("mousemove").stopObserving("click")}).addClassName('turret')
if(game.scene.selectedTower)
game.scene.processTowerInfoTemplate()},showInfo:function(){},clear:function(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)},render:function(ctx){ctx.save()
ctx.translate(Map.transform(this.x)-Map.pitch,Map.transform(this.y))
if(this.towerHovered){ctx.drawImage(Loader.images.game['hover_effect.png'],25,-3)}else{if(GhostTurret&&GhostTurret.selected&&GhostTurret.isIn){ctx.drawImage(this.images.base[0],0,0)
if(this.images.cannon){ctx.drawImage(this.images.cannon[0],0,0)}else{ctx.drawImage(this.images.pad[0],0,0)
ctx.drawImage(this.images.rocket[0],0,0)}
if(this.valid){ctx.fillStyle='rgba(255,255,255,0.5)'
ctx.beginPath();ctx.arc(Map.pitch+16,Map.pitch-16,(this.range*Map.pitch)+(Map.pitch/2),0,Math.PI*2,false)
ctx.closePath();ctx.fill();}else{ctx.fillStyle='rgba(255,0,0,0.0)'
ctx.beginPath();ctx.arc(0,0,128,0,Math.PI*2,false)
ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,0,0,0.9)'
ctx.fillRect(32,0,32,32)}}}
ctx.restore();}}
var Humvee=Class.create(Creep,{name:'Humvee',hp:275,maxHp:275,speed:4,price:2,cannonDisplacement:[-1,1]})
var Tank=Class.create(Creep,{name:'Tank',images:{},price:1,power:1})
var TankI=Class.create(Creep,{images:{},name:'TankI',price:1,hp:225,maxHp:225})
var TankII=Class.create(Creep,{images:{},name:'TankII',price:2,speed:8,hp:225,maxHp:225})
var BlackTank=Class.create(Creep,{images:{},name:'BlackTank',price:40,hp:3000,maxHp:3000,speed:2,power:3})
var RedTank=Class.create(Creep,{images:{},name:'RedTank',price:3,power:2,hp:175,maxHp:175})
var Display=Class.create({initialize:function(owner){this.owner=owner;},update:function(){},finish:function(){}})
var CanvasDisplay=Class.create(Display,{initialize:function(owner){this.owner=owner;this.initImages();},initImages:function(){}})
var UnitDisplay=Class.create(CanvasDisplay,{createBaloon:function(num){if(!this.baloon){this.baloon=new Baloon(num,this.owner)
this.owner.scene.creepsLayer.attach(this.baloon)}},destroyBaloon:function(){this.baloon.destroy()
this.baloon=null}})
var CreepDisplay=Class.create(UnitDisplay,{initialize:function(owner){this.owner=owner;this.initImages();this.sprite=new CompositeUnitSprite(this.images,this.owner)},update:function(){if(this.owner.killed){var anim=new CreepBoom(this.owner.x,this.owner.y)
this.owner.scene.rankLayer.attach(anim)
this.owner.scene.objects.push(anim)
Sounds.play(Sounds.boom.unit)
var anim=new CoinsAnimation(this.owner.x,this.owner.y-40)
this.owner.scene.towerHealthLayer.attach(anim)
this.owner.scene.objects.push(anim)
var moneyAnim=new MoneyAnimation(this.owner.x-10,this.owner.y-5,Math.round(this.owner.price))
this.owner.scene.objects.push(moneyAnim)}},finish:function(){var anim=new CreepBoom(this.x,this.y)
this.owner.scene.rankLayer.attach(anim)
this.owner.scene.objects.push(anim)
Sounds.play(Sounds.boom.unit)},})
var HumveeDisplay=Class.create(CreepDisplay,{initImages:function(){this.images={base:Loader.images.game['humvee_body.png'],cannon:Loader.images.game['humvee_tower.png'],fire:Loader.images.game['humvee_tower_in_action.png']}}})
var TankDisplay=Class.create(CreepDisplay,{initImages:function(){this.images={base:Loader.images.game['tank_body.png'],cannon:Loader.images.game['tank_tower.png'],fire:Loader.images.game['tank_tower_in_action.png']}}})
var TankIDisplay=Class.create(CreepDisplay,{initImages:function(){this.images={base:Loader.images.game['tank_1_body.png'],cannon:Loader.images.game['tank_1_tower.png'],fire:Loader.images.game['tank_1_tower_in_action.png']}}})
var TankIIDisplay=Class.create(CreepDisplay,{initImages:function(){this.images={base:Loader.images.game['tank_2_body.png'],cannon:Loader.images.game['tank_2_tower.png'],fire:Loader.images.game['tank_2_tower_in_action.png']}}})
var BlackTankDisplay=Class.create(CreepDisplay,{initImages:function(){this.images={base:Loader.images.game['black_tank_body.png'],cannon:Loader.images.game['black_tank_tower.png'],fire:Loader.images.game['black_tank_tower_in_action.png']}}})
var RedTankDisplay=Class.create(CreepDisplay,{initImages:function(){this.images={base:Loader.images.game['red_tank_body.png'],cannon:Loader.images.game['red_tank_tower.png'],fire:Loader.images.game['red_tank_tower_in_action.png']}}})
var PlaneDisplay=Class.create(UnitDisplay,{initialize:function($super,owner){$super(owner)
this.cannonSprite=new Sprite([this.images.base,this.images.fire],owner)
this.shadowSprite=new Sprite([this.images.shadow],owner)
this.healthSprite=new HealthSprite(owner)
this.cannonSprite.shiftX=30
this.shadowSprite.shiftX=30},initImages:function(){this.images={base:Loader.images.game['air_craft.png'],fire:Loader.images.game['air_craft_in_action.png'],shadow:Loader.images.game['air_craft_shade.png']}},update:function(){if(this.owner.fired){this.cannonSprite.currentFrame=1}else{this.cannonSprite.currentFrame=0}
if(this.owner.killed){var anim=new CreepBoom(this.owner.x,this.owner.y)
this.owner.scene.rankLayer.attach(anim)
this.owner.scene.objects.push(anim)
Sounds.play(Sounds.boom.unit)
var anim=new CoinsAnimation(this.owner.x,this.owner.y-40)
this.owner.scene.towerHealthLayer.attach(anim)
this.owner.scene.objects.push(anim)
var moneyAnim=new MoneyAnimation(this.owner.x-10,this.owner.y-5,Math.floor(this.owner.price))
this.owner.scene.objects.push(moneyAnim)}},finish:function(){var anim=new CreepBoom(this.x,this.y)
this.owner.scene.rankLayer.attach(anim)
this.owner.scene.objects.push(anim)
Sounds.play(Sounds.boom.unit)}})
var RedPlaneDisplay=Class.create(PlaneDisplay,{initImages:function(){this.images={base:Loader.images.game['red_air_craft.png'],fire:Loader.images.game['red_air_craft_in_action.png'],shadow:Loader.images.game['air_craft_shade.png']}}})
var TurretDisplay=Class.create(UnitDisplay,{fireSound:Sounds.turret.fire,initialize:function(owner){this.owner=owner;this.initImages(1);this.rangeSprite=new RangeSprite(owner.range,owner)
this.baseSprite=new Sprite(this.images.base,owner)
if(this.images.cannon)this.cannonSprite=new Sprite(this.images.cannon.concat(this.images.fire),owner)
this.rankSprite=new Sprite(this.images.ranks,owner)
this.rankSprite.shiftX=50;this.rankSprite.shiftY=-5;this.healthSprite=new HealthSprite(owner)},initImages:function(rank){this.images={}
this.images.base=[Loader.images.game['tower_base_'+rank+'.png']]
this.images.cannon=[Loader.images.game['belcher_'+rank+'.png']]
this.images.fire=[Loader.images.game['belcher_'+rank+'_inaction.png']]
this.images.ranks=[null,Loader.images.game['rank_1.png'],Loader.images.game['rank_2.png'],Loader.images.game['rank_3.png']]},update:function(){if(this.owner.killed){var anim=new CreepBoom(this.owner.x,this.owner.y)
this.owner.scene.rankLayer.attach(anim)
this.owner.scene.objects.push(anim)
Sounds.play(Sounds.boom.unit)}
this.cannonSprite.rotation=Nezal.degToRad(this.owner.cannonTheta)
if(this.owner.fired){Sounds.play(this.fireSound)
this.cannonSprite.currentFrame=1}
else{this.cannonSprite.currentFrame=0}},upgrade:function(){this.rankSprite.currentFrame=this.owner.rank%4;if(this.owner.rank==4)this.initImages(2)
else if(this.owner.rank==8)this.initImages(3)
this.baseSprite.images=this.images.base
if(this.images.cannon)this.cannonSprite.images=this.images.cannon.concat(this.images.fire)}})
var DoubleTurretDisplay=Class.create(TurretDisplay,{fireSound:Sounds.turret.fire,initImages:function($super,rank){$super(rank)
this.images.cannon=[Loader.images.game['reaper_'+rank+'.png']]
this.images.fire=[Loader.images.game['reaper_'+rank+'_inaction_right.png'],Loader.images.game['reaper_'+rank+'_inaction_left.png']]},update:function(){if(this.owner.fired){Sounds.play(this.fireSound)
this.cannonSprite.currentFrame=this.owner.firing_turn+1}
else{this.cannonSprite.currentFrame=0}
this.cannonSprite.rotation=Nezal.degToRad(this.owner.cannonTheta)},})
var RocketLauncherDisplay=Class.create(TurretDisplay,{initialize:function(owner){this.owner=owner;this.initImages(1);this.cannonSprite=new Sprite(this.images.pad,owner)
this.rangeSprite=new RangeSprite(owner.range,owner)
this.baseSprite=new Sprite(this.images.base,owner)
this.rocketSprite=new Sprite(this.images.rocket,owner)
if(this.images.cannon)this.cannonSprite=new Sprite(this.images.cannon.concat(this.images.fire),owner)
this.rankSprite=new Sprite(this.images.ranks,owner)
this.rankSprite.shiftX=50;this.rankSprite.shiftY=-5;this.healthSprite=new HealthSprite(owner)},initImages:function(rank){this.images={}
this.images.base=[Loader.images.game['tower_base_'+rank+'.png']],this.images.pad=[Loader.images.game['exploder.png']],this.images.rocket=[Loader.images.game['exploder_rocket.png']],this.images.ranks=[null,Loader.images.game['rank_1.png'],Loader.images.game['rank_2.png'],Loader.images.game['rank_3.png']]},update:function(){if(this.fired){Sounds.play(Sounds.turret.patriotLaunch)}
if(this.owner.reloaded){this.rocketSprite.draw=true}
else this.rocketSprite.draw=false
this.cannonSprite.rotation=Nezal.degToRad(this.owner.cannonTheta)
this.rocketSprite.rotation=Nezal.degToRad(this.owner.cannonTheta)}})
var PatriotDisplay=Class.create(TurretDisplay,{initImages:function(rank){this.images={}
this.images.base=[Loader.images.game['tower_base_'+rank+'.png']],this.images.cannon=[Loader.images.game['patriot.png']],this.images.fire=[Loader.images.game['patriot_inaction_right.png'],Loader.images.game['patriot_inaction_left.png']],this.images.ranks=[null,Loader.images.game['rank_1.png'],Loader.images.game['rank_2.png'],Loader.images.game['rank_3.png']]},update:function(){if(this.owner.fired){this.cannonSprite.currentFrame=this.owner.firing_turn+1
Sounds.play(Sounds.turret.patriotLaunch)}else{this.cannonSprite.currentFrame=0}
this.cannonSprite.rotation=Nezal.degToRad(this.owner.cannonTheta)}})
var RocketDisplay=Class.create(CanvasDisplay,{initialize:function($super,owner){$super(owner)
this.rocketSprite=new Sprite([this.rocketImage],owner)
this.rocketSprite.rotation=Nezal.degToRad(this.owner.theta)},initImages:function(){this.rocketImage=Loader.images.game['exploder_rocket_inaction.png']},update:function(){this.rocketSprite.rotation=Nezal.degToRad(this.owner.theta)
this.rocketSprite.transitionX=-(this.owner.step*this.owner.speed)}})
var PatriotRocketDisplay=Class.create(RocketDisplay,{initImages:function(){this.rocketImage=Loader.images.game['patriot_rocket.png']}})
var Plane=Class.create(Creep,{name:'Plane',parent:'Plane',flying:true,hp:125,maxHp:125,speed:4,power:1,rate:0.1,range:2,price:2,initialize:function($super,x,y,extension){$super(x,y,extension)
this.x=0
this.theta=0},tick:function(){this.x+=this.speed*Math.cos(this.theta*Math.PI/180)
this.y+=this.speed*Math.sin(this.theta*Math.PI/180)
var newGridX=Math.floor((this.x)/Map.pitch)
if(this.gridX>=Map.width){if(this.x>=(Map.width*Map.pitch+Map.pitch/2)){this.scene.escaped+=1
this.destroy()}}else if(this.gridX!=newGridX){var oldArr=Map.grid[this.gridX][this.gridY]
oldArr.splice(oldArr.indexOf(this),1);this.gridX=newGridX
if(newGridX<Map.width){Map.grid[newGridX][this.gridY].push(this);}else{}}
this.target();},die:function(){if(Map.grid[this.gridX]&&Map.grid[this.gridX][this.gridY]){var cell=Map.grid[this.gridX][this.gridY];var res=cell.splice(cell.indexOf(this),1);}
this.scene.money+=Math.round(this.price);this.scene.stats.creepsDestroyed++
this.scene.score+=Math.round(this.maxHp/20)*this.scene.config.level},destroy:function(){this.dead=true}})
var RedPlane=Class.create(Plane,{hp:125,maxHp:125,speed:6,power:1,rate:0.1,range:2,price:3})
var Animation=Class.create({x:0,y:0,dead:false,currentFrame:0,delay:1,delayIndex:0,dx:20,dy:20,fps:0,score:0,initialize:function(x,y){this.visible=true
this.frames=[]
this.x=x;this.y=y;this.initImages()},initImages:function(){},tick:function(){this.delayIndex++
if(this.delayIndex>=this.delay){this.delayIndex=0
this.currentFrame++}
if(!this.frames[this.currentFrame+'.png']){this.finish();}},render:function(ctx){if(this.frames[this.currentFrame+'.png'])
ctx.drawImage(this.frames[this.currentFrame+'.png'],this.x-this.dx/2,this.y-this.dy/2)},finish:function(){this.dead=true
this.layer=null}})
var CreepBoom=Class.create(Animation,{dx:32,dy:32,initImages:function(){this.frames=Loader.animations.creep_boom}})
var NukeBoom=Class.create(Animation,{dx:640,dy:480,initImages:function(){this.frames=Loader.images.weapons},render:function(ctx){var shadeImage=""
if(this.currentFrame==1)shadeImage="1"
else if(this.currentFrame>=2&&this.currentFrame<=4)shadeImage="2_4"
else if(this.currentFrame>=5&&this.currentFrame<=9)shadeImage="5_9"
else if(this.currentFrame>=10&&this.currentFrame<=14)shadeImage="10_14"
else if(this.currentFrame>=15&&this.currentFrame<=16)shadeImage="15_16"
else if(this.currentFrame>=17&&this.currentFrame<=20)shadeImage="17_20"
if(this.frames[this.currentFrame+'.png']){ctx.drawImage(Loader.images.weapons[shadeImage+'_shade.png'],this.x-this.dx/2,this.y-this.dy/2)
ctx.drawImage(this.frames[this.currentFrame+'.png'],this.x-this.dx/2,this.y-this.dy/2)}}})
var CoinsAnimation=Class.create(Animation,{dx:16,dy:30,initImages:function(){this.frames=Loader.animations.coins}})
var HealAnimation=Class.create(Animation,{dx:22,dy:44,initImages:function(){this.frames=Loader.animations.health_point}})
var ArrowAnimation=Class.create(Animation,{dx:0,dy:0,increment:0,initImages:function(){this.frames=Loader.animations.arrow},tick:function(){if(this.increment==60){this.increment=0;this.x-=60}
this.x+=3
this.increment+=3
this.currentFrame=1}})
var VerticalArrowAnimation=Class.create(Animation,{dx:0,dy:0,increment:0,initImages:function(){this.frames=Loader.animations.vertical_arrow},tick:function(){if(this.increment==60){this.increment=0;this.y-=60}
this.y+=3
this.increment+=3
this.currentFrame=1}})
var WeakAnimation=Class.create(Animation,{type:'weak',tick:function(){},render:function(ctx){game.scene.creeps.each(function(creep){ctx.drawImage(Loader.images.game['weak.png'],creep.x-16,creep.y-16)})}})
var MoneyAnimation=Class.create(Animation,{increment:0,step:3,totalMovement:30,initialize:function($super,x,y,money){this.money=money
$super(x,y)
this.frames=Loader.animations.coins},initImages:function(){this.parent=$('gameElements');this.div=document.createElement('div');this.div.innerHTML="+"+this.money
var divIdName='moneyAnimation';this.div.setAttribute('id',divIdName);this.div.style.position="absolute"
this.div.style.top=this.y+"px"
this.div.style.left=this.x+"px"
this.image=Loader.animations.coins[this.currentFrame+'.png']
this.parent.appendChild(this.div);},enlarge:function(text){this.step=2
this.div.innerHTML=text
this.div.style.fontSize="13px"},tick:function(){if(this.increment==this.totalMovement)this.finish()
this.increment+=this.step
this.y-=this.step
this.div.style.top=this.y+"px"},finish:function($super){$super()
this.parent.removeChild(this.div)}})
var SuperWeapon=Class.create({factor1:0,factor2:0,cooldown:15,initialize:function(scene,options){this.scene=scene
var options=options||{}
this.active=true
this.count=options.count||0
this.progressInterval=options.progressInterval||1
this.type=options.type},fire:function(){if(!this.active)return
try{this.action()
if(window.document){if(typeof FlashCanvas!="undefined"){this.normalEffect($$('#gameElements .superWeapons .'+this.type+' img').first(),this.cooldown)}else{this.clockEffect($$('#gameElements .superWeapons .'+this.type+' img').first(),this.cooldown)}}}catch(e){}},end:function(){if(window.document){var canvas=$$('#gameElements .superWeapons .'+this.type+' canvas')
if(canvas.length>0){$$('#gameElements .superWeapons .'+this.type)[0].removeChild(canvas[0])}
if(typeof FlashCanvas!="undefined"){$$('#gameElements .superWeapons .'+this.type+' img').first().setOpacity(1)}}},render:function(){},action:function(){},progressTick:function(){this.progress++
this.notify(this.progress)
if(this.progress==this.coolDown){if(this.count>0)this.activate()}else{var self=this
this.scene.reactor.push(this.progressInterval,function(){self.progressTick()})}},normalEffect:function(img,delay){this.active=false
var image=img
var opacity=0
image.setOpacity(opacity)
var self=this
function tick(){opacity+=(0.7/(delay*1000/self.scene.reactor.delay))
image.setOpacity(opacity)
if(opacity>=0.7){image.setOpacity(1)
self.active=true
return}
self.scene.push(1,tick)}
tick()},clockEffect:function(img,delay){this.active=false
var image=img
var canvas=document.createElement('canvas')
canvas.width=image.width
canvas.id="can1"
canvas.height=image.height
canvas.style.position='absolute'
canvas.style.left='0px'
var ctx=canvas.getContext('2d')
var angle=0
image.parentNode.appendChild(canvas)
var self=this
function tick(){ctx.clearRect(0,0,300,300)
ctx.drawImage(overlay,0,0)
ctx.save()
ctx.globalCompositeOperation='destination-out'
ctx.fillStyle="white";ctx.strokeStyle="black"
ctx.translate(image.width/2,image.height/2)
ctx.rotate(-(Math.PI/180)*90)
ctx.beginPath();ctx.arc(0,0,(image.width>image.height?image.width:image.height)+5,0,(Math.PI/180)*angle,false);ctx.lineTo(0,0)
ctx.closePath();ctx.fill()
ctx.stroke();ctx.restore()
angle=angle+(360/(delay*1000/self.scene.reactor.delay))
if(angle>360){self.active=true
image.parentNode.removeChild(canvas)
return}
self.scene.push(1,tick)}
var overlay=Loader.images.background[this.type+'_button_off.png']
tick()},deactivate:function(){this.active=false
this.renderDeactivate()},renderActivate:function(){var div=$$('#gameElements .superWeapons div.'+this.type)[0]
div.setOpacity(div.getOpacity()+0.05)
if(div.getOpacity()==0.7){var self=this
div.observe('click',function(){self.scene.fire(div.className)})
div.setOpacity(1)}else{var self=this
this.scene.push(this.progressInterval,function(){self.activate()})}},renderDeactivate:function(){var div=$$('#gameElements .superWeapons div.'+this.type)[0]
div.stopObserving('click')
div.setOpacity(0);}})
var Weak=Class.create(SuperWeapon,{action:function(){if(window.document){Sounds.play(Sounds.superWeapons.weak,true)
var anim=new WeakAnimation()
var randomUnit=this.scene.creeps[Math.round(this.scene.randomizer.next()*(this.scene.creeps.length-1))]
this.scene.scenario.notify({name:"superWeaponsWeak",method:false,unit:randomUnit})
this.scene.objects.push(anim)
this.scene.rankLayer.attach(anim)}
var self=this
this.weak(0)},weak:function(count){var self=this
this.scene.creeps.each(function(creep){creep.takeHit(Math.floor(creep.hp*self.factor1));})
count++
var self=this
if(count<self.factor2){this.scene.push(20,function(){self.weak(count);})}
else if(window.document)self.unWeak()},unWeak:function(){var index=-1
this.scene.objects.each(function(obj,i){if(index==-1&&obj.constructor==WeakAnimation){index=i}})
var anim=this.scene.objects.splice(index,1)[0]
anim.layer=null}})
var Splash=Class.create(SuperWeapon,{action:function(){this.scene.scenario.notify({name:"superWeaponsSplash",method:false,unit:this.scene.creeps.random()})
var x=[0,Map.width*Map.pitch-1][Math.round(Math.random())]
var y=[0,Map.height*Map.pitch-1][Math.round(Math.random())]
Sounds.play(Sounds.turret.rocketLaunch,true)
Sounds.play(Sounds.turret.rocketLaunch,true)
var self=this
this.scene.creeps.sort(function(a,b){return b.hp-a.hp}).slice(0,self.factor2).each(function(creep){self.scene.addPatriotRocket(new PatriotRocket(0,0,self.scene,{theta:0,targetUnit:creep,x:x,y:y,power:creep.maxHp*self.factor1,speed:15}))})}})
var Nuke=Class.create(SuperWeapon,{action:function(){this.scene.scenario.notify({name:"superWeaponsNuke",method:false,unit:this.scene.creeps.random()})
Sounds.play(Sounds.superWeapons.nuke,true)
function startNuke(){this.scene.creeps.each(function(creep){creep.takeHit(Math.round(creep.maxHp*1));})
if(window.document){var anim=new NukeBoom(320,240)
this.scene.objects.push(anim)
this.scene.rocketsLayer.attach(anim)}}
this.scene.push(25,startNuke,this)}})
var Heal=Class.create(SuperWeapon,{action:function(){this.scene.scenario.notify({name:"superWeaponsHeal",method:false,unit:this.scene.turrets.random()})
var self=this
self.scene.turrets.each(function(tower){tower.hp=Math.min(tower.maxHp,tower.hp+tower.maxHp*self.factor1)
if(window.document){Sounds.play(Sounds.superWeapons.heal,true)
var anim=new HealAnimation(tower.x,tower.y-43)
self.scene.objects.push(anim)
self.scene.rocketsLayer.attach(anim)}})}})
var Hyper=Class.create(SuperWeapon,{action:function(){var self=this
this.scene.scenario.notify({name:"superWeaponsHyper",method:false,unit:this.scene.turrets.random()})
Sounds.play(Sounds.superWeapons.hyper,true)
var hyper=function(tower){tower.originalRate=tower.rate;tower.rate*=self.factor1;tower.originalX=tower.x
tower.originalY=tower.y}
this.scene.turrets.each(hyper)
this.scene.towerMutators.push({name:'hyper',action:hyper})
this.hyperEffect(0,0)},hyperEffect:function(ticks,flip){if(ticks>this.factor2*1000/this.scene.reactor.delay){this.unHyper()
return;}
this.scene.turrets.each(function(turret){if(flip%2==0){var directionX=1
var directionY=1
var randx=Math.random()
var randy=Math.random()
if(randx>0.5)directionX=-1
if(randy>0.5)directionY=-1
turret.x+=directionX*1
turret.y+=directionY*1}else{turret.x=turret.originalX
turret.y=turret.originalY}})
var self=this
this.scene.push(2,function(){self.hyperEffect(ticks+2,flip+1)})},unHyper:function(){var self=this
self.scene.turrets.each(function(tower){if(tower.originalRate)tower.rate=tower.originalRate;tower.x=tower.originalX
tower.y=tower.originalY});var index=-1
this.scene.towerMutators.splice(index,1)}})
var UpgradeData={selectedUpgrade:null,bullets:{affects:[Turret,DoubleTurret],list:[{price:0,classes:['bullets_1'],effect:{}},{price:120,classes:['bullets_2'],effect:{rate:1.5}}]},rockets:{affects:[RocketLauncher,Patriot],list:[{price:0,classes:['rockets_1'],effect:{}},{price:120,classes:['rockets_2'],effect:{rate:1.5}}]},shields:{affects:[Turret,DoubleTurret,RocketLauncher,Patriot],list:[{price:0,classes:['shields_1'],effect:{}},{price:120,classes:['shields_2'],effect:{maxHp:1.5,hp:1.5}}]}}
var Upgrades={init:function(){this.data=Nezal.clone_obj(UpgradeData)
this.selectDefault()},selectDefault:function(){if($$('#gameElements .upgrades .upgradeItem.bullets')[0]){$$('#gameElements .upgrades .upgradeItem.bullets')[0].addClassName('selected');Upgrades.data.selectedUpgrade=Upgrades.data['bullets']}},select:function(){if(this.id==null||this.id=='')return
$$('#gameElements .upgrades .upgradeItem').invoke('removeClassName','selected')
this.addClassName('selected')
Upgrades.data.selectedUpgrade=Upgrades.data[this.id]},upgrade:function(){var item=Upgrades.data.selectedUpgrade
if(!item.list[1])return
if(!item||game.scene.money<item.list[1].price)return
item.list.shift()
game.scene.money-=item.list[0].price
item.affects.each(function(tower){var values=eval(game.config.towers.find(function(t){return eval(t)==tower})).prototype
for(p in item.list[0].effect){if(values[p]){values[p]=Math.round(values[p]*item.list[0].effect[p]*100)/100
game.scene.turrets.each(function(t){if(t.constructor==tower){t[p]=Math.round(t[p]*item.list[0].effect[p]*100)/100}})}}})
$('towerInfo').innerHTML=''},render:function(){if(Upgrades.data.selectedUpgrade){var item=Upgrades.data.selectedUpgrade
$('currentUpgrade').className="upgrade current active "+item.list[0].classes[0]
if(item.list[1]){if(game.scene.money<item.list[1].price){$('nextUpgrade').className="upgrade next "+item.list[1].classes[0]+" off"}else{$('nextUpgrade').className="upgrade next "+item.list[1].classes[0]}
$('upgradePrice').innerHTML='$'+item.list[1].price}else{$('nextUpgrade').className="upgrade next blocked"
$('upgradePrice').innerHTML=''}}}}
var Tutorial=Class.create({count:0,initialize:function(scene,ctx){this.scene=scene
this.scene.money=60
this.tutorialScene=new Scene(50)
this.tutorialLayer=new Layer(ctx);this.tutorialLayer.clear=true
this.tutorialScene.layers.push(this.tutorialLayer)
var self=this
var arr=['Splash','Heal','Hyper','Weak','Nuke']
this.tutorialScene.start()
$$('#gameElements .superWeapons div').each(function(div){div.hide()})
this.content=$$('#modalWindow .innerContent').first()
this.ok=$$('#modalWindow #ok').first()
this.step1()},hide:function(){$('modalWindow').hide()},step1:function(){$('modalWindow').show()
this.viewMessage(0)
var self=this
this.ok.observe('click',function(){self.ok.stopObserving('click')
self.viewMessage(1)
self.ok.observe('click',function(){self.ok.stopObserving('click')
self.viewMessage(2)
self.ok.observe('click',function(){self.viewMessage(3)
self.ok.stopObserving('click')
self.ok.observe('click',self.hide)
self.placeTower()})})})},viewMessage:function(num){$('modalWindow').hide();Effect.Appear('modalWindow',{duration:0.5});this.content.innerHTML=window.Text.game.tutorial['msg'+(num+1)]},placeTower:function(){this.ok.hide()
this.validate=GhostTurret.validate
GhostTurret.validate=function(){GhostTurret.valid=true
if((this.xGrid!=5||this.yGrid!=4)){GhostTurret.valid=false}}
var anim=this.addArrowAnim(505,130)
anim2=this.addArrowAnim(500,400)
var self=this
$$('.towers .Turret').invoke('observe','click',function(){self.step2(this,anim,anim2)})},step2:function(div,anim,anim2){$$('.towers .Turret').first().stopObserving('click')
$$('.towers .Turret').first().observe('click',function(){GhostTurret.select(this)})
$('modalWindow').show()
anim.finish()
anim2.finish()
GhostTurret.select(div)
var self=this
self.ok.stopObserving('click')
self.ok.observe('click',self.hide)
self.viewMessage(4)
anim.finish()
anim=self.addVerticalArrowAnim(152,30)
self.droppingGroundClick=GhostTurret.droppingGroundClick
GhostTurret.droppingGroundClick=tutorialGroundClicked
function tutorialGroundClicked(e){if(e.x){var x=Math.floor(e.layerX/32)
var y=Math.floor(e.layerY/32)}else{var x=Math.floor(e.x/32)
var y=Math.floor(e.y/32)}
GhostTurret.validate(x,y);if(GhostTurret.valid){_gaq.push(['_trackEvent','Tutorial','tower placed',navigator.userAgent]);anim2=self.addVerticalArrowAnim(50,350)
GhostTurret.droppingGroundClick=self.droppingGroundClick
self.droppingGroundClick(e)
GhostTurret.validate=self.validate
anim.finish()
self.viewMessage(5)}}
$$('#gameElements .start').first().observe('click',function(){self.startAttack(anim,anim2)})},startAttack:function(anim,anim2){this.ok.show()
anim.finish()
anim2.finish()
$('modalWindow').hide()
$$('#gameElements .start').first().stopObserving('click')
$$('#gameElements .startText').first().innerHTML=""
this.scene.sendWaves(this.scene.config)
this.scene.checkStatus()},initiateSuperWeapon:function(){var anim=this.addArrowAnim(440,130)
var self=this
this.scene.reactor.pause()
$('modalWindow').show()
this.viewMessage(6)
this.ok.hide()
$$('#gameElements .superWeapons .splash').first().show()
$$('#gameElements .superWeapons .splash').first().observe('click',function(){self.fireSuperWeapon("splash",anim)})},fireSuperWeapon:function(weapon,anim){$('modalWindow').hide()
this.scene.reactor.resume()
anim.finish()
this.scene.fire(weapon)
var self=this},planesAttack:function(){this.ok.show()
$('modalWindow').show()
var self=this
self.viewMessage(8)
self.scene.reactor.pause()
self.ok.stopObserving('click')
self.ok.observe('click',function(){self.scene.reactor.resume();self.hide()})},wishLuck:function(){this.ok.show()
$('modalWindow').show()
var self=this
self.viewMessage(9)
self.scene.reactor.pause()
self.ok.stopObserving('click')
self.ok.observe('click',function(){self.scene.reactor.pause()
self.hide();Intro.newbieNoMore()
$("gameStart").innerHTML=Intro.templates['game'];})},upgradeTower:function(){var self=this
self.scene.reactor.pause()
$('modalWindow').show()
self.ok.stopObserving('click')
self.ok.show()
self.ok.observe('click',function(){self.scene.reactor.resume();self.hide()})
self.viewMessage(7)},waveEffect:function(){$('modalWindow').show()
var self=this
self.viewMessage(10)
self.scene.reactor.pause()
self.ok.stopObserving('click')
self.ok.observe('click',function(){self.scene.reactor.resume();self.hide()
self.scene.push(120,function(){game.tutorial.initiateSuperWeapon()})})},addArrowAnim:function(x,y){var anim=new ArrowAnimation(x,y)
this.tutorialLayer.attach(anim)
this.tutorialScene.objects.push(anim)
return anim},addVerticalArrowAnim:function(x,y){var anim=new VerticalArrowAnimation(x,y)
this.tutorialLayer.attach(anim)
this.tutorialScene.objects.push(anim)
return anim},messages:["Welcome to the academy of defense.</br>"
+"</br>During this training period, you will get all the required information, and gain the basic skills that are needed to defend your city against any hostile activities. </br>","</br>Your goal is to kill all coming waves of enemy units and prevent them from passing to your city </br>","You can always see your current rank at the top right of the map </br>"
+"</br>The upper bar indicates your rank progress, the wave number, your score in this game and the remaining enemy units to escape that indicate your loss</br>","Now it is time to place some towers. Click on the Belcher tower in the towers box.</br>"
+"Notice that the tower information will be visible in the information box.","Click on the highlighted area to place the tower. ","Place more towers as long as you have enough gold. then press start to begin the battle","You can always use super weapons on demand. ","click on a tower to see it's abilities, sell or upgrade it","Finally, there is an important hint you need to know before finishing this training. Air units do not respect any path, they simply fly over anything.","That is it soldier, you are now ready to defend your city against any hostile activities. I am sure you will do your best to complete all missions assigned to you."
+"</br>Do not forget to like us and bookmark  us to get a nice reward. Good Luck.","After each wave enemies get stronger, so prepare yourself well"]})
var Scenario=Class.create({events:[],currentEvent:null,scenario:{},eventNames:{},eventRunning:false,firstTick:0,initialize:function(scene){this.scene=scene},notify:function(event){if(event.unit&&(!event.unit.display||event.unit.constructor==Plane||event.unit.constructor==RedPlane))return
var x=this.scene.randomizer.next()
if((x<0.1&&event.unit)||(event.name!="creepEnteredTower"&&event.name!="creepEntered"&&event.name!="towerDestroyedCreep")){event['tick']=0
event['created']=false
event['finished']=false
this.events.push(event)
this.eventNames[event.name]=true}},start:function(){this._speak()},_speak:function(){for(var i=0;i<this.events.size();i++){var event=this.events[i]
if(event.tick<4){if(event.created)
event.tick++
else{if(event.unit&&event.unit.baloon){event.finished=true}
else if(event.unit&&event.unit.display&&!event.unit.dead){var baloonNum=2
if(event.unit.parent=="creep")baloonNum=1
event.unit.display.createBaloon(baloonNum)
event.created=true
event.unit.display.baloon.text.innerHTML=window.Text.game[event.name][Math.round(this.scene.randomizer.next()*(Text.game[event.name].length-1))]
if(event.method)this[event.name]()}}}else{if(event.unit&&!event.unit.dead&&event.unit.display.baloon)event.unit.display.destroyBaloon()
event.finished=true}}
var arr=[]
for(var i=0;i<this.events.size();i++){if(!this.events[i].finished){arr.push(this.events[i])}}
this.events=arr
var self=this
this.scene.reactor.push(10,function(){self._speak()})},formScenario:function(){this.scenario['creepDestroyed']=["ARRGGHH!","NOOO!!!","SEE YOU IN HELLLL!","I AM DYING!!","OUCH!!","#3aaaa!","TEEET!","#^$?!"]
this.scenario['towerDestroyedCreep']=["Who's next?!","BRING IT ON!!!","Die, Die, Die","Did it hurt?","Take that!"]
this.scenario['towerDestroyed']=["ARRGGHH!","NOOO!!!","I DIE IN HONOR!","I AM DYING!!","OUCH!!","#3aaaa!","TEEET!","#^$?!"]
this.scenario['creepDestroyedTower']=["Oops, was that a tower?","WE WILL CRUSH'em!!!","Die, Die, Die","Hurray!","Take that!","FATALITY!"]
this.scenario['superWeaponsHeal']=["Just in time!","Thanks Man!","Feels Better!"]
this.scenario['superWeaponsWeak']=["I AM BLIND!","Cough, cough!","I feel s l e e p y!"]
this.scenario['superWeaponsSplash']=["What is this?!","Run!!","Rockets, Run!"]
this.scenario['superWeaponsNuke']=["Wha..","Ru...","I see a ...","Lights ...","#3aaaa.."]
this.scenario['superWeaponsHyper']=["COFFEE!!","GOOD STUFF!!","I AM HYPER!!","WEEHAAAA!"]
this.scenario['creepEntered']=["Born to destroy!!","ATTAAACK!!","RUN THEM OVER!!","CRUSH THEM!"]
this.scenario['creepEnteredTower']=["BRING IT ON!!","HOLD!!","STAND YOUR GROUND!!","That's all you got?"]}})
var RangeSprite=Class.create(Sprite,{initialize:function(range,owner){this.range=range
this.owner=owner
this.visible=false},render:function(ctx){if(this.owner.dead){return this.destroy()}
ctx.save()
ctx.translate(Map.transform(this.owner.x)-Map.pitch,Map.transform(this.owner.y))
ctx.fillStyle='rgba(255,255,255,0.5)'
ctx.beginPath();ctx.arc(Map.pitch*1.5,Map.pitch*0.5,(this.owner.range*Map.pitch)+(Map.pitch/2),0,Math.PI*2,false)
ctx.closePath();ctx.fill();ctx.restore()}})
var IncomingWaves={init:function(container,template,divId,reactor){this.reactor=reactor
this.wave=0
this.step=5
this.waveWidth=154
container.innerHTML=TrimPath.parseTemplate(template.value).process()
this.div=$(divId)
this.div.setStyle({width:Config.waves.length*this.waveWidth+'px',left:-154*(Config.waves.length-3)+'px'})
this.div.children[this.wave].addClassName('active')},nextWave:function(){this.div.children[this.wave].removeClassName('active')
this.div.children[this.wave].addClassName('passed')
this.wave++
this.div.children[this.wave].addClassName('active')
this.moved=0;this.reactor.push(0,this.advance,this)},advance:function(){this.div.setStyle({left:Number(this.div.style.left.gsub('px',''))+this.step+'px'})
this.moved+=this.step
if(this.moved>=this.waveWidth){this.div.setStyle({left:Number(this.div.style.left.gsub('px',''))-this.moved+this.waveWidth+'px'})
return}
this.reactor.push(1,this.advance,this)}}