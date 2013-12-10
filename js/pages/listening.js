(function(){

	//load audio script
	//Declaration here for global varible :D, not declare them in function () , caus this act will cause them tranlate into local varible- sorry for my bad english if it's not good
	var audioUrl = "../toeic01/Toeic01.mp3";
	var currentQues = 1;
	var urlXML="../toeic01/toeic01new.xml";
	var urlXMLKey="../toeic01/toeic01key.xml";
	var urlImg="../toeic01/lis_img/";
	var isPraceticeMode=true;//set mode pratice or test
	var lastAns=-1;
	var ansQues=[];
	var codeName="toeic01";
	var maxQues=45;
	var correctAns=0;
	var mark=10;
	//init
	sessionStorage.clear();
	$("div.result").hide();
	
	function changeAudio(url){
			var audio = $("#audioPlayer");
			$("#audioSrc").attr('src', url);
			audio.seekable=false;
	    	/*audio[0].pause();
		    audio[0].load();
		    audio[0].play();*/
		}
	changeAudio(audioUrl);

	//parse xml script
	$(document).ready(function(){
			$.ajax({
				type: "GET",
				url: urlXML,
				dataType: "xml",
				success: parseXml
		});
	});

	function parseXml(xml){
		$(xml).find('question').each(function(){
				var order = $(this).attr('order');
				var description = $(this).find('description').text();
				var choiceA = $(this).find('a').text();
				var choiceB = $(this).find('b').text();
				var choiceC = $(this).find('c').text();
				var choiceD = $(this).find('d').text();
				var part=0;

				if (11>order){
					part=1;
				}else if (41>order){
					part=2;
				}else if (101>order){
					part=3;
				}
				switch (part){
						case 1:
							description="<image class='imglis' src="+urlImg+$(this).find('description').attr('image')+".jpg />";
							if(0==order){
								$("div.choices").hide();
							}else{
								$("div.choices").show();
							}	

							break;
						case 2:

							break;
						case 3:
							
							break;
						case 4:

							break;
						default:
							break;
					}
				if(order == currentQues){
							$("#quesTitle").html("Question " + order);
							$("#quesDetail").html(description);
							$("#lbChoiceA span.ui-btn-text").html("(A) " + choiceA);
							$("#lbChoiceB span.ui-btn-text").html("(B) " + choiceB);
							$("#lbChoiceC span.ui-btn-text").html("(C) " + choiceC);
							//$("#lbChoiceD span.ui-btn-text").html("(D) " + choiceD);

							console.log(part+ " --" + order +" --"+description);
							// need to hide the D answer, part have just 3 choices.
							if (2==part){
								$("div.ui-radio:last").hide();
							}else{
								$("#lbChoiceD span.ui-btn-text").html("(D) " + choiceD);
								$("div.ui-radio:last").show();
							}

				}
				
				
			});
		}



	//button functions
		function play(action)
				 { 
				   if(action=='play') { 
				      $("#btnMarkQues").val('pause');
				   }
				   else { 
				      $("#btnMarkQues").val('play');
				   }
				}
		$("#btnMarkQues").click(function(){
			val = $(this).val();
			   play(val);
			
			/*if($(this).val() == "Mark"){
				$("#quesTitle").css('background-color', 'yellow');
				$(this).val("Unmark");
				alert($(this).val());
			}
			else{
				$("#quesTitle").css('background-color', 'none');
				$(this).val("Mark");
				alert($(this).val());
			}
			//$("#quesTitle").css('background-color', 'yellow');
			//$("#quesTitle").highlight("Question");
			/*if($("#quesTitle").css('background-color') == 'transparent'){
		    	$("#quesTitle").css('background-color', 'yellow');
		    }
			else{
		    	$("#quesTitle").css('background-color', 'transparent');
			}*/
		});

		//save the last answer of current question ,may be use localStorage for saving???
		$("input[name=radio-choice]").click(function(){
    		console.log(currentQues+$(this).attr('value'));
    		lastAns=$(this).attr('value');
		});
		function saveAnswer(ques,ans){
			if (-1==ans){
				return;
			}
			sessionStorage.setItem(codeName+ques, ans);
		}
		function getSavedAnswer(ques){
			return sessionStorage.getItem(codeName+ques);
		}
		function clearLastAnswer(){
			lastAns=-1;
		}
		function showSavedAnswer(ans){
			var container="input[name=radio-choice]#radio-choice-"+ans;

			//$(container).attr('checked', true).checkboxradio('refresh',true);
			$(container).prop("checked",true).checkboxradio("refresh");
			console.log((container));
			console.log("current aswer is "+ans);
		}
		function getAllAnswer(){

		}
		//next question
		$("#btnNextQues").click(function() {
			console.clear();
			//storing user answer before change question , using localStorage :D, maximum 5MB :(o)
			saveAnswer(currentQues,lastAns);
			clearLastAnswer();

			currentQues++;
			if (currentQues>maxQues){
				currentQues=1;
			}
			$("input[type='radio'].radio-ans").prop("checked",false).checkboxradio("refresh");
			//$("input[name=radio-choice]").attr('checked', false).checkboxradio('refresh',true);
			//check if question has been already ans
			if (null!==getSavedAnswer(currentQues))
			{
				showSavedAnswer(getSavedAnswer(currentQues));
			}
				
			//change question content 
			$.ajax({
				type: "GET",
				url: urlXML,
				dataType: "xml",
				success: parseXml
			});
			
			
			
			
		});
		//previous 
		$("#btnPrevQues").click(function() {
			console.clear();
			//storing user answer before change question , using localStorage :D, maximum 5MB :(o)
			saveAnswer(currentQues,lastAns);
			clearLastAnswer();

			currentQues--;
			if (currentQues<1){
				currentQues=maxQues;	
			}
			//$("input[name=radio-choice]").attr('checked', false).checkboxradio('refresh',true);
			$("input[type='radio'].radio-ans").prop("checked",false).checkboxradio("refresh");
			//check if question has been already ans
			if (null!==getSavedAnswer(currentQues))
			{
				showSavedAnswer(getSavedAnswer(currentQues));
			}

			//change question content 
			$.ajax({
				type: "GET",
				url: urlXML,
				dataType: "xml",
				success: parseXml
			});
			
			
		});
		
		function getAnswerKey(xml){
			$(xml).find('question').each(function(){
				var order = $(this).attr('order');
				var key = $(this).attr('answer');
				console.log(order+" "+key);
				
				if (null!==getSavedAnswer(order)){
					if (getSavedAnswer(order)==key){
						++correctAns;
					}
				}


			});
			console.log("correct answer "+correctAns);
			
			$("div.main").fadeOut('slow/400/fast', function() {
				
			});
			$("div.result").fadeIn('slow/400/fast', function() {
				$(this).find(".correctLis").html(correctAns);
			});

		}
		$("#btnSumit").click(function(event) {
			/* Act on the event */
			//event.preventDefault();
			
			mark=5;
			console.log("checking answer...");
			$.ajax({
				type: "GET",
				url: urlXMLKey,
				dataType: "xml",
				success: getAnswerKey
			});
			
		});


})();//end here