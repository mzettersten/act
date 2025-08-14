/**
 * jspsych-activeWord-learning
 * Martin Zettersten
 */

jsPsych.plugins['activeWord-learning'] = (function() {

  var plugin = {};
  
  jsPsych.pluginAPI.registerPreload('activeWord-learning', ['images'], 'image');
  jsPsych.pluginAPI.registerPreload('activeWord-learning', 'audio', 'audio');
  jsPsych.pluginAPI.registerPreload('activeWord-learning', 'audioTrill', 'audio');
  

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,650];
      trial.image_size = trial.image_size || [150,150];
	  trial.condition = trial.condition || "active";
	  trial.location = trial.location || 0;
	  trial.images = trial.images || ["stims/bear.png", "stims/cow.png", "stims/penguin.png", "stims/pig.png"];
	  trial.standardIm = trial.standardIm || ["stims/Bear_Smile.png"];
	  trial.standardImTalk = trial.standardImTalk || ["stims/Bear_Talk.png"];
	  trial.audio = trial.audio || ["stims/norm_it_bear.wav","stims/norm_it_cow.wav","stims/norm_that_penguin.wav","stims/norm_that_pig.wav"];
	  trial.audioDur = trial.audioDur || 1300;
	  trial.audioTrill = trial.audioTrill || "stims/trill.wav";
	  trial.onsetWait = trial.onsetWait || 0;
	  trial.targetIndex = trial.targetIndex || 0;
	  trial.endTrialPause = trial.endTrialPause || 500;
	  trial.input = trial.input || "click";
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial;
	  
	  
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
      display_element.append($("<svg id='jspsych-activeWord-learning-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var s = Snap("#jspsych-activeWord-learning-canvas");
	  
	  var rectFill = "#FFFFFF";
	  if (trial.condition=="passive") {
		  rectFill = "#FF3333";
	  };
	  
	  var rect = s.rect(300,325, 200, 200,10,10);
	  rect.attr({
		  fill: rectFill,
		  stroke: "#000",
		  strokeWidth: 5
	  });
				  
	  var bigCircle1 = s.circle(150, 305, 105);
	  bigCircle1.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var bigCircle2 = s.circle(650, 305, 105);
	  bigCircle2.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var bigCircle3 = s.circle(650, 545, 105);
	  bigCircle3.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var bigCircle4 = s.circle(150, 545, 105);
	  bigCircle4.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var imageLocations = [
		  [75, 230],
		  [575, 230],
		  [575, 470],
		  [75, 470]
	  ];
	  
	  var centerLocation=[325,350];

	  var audio1 = new Audio(trial.audio[0]);
	  var audio2 = new Audio(trial.audio[1]);
	  var audio3 = new Audio(trial.audio[2]);
	  var audio4 = new Audio(trial.audio[3]);
	  var audioTrill = new Audio(trial.audioTrill);
	  
	  var start_time = (new Date()).getTime();
	  
	  var standard = s.image(trial.standardIm,311,55,179,258);
	  
	  /*var image1 = s.image(trial.images[0], imageLocations[0][0], imageLocations[0][1], 0,0);
	  var image2 = s.image(trial.images[1], imageLocations[1][0], imageLocations[1][1], 0,0);
	  var image3 = s.image(trial.images[2], imageLocations[2][0], imageLocations[2][1], 0,0);
	  var image4 = s.image(trial.images[3], imageLocations[3][0], imageLocations[3][1], 0,0);*/
	  var image1 = s.image(trial.images[0], imageLocations[0][0], imageLocations[0][1], trial.image_size[0],trial.image_size[1]);
	  var image2 = s.image(trial.images[1], imageLocations[1][0], imageLocations[1][1], trial.image_size[0],trial.image_size[1]);
	  var image3 = s.image(trial.images[2], imageLocations[2][0], imageLocations[2][1],trial.image_size[0],trial.image_size[1]);
	  var image4 = s.image(trial.images[3], imageLocations[3][0], imageLocations[3][1], trial.image_size[0],trial.image_size[1]);
	  
	  image1.attr({
		  opacity: "1"
	  });
	  image2.attr({
		  opacity: "1"
	  });
	  image3.attr({
		  opacity: "1"
	  });
	  image4.attr({
		  opacity: "1"
	  });
	  
	  /*image1.animate({
		  opacity: "1",
		  width: trial.image_size[0],
		  height: trial.image_size[1]
	  }, 300,mina.linear);
	  
	  image2.animate({
		  opacity: "1",
		  width: trial.image_size[0],
		  height: trial.image_size[1]
	  }, 300,mina.linear);
	  
	  image3.animate({
		  opacity: "1",
		  width: trial.image_size[0],
		  height: trial.image_size[1]
	  }, 300,mina.linear);
	  
	  image4.animate({
		  opacity: "1",
		  width: trial.image_size[0],
		  height: trial.image_size[1]
	  }, 300,mina.linear);*/
	  
	  var rt = 0;
	  var choice = 0;
	  
	  if (trial.condition=="active") {
		  if (trial.input == "touch") {
			//rect.touchstart(function() {
			//	rect.untouchstart();
			//	rect.animate({
			//		fill: "#FFFFFF"
			//	}, 300,mina.linear, function() {
	  			  image1.touchstart(function() {
	  				  inputEvent(image1,audio1,image2,image3,image4,0);
	  			  });
	  			  image2.touchstart(function() {
	  				  inputEvent(image2,audio2,image1,image3,image4,1);
	  			  });
	  			  image3.touchstart(function() {
	  				  inputEvent(image3,audio3,image2,image1,image4,2);
	  			  });
	  			  image4.touchstart(function() {
	  				  inputEvent(image4,audio4,image2,image3,image1,3);
	  			  });
			//	});
			//});
		  } else {
  			//rect.click(function() {
  			//	rect.unclick();
  			//	rect.animate({
  			//		fill: "#FFFFFF"
  			//	}, 300,mina.linear, function() {
	  			  image1.click(function() {
	  				  inputEvent(image1,audio1,image2,image3,image4,0);
	  			  });
	  			  image2.click(function() {
	  				  inputEvent(image2,audio2,image1,image3,image4,1);
	  			  });
	  			  image3.click(function() {
	  				  inputEvent(image3,audio3,image2,image1,image4,2);
	  			  });
	  			  image4.click(function() {
	  				  inputEvent(image4,audio4,image2,image3,image1,3);
	  			  });
			//  });
		  //});
	  };
  } else if (trial.condition=="passive") {
		  if (trial.input == "touch") {
			rect.touchstart(function() {
				rect.untouchstart();
				rect.animate({
					fill: "#FFFFFF"
				}, 300,mina.linear, function() {
				  	if (trial.targetIndex==0) {
				  		var imTarget=image1;
				  		var audioTarget=audio1;
				  		var im1=image2;
				  		var im2=image3;
				  		var im3=image4;
				  	}
	
				  	setTimeout(function() {
				  		if (trial.targetIndex==0) {
				  			inputEvent(image1,audio1,image2,image3,image4,trial.targetIndex);
				  		} else if (trial.targetIndex==1) {
				  			inputEvent(image2,audio2,image1,image3,image4,trial.targetIndex);
				  		} else if (trial.targetIndex==2) {
				  			inputEvent(image3,audio3,image1,image2,image4,trial.targetIndex);
				  		} else {
				  			inputEvent(image4,audio4,image1,image2,image3,trial.targetIndex);
				  		};
		
				  	}, trial.onsetWait);
				});
			});
		} else {
  			rect.click(function() {
  				rect.unclick();
  				rect.animate({
  					fill: "#FFFFFF"
  				}, 300,mina.linear, function() {
				  	if (trial.targetIndex==0) {
				  		var imTarget=image1;
				  		var audioTarget=audio1;
				  		var im1=image2;
				  		var im2=image3;
				  		var im3=image4;
				  	}
	
				  	setTimeout(function() {
				  		if (trial.targetIndex==0) {
				  			inputEvent(image1,audio1,image2,image3,image4,trial.targetIndex);
				  		} else if (trial.targetIndex==1) {
				  			inputEvent(image2,audio2,image1,image3,image4,trial.targetIndex);
				  		} else if (trial.targetIndex==2) {
				  			inputEvent(image3,audio3,image1,image2,image4,trial.targetIndex);
				  		} else {
				  			inputEvent(image4,audio4,image1,image2,image3,trial.targetIndex);
				  		};
		
				  	}, trial.onsetWait);
				});
			});
			  
		  };
	  };
	  
	  function inputEvent(im,audio,im1,im2,im3,imChoice) {
		if (trial.input=="click") {
			image1.unclick();
			image2.unclick();
			image3.unclick();
			image4.unclick();
		} else {
			image1.untouchstart();
			image2.untouchstart();
			image3.untouchstart();
			image4.untouchstart();
		};
		var end_time = (new Date()).getTime();
		rt = end_time - start_time;
		choice = imChoice;
		var t = new Snap.Matrix();
		var imCenterX = imageLocations[imChoice][0]+trial.image_size[0]/2;
		var imCenterY = imageLocations[imChoice][1]+trial.image_size[1]/2;
		audioTrill.play();
		t.rotate(10,imCenterX,imCenterY);
		im.animate({transform: im.transform(t)},50,mina.easeinout, function() {
			t.rotate(-20,imCenterX,imCenterY);
			im.animate({transform: im.transform(t)},100,mina.easeinout, function() {
				t.rotate(20,imCenterX,imCenterY);
				im.animate({transform: im.transform(t)},100,mina.easeinout, function() {
					t.rotate(-10,imCenterX,imCenterY);
					im.animate({transform: im.transform(t)},50,mina.easeinout,function() {
				        //im.animate({ transform: "r10," + bbox.cx + ',' + bbox.cy}, 100, mina.easeinout,function() {
						//	im.animate({ transform: "r-20," + bbox.cx + ',' + bbox.cy}, 200,mina.easeinout,function() {
						//		im.animate({ transform: "r10," + bbox.cx + ',' + bbox.cy}, 100,mina.easeinout, function() {
										im.animate({
											x: centerLocation[0],
											y: centerLocation[1]
										},1000,mina.easeinout,function() {
											standard.attr({
												href: trial.standardImTalk
											});
											audio.play();
											setTimeout(function() {
											//	audioTrill.play();
											//	t.rotate(10,centerLocation[0]+trial.image_size[0]/2,centerLocation[1]+trial.image_size[1]/2);
											//	im.animate({transform: im.transform(t)},50,mina.easeinout, function() {
											//		t.rotate(-20,centerLocation[0]+trial.image_size[0]/2,centerLocation[1]+trial.image_size[1]/2);
											//		im.animate({transform: im.transform(t)},100,mina.easeinout, function() {
											//			t.rotate(20,centerLocation[0]+trial.image_size[0]/2,centerLocation[1]+trial.image_size[1]/2);
											//			im.animate({transform: im.transform(t)},100,mina.easeinout, function() {
											//				t.rotate(-10,centerLocation[0]+trial.image_size[0]/2,centerLocation[1]+trial.image_size[1]/2);
											//				im.animate({transform: im.transform(t)},50,mina.easeinout,function() {
																setTimeout(function() {
																	endTrial();
																}, trial.endTrialPause);
											//				});
											//			});
											//		});
											//	});
											      }, trial.audioDur);
										});
						//	});
						//});
						//});
										
		
										bigCircle1.animate({
											fill: "lightblue"
										}, 1000);
										bigCircle2.animate({
											fill: "lightblue"
										}, 1000);
										bigCircle3.animate({
											fill: "lightblue"
										}, 1000);
										bigCircle4.animate({
											fill: "lightblue"
										}, 1000);
		
										im1.animate({
												opacity: "0"
											},300);
			
										im2.animate({
												opacity: "0"
											},300);
			
										im3.animate({
												opacity: "0"
											},300);
					});
				});
			});
		});
	};
	  
      function endTrial() {
		  var trial_data = {
			  "image1": trial.images[0],
			  "image2": trial.images[1],
			  "image3": trial.images[2],
			  "image4": trial.images[3],
			  "audio1": trial.audio[0],
			  "audio2": trial.audio[1],
			  "audio3": trial.audio[2],
			  "audio4": trial.audio[3],
			  "rt": rt,
			  "audio1": trial.audio[0],
			  "audio2": trial.audio[1],
			  "audio3": trial.audio[2],
			  "audio4": trial.audio[3],
			  "choice": choice,
			  "choiceImage": trial.images[choice],
			  "choiceAudio": trial.audio[choice]
		  }; 
	      // clear the display
	      display_element.html('');
		  
		  jsPsych.finishTrial(trial_data);
	  };
  };	  
		
		return plugin;
})();