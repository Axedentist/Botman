

const Discord = require("Discord.js");
const YTDL = require("ytdl-core");

var bot = new Discord.Client();


const TOKEN = client.login(config.TOKEN)
const PREFIX = client.login(config.PREFIX) 

bot.on("guildMemberAdd", member => {
    var welcome = greetings[Math.floor(Math.random() * greetings.length)]
    member.guild.channels.find("name", "general").send(member.toString() + welcome);
})

bot.on("message", function (message) {
    // if the message is a bot, ignore
    if (message.author.equals(bot.user)) return;
    // if the message doesn't start with the prefix, ignore
    if (!message.content.startsWith(PREFIX)) return;
    //slice off the prefix and put it to lowercase for the raw input
    const input = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const args = input.shift().toLowerCase();
    // person that was mentioned in command. 
    var member = message.mentions.members.first();
    var reason = input.slice(1).join(' ');
    
    switch (input, args) {

        case "help":
            let help = ['```xl'
                ,'!ping : "Sends back \'pong!\' with a counter of how long the response took."'
                ,'!flipcoin : "Flips a coin and responds with \'Heads\' or \'Tails\'."'
                ,'!pubgchallenge : "Messages you a randomized challenge for your next PUBG match."'
                ,'!pubgteamchallenge : "Gives a challenge but for the whole family."'
                ,'!dropzone : "Gives you a random place to drop on the map."'
                ,'!eightball [Yes/No question] : "Ask a yes or no question and 8ball will give you the answers."'
                ,'!silverstar : "When you don\'t quite deserve a gold star."'
                ,'!goodbot : "Tell Botman that he is a good bot."'
                ,'!badbot : "Tell Botman he is a bad bot. (This will never happen)"'
                ,'!backmeup : "For when you throw out a sick burn and you need someone to back you up."'
                ,'!roastme : "Self confidence levels too high? Try this command."'
                ,'!dadjoke. : "Tells a really bad joke."'
                ,'!kick : "What do you think this does?"'
                ,'!say : "Get the bot to say whatever you want."'
                ,'!join : "Join Voice channel of msg sender"'
                ,'!add : "Add a valid youtube link to the queue"'
                ,'!queue : "Shows the current queue, up to 15 songs shown."'
                ,'!play : "Play the music queue if already joined to a voice channel"'
                ,''
                ,'the following commands only function while the play command is running:'.toUpperCase()
                ,'!pause : "pauses the music"'
                ,'!resume : "resumes the music"'
                ,'!skip : "skips the playing song"'
                ,'!playtime : "Shows the playtime of the song."'
                ,'!volume+(+++) : "increases volume by 2%/+"'
                ,'!volume-(---) : "decreases volume by 2%/-"'
                ,'```'];
            message.channel.send(help.join('\n'));
            break;
        case "play":
            // if the queue is empty then tell them to add some songs
            if (queue[message.guild.id] === undefined) return message.channel.send(`Add some songs to the queue first with !add`);
            // if the bot has not joined a voice channel, join the channel they are in.
            if (!message.guild.voiceConnection) //message.channel.send("Use the !join function to have botman join your channel.") {
                return new Promise((resolve, reject) => {
                    const voiceChannel = message.member.voiceChannel;
                    if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
                    voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
                });
            
            // If already playing, give said feedback
            if (queue[message.guild.id].playing) return message.channel.send('Already Playing');
            let dispatcher; //let redeclares a global variable but only in the function scope. 
            // Once validation is complete, set playing to true.
            queue[message.guild.id].playing = true;

            console.log(queue);
            (function play(song) {
                console.log(song);
                // Make sure there is a song in the queue.
                if (song === undefined) return message.channel.send('Queue is empty').then(() => {
                    //stop playing and set playing to false
                    queue[message.guild.id].playing = false;
                    message.member.voiceChannel.leave();
                });
                // Message channel the song that is playing.
                message.channel.send(`Playing: **${song.title}** as requested by: **${song.requester}**`);
                dispatcher = message.guild.voiceConnection.playStream(YTDL(song.url, "audioonly", "360p" )); 
                let collector = message.channel.createCollector(m => m);
                collector.on("message", m => {
                    // pause feed only when music is playing
                    if (m.content.startsWith("!pause")) {
                        message.channel.send("paused").then(() => {dispatcher.pause();});
                    // resume feed. only works while playing 
                    } else if (m.content.startsWith("!resume")){
                        message.channel.send("resumed").then(() => {dispatcher.resume();});
                    // skip to the next song
                    } else if (m.content.startsWith("!skip")){
                        message.channel.send("skipped").then(() => {dispatcher.end();});
                    // increase volume by 2% / +. defaults to 50%
                    } else if (m.content.startsWith("!volume+")){
                        if (Math.round(dispatcher.volume*50) >= 100) return message.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                        dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split("+").length-1)))/50,2));
                        message.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                    // decrease volume by 2% / +. defaults to 50%
                    } else if (m.content.startsWith("!volume-")){
                        if (Math.round(dispatcher.volume*50) <= 0) return message.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                        dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
                        message.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                    // tells you the playtime of the song.
                    } else if (m.content.startsWith("!playtime")){
                        message.channel.send(`playtime: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
                    }
                });
                // at the end, skip to the next song. If there is no next song, it will be caught above not here.
                dispatcher.on("end", () => {
                    collector.stop();
                    play(queue[message.guild.id].songs.shift());
                });
                dispatcher.on("error", (err) => {
                    return message.channel.send("error: " + err).then(() => {
                        collector.stop();
                        play(queue[message.guild.id].songs.shift());
                    });
                });
            });
            (queue[message.guild.id].songs.shift());
            break;
        case "join":
            // join the voice channel of the person making the command
            new Promise((resolve, reject) => {
			    const voiceChannel = message.member.voiceChannel;
			    if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
                voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
            });
            break;
        case "leave":
            // kicks botman out of the voice channel
            message.channel.send(`Leaving`)
            queue[message.guild.id].playing = false;
            message.member.voiceChannel.leave();
            break;    
        case "add":
            // adds a song to the queue. queue gets cleared whenever botman goes offline
            let url = message.content.split(/ +/g)[1];
            if (url == '' || url === undefined) 
                return message.channel.send(`You must add a YouTube video url, or id after !add`);
            YTDL.getInfo(url, (err, info) => {
                if(err) return message.channel.send('Invalid YouTube Link: ' + err);
                if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = []; 
                    queue[message.guild.id].songs.push({url: url, title: info.title, requester: message.author.username});
                message.channel.send(`added **${info.title}** to the queue`);
            });
        
            break;
        case "queue": // show the songs in the queue
            // if queue is empty, tell them to add songs first
            if (queue[message.guild.id] === undefined) return message.channel.send(`Add some songs to the queue first with !add`);
            let tosend = []; // declare tosend as a new object
            // send the first song in the queue, then iterate through with i
            queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
            message.channel.send(`__**${message.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
            break;

        case "info": // who are you??
            message.reply("I'm Botman.");
            break;
        case "jingle": // The totally original botman jingle
            message.reply("Na, na, na, na, na, na, na, na, na, na, na, na, na Botman!")
            break;
        case "kick":
            // This command must be limited to mods and admins. In this example we just hardcode the role names.
            if(!message.member.roles.some(r=>["Administrator", "Moderator", "The Vanguard", "Real people not actors", "Admin"].includes(r.name)) )
                return message.reply("Sorry, you don't have permissions to use this!");                
            if(!member)
                return message.reply("Please mention a valid member of this server.");
            if(!member.kickable) 
                return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");  
            if(!reason)
                return message.reply("Please indicate a reason for the kick!");                
            
            member.kick(reason).catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`))
            message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
            break;

        case "purgatory":
            // if they are not in the required roles...
            if (!message.member.roles.some(r => ["The Vanguard", "Real people not actors", "admin"].includes(r.name)))
                //TO DO: DETECT admin role and check if they are in it instead of hardcoded values
                return message.reply("Sorry, you don't have permissions to use this!");
            // if member cannot be found...
            if(!member)
                return message.reply("User mentioned is not a valid user of this server.")
            // if they are not able to be moved to purgatory...
            if(!member.kickable)
                return message.reply("Unable to send user to purgatory. Check if they have higher permissions or this bots permissions.")
            // if no reason for his isolation...
            if(!reason)
                return message.reply("Provide a reason for the purgatory. We are not fascists")
            // Silence them!
            member.addRole("Purgatory").catch(error => message.reply(`Sorry ${message.author} I couldn't send them to purgatory because of : ${error}`));
            message.reply(`${member.user.tag} has been sent to purgatory by ${message.author.tag} because: ${reason}`);
            break;
        case "say": 
            // To get the "message" itself we join the `args` back into a string with spaces: 
            let sayMessage = input.join(' ');
            // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
            message.delete().catch(O_o=>{});
            // And we get the bot to say the thing:
            message.channel.send(sayMessage);
            break;
     
        case "flipcoin":
            message.channel.send(flip[Math.floor(Math.random() * flip.length)])
            break;

        case "roastme": // select a random response from the roasts array
            message.reply(roasts[Math.floor(Math.random() * roasts.length)])
            break;

        case "dadjoke": // select a random response from the dadjokes array
            message.channel.send(dadjokes[Math.floor(Math.random() * dadjokes.length)])
            break;

        case "challenge":
            //if no input is detected, send the challenge to the person who called the function.
            if (input == "") {
                message.channel.send("No players in squad were defined. Sending Challenge to your inbox")
                message.author.send("Here is your challenge: " + challenge[Math.floor(Math.random() * challenge.length)])
                break;
            }
            //split the input into 4 different sections based on spaces.
            var squadmates = input,
                p1 = input.slice(/ +/g)[1],
                p2 = input.slice(/ +/g)[2],
                p3 = input.slice(/ +/g)[3],
                p4 = input.slice(/ +/g)[4];
            //pick a random input in the array.
            var rand = squadmates[Math.floor(Math.random() * squadmates.length)]

            //removing any sign of < @ ! >... 
            //the exclamation symbol comes if the user has a nickname on the server.
            let TheID = rand.replace(/[<@!>]/g, '');
            // send the challenge to the picked person's inbox
            bot.fetchUser(TheID)
                .then(user => {
                    user.send("Here is your challenge: " + challenge[Math.floor(Math.random() * challenge.length)])
                })
            //give feedback confirmation that the challenge has been sent.
            message.channel.send("Challenge has been sent")
            break;

        case "teamchallenge": // challenge bot but sends to the channel to the whole team
            message.channel.send(challenge[Math.floor(Math.random() * challenge.length)])
            break;

        case "dropzone": // tells the squad where to drop
            message.channel.send(dropzones[Math.floor(Math.random() * dropzones.length)])
            break;

        case "goodbot": 
            message.channel.send(goodbot[Math.floor(Math.random() * goodbot.length)])
            break;

        case "silverstar": // send a silver star image.
            message.channel.send(silverstar)
            break;

        case "badbot": // Censor their input, then message them a personal response
            message.delete();
            message.channel.send(badbot[Math.floor(Math.random() * badbot.length)]);
            // Send a DM to the jerk
            message.author.send(copypasta[Math.floor(Math.random() * copypasta.length)]);
            break;

        case "eightball": // select a random fortune
            message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)])
            break;
    //    default:
    //            message.channel.send("That is not a valid command. Please use !help to see a list of commands.")
    }
});

bot.login(TOKEN);