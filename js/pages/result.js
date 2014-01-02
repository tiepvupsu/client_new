(function(){

	var urlXML="../data/ielts_convert.xml";
	$.ajax({
				type: "GET",
				url: urlXML,
				dataType: "xml",
				success: getEILTSConvert,
			});
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
});