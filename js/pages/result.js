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
						var datetime =sessionStorage.getItem("datetime");

						$(".datetime").html(datetime);
						$(".correct").html(correctAns);
						$(".incorrect").html((totalQues-correctAns));
						$(".totalQ").html(totalQues);
						$(".takentime").html(Math.floor(takentime/60)+"m"+(takentime%60)+"s");
						if (totalQues==40){
							$(".mark").html(mark);
							$(".rating").html(Math.round((correctAns/totalQues*100))+"%");
						}else{
							mark=Math.round((correctAns/totalQues*9));
							$(".mark").html(mark);
							
							$(".rating").html(Math.round((correctAns/totalQues*100))+"%");
						}

						storeScore(datetime,mark);
						//sessionStorage.clear();
					}
				}
			});
	}
	function storeScore(time,mark){
		//store testing result -
		var jsonDataRs=localStorage.getItem("result");

		if (jsonDataRs){
			jsonDataRs = JSON.parse(jsonDataRs);
		} else{
			jsonDataRs ={					    
					    "result": []
						};
						var data={"time": time,"point": mark};
			jsonDataRs.result.push(data);
			jsonDataRs=localStorage.setItem("result",JSON.stringify(jsonDataRs));
		}
		
		
		if (jsonDataRs.result[jsonDataRs.result.length-1].time !==time){
			var data={"time": time,"point": mark};
			jsonDataRs.result.push(data);
			jsonDataRs=localStorage.setItem("result",JSON.stringify(jsonDataRs));
		}

	}

//});
