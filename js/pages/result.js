//(function(){

	var codeName=localStorage.getItem("current_test");
	var correctAns=parseInt(sessionStorage.getItem("correctAns"));
	var urlXML="../data/ielts_convert.xml";
	var urlXMLKey="../data/"+codeName+"/"+codeName+"ques.xml";
	var isModeOnline=false;
	var totalQues=parseInt(sessionStorage.getItem("totalQues_currenttest"));
	var takentime=sessionStorage.getItem("takentime");

	console.log(urlXMLKey);
	console.log(urlXML);
	callAjax();

	if(localStorage.getItem('isOnline')=='yes'){
			if(sessionStorage.getItem('back_to_page')){
						btp=sessionStorage.getItem('back_to_page');
						console.log(btp);
						$("#btnResult2List").attr('href',btp);
			}
	}
	// change to localStorage
	
	$("#btnBack").click(function(event) {
		/* Act on the event */
		countinueCount=false;
		$("span.rs").html("");
		sessionStorage.clear();
		

	});

	//$("p.correct").html("You got "+correct +" answers");
	
	
	
	function callAjax(){
		

		$.ajax({
				type: "GET",
				url: urlXML,
				dataType: "xml",
				success: getEILTSConvert,
		});

	}
	
	function getEILTSConvert(xml){
			$(xml).find('question').each(function(){
				var correct = $(this).attr('correct');
				if (null!==sessionStorage.getItem("correctAns")){
					if (sessionStorage.getItem("correctAns")==correct){
						var mark = $(this).attr('lmark');
						var currentdate = new Date(); 
						var datetime =currentdate.getDate() + "/"
						            + (currentdate.getMonth()+1)  + "/" 
						            + currentdate.getFullYear() + "--"  
						            + currentdate.getHours() + "h:"  
						            + currentdate.getMinutes() + "m";

						$(".datetime").html(datetime);
						$(".correct").html(correctAns);
						$(".incorrect").html((totalQues-correctAns));
						$(".totalQ").html(totalQues);
						$(".takentime").html(Math.floor(takentime/60)+"m"+(takentime%60)+"s");
						if (totalQues==40){
							$(".mark").html(mark);
							$(".rating").html(Math.round((correctAns/totalQues*100))+"%");
						}else{
							$(".mark").html("Unknown");
							$(".rating").html(Math.round((correctAns/totalQues*100))+"%");
						}
					}
				}
			});
	}
	function storeScore(correct,total,mark){
		//store testing result - 

	}
//});