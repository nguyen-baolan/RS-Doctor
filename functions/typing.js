  /*
 * Turn typing indicator on
 *
 */
// const sendTypingOn = (recipientId) => {
//     var messageData = {
//       recipient: {
//         id: recipientId
//       },
//       sender_action: "typing_on"
//     };
//     callSendAPI(messageData);
//   }

const callSendAPI = require('./callSendAPI');

module.exports = {
    sendTypingOn: function sendTypingOn (recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_on"
    };
    callSendAPI.callSendAPI(messageData);
  },

  
  /*
 * Turn typing indicator off
 *
 */
// const sendTypingOff = (recipientId) => {
//     var messageData = {
//       recipient: {
//         id: recipientId
//       },
//       sender_action: "typing_off"
//     };
  
//     callSendAPI(messageData);
//   }


    sendTypingOff: function sendTypingOff(recipientId){
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_off"
    };
  
    callSendAPI.callSendAPI(messageData);
  }
};