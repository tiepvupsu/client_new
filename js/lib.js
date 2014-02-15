function reloadEvent(btn){
    $(btn).click(function(event) {
        /* Act on the event */
        event.preventDefault();
        window.console.log("reload");
        location.reload();
    
    });
}

function moodleWSCallXMLClone(method, data, callBack, preSets){
                        
    //$.mobile.showPageLoadingMsg();
    
    if(typeof(preSets.wstoken) == 'undefined'){   
        var tokens = localStorage.getItem("tokens");
        var tokens = JSON.parse(tokens);
        var mytoken = tokens[localStorage.getItem("current_site")];
        if(!mytoken){
            popErrorMessage('Unexpected error. Please close and open again the application');
            return false;
        }
    }
    else{
        var mytoken = preSets.wstoken;
    }
    
    if(typeof(preSets.siteurl) == 'undefined'){   
        var sites = JSON.parse(localStorage.getItem("sites"));
        var siteurl = sites[localStorage.getItem("current_site")].siteurl;
        if(!siteurl){
            popErrorMessage('Unexpected error. Please close and open again the application');
            return false;
        }
    }
    else{
        var siteurl = preSets.siteurl;
    }
    
    // TODO . Autodected 2.2 or above to use native json mapping
    //data.moodlewsrestformat = 'json';
    data.wsfunction = method;
    
    var ajaxURL = siteurl+"/webservice/rest/server.php?wstoken="+mytoken;
    var ajaxData = data;
    
    // First of all, we check for a cached ajax response for this call
    
    preSets.nocache = (typeof(preSets.nocache) != 'undefined')? preSets.nocache : 0;
    
    if(!preSets.nocache){
        var cachedData = getCachedWSCall(ajaxURL, ajaxData);
        
        if(cachedData != false){
            //$.mobile.hidePageLoadingMsg();
            callBack(cachedData);
            return true;
        }
    }
    
    // Check if we are connected to Internet
    if(! connectionOn){
        popErrorMessage("Internet connection required to perform this action");
        return;    
    }
    
    $.ajax({
      type: "POST",
      url: ajaxURL,
      data: ajaxData,
      dataType: 'text',
      xhrFields: {
        withCredentials: false
      },
      dataFilter: function(data, dataType){
        // XML returned by Moodle is not well parsed
        data = data.replace(/\<VALUE\>/gi,'<VALUE><![CDATA[').replace(/\<\/VALUE\>/gi,']]></VALUE>');
        data = data.replace(/\<MESSAGE\>/gi,'<MESSAGE><![CDATA[').replace(/\<\/MESSAGE\>/gi,']]></MESSAGE>');
        return data;
      },
      success: function(data){
        //$.mobile.hidePageLoadingMsg();
        
        data = xml2json(data);
        
        if(typeof(data.debuginfo) != "undefined"){
            popErrorMessage('Unexpected error. Please close and open again the application');
            return;
        }
        if(typeof(data.exception) != "undefined"){
            popErrorMessage('Error. '+data.message);
            return;
        }
        
        logInfo("Data received from WS "+typeof(data));       
        
        if(typeof(data) == 'object' && typeof(data.length) != 'undefined'){
            logInfo("Data number of elements "+data.length);
        }
        
        if(!preSets.nocache){
            setCachedWSCall(ajaxURL, ajaxData, data);
        }
        callBack(data);
      }
    });    
}
function checkXML(xml){ 

$(xml).find('listening question').each(function(){
                var id = parseInt($(this).attr('id'));
                
                
                    
                    

                    
                
            });
            
}