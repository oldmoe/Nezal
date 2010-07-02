<MARQUEE BEHAVIOR=SCROLL LOOP=1 direction=right onfinish="Comments.refreshUpdate()" onMouseOver='this.stop()' onMouseOut='this.start()'>
{for msg in msgs}
    {if msg[0]['name'] && msg[0]['message']} 
      <div style="display : inline; z-index : 10033;"  title="${msg[0]['name']}">
          <span id="${msg[0]['id']}" class="msg" dir="ltr">
            ${msg[0]['message']}
          </span>
          {if msg[0]['pic']} 
            <img src="${msg[0]['pic']}" style="width : 25px"/>
          {/if}
          <img src="/images/background/comment-separator.png"/>
      </div>
    {/if}
{/for}
</marquee>
