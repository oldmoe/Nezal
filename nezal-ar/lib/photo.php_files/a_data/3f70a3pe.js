/*
HTTP Host: static.ak.fbcdn.net
Generated: September 15th 2010 12:51:33 PM PDT
Machine: 10.138.16.181
Locale: nu_ll
Path: js/7jkgblo2i5k4ocw4.pkg.js
*/

((location=='about:blank'&&(window.parent.eval_global||window.parent.eval))||(window.eval_global||window.eval))("if (window.CavalryLogger) { CavalryLogger.start_js([\"js\\\/7jkgblo2i5k4ocw4.pkg.js\"]); }\n\nvar PhotoPageTags={removeCallback:function(b,a){PhotoPageTags._replaceTagHtml(a);PhotoTagViewer.getInstance('myphoto').hideTag();PhotoPageTags.resetInstructions();},addCallback:function(c,a){PhotoPageTags._replaceTagHtml(a);var e=htmlize(c.getText());var b=htmlize(a.photoOwnerName);var d='';if(a.tag_success){d='<b>';if(!a.tags_need_approval){if(a.user==c.getTaggeeId()){d+=_tx(\"Tag for yourself saved\");}else d+=_tx(\"Tag for {name} saved\",{name:e});}else if(a.user==c.getTaggeeId()){d+=_tx(\"Tag request for yourself sent to {photo-owner} for approval\",{'photo-owner':b});}else d+=_tx(\"Tag request for {name} sent to {photo-owner} for approval\",{name:e,'photo-owner':b});d+='<\/b>.<br\/>';}else d='<b style=\"color:red\">'+_tx(\"There was an error tagging this photo. Try again later.\")+'<\/b><br \/>';if(a.invite_sent)d+='<b style=\"color: green\">'+_tx(\"An invitation and friend request have been sent to {name}\",{name:e})+'<\/b><br\/>';if(!a.tags_need_approval){d+=_tx(\"You can continue to tag the photo below.\");}else d+=_tx(\"You can continue to request tags in the photo below.\");d+='<br\/>'+_tx(\"When you are done, click the \\\"Done Tagging\\\" button to resume browsing.\");hide('tagging_instructions_default_message');DOM.setContent($('tagging_instructions_status_message'),HTML(d));PhotoPageTags.focusInstructions();},showTaggingUI:function(a){window.photocrop&&window.photocrop.destroy();show('tagging_instructions');PhotoTagController.getInstance('myphoto').enableTagging(PhotoPageTags.addCallback);PhotoPageTags.resetInstructions();PhotoPageTags.focusInstructions();if(a!='ignore'){data={context:a};new AsyncSignal('\/ajax\/photos\/tagbutton.php',{data:JSON.encode(data)}).send();}},_replaceTagHtml:function(a){DOM.setContent($('phototags_row'),HTML(a.tag_html));DOM.setContent($('photo_tag_boxes'),HTML(a.tag_boxes));},resetInstructions:function(){if(!ge('tagging_instructions_status_message'))return;DOM.empty('tagging_instructions_status_message');show('tagging_instructions_default_message');},hideTaggingUI:function(){hide('tagging_instructions');if(PhotoTagController.getInstance('myphoto'))PhotoTagController.getInstance('myphoto').disableTagging();},focusInstructions:function(){if(ge('tagging_instructions')){var a=Vector2.getElementPosition($('tagging_instructions'));if(Vector2.getScrollPosition().y>a.y)DOMScroll.scrollTo(a.sub(0,8));}}};\nfunction PhotoTagViewer(c){if(PhotoTagViewer._instances[c])return PhotoTagViewer._instances[c];copy_properties(this,{minTagDistance:83,photoElementId:c,photoOwnerId:null,photoId:null,photoObjectId:null,tagShowCallback:bagofholding,tagHideCallback:bagofholding,showingTag:null,showingFaceBox:null,tagFrame:null,tagNameFrame:null,faceBoxNameFrame:null,_taggingEnabled:false});this._getPhotoElement=bind(null,ge,c);this._destruct=function(){b.remove();this.hideTag();this.tagHideCallback();this.hideFaceBoxText();this.showingFaceBox=null;delete PhotoTagViewer._instances[c];};this._wait_for_load=function(d){d.deferUntil(image_has_loaded.bind(this,this._getPhotoElement()),100);};if(!this._getPhotoElement())throw new Error('No images with the id `'+c+'\\' '+'found on the page.  PhotoTagViewer Abort.');var a=bind(this,this._photoMouseMove);var b=Event.listen(document,'mousemove',a);onleaveRegister(bind(this,this._destruct));PhotoTagViewer._instances[c]=this;}copy_properties(PhotoTagViewer,{_instances:{},_tagThisFriendText:'',_showFaceBoxes:false,_alwaysShowFaceBoxes:false,getInstance:function(a){return PhotoTagViewer._instances[a];},setTagThisFriendText:function(a){PhotoTagViewer._tagThisFriendText=a;},getTagThisFriendText:function(){return PhotoTagViewer._tagThisFriendText;},setShowFaceBoxes:function(a){PhotoTagViewer._showFaceBoxes=a;},getShowFaceBoxes:function(){return PhotoTagViewer._showFaceBoxes;},setAlwaysShowFaceBoxes:function(a){PhotoTagViewer._alwaysShowFaceBoxes=a;},getAlwaysShowFaceBoxes:function(){return PhotoTagViewer._alwaysShowFaceBoxes;}});copy_properties(PhotoTagViewer.prototype,{setPhotoData:function(c,b,a){this.photoOwnerId=c;this.photoId=b;this.photoFbid=a;this.hideTag();this.tagHideCallback();this.hideFaceBoxText();this.showingFaceBox=null;return this;},setPhotoObjectId:function(a){this.photoObjectId=a;return this;},setMinTagDistance:function(a){this.minTagDistance=a;return this;},registerTagHover:function(b,a){if(!b&&!a){this.tagShowCallback=bind(this,this.showTagText);this.tagHideCallback=bind(this,this.hideTagText);}else{this.tagShowCallback=b;this.tagHideCallback=a;}return this;},enableTagging:function(){this._taggingEnabled=true;},disableTagging:function(){this._taggingEnabled=false;},shouldShowBoxes:function(){return !this._taggingEnabled||(PhotoTagViewer.getAlwaysShowFaceBoxes()&&!shown($('photo_tag_selector')));},_photoClick:function(event){if(!this._getPhotoElement())return this._destruct();if(!this._taggingEnabled)return true;var a=PhotoTag.tagsForPhoto(this.photoId,this.photoOwnerId);if(PhotoTag.MAX_TAGS_PER_PHOTO<=a.length){new ErrorDialog().showError(_tx(\"Too Many Tags\"),_tx(\"A photo may only have up to {limit} tags. To add a new tag, you must first remove one of the existing tags on the photo.\",{limit:PhotoTag.MAX_TAGS_PER_PHOTO}));return $E(event).kill();}},showTag:function(a){if(!this._getPhotoElement())return this._destruct();if(!a)return;if(this._isPhotoCropOn())return;this._wait_for_load(this._showTag.bind(this,a));},_showTag:function(f){if(!this.tagFrame){var e=document.createElement('div');e.style.width=(2*this.minTagDistance)+'px';e.style.height=(2*this.minTagDistance)+'px';CSS.addClass(e,'photo_tag_frame_inside');this.tagFrame=$N('div',null,e);CSS.addClass(this.tagFrame,'photo_tag_frame');this.tagFrame.onclick=bind(this,this._photoClick);DOM.appendContent(document.body,this.tagFrame);}var d=Vector2.getElementPosition(this._getPhotoElement());var c=Vector2.getElementDimensions(this._getPhotoElement());var i=f.absoluteCenter(c.x,c.y);var a=this._calculateWithinBounds(i,2*this.minTagDistance,this._getPhotoElement());var g=new Vector2(a.size,a.size);var h=g.mul(.5,.5);g.setElementDimensions(DOM.find(this.tagFrame,'div.photo_tag_frame_inside'));new Vector2(-10000,-100000,'document').setElementPosition(this.tagFrame);show(this.tagFrame);var b=Vector2.getElementDimensions(this.tagFrame).sub(a.size,a.size).mul(.5,.5);d.add(a.tagPosition).sub(h).sub(b).setElementPosition(this.tagFrame);},hideTag:function(){hide(this.tagFrame);},showTagText:function(a){if(!this._getPhotoElement())return this._destruct();if(!a||this._taggingEnabled)return;this._wait_for_load(this._showTagText.bind(this,a));},_showTagText:function(c){if(this.tagNameFrame)this.hideTagText();if(this._isPhotoCropOn())return;var a=Vector2.getElementDimensions(this._getPhotoElement());var d=c.absoluteCenter(a.x,a.y);var b=Vector2.getElementPosition(this._getPhotoElement());this.tagNameFrame=this._showText(d,b,c.getText(),null);},showFaceBoxText:function(a){if(!this._getPhotoElement())return this._destruct();if(!a||!this.shouldShowBoxes())return;this._wait_for_load(this._showFaceBoxText.bind(this,a));},_showFaceBoxText:function(d){if(this._isPhotoCropOn())return;this.hideFaceBoxText();this.faceBoxFrame=[];var l=d.getCenterPoint();var c=bind(this,this._faceBoxClickCallback,d);var h=$N('div',{className:'photo_tag_frame_inside'});var e=$N('div',{className:'photo_tag_frame',onclick:c},h);CSS.addClass(e,'facebox_frame');DOM.appendContent(document.body,e);var g=Vector2.getElementPosition(this._getPhotoElement());var f=Vector2.getElementDimensions(this._getPhotoElement());var a=this._calculateWithinBounds(l,1.2*this.minTagDistance,this._getPhotoElement());var j=new Vector2(a.size,a.size);var k=j.mul(.5,.5);j.setElementDimensions(DOM.find(e,'div.photo_tag_frame_inside'));var b=Vector2.getElementDimensions(e).sub(a.size,a.size).mul(.5,.5);g.add(a.tagPosition).sub(k).sub(b).setElementPosition(e);this.faceBoxFrame.push(e);var i=this._showText(l.add(0,12),g,PhotoTagViewer.getTagThisFriendText(),c);this.faceBoxFrame.push(i);},_showText:function(e,c,f,b){if(b){var d=$N('a',{onclick:b,className:'photo_box_name_link'},f);}else var d=$N('span',null,f);var g=$N('div',null,d);if(b){CSS.addClass(g,'photo_box_name_frame');}else CSS.addClass(g,'photo_tag_name_frame');DOM.appendContent(document.body,g);var a=this._calculateWithinBounds(e,1.2*this.minTagDistance,this._getPhotoElement());var h=Vector2.getElementDimensions(g);var i=new Vector2(h.x\/2,h.y\/2-a.size\/2-9);c.add(a.tagPosition).sub(i).setElementPosition(g);show(g);return g;},_faceBoxClickCallback:function(b){this.showingFaceBox=null;this.hideFaceBoxText();var a=new PhotoTagController(this.photoElementId).setPhotoData(this.photoOwnerId,this.photoId,this.photoFbid);PhotoPageTags.showTaggingUI('facebox');PhotoTagSelector.init();a.enableTaggingForFaceBox(b);},hideTagText:function(){if(this.tagNameFrame)DOM.remove(this.tagNameFrame);this.tagNameFrame=null;},hideFaceBoxText:function(){if(this.faceBoxFrame)for(var a=0;a<this.faceBoxFrame.length;a++)DOM.remove(this.faceBoxFrame[a]);this.faceBoxFrame=null;},_forceWithinBounds:function(c,b,a){c=c.sub(0,0);if(c.x<b){c.x=Math.min(b,a.x);}else if(c.x>a.x-b)c.x=Math.max(0,a.x-b);if(c.y<b){c.y=Math.min(b,a.y);}else if(c.y>a.y-b)c.y=Math.max(0,a.y-b);return c;},_calculateWithinBounds:function(i,b,c){var e=Vector2.getElementPosition(c);var d=Vector2.getElementDimensions(c);var f=Math.max(i.x-b\/2,0);var g=Math.min(i.x+b\/2,d.x);var j=Math.max(i.y-b\/2,0);var a=Math.min(i.y+b\/2,d.y);var i=new Vector2((g+f)\/2,(j+a)\/2);var h=Math.min(g-f,a-j);return {tagPosition:i,size:h};},_photoMouseMove:function(event){if(!this._getPhotoElement())return this._destruct();if(!this.shouldShowBoxes())return;var e=PhotoTag.tagsForPhoto(this.photoId,this.photoOwnerId);var d=PhotoFaceBox.faceBoxesForPhoto(this.photoFbid);var b=Vector2.getEventPosition(event);var a=Vector2.getElementPosition(this._getPhotoElement());var c=b.sub(a);if(e.length>0){if(PhotoTagViewer.getAlwaysShowFaceBoxes())this._photoMouseMoveFaceBoxes(c,d);this._photoMouseMoveTags(c,e);}else if((PhotoTagViewer.getShowFaceBoxes()||PhotoTagViewer.getAlwaysShowFaceBoxes())&&d.length>0)this._photoMouseMoveFaceBoxes(c,d);},_photoMouseMoveTags:function(f,g){if(!this.tagShowCallback&&!this.tagHideCallback)return;var c=Vector2.getElementDimensions(this._getPhotoElement());if(f.x>0&&f.x<c.x&&f.y>0&&f.y<c.y){var d=c.magnitude();var e=null;for(var b=0;b<g.length;b++){var a=g[b].absoluteCenter(c.x,c.y);var i=a.sub(f);var h=i.magnitude();if(Math.abs(i.x)<=this.minTagDistance&&Math.abs(i.y)<=this.minTagDistance&&h<=d){d=h;e=g[b];if(0==h)break;}}}if(!e&&this.showingTag&&this.tagHideCallback){this.showingTag=null;this.tagHideCallback(this.showingTag);}else if(e&&this.tagShowCallback&&e!=this.showingTag){this.showingTag=e;this.tagShowCallback(e);}},_photoMouseMoveFaceBoxes:function(f,g){var c=Vector2.getElementDimensions(this._getPhotoElement());var d=c.magnitude();var e=null;if(f.x>0&&f.x<c.x&&f.y>0&&f.y<c.y){for(var b=0;b<g.length;b++){var a=g[b].getCenterPoint();var i=a.sub(f);var h=i.magnitude();if(h<=d){d=h;e=g[b];if(0==h)break;}}if(!e&&this.showingFaceBox){this.showingFaceBox=null;this.hideFaceBoxText();}else if(e&&e!=this.showingFaceBox){this.showingFaceBox=e;this.showFaceBoxText(e);}}else{this.showingFaceBox=null;this.hideFaceBoxText();}},_isPhotoCropOn:function(){return window.photocrop&&window.photocrop.instance&&true;}});\nPhotoTagSelector=function(){var y;var zc;var e;var p=null;var g=[];var h=[];var q=false;var t=null;var r=null;var s=null;var b=false;var m=false;var za=bagofholding;var l=bagofholding;var zb=[];var zd=0;var d=function(){zc.value='';e.value='';PhotoTagSelector.exitInviteMode();};var n=function(){return !!ge('photo_tag_selector');};var u=function(){if(!n())return;var zg=zc.value.toLowerCase().trim();zg=typeahead_source.flatten_string(zg);var zj=[];var zk=[];for(var zf=0,zh=g.length;zf<zh;zf++){var ze=g[zf];if(!zg||-1!=ze.flat_name.indexOf(zg))(ze.rel?zk:zj).push(ze.fragment);}zd=zj.length+zk.length;if(0==zd||m){hide('pts_userlist','pts_userlistlabel','pts_choose_text','pts_invite_msg');if(b){z();}else hide('pts_invite_section');return;}show('pts_userlist','pts_userlistlabel','pts_choose_text');hide('pts_invite_section');if(b)show('pts_invite_msg');var zl='';if(0!=zj.length&&0!=zk.length)zl='<hr \/>';var zi=zk.join('')+zl+zj.join('');DOM.setContent($('pts_userlist'),HTML(zi));if((1==zd)&&zg)DOM.find($('pts_userlist'),'input[type=\"checkbox\"]').checked=true;};var i=function(){if(p){return v();}else if(q)return false;q=true;new AsyncRequest().setHandler(k).setErrorHandler(j).setFinallyHandler(function(){q=false;}).setURI('\/ajax\/photos_tag_options.php').setData({pid:r,id:t,oid:s}).setMethod('GET').setReadOnly(true).send();};var w=function(){g=p;if(!zb)return;for(var ze=0,zf=zb.length;ze<zf;ze++)if(zb[ze].id>0){g=g.filter(function(zg){return zb[ze].id!=zg.id;});}else g=g.filter(function(zg){return zb[ze].id!=zg.id||zb[ze].name.toLowerCase()!=zg.name.toLowerCase();});};var k=function(zg){g=p=zg.getPayload();for(var ze=0,zf=p.length;ze<zf;ze++)f(p[ze]);v();};var j=function(ze){PhotoTagSelector.hide();AsyncResponse.verboseErrorHandler(ze);};var f=function(ze){ze.flat_name=typeahead_source.flatten_string(ze.name);var zf='PhotoTagSelector._checkboxClick(this, '+parseInt(ze.id,10)+\", '\"+escape_js_quotes(ze.name)+\"');\";ze.fragment='<label><input type=\"checkbox\" onclick=\"'+zf+'\" \/>'+htmlize(ze.name)+'<\/label>';};var a=function(ze){h.push(ze);};var v=function(){for(var ze=0,zf=h.length;ze<zf;ze++)h[ze]();h=[];};var o=function(event){switch(Event.getKeyCode(event)){case KEYS.RETURN:c();break;case KEYS.ESC:PhotoTagSelector.hide();break;default:setTimeout(u,0);}};var c=function(){var zf=0;var zg='';var ze='';if(''!=e.value.trim()){ze=e.value.trim();zg=zc.value.trim();}else if(1==zd){var zh=DOM.find($('pts_userlist'),'input[type=\"checkbox\"]');if(zh.checked){return zh.onclick();}else zg=zc.value.trim();}else zg=zc.value.trim();x(zf,zg,ze);};var x=function(zh,zj,ze){zh=zh||0;zj=zj||'';ze=ze||'';if(!zj&&!zh)return;za(zh,zj,ze);PhotoTagSelector.hide();if(zh){for(var zg=0,zi=p.length;zg<zi;zg++)if(p[zg].id==zh){p[zg].rel=true;break;}}else if(!ze){var zf=false;for(var zg=0,zi=p.length;zg<zi;zg++)if(!p[zg].id&&p[zg].name==zj){p[zg].rel=true;zf=true;break;}if(!zf){var zk={name:zj,rel:true,id:0};f(zk);p.unshift(zk);}}};var z=function(){var zf=zc.value.trim();var ze;if(zf){var zg=zf.indexOf(' ');ze=zg>-1?zf.substr(0,zg):zf;}else ze=_tx(\"your friend\");DOM.setContent($('pts_invite_name'),ze);show('pts_invite_section');};return {init:function(){if(n())return;var ze='<span id=\"pts_invite_name\">'+_tx(\"your friend\")+'<\/span>';markup='<label for=\"name\" id=\"label_name\" class=\"pts_name_input\">';markup+=_tx(\"Type any name or tag:\");markup+='<\/label>';markup+='<input type=\"text\" class=\"inputtext i_name\" size=\"20\"';markup+='autocomplete=\"off\" id=\"pts_name_input\"\/>';markup+='<span id=\"pts_choose_text\">';markup+=_tx(\"or choose a person:\");markup+='<\/span>';markup+='<div id=\"pts_userlist\">';markup+='<div style=\"margin: 4px;\">';markup+=_tx(\"Loading friends...\");markup+='<\/div>';markup+='<\/div>';markup+='<div id=\"pts_invite_section\" style=\"display: none;\">';markup+=_tx(\"Enter {name}'s email address. We'll send a link to this photo and add them to your friends list.\",{name:ze});markup+='<div>';markup+='<label for=\"pts_invite_email\" id=\"label_pts_invite_email\">';markup+=_tx(\"Email:\");markup+='<\/label>';markup+='<input type=\"text\" class=\"inputtext\" id=\"pts_invite_email\" name=\"pts_invite_email\" value=\"\" \/>';markup+='<\/div>';markup+='<\/div>';markup+='<div id=\"pts_invite_msg\" class=\"hidden_elem\">';markup+='<strong>';markup+=_tx(\"Person doesn't use Facebook?\");markup+='<\/strong>';markup+='<div>';markup+='<a onclick=\"PhotoTagSelector.enterInviteMode()\">';markup+=_tx(\"Click here to tag them.\");markup+='<\/a>';markup+='<\/div>';markup+='<\/div>';markup+='<div class=\"buttons\">';markup+='<input type=\"button\" class=\"inputbutton\" id=\"tag\" name=\"tag\" value=\"'+_tx(\"Tag\")+'\" \/>';markup+='<input type=\"button\" class=\"inputbutton inputaux\" id=\"cancel\" name=\"cancel\" value=\"'+_tx(\"Cancel\")+'\" \/>';markup+='<\/div>';y=$N('div',null,HTML(markup));y.id='photo_tag_selector';ge('content').appendChild(y);e=$('pts_invite_email');zc=$('pts_name_input');zc.onkeyup=o;DOM.find(y,'input[name=\"tag\"]').onclick=c;DOM.find(y,'input[name=\"cancel\"]').onclick=this.hide;},prime:function(){i();return this;},hide:function(){l();if(!n())return;y.style.display='none';za=bagofholding;l=bagofholding;t=null;r=null;s=null;zb=[];zd=0;d();return this;},showAt:function(ze){ze.setElementPosition(y);y.style.display='block';a(w);a(u);a(function(){zc.focus();});i();return this;},setTagCallback:function(ze){za=ze;return this;},setHideCallback:function(ze){l=ze;return this;},setTaggedPeople:function(ze){zb=ze;return this;},setPhotoOwner:function(ze){t=ze;return this;},setPhotoId:function(ze){r=ze;return this;},setPhotoObjectId:function(ze){s=ze;return this;},setAllowEmailTags:function(ze){b=ze;return this;},enterInviteMode:function(){m=true;hide('pts_userlist','pts_userlistlabel','pts_choose_text','pts_invite_msg');z();if(zc.value){var ze=DOM.find($('pts_invite_section'),'input[name=\"pts_invite_email\"]');ze.focus();}else zc.focus();return this;},exitInviteMode:function(){m=false;hide('pts_invite_section');if(b)show('pts_invite_msg');return this;},_checkboxClick:function(ze,zf,zg){if(!ze||!ze.checked)return;x(zf,zg);}};}();function PhotoTagController(a){if(PhotoTagController._instances[a])return PhotoTagController._instances[a];var b=PhotoTagViewer.getInstance(a);if(!b)b=new PhotoTagViewer(a);copy_properties(this,{photoElementId:a,photoOwnerId:null,photoId:null,photoFbid:null,photoObjectId:null,_taggingEnabled:false,_tagCallbackFn:bagofholding,_autoSubmitTags:true,viewerObject:b,scale:1,source:''});this._getPhotoElement=bind(null,ge,a);this._destruct=function(){PhotoTagSelector.hide();this.viewerObject._destruct();delete PhotoTagController._instances[a];};this._wait_for_load=function(c){c.deferUntil(image_has_loaded.bind(this,this._getPhotoElement()),100);};if(!this._getPhotoElement())throw new Error('No images with the id `'+a+'\\' '+'found on the page.  PhotoTagController Abort.');onleaveRegister(bind(this,this._destruct));Event.listen(this._getPhotoElement(),'click',bind(this,this._photoClick),Event.Priority.TRADITIONAL);PhotoTagController._instances[a]=this;}copy_properties(PhotoTagController,{_instances:{},getInstance:function(a){return PhotoTagController._instances[a];}});copy_properties(PhotoTagController.prototype,{setPhotoData:function(c,b,a){this.photoOwnerId=c;if(b!=this.photoId){if(this.photoId)Event.listen(this._getPhotoElement(),'click',bind(this,this._photoClick),Event.Priority.TRADITIONAL);this.photoId=b;}this.photoFbid=a;PhotoTagSelector.hide();this.viewerObject.setPhotoData(c,b,a);return this;},setPhotoObjectId:function(a){this.photoObjectId=a;return this;},setMinTagDistance:function(a){this.viewerObject.setMinTagDistance(a);return this;},setScale:function(a){this.scale=a;return this;},setSource:function(a){this.source=a;return this;},enableTagging:function(b,a){if(!this._getPhotoElement())return this._destruct();this.viewerObject.enableTagging();this._taggingEnabled=true;this._tagCallbackFn=b||bagofholding;this._autoSubmitTags=(a===undefined)||a;this._getPhotoElement().style.cursor='crosshair';PhotoTagSelector.setPhotoOwner(this.photoOwnerId).setPhotoId(this.photoId).setPhotoObjectId(this.photoObjectId).prime();return this;},enableTaggingForFaceBox:function(a){this.enableTagging();this.showTaggerForFaceBox(a.getCenterPoint());},disableTagging:function(){this.viewerObject.disableTagging();if(!this._getPhotoElement())return this._destruct();this._taggingEnabled=false;this._tagCallbackFn=bagofholding;this._autoSubmitTags=true;this._getPhotoElement().style.cursor='';PhotoTagSelector.hide();return this;},_photoClick:function(event){if(!this._getPhotoElement())return this._destruct();if(!this._taggingEnabled)return true;if(PhotoTagViewer.getAlwaysShowFaceBoxes()){var a=DOM.find(document.body,'div.facebox_frame');CSS.hide(a);var b=DOM.find(document.body,'div.photo_box_name_frame');CSS.hide(b);}var f=PhotoTag.tagsForPhoto(this.photoId,this.photoOwnerId);if(PhotoTag.MAX_TAGS_PER_PHOTO<=f.length){new ErrorDialog().showError(_tx(\"Too Many Tags\"),_tx(\"A photo may only have up to {limit} tags. To add a new tag, you must first remove one of the existing tags on the photo.\",{limit:PhotoTag.MAX_TAGS_PER_PHOTO}));return $E(event).kill();}var d=Vector2.getEventPosition(event);var c=Vector2.getElementPosition(this._getPhotoElement());var e=d.sub(c);this._photoEnableTaggerRelative(e);return $E(event).kill();},showTaggerForFaceBox:function(a){this._photoEnableTaggerRelative(a);},_photoEnableTaggerRelative:function(d){PhotoTagSelector.hide();var b=Vector2.getElementDimensions(this._getPhotoElement());var i=PhotoTag.tagsForPhoto(this.photoId,this.photoOwnerId);var g=new PhotoTag(100*d.x\/b.x,100*d.y\/b.y,this.photoOwnerId,this.photoId);g.setScale(this.scale);g.setSource(this.source);this.viewerObject.showTag(g);var e=Vector2.getElementPosition(this.viewerObject.tagFrame);if(d.x>(b.x\/2)||b.x<300){e=e.sub(210,0);}else{var h=Vector2.getElementDimensions(this.viewerObject.tagFrame);e=e.add(h.x+10,0);}var f=[];for(var a=0,c=i.length;a<c;a++)f.push({name:i[a].getText(),id:i[a].getTaggeeId()});PhotoTagSelector.setTagCallback(bind(this,this._photoTagCallback,g)).setHideCallback(bind(this.viewerObject,this.viewerObject.hideTag)).setPhotoOwner(this.photoOwnerId).setPhotoId(this.photoId).setPhotoObjectId(this.photoObjectId).setTaggedPeople(f).showAt(e);},_photoTagCallback:function(d,b,c,a){if(b)d.setTaggeeId(b);if(c)d.setTaggeeName(c);if(a)d.setTaggeeEmail(a);if(this._autoSubmitTags){d.submit(this._tagCallbackFn);}else{d.setLocalSave();this._tagCallbackFn(d,{});}},_isPhotoCropOn:function(){return window.photocrop&&window.photocrop.instance&&true;}});\n\nif (window.Bootloader) { Bootloader.done([\"js\\\/7jkgblo2i5k4ocw4.pkg.js\"]); }")