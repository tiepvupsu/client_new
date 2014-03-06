(function(){

	//load audio script
	//Declaration here for global varible :D, not declare them in function () , caus this act will cause them tranlate into local varible- sorry for my bad english if it's not good
	var isModeOnline=false;
	var codeName=localStorage.getItem("current_test");
	var unitUrl="../data/"+codeName+"/"+codeName;
	var audioUrl = unitUrl+".mp3";
	var currentQues = 1;
	var currentQuesRange;
	var currentQuesType=-1;
	var offsetInc=0,offsetDesc=1;
	var urlXML=unitUrl+"ques.xml";
	var urlXMLKey=unitUrl+"key.xml";
	var urlImg=unitUrl+"_lis_img/";
	var isPraceticeMode=true;//set mode pratice or test
	var lastAns=-1;
	var ansQues=[];//store answer
	var totalQues;
	var correctAns=0;
	var audio = $("#audioPlayer");
	var audioDuration=audio.get(0).duration;
	var countinueCount;
	var testtime=45;//time in second
	//init
	
	console.log(codeName);
	counter();
	if(localStorage.getItem('isOnline')==='yes'){
		isModeOnline=true;
	}
	if(isModeOnline){
		urlXML=sessionStorage.getItem('current_xml_url');
		urlXMLKey=urlXML;
		audioUrl=sessionStorage.getItem('current_audio_url');

		if(sessionStorage.getItem('back_to_page')){
			btp=sessionStorage.getItem('back_to_page');
			//console.log(btp);
			$("#btnQuit").attr('href',btp);
		}
		
	}
	//countQuestion(urlXML);//to set value to totalQues
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
		console.log(urlXML);
		console.log(urlXMLKey);
		
		$("#btnBack").click(function(event) {
			/* Act on the event */
			countinueCount=false;
			sessionStorage.clear();
		});

		//start the test
		$("#btnPlayTest").click(function(){
			$("audio").get(0).play();
			if (isTestMode) {
				$(this).addClass('ui-state-disabled');
				//console.log("test");

			}
		});
		//next question
		$("#btnNextQues").click(function() {
			//window.console.clear();
			//storing user answer before change question , using sessionStorage :D, maximum 5MB :(o)
			//saveSingleAnswer(currentQues,lastAns);
			//$( "input[type=text].quesfil" ).addClass('aaaaaaaa');
			clearLastAnswer();
			
			
			//change question id
			currentQues+=offsetInc;
			if (currentQues>totalQues){
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
			console.log(currentQues+"type" +currentQuesType);
		});
		//previous 
		$("#btnPrevQues").click(function() {
			//window.console.clear();
			//storing user answer before change question , using localStorage :D, maximum 5MB :(o)
			//saveSingleAnswer(currentQues,lastAns);
			clearLastAnswer();

			currentQues-=offsetDesc;
			if (currentQues<1){
				currentQues=totalQues-offsetDesc+1;	
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
			console.log(currentQues+"type" +currentQuesType);
		});
		//
		$("#btnCheckAns").click(function(event){
			/* Act on the event */
			//console.log(currentQuesRange+"ques");
			if(currentQuesType===0)
			{
				if (currentQuesRange>1)
				{
					var total=currentQues+currentQuesRange;
				}
				
			
				for (var i=currentQues;i<total;++i)
				{
					var container=$("#"+codeName+i);
					
					if(getSavedAnswer(i)!==null)
					if(getSavedAnswer(i)==='')
					{
						container.removeClass('wrongans trueans');
						//console.log(i+" is null");
					}
					else
						{
							if (ansQues[i]===getSavedAnswer(i).trim())
							{
								//console.log(i+" is correct");
								container.removeClass('wrongans');
								container.addClass('trueans');
							}
							else
							{
								//console.log(i+" is incorrect");
								container.removeClass('trueans');
								container.addClass('wrongans');
							}
						}
				}
			}
			else if(currentQuesType===1)
			{
				var container=$("#"+codeName+i);
				if(getSavedAnswer(currentQues)!==null)
				{	var cA =getSavedAnswer(currentQues).toUpperCase();
					if (ansQues[currentQues].toUpperCase()===cA)
					{
						//console.log(currentQues+" is correct");
						
						$('span.alertmess').remove();
						$("#lbChoice"+cA).append('<span class="alertmess correct"> Correct </span>');
					}
					else
					{
						//console.log(currentQues+" is incorrect");
						$('span.alertmess').remove();
						$("#lbChoice"+cA).append('<span class="alertmess incorrect"> Incorrect </span>');
					}
				}		
			}
				
		});
		
		$("#btnShowAnswer").click(function(event) {
			/* Act on the event */
			alert("Not working");
		});
		
		$("#btnFinish").click(function(event) {
			/* Act on the event */
			countinueCount=false;
			getAnswerKey();
			/*
			$.ajax({
				type: "GET",
				url: urlXMLKey,
				dataType: "xml",
				success: getAnswerKey
			});
			*/
		});

		$("#btnQuit").click(function(event) {
			/* Act on the event */
			countinueCount=false;
			sessionStorage.clear();
			$("input[type='text']").val("");
			stopAudio(audio);

			/*
			$.ajax({
				type: "GET",
				url: urlXMLKey,
				dataType: "xml",
				success: getAnswerKey
			});
			*/
		});
		
		$.ajax({
				type: "GET",
				url: urlXMLKey,
				dataType: "xml",
				success: storeAnswerKey2Arr
			});

	/* 
		*********************
		*function area here *
		*********************
	*/

		function __init(){
			countinueCount=true;
			if (isTestMode()){
				$(".practice_mode").hide();
				$(".test_mode").show();
			}else{
				$(".practice_mode").show();
				$(".test_mode").hide();
			}

			//sessionStorage.clear();
			$("div.result").hide();
			updateAudioUrl(audioUrl);
			//parse xml script, to load data
					$.ajax({
							type: "GET",
							url: urlXML,
							dataType: "xml",
							success: parseXml
						});
				console.log("currentQues type" +currentQuesType);
				console.log("current "+currentQues);
			
		}
		function handle_user_multichoices(){
				$("input[name=radio-choice]").click(function(){
					/* Act on the event */
		    		console.log(currentQues+"->"+$(this).attr('value'));
		    		lastAns=$(this).attr('value');
		    		saveSingleAnswer(currentQues,lastAns);
				});

				$("input[type=checkbox]").click(function(event) {
					/* Act on the event */
					var notCache=$(this).attr('data-cacheval');
					console.log(notCache);
				
				  	//console.log("checkbox selected "+$(this).val());
				  
					//var currans+=$(this).val();
					//saveMultiAnswer(currentQues,$(this).val())
				});
				$("input[type='checkbox']").bind( "change", function(event, ui) {

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
			
			$(audio).bind('timeupdate durationchange updateMediaState', function(event) {
				/* Act on the event */
				var duration = $.prop(this,'duration');
				var valuenow =$.prop(this,'currentTime');

	            if (!duration) {
	                return;
	            }
	            $('#sliderTime').prop({
	                'max': duration,
	                disabled: false
	            });

	            $( "#sliderTime" ).bind( 'slidestop', function( event ) { 
		        	valuenow=$(this).prop("value");
		    		console.log(valuenow);
		    		
		    	});
		        //$('#sliderTime').prop('value',valuenow).slider('refresh');
		        

		        /* 
		        try {
		            
		            $( "#sliderTime" ).bind( "change", function(event, ui) {
					  valuenow=$(this).prop("value");
					});
		        } catch (er) {}
		        */
	         
			});
			/*
			$(audio).bind('timeupdate durationchange updateMediaState', function(event) {
				
				var updateSeek=audio.currentTime*(100/audio.duration);
				console.log(updateSeek);
				$("#seekBar").val(updateSeek).slider("refresh");
				
				//var second=Math.round(audio.currentTime);
				//var minute=(second / 60);
				//$(".counter").html(minute+" mm :"+second+" ss");
			});*/
		}
		function stopAudio(audioSelector){
			var audio=$(audioSelector).get(0);
			audio.currentTime = 0;
			audio.pause();
			
		}
		
		function updateAudioUrl(url){
			$("#audioSrc").attr('src', url);
			console.log($("#audioSrc"));
		}
		function countQuestion(url){
			$.ajax({
					type: "GET",
					url: urlXML,
					dataType: "xml",
					success:function(xml){
						totalQues= parseInt($(xml).find('listening amount').attr("value"));
						console.log(totalQues);
						sessionStorage.setItem("totalQues_currenttest",totalQues);
					}
			});
		}
		function parseXml(xml){
			var multiNumber; 
			var qty;
			var description ="";
			var direction,dir;
			//get total question in test
			totalQues= parseInt($(xml).find('listening amount').attr("value"));
			console.log(totalQues);
			sessionStorage.setItem("totalQues_currenttest",totalQues);

			$(xml).find('listening question').each(function(){
				var id = parseInt($(this).attr('id'));
				
				//find the current question and act :D
				if(id === currentQues){
					multiNumber = parseInt($(this).attr('multiple'));
					qty=parseInt($(this).attr('qty'));
					currentQuesType=multiNumber;
					currentQuesRange=qty;
					dir=$(this).attr('dir');
					direction=$(xml).find('listening directions '+'direction'+dir).text();
					console.log("direction"+direction);

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
								//$(container).addClass('ui-field-contain');
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
							var choiceD = $(this).find('d').text();
							$("#lbChoiceA").html("(A) " + choiceA);
							$("#lbChoiceB").html("(B) " + choiceB);
							$("#lbChoiceC").html("(C) " + choiceC);
							if (choiceD.length>1){

								$("#lbChoiceD").html("(D) " + choiceD);
							}
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

					$("#quesTitle").append("<br />"+direction);
					console.log("___________________________________________");

					
				}
			});
			
		}
		function getQuestTypeFromXml(xml){
			$(xml).find('listening question').each(function(){
				var id = parseInt($(this).attr('id'));

				//find the current question and act :D
				if(id === currentQues){
					currentQuesType=(parseInt($(this).attr('multiple')));
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
		function saveMultiAnswer(ques,arr){
			if (-1==ans){
				return;
			}
			sessionStorage.setItem(codeName+ques, arr);
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
		function storeAnswerKey2Arr(xml){
			$(xml).find('key').each(function(){
				var id = $(this).attr('id');
				var key = $(this).attr('answer');
				console.log(id+" "+key);
				ansQues[id]=key;
			});
			console.log(ansQues);
		}
		function getAnswerKey(){
			for (var i=1;i<=totalQues;i++){
				key=ansQues[i];
				ans=getSavedAnswer(i);
				if (null!==ans){
					if(key==ans){
						++correctAns;
					}
				}
			}
			sessionStorage.setItem("correctAns",correctAns);
			/*
			$(xml).find('key').each(function(){
				var id = $(this).attr('id');
				var key = $(this).attr('answer');
				console.log(id+" "+key);
				
				if (null!==getSavedAnswer(id)){
					if (getSavedAnswer(id)==key){
						++correctAns;
						sessionStorage.setItem("correctAns",correctAns);
					}
				}
			}); */
			console.log(correctAns);
		}
		function counter(){
			var startTime = new Date();

			
			setInterval(function () {
				if (countinueCount==true){
			    var time= (new Date() - startTime);
			    
			    var second=((Math.round(time/1000) ) % 60);
			    var minute=Math.floor(time/1000/60);
			    if(isTestMode){
			    	var timeremain=(testtime-minute*60-second);
			  		var s = Math.round(time/1000);		    

				   	$("#timeline").attr("max", testtime);
				   	$("#timeline").val(s);
				   	$("#timeline").slider( "refresh" );
			    }


			   $("span.countS").html(second);
			   $("span.countM").html(minute);

			   sessionStorage.setItem("takentime",(minute*60+second));
			   if (isTestMode()){
				   	if ( (testtime) <=second ){
					   		countinueCount=false;
					   		getAnswerKey();
					   		/*
					   		$.ajax({
								type: "GET",
								url: urlXMLKey,
								dataType: "xml",
								success: getAnswerKey
							});
							*/
							$.mobile.changePage("page_result.html",'slideup');
							minute=0;second=0;
							return;
						}
			   		}
			   	}
			   
			
			}, 1000);
			
			
		}
		
		/* function area end here */

})();//end here