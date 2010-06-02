var reactor = new Reactor()
var right = new Narrator(reactor, 'right_baloon')
var left = new Narrator(reactor, 'left_baloon')
var narrators = [right, left]

var events = [
	[function(){
		$('waitScreen').hide()
		$('loadingScreen').show()	
	}, 10],
	
	[function(){
			new Effect.Fade('loadingScreen', {duration : 2.0})
			$('game').show()			
			//Sound.play('sounds/effects/mp3/score.mp3')
			//$('creditsScreen').show();
			var credits = $('sms_marquee')
			new Effect.Move(credits, { x: credis.style.width, y: 0, mode: 'relative' , duration: 25});
	}, 10],
	//[function(){SMS.scrollMessages(); $('creditsScreen').hide()}, 500],
	[function(){SMS.scrollMessages()}, 10],
	function(){right.speak('أهلاً بكم، سنتعرض معا طرفي مباراة جنوب أفريقيا و المكسيك')},	
	[function(){right.unspeak()}, 20],
	[function(){left.speak('لقد نسى زميلي العزيز أن يذكر أنها المباراة الافتتاحية لكأس العالم')}, 20],
	[function(){left.unspeak()}, 20],
	function(){$$("#left_screen img")[0].src = 'images/teams/mex.jpg'; $$("#right_screen img")[0].src = 'images/teams/rsa.jpg'},
	function(){right.speak('يعد هذا هو ظهور جنوب أفريقيا الثالث في نهائيات كأس العالم لكرة القدم')},
	[function(){right.unspeak()}, 20],
	[function(){right.speak('وتعتبر مشاركتها الأولى في فرنسا عام 1998 ، والثانية في كوريا واليابان عام 2002')}, 10],	
	[function(){right.unspeak()}, 20],
	[function(){right.speak('وسجل بيني مكارثي الهدف الأول لبلاده في نهائيات كأس العالم لكرة القدم عند التعادل 1-1 امام الدانمرك يوم 18 يونيو 1998')}, 10],	
	[function(){right.unspeak()}, 20],
	[function(){left.speak('تأهلت المكسيك لنهائيات كأس العالم 14 مرة، متفوقة على كل منتخبات الكونكاكاف')}, 20],
	[function(){left.unspeak()}, 20],
	function(){$$("#left_screen img")[0].src = 'images/flags/mex.png'; $$("#right_screen img")[0].src = 'images/flags/rsa.png'},
	[function(){left.speak('أفضل مركز حصلت عليه المكسيك في نهائيات كأس العالم هو المركز السادس الذي نالته في البطولتين اللتين نظمتا في المكسيك 1970 و1986')},10],
	[function(){left.unspeak()}, 20],
	[function(){left.speak('تعتبر بطولة جنوب أفريقيا 2010 هي المرة الخامسة على التوالي التي يتأهل فيها المكسيكيون إلى نهائيات المونديال. وفي البطولات الأربع السابقة، خرجت من دور الستة عشر')},10],
	[function(){left.unspeak()}, 20],
	function(){$$("#left_screen img")[0].src = 'images/ads/1.jpg'; $$("#right_screen img")[0].src = 'images/ads/2.jpg'},
	function(){right.speak('كل التوفيق لجنوب أفريقيا')},
	[function(){left.speak('بل كل التوفيق للمكسيك'); right.unspeak()}, 20],
	[function(){left.unspeak()}, 20]
]

var timeline = new Timeline(reactor, events)

// Application entry point
$(document).observe('dom:loaded',function(){
	reactor.run(function(){timeline.run()})
})