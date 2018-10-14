// const apiai = require("apiai");
const express = require("express");
const bodyParser = require("body-parser");
//const uuid = require("uuid");
// const axios = require('axios');
const typing = require('./functions/typing');
// const callSendAPI = require('./functions/callSendAPI');
const messageHandler = require('./functions/messageHandlers');
const config = require("./config");

var app = express();

//setting Port
app.set("port", process.env.PORT || 5000);

/* #####  STANDARD MIDDLEWARE ##### */

//serve static files in the public directory
app.use(express.static("public"));

// Process application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

// Process application/json
app.use(bodyParser.json());


/* #####  ROUTING MIDDLEWARE ##### */
//add routing middleware here

//app.get("/webhook",function(req,res){...});

// Index route
app.get("/", function (req, res) {
    res.send("Hello world, I am a chat bot");
});

// for Facebook verification
app.get("/webhook/", function (req, res) {
    console.log("request");
    if (
        req.query["hub.mode"] === "subscribe" &&
        req.query["hub.verify_token"] === config.FB_VERIFY_TOKEN
    ) {
        res.status(200).send(req.query["hub.challenge"]);
        console.log("verified successfully");
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

// const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
//     language: "en",
//     requestSource: "fb"
// });

//Store all the session Ids of the Messenger users
const sessionIds = new Map();


/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post("/webhook/", function (req, res) {
    var data = req.body;
    // Make sure this is a page subscription
    if (data.object == "page") {
        // Iterate over each entry
        // There may be multiple if batched

        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.message) {
                    console.log("Receiving the message properly");
                    messageHandler.receivedMessage(messagingEvent, sessionIds);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });
        // Assume all went well.
        // You must send back a 200, within 20 seconds
        res.sendStatus(200);
    }
    console.log("page is broken" && data.object);
    //res.sendStatus(403);
});



/* #####  MIDDLEWARE TO CATCH ERRORS ##### */


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
//   });

//   // error handler
//   app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     //res.render('error');
//     next(err);
//   });




// /**
//  * Displays 'typing' to FB Messenger and call handleApiAiResponse(sender,response) to handle the response
//  * @param {*} ID of the sender 
//  * @param {*} text sent to DialogFlow
//  */
// function sendToApiAi(sender, text) {
//     typing.sendTypingOn(sender);

//     let apiaiRequest = apiAiService.textRequest(text, {
//         sessionId: sessionIds.get(sender)
//     });

//     apiaiRequest.on("response", response => {
//         if (isDefined(response.result)) {
//             handleApiAiResponse(sender, response);
//         }
//     });

//     apiaiRequest.on("error", error => console.error(error));
//     apiaiRequest.end();
// }



/*
* Call the Send API. The message data goes in the body. If successful, we'll 
* get the message id in a response 
*
//  */
// const callSendAPI = async (messageData) => {

//     const url = "https://graph.facebook.com/v3.0/me/messages?access_token=" + config.FB_PAGE_TOKEN;
//       await axios.post(url, messageData)
//         .then(function (response) {
//           if (response.status == 200) {
//             var recipientId = response.data.recipient_id;
//             var messageId = response.data.message_id;
//             if (messageId) {
//               console.log(
//                 "Successfully sent message with id %s to recipient %s",
//                 messageId,
//                 recipientId
//               );
//             } else {
//               console.log(
//                 "Successfully called Send API for recipient %s",
//                 recipientId
//               );
//             }
//           }
//         })
//         .catch(function (error) {
//           console.log(error.response.headers);
//         });
//     }




// const isDefined = (obj) => {
//     if (typeof obj == "undefined") {
//         return false;
//     }
//     if (!obj) {
//         return false;
//     }
//     return obj != null;
// }




// function handleApiAiResponse(sender, response) {
//     let responseText = response.result.fulfillment.speech;
//     let responseData = response.result.fulfillment.data;
//     let messages = response.result.fulfillment.messages;
//     let action = response.result.action;
//     let contexts = response.result.contexts;
//     let parameters = response.result.parameters;

//     typing.sendTypingOff(sender);

//     if (responseText == "" && !isDefined(action)) {
//         //api ai could not evaluate input.
//         console.log("Unknown query" + response.result.resolvedQuery);
//         sendTextMessage(
//             sender,
//             "I'm not sure what you want. Can you be more specific?"
//         );
//     } else if (isDefined(action)) {
//         handleApiAiAction(sender, action, responseText, contexts, parameters);
//     } else if (isDefined(responseData) && isDefined(responseData.facebook)) {
//         try {
//             console.log("Response as formatted message" + responseData.facebook);
//             sendTextMessage(sender, responseData.facebook);
//         } catch (err) {
//             sendTextMessage(sender, err.message);
//         }
//     } else if (isDefined(responseText)) {
//         sendTextMessage(sender, responseText);
//     }
// }


// const sendTextMessage = async (recipientId, text) => {
//     var messageData = {
//         recipient: {
//             id: recipientId
//         },
//         message: {
//             text: text
//         }
//     };
//     await callSendAPI.callSendAPI(messageData);
// }



// function handleApiAiAction(sender, action, responseText, contexts, parameters) {
//     switch (action) {
//         case "learn-communication":
//             //treat the request here
//             var responseText = "This is example of Text message."
//             sendTextMessage(sender, responseText);
//             break;
//         default:
//             //unhandled action, just send back the text
//             sendTextMessage(sender, responseText);
//     }
// }



// Spin up the server
app.listen(app.get("port"), function () {
    console.log("Magic Started on port", app.get("port"));
});