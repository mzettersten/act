/**
 * jspsych-activeWord-showImage
 * Martin Zettersten
 */

jsPsych.plugins['activeWord-showImage'] = (function() {

  var plugin = {};
  
  var context = new AudioContext();
  
  jsPsych.pluginAPI.registerPreload('activeWord-showImage', 'images', 'image');
  jsPsych.pluginAPI.registerPreload('activeWord-showImage', 'audio', 'audio');
  

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,650];
      trial.image_size = trial.image_size || [150,150];
	  trial.location = trial.location || 0;
	  trial.imageOrder = trial.imageOrder || [0,1,2,3];
	  trial.images = trial.images || ["stims/penguin.png","stims/chicken.png","stims/monkey.png","stims/dog.png"];
	  trial.standardIm = trial.standardIm || ["stims/Bear_Smile.png"];
	  trial.audio = trial.audio || "stims/bleep.wav";
	  trial.input = trial.input || "click";
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial;
	  
	  
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
      display_element.append($("<svg id='jspsych-activeWord-showImage-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var s = Snap("#jspsych-activeWord-showImage-canvas");

				  

	  var rect = s.rect(300,325, 200, 200,10,10);
	  rect.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
		  
	var circleLocations = [
		[150, 305],
		[650, 305],
		[650, 545],
		[150, 545]
	];
				  
	  var bigCircle1 = s.circle(circleLocations[trial.imageOrder[0]][0],circleLocations[trial.imageOrder[0]][1], 105);
	  bigCircle1.attr({
		  fill: "#FF3333",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var bigCircle2 = s.circle(circleLocations[trial.imageOrder[1]][0],circleLocations[trial.imageOrder[1]][1], 105);
	  bigCircle2.attr({
		  fill: "lightblue",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var bigCircle3 = s.circle(circleLocations[trial.imageOrder[2]][0],circleLocations[trial.imageOrder[2]][1], 105);
	  bigCircle3.attr({
		  fill: "lightblue",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var bigCircle4 = s.circle(circleLocations[trial.imageOrder[3]][0],circleLocations[trial.imageOrder[3]][1], 105);
	  bigCircle4.attr({
		  fill: "lightblue",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var imageLocations = [
		  [75, 230],
		  [575, 230],
		  [575, 470],
		  [75, 470]
	  ];
	  
	  //var centerLocation=[340,365];
	  
	  var start_time = (new Date()).getTime();
	  
	//function to play audio
	  function playSound(buffer) {
	    var source = context.createBufferSource(); // creates a sound source
	    source.buffer = jsPsych.pluginAPI.getAudioBuffer(buffer);                    // tell the source which sound to play
	    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	    source.start(0);                           // play the source now
	  }
	  // var audio = new Audio(trial.audio);
	  
	  var standard = s.image(trial.standardIm,311,55,179,258);
	  
	  var image1 = s.image(trial.images[trial.imageOrder[0]], imageLocations[trial.imageOrder[0]][0], imageLocations[trial.imageOrder[0]][1], 0,0);
	  var image2 = s.image(trial.images[trial.imageOrder[1]], imageLocations[trial.imageOrder[1]][0], imageLocations[trial.imageOrder[1]][1], 0,0);
	  var image3 = s.image(trial.images[trial.imageOrder[2]], imageLocations[trial.imageOrder[2]][0], imageLocations[trial.imageOrder[2]][1], 0,0);
	  var image4 = s.image(trial.images[trial.imageOrder[3]], imageLocations[trial.imageOrder[3]][0], imageLocations[trial.imageOrder[3]][1], 0,0);
	  
	  image1.attr({
		  opacity: "0"
	  });
	  image2.attr({
		  opacity: "0"
	  });
	  image3.attr({
		  opacity: "0"
	  });
	  image4.attr({
		  opacity: "0"
	  });
	  
	  var rt = [];
	  
	  if (trial.input == "touch") {
    	    bigCircle1.touchstart(function() {
				playSound(trial.audio);
    			inputEvent(image1,bigCircle1,bigCircle2,false);
    			bigCircle2.touchstart(function() {
					playSound(trial.audio);
    				inputEvent(image2,bigCircle2,bigCircle3,false);
    				bigCircle3.touchstart(function() {
						playSound(trial.audio);
    					inputEvent(image3,bigCircle3,bigCircle4,false);
    					bigCircle4.touchstart(function() {
							playSound(trial.audio);
    						inputEvent(image4,bigCircle4,rect,true);
							//rect.touchstart(function() {
							//	rect.untouchstart();
							//	circle.animate({
							//		fill: "#FFFFFF"
							//	}, 300,mina.linear, function() {
							//		endTrial();
							//	});
							//});
    					});	
    				});
    			});
    		});
	  } else {
  	    bigCircle1.click(function() {
			playSound(trial.audio);
  			inputEvent(image1,bigCircle1,bigCircle2,false);
  			bigCircle2.click(function() {
				playSound(trial.audio);
  				inputEvent(image2,bigCircle2,bigCircle3,false);
  				bigCircle3.click(function() {
					playSound(trial.audio);
  					inputEvent(image3,bigCircle3,bigCircle4,false);
  					bigCircle4.click(function() {
						playSound(trial.audio);
  						inputEvent(image4,bigCircle4,rect,true);
						//rect.click(function() {
						//	rect.unclick();
						//	rect.animate({
						//		fill: "#FFFFFF"
						//	}, 300,mina.linear, function() {
						//		endTrial();
						//	});
							
						//});
  					});	
  				});
  			});
  		});
	  };
	  
	  function inputEvent(im,circle,nextCircle,end) {
		if (trial.input=="click") {
			circle.unclick();
		} else {
			circle.untouchstart();
		};
		var end_time = (new Date()).getTime();
		rt.push(end_time - start_time);
  	  	im.animate({
			opacity: "1",
			width: trial.image_size[0],
			height: trial.image_size[1]
		}, 300,mina.linear,function(){
  			nextCircle.attr({
  				fill: "#FF3333",
  			});
		});
		
		//playSound(trial.audio);
	  	//audio.play();
		circle.animate({
			fill: "#FFFFFF"
		}, 300, function(){
			if (end==true) {
				endTrial();
			}
		});
	};
	  
      function endTrial() {
		  var trial_data = {
			  "image1": trial.images[0],
			  "image2": trial.images[1],
			  "image3": trial.images[2],
			  "image4": trial.images[3],
			  "pushImage1": trial.images[trial.imageOrder[0]],
			  "pushImage2": trial.images[trial.imageOrder[1]],
			  "pushImage3": trial.images[trial.imageOrder[2]],
			  "pushImage4": trial.images[trial.imageOrder[3]],
			  "locationIndex1": trial.imageOrder[0],
			  "locationIndex2": trial.imageOrder[1],
			  "locationIndex3": trial.imageOrder[2],
			  "locationIndex4": trial.imageOrder[3],
			  "rtPush1": rt[0],
			  "rtPush2": rt[1],
			  "rtPush3": rt[2],
			  "rtPush4": rt[3],
		  }; 
	      // clear the display
	      display_element.html('');
		  
		  jsPsych.finishTrial(trial_data);
	  };
  };	  
		
		return plugin;
})();