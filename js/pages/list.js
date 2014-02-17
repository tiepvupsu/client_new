(function(){
	
	listTests();
	sessionStorage.clear();
	var sites = localStorage.getItem("sites");
	$("#btnLoadList").click(function(event) {
		/* Act on the event */
		event.preventDefault();
		console.log("click");
		location.reload();
	});
	
	
	function listTests(){
			console.log("listTests function");

            $('#lmytests li').remove();
            
            var count=1;
            var continute=true;
            do{
            	if (count<10){
            		var id="0"+count;
            	}else{
            		var id=count;
            	}
            	var codeName="ielts"+id;
				var urlXML="../data/"+codeName+"/"+codeName+"ques.xml";
	            
	           
	           	$.ajax({
					type: "GET",
					url: urlXML,
					dataType: "xml",
					success: get(id,codeName)
					
				});
				++count;
            }while(count<4);
            
                  
            //$('#lmytests').listview('refresh');        
    }
    function get(id,codeName){
    	$("#lmytests").append('<li><a id="test'+id+'" codeTest="'+codeName+'">'+codeName+'<p>'+codeName+'</p></a></li>');
                $("#test"+id).click(function(){                        
                    localStorage.setItem("current_test",$(this).attr('codeTest'));
                    $.mobile.changePage("page_select_mode.html");
        });
    }
    function setExit(continute){
    	continute=false;
    }
})();//end here