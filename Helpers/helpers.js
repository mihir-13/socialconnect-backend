const User = require('../Models/userModels');

module.exports = {
  firstLetterUpperCase: (username) => {
    const name = username.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  },
  lowerCase: (str) => {
    return str.toLowerCase();
  },

  updateChatList: async (req, messageId) => {
    await User.update({
      _id: req.user._id
    }, {
      $pull: {
        chatList: {
          receiverId: req.params.receiver_id
        } 
      }
    });

    await User.update({
      _id: req.params.receiver_id
    }, {
      $pull: {
        chatList: {
          receiverId: req.user._id
        }
      }
    });


    await User.update({
      _id: req.user._id
    }, {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.params.receiver_Id,
                msgId: messageId._id
              }
            ],
            $position: 0
          }
        }
      });

    await User.update({
      _id: req.params.receiver_Id
    }, {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.user._id,
                msgId: messageId._id
              }
            ],
            $position: 0
          }
        }
      });

  }
}