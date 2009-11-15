// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function submitOnEnter(submitter, event, url, callback)
{
  var keycode;
  var url = url;
  
  if (window.event) 
    keycode = window.event.keyCode;
  else if (event) 
    keycode = event.which;
  else 
    return true;
     
  if (keycode == 13 && !event.shiftKey)
  {
    var data = submitter.value.replace(/^\s*/, "").replace(/\s*$/, "");
    var dataJson  = {"data": escape(data)}
    if( data.length >0 )
    {
      
      window[callback](dataJson); 
      submitter.value = "";
   
      new Ajax.Request(url, { 
          method:'post', 
          parameters: {data: dataJson["data"]},
          onSuccess: function(transport, json){
            //alert("Success! \n\n" + /*JSON.parse(response).data*/  json.id );
            if(json.data != dataJson["data"])
            {
              window["eventError"]("Error");            
            }
          },
          onFailure: function(){
            window["eventError"]("Error");              
          }
      });
      return false;
    }
  }
  else
    return true;
    
}

