// 引用linebot SDK
var linebot = require("linebot");

// 用於辨識Line Channel的資訊
var bot = linebot({
  channelId: "1655581878",
  channelSecret: "e305dfb1aabca64f0d6f4cc8c9811086",
  channelAccessToken:
    "a0EdzHygRafjRZI8N2ehgR86kqWcQY4SxFr3hNeuhpkBjDaNgqt1f4PTauymHKUcvqGXYXTSqe39Dt55LeBY8wq3kFlikHiorfARVoTHXm6t6/NPN/E3B83mfCDHDFpjA9rlqx2CIcGfQEiiexI/EQdB04t89/1O/w1cDnyilFU=",
});

// 當有人傳送訊息給Bot時
bot.on("message", function (event) {
  // event.message.text是使用者傳給bot的訊息
  // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者
  var replyMsg = `Hello你剛剛說了這句話：${event.message.text}`;

  event
    .reply(event.message.text)
    .then(function (data) {
      // 當訊息成功回傳後的處理
    })
    .catch(function (error) {
      // 當訊息回傳失敗後的處理
    });
});

// Bot所監聽的webhook路徑與port
bot.listen("/linewebhook", 3000, function () {
  console.log("[BOT已準備就緒]");
});
