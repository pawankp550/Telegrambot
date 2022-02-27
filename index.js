//5282534955:AAG_Tf6eBw7ZK7ZGvi675YtYidA3FR1Dqtc
const axios = require('axios');
const TIME_PERIOD = 14
const { Telegraf } = require('telegraf')

const getRSI = (candles) => {
     const changes = []
  
    for(let i of candles) {
      const changeObj = {}
      
      changeObj.up = i.close > i.open ? i.close - i.open : 0
      changeObj.down = i.close < i.open ? i.open - i.close : 0
    
      changes.push(changeObj)
    }
  
  let smaUp = 0
  let smaDown = 0
  
  for(let i of changes) {
    smaUp += i.up
    smaDown += i.down
  }
  
  
  const rs = (smaUp/TIME_PERIOD)/(smaDown/TIME_PERIOD)
  const RSI = 100 - (100 / (1 + rs))
  return RSI
  }

const bot = new Telegraf('5282534955:AAG_Tf6eBw7ZK7ZGvi675YtYidA3FR1Dqtc')
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('lol'))
bot.hears(/rsi/i, async (ctx) => {
  const response = await  axios.get('https://public.coindcx.com/market_data/candles?pair=I-USDT_INR&interval=1d&limit=14')
  ctx.reply(getRSI(response.data.reverse()))
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))