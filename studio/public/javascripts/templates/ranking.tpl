{for user in holders}
  <li>
    <div class="user">
      <div class="name">
        أضف صديق
      </div>
      <div class="pic" style="background :  transparent url('/images/ranking/question.png') center no-repeat">
        <a href="" onclick="FBConnect.invite(); return false;" style="width:100%; height : 100%;">  </a>
      </div>
    </div>
  </li>
{/for}
{for user in users.reverse()}
    <li>
      <div class="user {if user['me'] == true} 
                          user-me
                        {/if}">
        <div class="name {if user['me'] == true} 
                          name-me
                        {/if}">
          ${user['name']}
        </div>
        <div class="pic" style="background :  transparent url( {if user['pic'] != null} 
                                                                    ${user['pic']} 
                                                                {else} 
                                                                    '/images/ranking/default.png'
                                                                {/if} ) center no-repeat">
          <a href="${user['profile_url']}" target="_parent" style="width:100%; height : 100%;">  </a>
        </div>
        <div class="score">
          <div class="order order-text">
            ${user['order']}
          </div>
          <div class="score-text">
            ${user['score']}
          </div>
        </div>
      </div>
    </li>
{/for}
