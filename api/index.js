var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1914332844:AAGh-92XhHQbc5CgeGFkHHY-lz9J7Q9BG8o'
const bot = new TelegramBot(token, {polling: true});

state = 0;
// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome riziq\n
        click /predict to predict`
    );   
    state = 0;
});

bot.onText(/\/predict/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `masukkan nilai x1|x2|x3|x4 seperti 7|8|2|1`
    ); 
    state = 1;
});
     
bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1]),
                parseFloat(s[2]),
                parseFloat(s[3]),
                ]
            ).then((jres1)=>{
            console.log(jres1);
                
          model.predict([parseFloat(s[0]), parseFloat(s[1]), parseFloat(s[2]),parseFloat(s[3]),parseFloat(jres1[0]), parseFloat(jres1[1]), parseFloat(jres1[2]),parseFloat(jres1[3])]);
                bot.sendMessage(
                    msg.chat.id,
                    `nilai Y1 yang diprediksi adalah ${jres1[0]}`
                    );
                bot.sendMessage(
                    msg.chat.id,
                    `nilai Y2 yang diprediksi adalah ${jres1[1]}`
                    );
                bot.sendMessage(
                    msg.chat.id,
                    `nilai Y3 yang diprediksi adalah ${jres1[2]}`
                     );
                bot.sendMessage(
                    msg.chat.id,
                    `nilai Y4 yang diprediksi adalah ${jres1[3]}`
                     );
                        
            })
      }
    state = 1;
})

// routers
r.get('/predict/:x1/:x2/:x3,x4', function(req, res, next) {    
            model.predict(
        [
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3),
            parseFloat(req.params.x4)
        ]
    ).then((jres1)=>{
       res.json(jres1)
    })            
});

module.exports = r;
