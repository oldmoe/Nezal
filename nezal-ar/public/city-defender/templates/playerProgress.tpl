<div id='playerProgressIframeContainer' style='display:none'>
	<iframe id="playerProgressIframe"  scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:80px;" allowTransparency="true"></iframe>
</div>
<div class='item logo'>
</div>
<div class='item installed'>
	<div class='title'>Installed</div>
	<div class='price'>$1000</div>
</div>
<div class='item bookmark'>
	<div class='title'>
		{if Intro.userData.bookmarked}
			Bookmarked
		{else}
			<a href='#' onclick="FBDefender.bookmark()">Bookmark</a>
		{/if}
	</div>
	<div class='price'>$500</div>
</div>
<div class='item like'>
		{if Intro.userData.like}
			Liked
		{else}
			<a href='#' onclick="$('playerProgressIframe').src='http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fapps%2Fapplication.php%3Fid%3D'+FBConnect.appIds[FBConnect.url()]+'&layout=standard&show_faces=true&width=450&action=like&colorscheme=light&height=80';$('playerProgressIframeContainer').show();">Like</a>
		{/if}
	<div class='price'>$500</div>
</div>
<div class='item subscribe'>
		{if Intro.userData.subscribed}
			Subscribed
		{else}
			<a href='#' onclick="FBDefender.subscribe()">Subscribe</a>
		{/if}
	<div class='price'>$500</div>
</div>
