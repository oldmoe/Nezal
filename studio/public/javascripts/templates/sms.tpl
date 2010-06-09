<FONT SIZE="4" FACE="courier" COLOR=white>
<MARQUEE BEHAVIOR=SCROLL LOOP=1 direction=right onfinish="Comments.refresh()">
{for msg in msgs}
  <span id="${msg[0]['id']}">
    ${msg[0]['message']}
  </span>
  <img src="/images/background/comment-separator.png"/>
{/for}
</marquee>
</FONT> 
