const typing = require('./typing');
const msgHandler = require('./messageHandlers');
const config = require('../config');
const apiai = require("apiai");
const callSendAPI = require("./callSendAPI");


const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
    language: "en",
    requestSource: "fb"
});


var self = module.exports = {

    sendToApiAi:
        /**
         * Displays 'typing' to FB Messenger and call handleApiAiResponse(sender,response) to handle the response
         * @param {*} ID of the sender 
         * @param {*} text sent to DialogFlow
         * @param sessionIds: session ID
         */
        function sendToApiAi(sender, text, sessionIds) {
            typing.sendTypingOn(sender);

            let apiaiRequest = apiAiService.textRequest(text, {
                sessionId: sessionIds.get(sender)
            });

            apiaiRequest.on("response", response => {
                if (config.isDefined(response.result)) {
                    console.log("response.result = " && response.result && " l Calling handleApiAiResponse(sender, response)");
                    self.handleApiAiResponse(sender, response);
                }
            });

            apiaiRequest.on("error", error => console.error(error));
            apiaiRequest.end();
        },


    handleApiAiResponse:

        /**
         * Evaluates the input given by the user and redirects the request to DF API
         * If an Action is recognized, then triggers the Action
         * If no Action recognized, sends back a text response
         * @param {*} sender 
         * @param {*} response 
         */
        function handleApiAiResponse(sender, response) {
            let responseText = response.result.fulfillment.speech;
            let responseData = response.result.fulfillment.data;
            let messages = response.result.fulfillment.messages;
            let action = response.result.action;
            let contexts = response.result.contexts;
            let parameters = response.result.parameters;

            typing.sendTypingOff(sender);

            if (responseText == "" && !config.isDefined(action)) {
                //api ai could not evaluate input.
                console.log("Unknown query" + response.result.resolvedQuery);
                msgHandler.sendTextMessage(
                    sender,
                    "I'm not sure what you want. Can you be more specific?"
                );
            } else if (config.isDefined(action)) {
                console.log("Action is defined as : " && action);
                self.handleApiAiAction(sender, action, responseText, contexts, parameters);
            } else if (config.isDefined(responseData) && config.isDefined(responseData.facebook)) {
                try {
                    console.log("Response as formatted message" + responseData.facebook);
                    msgHandler.sendTextMessage(sender, responseData.facebook);
                } catch (err) {
                    msgHandler.sendTextMessage(sender, err.message);
                }
            } else if (config.isDefined(responseText)) {
                msgHandler.sendTextMessage(sender, responseText);
            }
        },

    handleApiAiAction:

        /**
         * Redirects the action to be triggered in DF based on the action keyword that is recognized
         * @param {*} sender 
         * @param {*} action 
         * @param {*} responseText 
         * @param {*} contexts 
         * @param {*} parameters 
         */
        function handleApiAiAction(sender, action, responseText, contexts, parameters) {
            switch (action) {
                case "learn-communication":
                    //treat the request here
                    var responseText = "This is example of Text message."
                    //CONTINUE HERE: function not defined??
                    msgHandler.sendTextMessage(sender, responseText);
                    // var messageData = {
                    //     recipient: {
                    //         id: sender
                    //     },
                    //     message: {
                    //         text: responseText
                    //     }
                    // };
                    // (async function (messageData) {
                    //     var sentToFB = await callSendAPI.callSendAPI(messageData);
                    //     console.log(sentToFB);
                    // })();
                    break;
                default:
                    //unhandled action, just send back the text
                    msgHandler.sendTextMessage(sender, responseText);
            }
        }


}




