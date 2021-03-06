"use strict";
require("dotenv").config();

const line = require("@line/bot-sdk");
const express = require("express");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// create LINE SDK config from env variables
const config = {
  channelId: process.env.LINE_CHANNEL_ID,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post("/callback", line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(
    req.body.events.map((event) => {
      console.log("event", event);
      // check verify webhook event
      if (
        event.replyToken === "00000000000000000000000000000000" ||
        event.replyToken === "ffffffffffffffffffffffffffffffff"
      ) {
        return;
      }
      return handleEvent(event);
    })
  )
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
/*
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: "text", text }))
  );
};*/

const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(token, {
    type: "text",
    text: "What do you want to know about me?",
    quickReply: {
      items: [
        {
          type: "action",
          action: {
            type: "message",
            label: "Major",
            text: "Computer Science",
          },
        },
        {
          type: "action",
          action: {
            type: "message",
            label: "Languages and Skillset",
            text:
              "JavaScript, HTML, CSS, Java, C++, .NET, Spring Boot, Docker, Jenkins ",
          },
        },
        {
          type: "action",
          action: {
            type: "camera",
            label: "Send camera",
          },
        },
        {
          type: "action",
          action: {
            type: "cameraRoll",
            label: "Send image",
          },
        },
        {
          type: "action",
          action: {
            type: "location",
            label: "Send location",
          },
        },
      ],
    },
  });
};

function handleEvent(event) {
  switch (event.type) {
    case "message":
      const message = event.message;
      switch (message.type) {
        //case "text":
        //return handleText(message, event.replyToken);
        case "image":
          return handleImage(message, event.replyToken);
        case "video":
          return handleVideo(message, event.replyToken);
        case "audio":
          return handleAudio(message, event.replyToken);
        case "location":
          return handleLocation(message, event.replyToken);
        case "sticker":
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case "follow":
      return replyText(event.replyToken, "Got followed event");

    case "unfollow":
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case "join":
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case "leave":
      return console.log(`Left: ${JSON.stringify(event)}`);

    case "postback":
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case "beacon":
      const dm = `${Buffer.from(event.beacon.dm || "", "hex").toString(
        "utf8"
      )}`;
      return replyText(
        event.replyToken,
        `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`
      );

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken) {
  return replyText(replyToken, message.text);
}

function handleImage(message, replyToken) {
  return replyText(replyToken, "Got Image");
}

function handleVideo(message, replyToken) {
  return replyText(replyToken, "Got Video");
}

function handleAudio(message, replyToken) {
  return replyText(replyToken, "Got Audio");
}

function handleLocation(message, replyToken) {
  return replyText(replyToken, "Got Location");
}

function handleSticker(message, replyToken) {
  return replyText(replyToken, "Got Sticker");
}
// listen on port
app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
