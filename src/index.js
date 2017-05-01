var APP_ID = "";

var animalNames = ["dog", "wolf", "frog" ,"chicken" ,"cat" ,"lion" ,"horse" ,"elephant" ,"rooster" ,"tiger" ,"pig", "sheep", "duck", "monkey", "bear"];
var PAUSE_TAG = "<break time='0.2s'/>";
var S3_URL = "https://s3.amazonaws.com/myanimalsounds/";

var CARD_TITLE = "Zoo"; // Be sure to change this for your skill.
var WELCOME_TEXT  = "Welcome to the zoo, ";
var REPROMPT_TEXT = "You can ask, lion says or dog sounds like";
var GOODBYE_TEXT = "Good bye, See you tomorrow";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var WiseGuySkill = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
WiseGuySkill.prototype = Object.create(AlexaSkill.prototype);
WiseGuySkill.prototype.constructor = WiseGuySkill;

/**
 * Overriden to show that a subclass can override this function to initialize session state.
 */
WiseGuySkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // Any session init logic would go here.
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
WiseGuySkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("WiseGuySkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);

    welcomeMessage(session, response);
};

function welcomeMessage(session, response) {
    var speechText = WELCOME_TEXT + REPROMPT_TEXT;

    //Reprompt speech will be triggered if the user doesn't respond.
    var repromptText = REPROMPT_TEXT;

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, "Zoo", speechText);
}

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
WiseGuySkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    //Any session cleanup logic would go here.
};

WiseGuySkill.prototype.intentHandlers = {
    "AnimalSoundIntent": function (intent, session, response) {
        handleAnimalSoundIntentIntent(intent, session, response);
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = GOODBYE_TEXT;
        response.tell(speechOutput);
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = GOODBYE_TEXT;
        response.tell(speechOutput);
    }
};

function handleAnimalSoundIntentIntent(intent, session, response) {
    var speechText = "";
    var repromptText = REPROMPT_TEXT;
    var animalName = intent.slots.AnimalName.value;

    var speechText;

    if(animalNames.indexOf(animalName) != -1) {
        speechText = '<audio src="' + S3_URL + animalName + '.mp3"/>';
        speechText =  animalName + " says, " + speechText;    
    } else {
        speechText = "Sorry, I dont have, " + animalName + ", in my zoo";
    }

    var speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: '<speak>' + repromptText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    response.ask(speechOutput, repromptOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the WiseGuy Skill.
    var skill = new WiseGuySkill();
    skill.execute(event, context);
};
