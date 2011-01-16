
var Carousel=Class.create({id:null,ulId:null,currIndex:0,width:0,scroll:3,offset:0,displayCount:3,enabled:true,images:{'left':"",'left-disabled':"",'right':"",'right-disabled':""},initialize:function(id,images,displayCount){this.id=id;this.images=images;this.width=parseInt($$('#'+this.id+' ul li')[0].getStyle('width'))+
parseInt($$('#'+this.id+' ul li')[0].getStyle('padding-left'))+
parseInt($$('#'+this.id+' ul li')[0].getStyle('padding-right'))+
parseInt($$('#'+this.id+' ul li')[0].getStyle('margin-left'))+
parseInt($$('#'+this.id+' ul li')[0].getStyle('margin-right'));this.displayCount=displayCount;this.ulId=$$('#'+this.id+' ul')[0].id;this.listSize=$$('#'+this.ulId+' li').length;$(this.ulId).style.left=0;this.offset=$(this.id).cumulativeOffset()[0];this.right=$$('#'+this.id+' .right img')[0];this.right.carousel=this;this.left=$$('#'+this.id+' .left img')[0];this.left.carousel=this;this.right.observe('click',function(event){Event.element(event).carousel.scrollLeft();});this.left.observe('click',function(event){Event.element(event).carousel.scrollRight();});this.checkButtons()},destroy:function(){this.right.stopObserving('click');this.left.stopObserving('click');},scrollRight:function(){var distance=0
if(this.currIndex>0)
{if(!this.enabled)return;this.enabled=false;var newIndex=this.currIndex-this.scroll;if(newIndex<0)
newIndex=0;var step=-1*(newIndex-this.currIndex)*this.width;this.currIndex=newIndex;var carousel=this;new Effect.Move(this.ulId,{x:step,y:0,mode:'relative',duration:0.5,afterFinish:function(){carousel.enabled=true;}})
this.checkButtons();}},scrollLeft:function(){if(this.currIndex<this.listSize-this.displayCount)
{if(!this.enabled)return;this.enabled=false;var newIndex=this.currIndex+this.scroll;if(newIndex>this.listSize-this.displayCount)
newIndex=this.listSize-this.displayCount;var step=-1*(newIndex-this.currIndex)*this.width;this.currIndex=newIndex;var carousel=this;new Effect.Move(this.ulId,{x:step,y:0,mode:'relative',duration:0.5,afterFinish:function(){carousel.enabled=true;}})
this.checkButtons();}},scrollTo:function(index){if(index>(this.listSize-this.displayCount))
index=this.listSize-this.displayCount
var distance=(this.currIndex-index)*this.width;this.currIndex=index;new Effect.Move(this.ulId,{x:distance,y:0,mode:'relative',duration:0.5,afterFinish:function(){}})
this.checkButtons();},checkButtons:function(){if(this.currIndex==0)
{this.left.addClassName('leftOff');this.left.src=this.images['left-disabled'];this.left.removeClassName('leftOn');}else{this.left.addClassName('leftOn');this.left.src=this.images['left'];this.left.removeClassName('leftOff');}
if((this.currIndex==(this.listSize-this.displayCount))||(this.listSize<this.displayCount))
{this.right.addClassName('rightOff');this.right.src=this.images['right-disabled'];this.right.removeClassName('rightOn');}else{this.right.addClassName('rightOn');this.right.src=this.images['right'];this.right.removeClassName('rightOff');}}})
var FBConnect={appIds:{'ie-city-defender':"149722381737500",'local-city-defender':"110196392331352",'city-defender':"107418339291733",'defenderofarabia':"122519734470004"},channelPath:"xd_receiver.html",location:null,url:function(){var data=FBConnect.location;data=data.split("/");data=data[4];return data;},retry:10,callback:null,user:null,getUser:function(){FBConnect.retry--;FBConnect.callback();},init:function(successCallback){FBConnect.location=window.location.toString();var fbRoot=document.createElement('div');fbRoot.setAttribute("id","fb-root");var invite=document.createElement('iframe');invite.setAttribute("id","invite");invite.setAttribute("src","#");invite.style.display='none';document.body.appendChild(fbRoot);document.body.appendChild(invite);FB.init({appId:FBConnect.appIds[FBConnect.url()],apiKey:FBConnect.appIds[FBConnect.url()],status:true,cookie:true});FBConnect.callback=successCallback;FB.getLoginStatus(function(response){if(response.session){FBConnect.session=response.session;Ajax.Responders.register({onCreate:function(req){var inviter=''
var search=window.location.search
if(search){search=search.split('?')[1]
if(search){search=search.split('&').find(function(pair){return pair.include('inviter')})
if(search){inviter=search}}}
req.url+=(req.url.include('?')?'&':'?')+Object.toQueryString(FBConnect.session)+'&'+inviter
return true}});if(document.getElementsByTagName('fb:fan')[0])
{document.getElementsByTagName('fb:fan')[0].writeAttribute('profile_id',FBConnect.appIds[FBConnect.url()]);FB.XFBML.parse();}
FBConnect.getUser();}else{var redirect_url=''
if(response.status=="unknown")
{redirect_url="http://www.facebook.com/login.php?v=1.0&app_id="+
FBConnect.appIds[FBConnect.url()]+"&canvas=1&next=http://apps.facebook.com/"+
FBConnect.url();}else if(response.status=="notConnected")
{var inviter=FBConnect.location.split("inviter")[1];var appendParam='';if(inviter)
{var id=inviter.split('&')[0];appendParam='?inviter'+id;}
redirect_url="http://www.facebook.com/connect/uiserver.php?app_id="+
FBConnect.appIds[FBConnect.url()]+"&next=http://apps.facebook.com/"+
FBConnect.url()+"/"+appendParam+"&display=page&locale=en_US&return_session=0&"+"fbconnect=0&canvas=1&legacy_return=1&method=permissions.request";}
window.top.location=redirect_url;}});},getUserInfo:function(callback){if(!FBConnect.user)
{FB.api('/me',function(response)
{FBConnect.user=response;callback();});}else{callback();}},isFan:function(callback){var query=FB.Data.query("SELECT page_id FROM page_fan WHERE uid={0}",FB.getSession().uid);FB.Data.waitOn([query],function(){var fan=query.value.find(function(obj){if(obj.page_id==FB._apiKey){return true;}});callback(fan);});},bookmark:function(callback){FB.ui({method:'bookmark.add'},function(response){if(response.bookmarked==1)
callback();});},subscribe:function(callback){FB.ui({method:'auth.login',perms:'email'},function(response){if(response.perms&&response.perms.indexOf('email')>-1)
callback();});},publish:function(attachment,usePrompt,actionLink,successCallback){FB.ui({method:'stream.publish',display:'dialog',message:'',attachment:attachment,action_links:actionLink,user_message_prompt:usePrompt},function(response){if(response&&response.post_id){successCallback();}});window.setTimeout(function(){var divs=$$('#fb-root .fb_dialog');if(divs.length>1&&(parseInt(divs.last().getStyle('top'))<0))
{divs.last().style["top"]="203.6px";divs.last().style["left"]="82.5px";}},10000);},invite:function(inviteMsg,userPrompt,appName){$('invite').src="html/invite.html?"+"msg="+escape(inviteMsg)+"&propmt="+escape(userPrompt)+"&name="+escape(appName)
$('invite').show();}}
var Language={supported:{'en_US':'english','en_GB':'english','fr_CA':'french','fr_FR':'french','ar_AR':'arabic'},langsNames:[['english','English'],['arabic','العربية'],['french','Français']],userLanguage:'english',getLanguage:function(savedLang,callback){if(savedLang)
{Language.userLanguage=savedLang;callback();}
else
{FBConnect.getUserInfo(function(){if(Language.supported[FBConnect.user.locale])
Language.userLanguage=Language.supported[FBConnect.user.locale];callback();})}},select:function(lang,callback){new Ajax.Request('users/locale',{method:'post',parameters:{'locale':lang},onSuccess:function(t){Language.userLanguage=t.responseText;callback();}})}}
var Layer=Class.create({initialize:function(ctx){this.ctx=ctx
this.clear=false
this.sprites=[]
this.visible=true},attach:function(sprite){sprite.layer=this
this.sprites.push(sprite)
return this},show:function(){this.visible=true
return this},hide:function(){this.visible=false
return this},render:function(){try{if(this.clear){this.ctx.clearRect(0,0,700,500)}
if(!this.visible)return
var remainingSprites=[]
var self=this
this.sprites.each(function(sprite){if(sprite.layer==self){if(sprite.visible)sprite.render(self.ctx)
remainingSprites.push(sprite)}})
this.sprites=remainingSprites}catch(e){console.log(e)}
return this}})
var Nezal={notImplemented:function(string){return function(){alert('Please implement '+string)}},applyNotImpilemented:function(obj,name){for(i in obj){if(obj[i]==null){obj[i]=this.notImplemented(name+i)}}},degToRad:function(deg){return deg*Math.PI/180},clone_obj:function(obj){if(typeof obj!=='object'||obj==null)return obj;var c=obj instanceof Array?[]:{};for(var i in obj){var prop=obj[i];if(typeof prop=='object'){if(prop instanceof Array){c[i]=[];for(var j=0;j<prop.length;j++){typeof prop[j]!='object'?c[i].push(prop[j]):c[i].push(Nezal.clone_obj(prop[j]));}}else{c[i]=Nezal.clone_obj(prop);}}else{c[i]=prop;}}
return c;}}
Array.prototype.random=function(){return this[Math.round(Math.random()*(this.length-1))]}
var Randomizer=Class.create({initialize:function(randoms){this.index=0
if(randoms){this.randoms=randoms}else{this.randoms=[]
for(var i=0;i<100;i++){this.randoms.push(Math.random())}}},next:function(){var result=this.randoms[this.index]
this.index=(this.index+1)%(this.randoms.length)
return result},reset:function(){this.index=0}})
var Reactor=Class.create({initialize:function(delay){this.delay=delay||50
this.events=[]
this.ticks=0
this.running=false},pause:function(){this.running=false},resume:function(){if(this.running)return
this.running=true
this.tick()},stop:function(){this.running=false;this.events=[]
this.ticks=0},run:function(callback){this.running=true
if(callback)callback()
this.tick()},tick:function(){if(!this.running)return
var self=this
var toFire=[]
try{var event=this.events.last()
while(event&&event[0]<=this.ticks){var length=this.events.length-1
toFire.push(this.events.pop())
event=this.events[this.events.length-1]}
toFire.each(function(event){if(event[2]){event[1].apply(event[2])}else{event[1]()}})}catch(e){}
this.ticks++
if(window.setTimeout)window.setTimeout(function(){self.tick()},this.delay)},_eventIndex:function(ticks,insert){var h=this.events.length,l=-1,m;while(h-l>1)
if(this.events[m=(h+l)>>1][0]>ticks)l=m;else h=m;return this.events[h]&&this.events[h][0]!=ticks?insert?h:-1:h;},push:function(ticks,func,callback){var delay=this.ticks+ticks
this.events.splice(this._eventIndex(delay,true),0,[delay,func,callback])}})
var _Render={renderInitialize:function(){this.layers=[]
this.objects=[]
return this},renderInit:null,render:function(){this.layers.invoke('render')
return this},renderStart:null,renderPause:null,renderResume:null,renderReset:null,renderFinsih:null,renderToggleSound:null}
var Scene=Class.create(_Render,{initialize:function(delay){this.running=false
this.delay=delay||50
this.reactor=new Reactor(this.delay)
this.renderInitialize()},init:function(){},push:function(delay,func,callback){this.reactor.push(delay,func,callback)
return this},start:function(){this.running=true
this.init()
this.reactor.run()
var self=this
this.push(1,function(){self._tick()})
return this},pause:function(){this.running=false
this.reactor.pause()
this.renderPause()
return this},renderPause:function(){},resume:function(){this.running=true
this.reactor.resume()
this.renderResume()
return this},renderResume:function(){},reset:function(){this.running=false
this.reactor.stop()
this.renderReset()
return this},finish:Nezal.notImplemented('Game#finish'),tick:function(){try{var remainingObjects=[]
var self=this
this.objects.each(function(object){if(!object.dead){object.tick()
remainingObjects.push(object)}})
this.objects=remainingObjects}catch(x){console.log(x)}
return this},_tick:function(){if(!this.running)return
this.tick()
this.render()
var self=this
this.push(1,function(){self._tick()})},render:function(){try{this.layers.invoke('render');}catch(x){console.log(x)}},toggleSound:function(){Game.sound=!Game.sound
this.renderToggleSound(Game.sound)
return this}})
var Sprite=Class.create({x:0,y:0,w:0,h:0,transitionX:0,transitionY:0,shiftX:0,shiftY:0,rotation:0,visible:true,layer:null,initialize:function(images,owner,properties){this.images=images
this.owner=owner
Object.extend(this,properties)
if(images[0]){if(!this.w)this.w=images[0].width
if(!this.h)this.h=images[0].height}
this.currentFrame=0
this.draw=true},moveTo:function(x,y){this.x=x
this.y=y
return this},rotate:function(deg){this.rotation=Nezal.degToRad(deg)
return this},show:function(){this.visible=true
return this},hide:function(){this.visible=false
return this},render:function(ctx){if(this.owner.dead){return this.destroy()}
if(!this.visible)return
ctx.save()
ctx.translate(this.owner.x+this.shiftX,this.owner.y+this.shiftY)
if(this.rotation!=0&&this.rotation<360){ctx.rotate(this.rotation)}
if(this.draw&&this.images[this.currentFrame])ctx.drawImage(this.images[this.currentFrame],-48+this.transitionX,-16+this.transitionY)
ctx.restore()},destroy:function(){this.layer=null}})