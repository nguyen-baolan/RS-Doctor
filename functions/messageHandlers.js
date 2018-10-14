const dfh = require('./dialogFlowHandler');
const callSendAPI = require('./callSendAPI');
const uuid = require("uuid");
// const config = require("../config");


exports.receivedMessage =

    /**
     * Separate the message to Text or Attachment (but not both) and redirects to the right handler
     * Sets the session ID of the current message sender in the global sessionsIds variable
     * @param event: the event triggering the message
     * @param sessionIds: the global session ids to be updated
     */
    function receivedMessage(event, sessionIds) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;
        var message = event.message;

        if (!sessionIds.has(senderID)) {
            console.log("No global session IDS yet, setting new ID = " && senderID);
            sessionIds.set(senderID, uuid.v1());
        }

        var messageId = message.mid;
        var appId = message.app_id;
        var metadata = message.metadata;

        // You may get a text or attachment but not both
        var messageText = message.text;
        var messageAttachments = message.attachments;

        if (messageText) {
            //send message to api.ai
            console.log("This is a text message, redirecting to sendToApiAi function");
            dfh.sendToApiAi(senderID, messageText, sessionIds);
        } else if (messageAttachments) {
            console.log("This is an attachment, redirecting to handleMessageAttachments function");
            handleMessageAttachments(messageAttachments, senderID);
        }
    };

exports.sendTextMessage =

    /**
     * Asynchronously sends a message back to the user through the FB API
     * @param {*} recipientId : the Id of the user to whom the responses should be sent
     * @param {*} text : the content to be sent
     */
    async function sendTextMessage(recipientId, text) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: text
            }
        };
        await callSendAPI.callSendAPI(messageData);
    };




// module.exports = {
//     sendTextMessage: sendTextMessage,
//     receivedMessage: receivedMessage
// };
