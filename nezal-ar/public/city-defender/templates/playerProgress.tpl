<div id='playerProgressIframeContainer' style='display:none'>
	<iframe id="playerProgressIframe"  scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:80px;" allowTransparency="true"></iframe>
</div>
<div id="progressBarEmpty">
	<div id="progressBarFill"> </div>
	<img id="bgImage" src="images/intro/upper_background.png"/>
</div>
				
<div id="progressItems">
	<div class='logo'>
		<img src="images/intro/title.png"/>
	</div>
	<div class='item installed'>
		<div class="iteminfo">
			<div class='title'> Installed </div>
			<div class='price'>$1000</div>
		</div>
		<img src="images/intro/play_icon.png"/>
		<img class="tick" src="images/intro/tick_mark.png"/>
	</div>
	<div class='item bookmark'>
		<div class="iteminfo">
			<div class='title'>
				{if Intro.userData.bookmarked}
					Bookmarked
				{else}
					<a href='#' onclick="FBDefender.bookmark()">Bookmark
				{/if}
			</div>
			<div class='price'>$500</div>
		</div>
		<img src="images/intro/bookmark_icon.png"/>
		{if Intro.userData.bookmarked}
		<img class="tick" src="images/intro/tick_mark.png"/>
		{else}
			</a>
		{/if}
		
	</div>
	<div class='item like'>
		<div class="iteminfo">
				{if Intro.userData.like}
					Liked
				{else}
					<a href='#' onclick="$('playerProgressIframe').src='http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fapps%2Fapplication.php%3Fid%3D'+FBConnect.appIds[FBConnect.url()]+'&layout=standard&show_faces=true&width=450&action=like&colorscheme=light&height=80';$('playerProgressIframeContainer').show();">Like
				{/if}
			<div class='price'>$500</div>
		</div>
		<img src="images/intro/like_icon.png"/>
		{if Intro.userData.like}
		<img class="tick" src="images/intro/tick_mark.png"/>
		{else}
			</a>
		{/if}
	</div>
	<div class='item subscribe'>
		<div class="iteminfo">
				{if Intro.userData.subscribed}
					Subscribed
				{else}
					<a href='#' onclick="FBDefender.subscribe()">Subscribe
				{/if}
			<div class='price'>$500</div>
		</div>
		<img src="images/intro/subscribe_icon.png"/>
		{if Intro.userData.subscribed}
		<img class="tick" src="images/intro/tick_mark.png"/>
		{else}
			</a>
		{/if}
	</div>
</div>