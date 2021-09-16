const mineflayer = require('mineflayer')
const {Client, MessageEmbed} = require('discord.js')
const client = new Client()
const {pathfinder,Movements,goals} = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow

const bot = mineflayer.createBot({
  username: process.env.USERNAME,
  host: process.env.HOST,
  version: '1.12.2'
})

const mcData = require('minecraft-data')(bot.version)

var isLoggedIn = false
var isFollowing = false
var isTurnedOn = false
var isEating = false
var spammer

bot.loadPlugin(pathfinder)

bot.on('chat', (username, message) => {
  channel = client.channels.cache.get('886832502109515776')
  if(username === '7b7t') return
  if(username === 'command'){
    if(isLoggedIn === true) return
    bot.chat('/login SexoOnTop')
    isLoggedIn = true
  } 
  fixed = message.replace('@', '')
  channel.send(`${username} > ${fixed}`)
})

bot.on('kicked', (reason) => {
  channel = client.channels.cache.get('884056680952901684')
  channel.send({embed:{
    title: 'Bot has been kicked',
    description: `Reason\n${reason}`
  }})
})

bot.on('health', () => {
  if(bot.health < 19){
    autoEat()
  }
})

bot.on('err', console.log)

client.on('message', (message) => {
  var args = message.content.split(' ')
  var command = args.shift()
  
  if(command === '!chat'){
    bot.chat(args.join(' '))
  } else if(command === '!follow'){
    followPlayer(args.join(' '))
  } else if(command === '!stop'){
    stopFollowing()
  } else if(command === '!spam'){
    spamBoi(args.join(' '))
  } else if(command === '!status'){
    if(checkStatus(args[0]) === true){
      message.channel.send(`${args[0]} is online!`)
    } else {
      message.channel.send(`${args[0]} is offline!`)
    }
  } 
})

function followPlayer(username){
  channel = client.channels.cache.get('886832502109515776')
  if(isFollowing === true){
    channel.send('Im already following someone')
    return
  }
  const player = bot.players[username]
  if(!player){
    channel.send(`Can't find a player named ${username}`)
    return
  } else if(!player.entity){
    channel.send(`I can't see ${username}`)
    return
  }
  bot.pathfinder.setMovements(new Movements(bot, mcData))  
  const goal = new GoalFollow(player.entity, 2)
  bot.pathfinder.setGoal(goal, true)
  channel.send(`Following ${username}...`)
  isFollowing = true
} 

function checkStatus(username){
  player = bot.players[username]
  if(!player){
    return false
  } else {
    return true
  }
}

function stopFollowing(){
  channel = client.channels.cache.get('886832502109515776')
  if(isFollowing === true){
    bot.pathfinder.stop()
    channel.send('Stopped following')
    isFollowing = false
  } else {
    channel.send('I\'m not following anyone')
  }
}

function spamBoi(string){
  if(isTurnedOn === false){
    spammer = setInterval(function(){
      bot.chat(string)
    }, 4000)
    isTurnedOn = true
    return
  }
  clearInterval(spammer)
  isTurnedOn = false
}

function autoEat(){
  channel = client.channels.cache.get('886832502109515776')
  const gapple = bot.inventory.findInventoryItem(322, null)
  const steak = bot.inventory.findInventoryItem(364, null)
  if(isEating === true) return
  if(gapple){
    bot.equip(gapple, 'hand')
    channel.send('Eating Enchanted Golden Apple...')
    isEating = true
    tickFood()
    bot.consume()
  } else if(steak){
    bot.equip(steak, 'hand')
    channel.send('Eating Cooked Beef...')
    isEating = true
    tickFood()
    bot.consume()
  } else {
    channel.send('I have no food lol')
  }
}

function tickFood(){
  setTimeout(function(){
    isEating = false
  }, 1610)
}

bot.on('physicTick', async () => {
  if(bot.inventory.slots[45] != null) return
  const totem = bot.inventory.findInventoryItem('totem_of_undying', null, null)
  if(totem) {
    bot.inventory.requiresConfirmation = false
    bot.equip(totem, 'off-hand')
  }
})

client.login(process.env.TOKEN)


