/**
* jspsych-active-prompt
* Martin Zettersten
* custom plugin for active word learning experiment
*
* based on:
 * jspsych-button-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["active-prompt"] = (function() {

  var plugin = {};
  jsPsych.pluginAPI.registerPreload('active-prompt', 'stimuli', 'image');

  plugin.trial = function(display_element, trial) {

    // default trial parameters
	  trial.canvas_size = trial.canvas_size || [1024,700];
	  trial.sequence = trial.sequence || [0,1,2,0,1,2,0,1,2,0,1,2,0,1,2];
	  trial.stimuli = trial.stimuli || ["stims/penguin.png","stims/walrus.png","stims/penguin.png"];
    trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';
    trial.response_ends_trial = (typeof trial.response_ends_trial === 'undefined') ? true : trial.response_ends_trial;
    trial.timing_response = trial.timing_response || -1; // if -1, then wait for response forever
    trial.is_html = (typeof trial.is_html === 'undefined') ? false : trial.is_html;
    trial.prompt = (typeof trial.prompt === 'undefined') ? "" : trial.prompt;
	trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // this array holds handlers from setTimeout calls
    // that need to be cleared if the trial ends early
    var setTimeoutHandlers = [];

    // display stimulus
    display_element.append($("<svg id='jspsych-prediction-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

    var paper = Snap("#jspsych-prediction-canvas");

  var bigCircle1 = paper.circle(125, 452, 120);
  bigCircle1.attr({
	  fill: "#98F5FF",
	  stroke: "#000",
	  strokeWidth: 5
  });
  var bigCircle2 = paper.circle(444, 133, 120);
  bigCircle2.attr({
	  fill: "#98F5FF",
	  stroke: "#000",
	  strokeWidth: 5
  });
  var bigCircle3 = paper.circle(560, 568, 120);
  bigCircle3.attr({
	  fill: "#98F5FF",
	  stroke: "#000",
	  strokeWidth: 5
  });
  var scoreBoxLength = trial.sequence.length * 35+5;
  var scoreBox = paper.rect(900, 50,50,scoreBoxLength);
  scoreBox.attr({
	  fill:'#926239',
	  stroke: "#000",
	  strokeWidth: 5,
  });
  var imageLocations = [
    [50, 377],
    [369, 58],
    [485, 493]
  ];
  
  if (trial.stimuli.length==3) {
  var image1 = paper.image(trial.stimuli[0], imageLocations[0][0], imageLocations[0][1], 150,150);
  var image2 = paper.image(trial.stimuli[1], imageLocations[1][0], imageLocations[1][1], 150,150);
  var image3 = paper.image(trial.stimuli[2], imageLocations[2][0], imageLocations[2][1], 150,150);
};
  


    //display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in button-response plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }
    display_element.append('<div id="jspsych-button-response-btngroup" class="center-content block-center"></div>')
    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      $('#jspsych-button-response-btngroup').append(
        $(str).attr('id', 'jspsych-button-response-button-' + i).data('choice', i).addClass('jspsych-button-response-button').on('click', function(e) {
          var choice = $('#' + this.id).data('choice');
          after_response(choice);
        })
      );
    }

    //show prompt if there is one
    if (trial.prompt !== "") {
      display_element.append(trial.prompt);
    }

    // store response
    var response = {
      rt: -1,
      button: -1
    };

    // start time
    var start_time = 0;

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = Date.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // disable all the buttons after a response
      $('.jspsych-button-response-button').off('click').attr('disabled', 'disabled');

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      for (var i = 0; i < setTimeoutHandlers.length; i++) {
        clearTimeout(setTimeoutHandlers[i]);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button
      };

      // clear the display
      display_element.html('');

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // start timing
    start_time = Date.now();


    // end trial if time limit is set
    if (trial.timing_response > 0) {
      var t2 = setTimeout(function() {
        end_trial();
      }, trial.timing_response);
      setTimeoutHandlers.push(t2);
    }

  };

  return plugin;
})();
