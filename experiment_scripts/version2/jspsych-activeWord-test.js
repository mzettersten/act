/**
 * jspsych-activeWord-test
 * plugin for memory trials in whack-a-mole style serial reaction time game with prediction violation feature
 * Martin Zettersten
 */

jsPsych.plugins['activeWord-test'] = (function() {

  var plugin = {};
  
  var context = new AudioContext();
  
  jsPsych.pluginAPI.registerPreload('activeWord-test', 'stimuli', 'image');
  jsPsych.pluginAPI.registerPreload('activeWord-test', 'audio', 'audio');
  jsPsych.pluginAPI.registerPreload('activeWord-test', 'audioPrompt', 'audio');
  //jsPsych.pluginAPI.registerPreload('memory', 'audioFeedback', 'audio');
  

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,700];
      trial.image_size = trial.image_size || [150, 150];
	  trial.targetLocation = trial.targetLocation || "left";
	  trial.foilLocation = trial.foilLocation || "right";
	  trial.targetIm = trial.targetIm || "stims/penguin.png";
	  trial.foilIm = trial.foilIm || "stims/penguin.png";
	  trial.standardIm = trial.standardIm || "stims/Bear_Smile.png";
	  trial.standardImTalk = trial.standardImTalk || "stims/Bear_Talk.png";
	  trial.audio = trial.audio || "stims/bleep.wav";
	  trial.audioPrompt = trial.audioPrompt;
	  trial.audioDur = trial.audioDur || 1500;
	  trial.endTrialDur = trial.endTrialDur || 1000;
	  trial.input = trial.input || "click";
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 500 : trial.timing_post_trial;
	  
	  
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
	  display_element.append($("<svg id='jspsych-activeWord-test-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var paper = Snap("#jspsych-activeWord-test-canvas");
	  
	  var leftCircle = paper.circle(150, 350, 105);
	  leftCircle.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  var rightCircle = paper.circle(650, 350, 105);
	  rightCircle.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });

	  
	  var imageLocations = {
		  left: [75, 275],
		  right: [575, 275]
	  };
	  
	  var standard = paper.image(trial.standardIm,311,221,179,258);
	  var targetImage = paper.image(trial.targetIm, imageLocations[trial.targetLocation][0], imageLocations[trial.targetLocation][1], 0,0);
	  var foilImage = paper.image(trial.foilIm, imageLocations[trial.foilLocation][0], imageLocations[trial.foilLocation][1], 0,0);
	  
	 targetImage.attr({
		  opacity: "1"
	  });
	  foilImage.attr({
		  opacity: "1"
	  });
	  targetImage.animate({
		  opacity: "1",
		  width: trial.image_size[0],
		  height: trial.image_size[1]
	  }, 300,mina.linear);
	  
	  foilImage.animate({
		  opacity: "1",
		  width: trial.image_size[0],
		  height: trial.image_size[1]
	  }, 300,mina.linear);
	  
	//function to play audio
	  function playSound(buffer) {
	    var source = context.createBufferSource(); // creates a sound source
	    source.buffer = jsPsych.pluginAPI.getAudioBuffer(buffer);                    // tell the source which sound to play
	    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	    source.start(0);                           // play the source now
	  }

	  // var audioPrompt = new Audio(trial.audioPrompt);
	  // var audio = new Audio(trial.audio);
	  
	  var isRight = "NA";
	  var choice = "NA";
	  var choiceIm = "NA";
	  var choiceType = "NA";
	  var rt = "NA";
	  var trial_time = (new Date()).getTime();
	  var start_time = 0
	  if (trial.input == "touch") {
	    standard.touchstart(function() {
			standard.untouchstart();
			start_time = (new Date()).getTime();
			standard.attr({
				href: trial.standardImTalk
			});
			playSound(trial.audioPrompt);
		//audioPrompt.play();
	    targetImage.touchstart(function() {
          var end_time = (new Date()).getTime();
          rt = end_time - start_time;
		  targetImage.untouchstart();
		  foilImage.untouchstart();
		  choice = trial.targetLocation;
		  //audio.play();
		  playSound(trial.audio);
		  save_response(choice,rt);
	  });
	  
	  foilImage.touchstart(function() {
          var end_time = (new Date()).getTime();
          rt = end_time - start_time;
		  targetImage.untouchstart();
		  foilImage.untouchstart();
		  choice = trial.foilLocation;

		  //audio.play();
		  playSound(trial.audio);
		  save_response(choice,rt);
	  });
	  });
	  } else {
  	    standard.click(function() {
  			standard.unclick();
  			start_time = (new Date()).getTime();
  			standard.attr({
  				href: trial.standardImTalk
  			});
  	  	//audioPrompt.play();
		playSound(trial.audioPrompt);
	    targetImage.click(function() {
          var end_time = (new Date()).getTime();
          rt = end_time - start_time;
		  targetImage.unclick();
		  foilImage.unclick();
		  choice = trial.targetLocation;
		  playSound(trial.audio);
		  //audio.play();
		  save_response(choice,rt);
	  });
	  
	  foilImage.click(function() {
		  var end_time = (new Date()).getTime();
		  rt = end_time - start_time;
		  targetImage.unclick();
		  foilImage.unclick();
		  choice = trial.foilLocation;
		  //audio.play();
		  playSound(trial.audio);
		  save_response(choice,rt);
	  });
		
	  });
	  };
	  
	  
	  var trial_data={};
	  
	  //audioPrompt.onended=function(){
	  
	  // if (trial.input == "touch") {
	  //   targetImage.touchstart(function() {
	  //           var end_time = (new Date()).getTime();
	  //           rt = end_time - start_time;
	  // 		  targetImage.untouchstart();
	  // 		  foilImage.untouchstart();
	  // 		  choice = trial.targetLocation;
	  // 		  audio.play();
	  // 		  save_response(choice,rt);
	  // });
	  //
	  // foilImage.touchstart(function() {
	  //           var end_time = (new Date()).getTime();
	  //           rt = end_time - start_time;
	  // 		  targetImage.untouchstart();
	  // 		  foilImage.untouchstart();
	  // 		  choice = trial.foilLocation;
	  //
	  // 		  audio.play();
	  // 		  save_response(choice,rt);
	  // });
	  //
	  //
	  //
	  // } else {
	  //   targetImage.click(function() {
	  //           var end_time = (new Date()).getTime();
	  //           rt = end_time - start_time;
	  // 		  targetImage.unclick();
	  // 		  foilImage.unclick();
	  // 		  choice = trial.targetLocation;
	  // 		  audio.play();
	  // 		  save_response(choice,rt);
	  // });
	  //
	  // foilImage.click(function() {
	  // 		  var end_time = (new Date()).getTime();
	  // 		  rt = end_time - start_time;
	  // 		  targetImage.unclick();
	  // 		  foilImage.unclick();
	  // 		  choice = trial.foilLocation;
	  // 		  audio.play();
	  // 		  save_response(choice,rt);
	  // });
	  //
	  // };
	  //};
	  
	  function save_response(choice,rt) {
		  // if (choice=="left") {
		  //     leftCircle.attr({
		  //       fill: "#009933"
		  //     });
		  // } else {
		  //     rightCircle.attr({
		  //       fill: "#009933"
		  //     });
		  // };
		  if (trial.targetLocation==choice) {
			  choiceType="target";
			  choiceIm=trial.targetIm;
			  isRight=1
		  } else {
			  choiceType="foil";
			  choiceIm=trial.foilIm;
			  isRight=0;
		  };
  	  	  setTimeout(function(){
  	  		  endTrial();
	      
  	  	  },trial.endTrialDur);
		  
	  };

	  
      function endTrial() {
		//var audioFeedback = new Audio(trial.audioFeedback);
		//audioFeedback.play();
        var trial_data = {
			"targetLocation": trial.targetLocation,
			"foilLocation": trial.foilLocation,
			"targetImage": trial.targetIm,
			"foilImage": trial.foilIm,
			"testAudio": trial.audioPrompt,
			"choiceLocation": choice,
			"choiceType": choiceType,
			"choiceImage": choiceIm,
			"isRight": isRight,
			"rt": rt
			
		};
		
			display_element.html('');
			jsPsych.finishTrial(trial_data);
		

        //jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);
		
      };
	  
	  
	    };	  
		
		return plugin;
})();