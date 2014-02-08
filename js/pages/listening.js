(function(){

	//load audio script
	//Declaration here for global varible :D, not declare them in function () , caus this act will cause them tranlate into local varible- sorry for my bad english if it's not good
	var codeName="ielts01";
	var unitUrl="../data/"+codeName+"/"+codeName;
	var audioUrl = unitUrl+".mp3";
	var currentQues = 1;
	var typeQues=-1;
	var offsetInc=0,offsetDesc=1;
	var urlXML=unitUrl+"ques.xml";
	var urlXMLKey=unitUrl+"key.xml";
	var urlImg=unitUrl+"_lis_img/";
	var isPraceticeMode=true;//set mode pratice or test
	var lastAns=-1;
	var ansQues=[];
	var maxQues=40;
	var correctAns=0;
	var mark=0;
	var audio = $("#audioPlayer");

	//init
	__init();
	handle_user_multichoices();
	handle_audio_control(audio);
	
	
	/*
			$$$$$$$$$$$$$$$$$$$$$$$$$$$
			$ event handler area here $
			$$$$$$$$$$$$$$$$$$$$$$$$$$$
	*/
		/*
			catch input...
		*/
		//save the last answer of current question ,may be use sessionStorage for saving???
		console.log(urlXMLKey);
		function handle_user_multichoices(){
				$("input[name=radio-choice]").click(function(){
					/* Act on the event */
		    		console.log(currentQues+$(this).attr('value'));
		    		lastAns=$(this).attr('value');
				});

				$("input[type=checkbox]").click(function(event) {
					/* Act on the event */
					console.log("checkbox selected "+$(this).val());
				});
		}
		function handle_user_type(cQues,qty){
			$( "input[type=text].quesfil" ).keyup(function() {
				var value = $( this ).val();
				var key=$(this).attr("id");
				
				sessionStorage.setItem(key, value);
			});
			//get answer if have
			for (i=0;i<qty;i++){
				var container="#"+codeName+(cQues+i);
				var key=codeName+(cQues+i);
				if(sessionStorage.getItem(key)){
					$(container).val(sessionStorage.getItem(key));
				}
				console.log($(container).attr("id"));
			}
			if ($( "input[type=text].quesfil" ).val()!=''){
				$(this).addClass('.active');
			}
		}	
		function handle_audio_control(audioSelector){
			var audio=$(audioSelector).get(0);
			var offsecTime=5;

			$("#btnPlay").click(function(event) {
				/* Act on the event */
				if (audio.paused){
					$(this).html('Pause');
					audio.play();
					
				}else{
					$(this).html('Play');
					audio.pause();
				}	
			});
			$("#btnSkipBack").click(function(event) {
				/* Act on the event */
				audio.currentTime-=offsecTime;
			});
			$("#btnSkipForward").click(function(event) {
				/* Act on the event */
				audio.currentTime+=offsecTime;
			});

			$(".seekBar a").bind('change', function(event){
				/* Act on the event */
				var updateTime=$(this).attr("valuenow")*(audio.duration/100);
				console.log(updateTime);
				audio.currentTime=updateTime;
			});
	
			$("#seekBar").bind('change', function(event) {
				/* Act on the event */
				var updateTime=$(this).attr("valuenow")*(audio.duration/100);
				console.log(updateTime);
				audio.currentTime=updateTime;

			});
			/*
			$(audio).bind('timeupdate', function(event) {
				
				var updateSeek=audio.currentTime*(100/audio.duration);
				console.log(updateSeek);
				$("#seekBar").val(updateSeek).slider("refresh");
				
				//var second=Math.round(audio.currentTime);
				//var minute=(second / 60);
				//$(".counter").html(minute+" mm :"+second+" ss");
			});*/
		}

		//start the test
		$("#btnPlayTest").click(function(){
			$("audio").get(0).play();
			if (isTestMode) {
				$(this).addClass('ui-state-disabled');
				console.log("test");

			}
			//timeout_trigger();

			//start timer countdown
			/*<script> 
					var myCountdown2 = new Countdown({
										time: 40*60, 
										width:200, 
										height:80, 
										rangeHi:"minute"	// <- no comma on last item!
										});
				</script>*/
		});
		//next question
		$("#btnNextQues").click(function() {
			console.clear();
			//storing user answer before change question , using sessionStorage :D, maximum 5MB :(o)
			saveSingleAnswer(currentQues,lastAns);
			$( "input[type=text].quesfil" ).addClass('aaaaaaaa');
			clearLastAnswer();
			
			
			//change question id
			currentQues+=offsetInc;
			if (currentQues>maxQues){
				currentQues=1;
			}
			//clear checkbox or radio
			$("input[type='radio'].radio-ans").prop("checked",false).checkboxradio("refresh");
			$("input[type='checkbox'].checkbox-ans").attr("checked",false).checkboxradio("refresh");
			
			//check if question has been already ans
			if (null!==getSavedAnswer(currentQues))
			{
				showSavedMultiChoiceAnswer(getSavedAnswer(currentQues));
			}
				
			//change question content 
			$.ajax({
				type: "GET",
				url: urlXML,
				dataType: "xml",
				success: parseXml,
			});

			console.log("current "+currentQues);
			console.log("currentQues type" +typeQues);
			
		});
		//previous 
		$("#btnPrevQues").click(function() {
			console.clear();
			//storing user answer before change question , using localStorage :D, maximum 5MB :(o)
			saveSingleAnswer(currentQues,lastAns);
			clearLastAnswer();

			currentQues-=offsetDesc;
			if (currentQues<1){
				currentQues=maxQues-offsetDesc+1;	
			}
			//$("input[name=radio-choice]").attr('checked', false).checkboxradio('refresh',true);
			$("input[type='radio'].radio-ans").prop("checked",false).checkboxradio("refresh");
			$("input[type='checkbox'].checkbox-ans").attr("checked",false).checkboxradio("refresh");

			//check if question has been already ans
			if (null!==getSavedAnswer(currentQues))
			{
				showSavedMultiChoiceAnswer(getSavedAnswer(currentQues));
			}

			//change question content 
			$.ajax({
				type: "GET",
				url: urlXML,
				dataType: "xml",
				success: parseXml
			});
			
		});
		
		
		$("#btnSumit").click(function(event) {
			/* Act on the event */
			//event.preventDefault();
			console.log("checking answer...");
			$.ajax({
				type: "GET",
				url: urlXMLKey,
				dataType: "xml",
				success: getAnswerKey
			});
			
		});

	/* 
		*********************
		*function area here *
		*********************
	*/
		function __init(){
			if (isTestMode()){
				$(".practice_mode").hide();
				$(".test_mode").show();
			}else{
				$(".practice_mode").show();
				$(".test_mode").hide();
			}
			sessionStorage.clear();
			$("div.result").hide();
			updateAudioUrl(audioUrl);
			//parse xml script, to load data
					$.ajax({
							type: "GET",
							url: urlXML,
							dataType: "xml",
							success: parseXml
						});
				console.log("currentQues type" +typeQues);
				console.log("current "+currentQues);
			
		}
		
		function updateAudioUrl(url){
			$("#audioSrc").attr('src', url);
			console.log($("#audioSrc"));
		}
		function parseXml(xml){
			var multiNumber; 
			var qty;
			var description ="";
			
			$(xml).find('listening question').each(function(){
				var id = parseInt($(this).attr('id'));
				
				//find the current question and act :D
				if(id === currentQues){
					multiNumber = parseInt($(this).attr('multiple'));
					qty=parseInt($(this).attr('qty'));
					typeQues=multiNumber;
					
					if (currentQues===1){
						preMulti=parseInt($(xml).find('listening question').last().attr('multiple'));
						if (preMulti===0){
							offsetDesc=parseInt($(xml).find('listening question').last().attr('qty'));
						}else{
							offsetDesc=preMulti;
						} 
					}else{			
						preMulti=parseInt($(this).closest("question").prev().attr("multiple"));
						if (preMulti===0){
							offsetDesc=parseInt($(this).closest("question").prev().attr("qty"));
						}else{
							offsetDesc=preMulti;
						}
					}
					
					switch (multiNumber){
						case 0:
							description=$(this).text();
							
							if (!isNaN(qty))	offsetInc=qty;
							$(".choices_single,.choices_multi").hide();
							$("#quesDetail").html(description);
							for (i=0;i<qty;i++){
								var container="#ques"+(id+i);
								$(container).html('<input type="text" name="'+(codeName+(id+i))+'" id="'+(codeName+(id+i))+'" data-mini="true" class="quesfil"/>');
							}
							//<input type="text" name="name" id="basic" data-mini="true" />
							handle_user_type(currentQues,qty);
							break;
						case 1:
							description=$(this).find('description').text();
		
							$("#quesDetail").html(description);
							$(".choices_single").show();
							$(".choices_multi").hide();
							var choiceA = $(this).find('a').text();
							var choiceB = $(this).find('b').text();
							var choiceC = $(this).find('c').text();
							$("#lbChoiceA").html("(A) " + choiceA);
							$("#lbChoiceB").html("(B) " + choiceB);
							$("#lbChoiceC").html("(C) " + choiceC);
							offsetInc=1;
							break;
						case 2:
							description=$(this).find('description').text();
				
							$("#quesDetail").html(description);
							$(".choices_multi").show();
							$(".choices_single").hide();
							var choiceA = $(this).find('a').text();
							var choiceB = $(this).find('b').text();
							var choiceC = $(this).find('c').text();
							var choiceD = $(this).find('d').text();
							var choiceE = $(this).find('e').text();
							$("#lbChoice_multi_A").html("(A) " + choiceA);
							$("#lbChoice_multi_B").html("(B) " + choiceB);
							$("#lbChoice_multi_C").html("(C) " + choiceC);
							$("#lbChoice_multi_D").html("(D) " + choiceD);
							$("#lbChoice_multi_E").html("(E) " + choiceE);
							
							offsetInc=2;
							break;
						default:
							break;
					}

					if (qty > 0){
						$("#quesTitle").html("Question " + currentQues + " to "+(id+qty-1));
						console.log("current ques :" +currentQues +" --> "+(id+qty-1));
					}else if (multiNumber===2){
						$("#quesTitle").html("Question " + currentQues+" to " +(currentQues+1));
						console.log("current ques :" +currentQues +"-->"+(currentQues+1));
					}else{
						$("#quesTitle").html("Question " + currentQues);
						console.log("current ques :" +currentQues);
					}
					console.log("___________________________________________");

					
				}
			});
			
		}
		function getQuestTypeFromXml(xml){
			$(xml).find('listening question').each(function(){
				var id = parseInt($(this).attr('id'));

				//find the current question and act :D
				if(id === currentQues){
					typeQues=(parseInt($(this).attr('multiple')));
				}
			});
		}
		function findTypeOfQuest(ques){
			$.ajax({
				type: "GET",
				url: urlXML,
				dataType: "xml",
				success: getQuestTypeFromXml
			});
		}
		function saveSingleAnswer(ques,ans){
			if (-1==ans){
				return;
			}
			sessionStorage.setItem(codeName+ques, ans);
		}
		function saveMultiAnswer(ques,ans1,ans2){
			if (-1==ans){
				return;
			}

		}
		function getSavedAnswer(ques){
			return sessionStorage.getItem(codeName+ques);
		}
		function clearLastAnswer(){
			lastAns=-1;
		}
		function translateAnswerToNumber(ans){
			if ((ans==='A') || (ans ==='a')){
				return 1;
			}
			if ((ans==='B') || (ans ==='b')){
				return 2;
			}
			if ((ans==='C') || (ans ==='c')){
				return 3;
			}
			if ((ans==='D') || (ans ==='d')){
				return 4;
			}
			if ((ans==='E') || (ans ==='e')){
				return 5;
			}
			return -1;
		}
		function showSavedMultiChoiceAnswer(ans){
			ansNum=translateAnswerToNumber(ans);
			var con_single="input[name=radio-choice]#radio-choice-"+ansNum;

			//$(con_single).attr('checked', true).checkboxradio('refresh',true);
			$(con_single).prop("checked",true).checkboxradio("refresh");
			console.log((con_single));
			console.log("current aswer is "+ans);
		}

		function getAllAnswer(){

		}
		function isTestMode(){
			if (sessionStorage.getItem("mode")==='test'){
				return true;
			}
			return false;
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
		
		/* function area end here */

})();//end here