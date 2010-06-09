<FONT SIZE="4" FACE="courier" COLOR=white>
<MARQUEE WIDTH=100% BEHAVIOR=SCROLL LOOP=3 direction=right onFinish=Comments.refresh()>
{for msg in msgs}
  <span id="${msg[0]['id']}">
    ${msg[0]['message']}
  </span>
  <img src="/images/background/comment-separator.png"/>
{/for}
</marquee>
</FONT> 
