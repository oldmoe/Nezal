/*
HTTP Host: static.ak.fbcdn.net
Generated: July 6th 2010 2:24:44 AM PDT
Machine: 10.16.139.103
Locale: nu_ll
Path: js/lib/event/controller.js
*/

((location=='about:blank'&&(window.parent.eval_global||window.parent.eval))||(window.eval_global||window.eval))("if (window.CavalryLogger) { CavalryLogger.start_js([\"js\\\/lib\\\/event\\\/controller.js\"]); }\n\nfunction EventController(a){copy_properties(this,{_queue:[],_ready:false,_responder:a});}copy_properties(EventController.prototype,{startQueue:function(){this._ready=true;this.dispatchEvents();return this;},pauseQueue:function(){this._ready=false;return this;},addEvent:function(event){event=event.toLowerCase();var a=[];for(var b=1;b<arguments.length;b++)a.push(arguments[b]);this._queue.push({type:event,args:a});if(this._ready)this.dispatchEvents();return false;},dispatchEvents:function(){if(!this._responder)throw new Error('No event responder.');for(var b=0;b<this._queue.length;b++){var a='on'+this._queue[b].type;if(typeof(this._responder[a])!='function'&&typeof(this._responder[a])!='null'){throw new Error('No event handler.');}else if(this._responder[a])this._responder[a].apply(this._responder,this._queue[b].args);}this._queue=[];}});\n\nif (window.Bootloader) { Bootloader.done([\"js\\\/lib\\\/event\\\/controller.js\"]); }")