const Alexa = require('alexa-sdk');
const APP_ID = process.env.APP_ID; // TODO replace with your app ID (OPTIONAL).

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCorrectWord(){
    var index = getRandomIntInclusive(1,5);
    switch (index){
        case 1:
            return `Correct,`;
        case 2:
            return `Good Job,`;
        case 3:
            return `Brilliant,`;
        case 4:
            return `You are doing great,`;
        case 6:
            return `Great,`;
        default:
            return `Correct,`;
    }
}

const handlers = {
    'LaunchRequest': function () {
        this.response.speak('Welcome to Math Quiz, Lets start our math quiz, Do you like to start with Additions or Subtractions, You may sat stop to stop the quiz');
        this.response.listen('Do you like to start the Additions or Subtraction Quiz');
        this.emit(':responseReady');
    },
    'WelcomeIntent': function () {
        this.response.speak('Hi, Welcome to Math Quiz, Do you like to play Additions or subtraction quiz');
        this.response.listen('Do you like to start the Additions or Subtraction Quiz');
        this.emit(':responseReady');
    },
    'AdditionsIntent': function () {
        var firstValue = getRandomIntInclusive(1, 10);
        var secondValue = getRandomIntInclusive(1, 3);
        this.attributes['operation'] = "+";
        this.attributes['first'] = firstValue;
        this.attributes['second'] = secondValue;
        var question = `What is ${firstValue} plus ${secondValue}?`;
        this.response.speak(`${question}`).listen(`${question}`);
        this.emit(':responseReady');
    },
    'ResponseIntent': function () {
        var intentObj = this.event.request.intent;
        var first = parseInt(this.event.session.attributes.first);
        var second = parseInt(this.event.session.attributes.second);
        var operation = this.event.session.attributes.operation;
        var answer = parseInt(intentObj.slots.Answer.value);
        var answerResponse ='';
        if(answer === first + second) {
            answerResponse = `${getCorrectWord()} ${first} plus ${second} is equal to ${answer}`;
        }else {
            answerResponse = `Sorry, ${first} plus ${second} is equal to ${first + second}`;
        }
        var firstValue = getRandomIntInclusive(1, 10);
        var secondValue = getRandomIntInclusive(1, 3);
        this.attributes['operation'] = "+";
        this.attributes['first'] = firstValue;
        this.attributes['second'] = secondValue;
        var nextQuestion = `What is ${firstValue} plus ${secondValue}?`;
        answerResponse = answerResponse + `<break time="1s"/>Next question, ${nextQuestion}`;
        this.response.speak(answerResponse).listen(nextQuestion);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak('I am Math Quiz, I can ask question on additions or subtraction').listen('Do you like to additions or subtraction quiz');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('Thank you for using Math Quiz');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Thank you for using Math Quiz');
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('Thank you for using Math Quiz'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('Help you');
        this.attributes.repromptSpeech = this.t('can i help you  with any thing else');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    console.log(event);
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
