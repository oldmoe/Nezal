<MARQUEE BEHAVIOR=SCROLL LOOP=1 direction=right onfinish="Comments.refreshUpdate()">
{for msg in msgs}
  <span id="${msg[0]['id']}">
    ${msg[0]['message']}
  </span>
  <img src="/images/background/comment-separator.png"/>
{/for}
</marquee>