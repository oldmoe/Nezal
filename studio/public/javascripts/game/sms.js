var SMS = {
	maxMessages : 20,
	splitter : "<span class='sms_splitter'></span>",
	messages : ['الكرة مع المنتخب المسيكي الآن !', 'فاول على ميلنر', 'الحارس يتصدى لكرة مكسيكية', 'عرضية خطيرة جدا و لكن لا متابعة من المهاجمين المكسيكيين',
	'المكسيك فقد مستواه بشكل كبير , كان منتخب عنيد وقوي سابقا', 'عرضيه خطيره للمنتخب المكسيكي تنتهي إلى تماس', 'خطأ للمكسيك في مكان خطير',
	'تسديده قويه وبعيده من جواردادو', 'هجمة للمكسيك !! و خطأ للأسود !!'],
	scrollMessages : function(){
		messages = this.messages.collect(function(msg){return "<span class='sms_msg'>"+msg+"</span>"})
		alert(messages)
		$('sms_marquee').innerHTML = this.splitter+ messages.join("<span class='sms_splitter'></span>")+this.splitter
	},
	
	addMessage : function(message){
		var m = $('sms_marquee')
		this.messages.push('<span class="sms_msg">'+message+'</span>')
		var span = document.createElement('span')
		span.className = 'sms_msg'
		span.innerHTML = message
		splitter = document.createElement('span')
		splitter.className = 'sms_splitter'
		m.appendChild(splitter)
		m.appendChild(span)
		if(m.childNodes.length > this.maxMessages + m.childNodes.length - 1 ){
			this.messages.shift();
			m.removeChild(m.childNodes[0])
			if(m.childNodes[0]) m.removeChild(m.childNodes[0])
		}		
	},
}


