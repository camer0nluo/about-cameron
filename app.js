const express = require("express");

// 引用linebot SDK
const app = express();

var linebot = require("linebot");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config().env;
}

// 用於辨識Line Channel的資訊
var bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
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
  console.log("[About Cameron已準備就緒]");
});
