const token = 'TELEGRAM BOT TOKEN';
const tgBotUrl = 'https://api.telegram.org/bot' + token;
const hookUrl = 'your Google web app url';
const sheetId = 'google sheet with form responses';

function doGet(e) {
  return HtmlService.createHtmlOutput('hello');
}

// tg bot will send updates to this function
function doPost(e) {
  let content = JSON.parse(e.postData.contents);
  try {
    let sheetHandle = new SheetHandler(sheetId);

    // check if it is not a bot's messages
    if (content.message.chat.id != botId) {
      if (content.message.text == '/subscribe') {
        sheetHandle.addChatId(content.message.chat.id);
         sendMessage(content.message.chat.id, 'subscribed');
      }
      else if (content.message.text == '/unsubscribe') {
        sheetHandle.removeChatId(content.message.chat.id);
         sendMessage(content.message.chat.id, 'unsubscribed');
      }
      else {
         sendMessage(content.message.chat.id, 'command unknown');
      }
    }
    return HtmlService.createHtmlOutput();
  } catch (e) {
     sendMessage(content.message.chat.id, 'error');
  } finally {
    return HtmlService.createHtmlOutput();
  }
}

// this metod will be triggered by trigger to send data to subscribers
function sendUpdateToSubscribers(){
  let sheetHandle = new SheetHandler(sheetId);
  let chats = sheetHandle.listChatIds();
  let messages = sheetHandle.listLatestAnswers();
  if (messages.length == 0) {
    return;
  }
  for (let i = 0; i < chats.length; i++) {
    for (let j = 0; j < messages.length; j++) {
        sendMessage(chats[i], messages[j]);
    }
    
  }
}

function sendMessage(chatId, message) {
  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify({
      chat_id: chatId,
      text: message
    })
  }
  return UrlFetchApp.fetch(tgBotUrl + "/sendMessage", options);
}

// service method to set webhook after service deployed
function setWebHook() {
  let response = UrlFetchApp.fetch(tgBotUrl + "/setWebhook?url=" + hookUrl);
  Logger.log('telegram response status is ' + response.getResponseCode());
}

// service method to get current webhook
function getWebHook() {
  let response = UrlFetchApp.fetch(tgBotUrl + "/getWebhookInfo");
  if (response.getResponseCode() == 200) {
    let data = JSON.parse(response.getContentText())
    Logger.log('current webhook ur is ' + data.result.url);
  } else {
    Logger.log('telegram response status is ' + response.getResponseCode());
  }
}

// just to test your code
function test() {
  try {
  let sheetHandle = new SheetHandler(sheetId);
  sheetHandle.addChatId('123457');
  Logger.log(sheetHandle.listChatIds());
  sheetHandle.removeChatId('123457');

  } catch (e) {
    Logger.log(e);
  }
}
