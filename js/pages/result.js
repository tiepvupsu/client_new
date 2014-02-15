(function(){

	var codeName=localStorage.getItem("current_test");
	var correct=sessionStorage.getItem("correctAns");
	var urlXML="../data/ielts_convert.xml";
	var urlXMLKey="../data/"+codeName+"/"+codeName+"ques.xml";

	console.log(urlXMLKey);
	console.log(urlXML);

	alert(correct);
	$("p.correct").html("You got "+correct +" answers");
	
	/*
	$.ajax({
				type: "GET",
				url: urlXML,
				dataType: "xml",
				success: getEILTSConvert,
			});
	
	$.ajax({
				type: "GET",
				url: urlXMLKey,
				dataType: "xml",
				success: getAnswerKey
			});
	*/
	function getEILTSConvert(xml){
			$(xml).find('question').each(function(){
				var correct = $(this).attr('correct');
				if (null!==sessionStorage.getItem("correctAns")){
					if (sessionStorage.getItem("correctAns")==correct){
						var mark = $(this).attr('lmark');

						$(".correct").html("You got "+correct +" answers");
						$(".mark").html("You got "+mark +" marks");

					}
				}
			});
	}
	function getAnswerKey(xml){
			$(xml).find('question').each(function(){
				var id = $(this).attr('id');
				var key = $(this).attr('answer');
				console.log(id+" "+key);
				
				if (null!==getSavedAnswer(id)){
					if (getSavedAnswer(id)==key){
						++correctAns;
						sessionStorage.setItem("correctAns",correctAns);
					}
				}
			});
			
			console.log(correctAns);

	}
});