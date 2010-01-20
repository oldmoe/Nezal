// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function submitOnEnter(submitter, event, eventHandler)
{
  var keycode;
  if(event){
    keycode = event.which;
  } else if (window.event) {
    keycode = window.event.keyCode;
  } else {
    return true;
  }
  if (keycode == 13 && !event.shiftKey)
  {
    var data = submitter.value.replace(/^\s*/, "").replace(/\s*$/, "");
    if( data.length >0 )
    {
      eventHandler(escape(data));
      submitter.value = "";
      return false;
    }
    submitter.value = "";
  }
  else
    return true;    
}

