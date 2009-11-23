function eventError( error)
{
  document.getElementById('errorMsg').innerHTML = "Something went wrong while sending message"
}


function appendChatMsg(json)
{
  var chatHistory = document.getElementById('chatHistory');
  var msgs = chatHistory.getElementsByTagName('div');
  var newMsg;
  if(!json.user)
  { 
    json.user =document.getElementById('userName').name;
  }
  if ( msgs.length >0 && msgs.item(msgs.length-1).getElementsByTagName('span').item(0).innerHTML.split(":")[0] == json.user )
  {
    newMsg = msgs.item(msgs.length-1);
    var chatMsgs = msgs.item(msgs.length-1).getElementsByTagName('span');
    newline = document.createElement('br');
    newMsg.appendChild(newline);
  }else
  {
    newMsg = document.createElement('div');
    newMsg = chatHistory.appendChild(newMsg);
    var userSpan =  document.createElement('span');
    userSpan = newMsg.appendChild(userSpan);
    userSpan.innerHTML = json.user + ": "; 
    userSpan.setAttribute('class', 'chatUser');
  }
  var span =  document.createElement('pre');
  span = newMsg.appendChild(span);
  span.setAttribute('class', 'chatMsg');
  span.innerHTML = unescape(json.data);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function updateChat(url)
{
  new Ajax.Request( url, { 
    method:'get', 
    onSuccess: function(transport, json){
      for(var i=0; i< json.length; i++){
        appendChatMsg(json[i]);
      }
      window.setTimeout(window['updateChat'], 5000, url);
    }
  });
}


