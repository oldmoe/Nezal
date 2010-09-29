/*
HTTP Host: static.ak.fbcdn.net
Generated: August 6th 2010 3:03:42 PM PDT
Machine: 10.30.145.196
Locale: nu_ll
Path: js/photos/faces/facebox.js
*/

((location=='about:blank'&&(window.parent.eval_global||window.parent.eval))||(window.eval_global||window.eval))("if (window.CavalryLogger) { CavalryLogger.start_js([\"js\\\/photos\\\/faces\\\/facebox.js\"]); }\n\nfunction PhotoFaceBox(b,c,a){copy_properties(this,{centerPoint:new Vector2(b,c),photoFbid:a});PhotoFaceBox._photoboxList[a]=PhotoFaceBox._photoboxList[a]||[];PhotoFaceBox._photoboxList[a].push(this);}copy_properties(PhotoFaceBox,{_photoboxList:{},faceBoxesForPhoto:function(a){return PhotoFaceBox._photoboxList[a]||[];},clearFaceBoxesForPhoto:function(a){PhotoFaceBox._photoboxList[a]=[];}});copy_properties(PhotoFaceBox.prototype,{_removeLocal:function(){var c=this.photoFbid;var d=PhotoFaceBox._photoboxList[c]||[];for(var a=0,b=d.length;a<b;a++)if(d[a]==this){d.splice(a,1);break;}},getCenterPoint:function(){return this.centerPoint;}});\n\nif (window.Bootloader) { Bootloader.done([\"js\\\/photos\\\/faces\\\/facebox.js\"]); }")