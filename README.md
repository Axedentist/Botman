
# Botman
## How to start
1. Download Node.js at Nodejs.org
2. Download a text editor (Visual Studio Code recommended)
3. Head to http://discordapp.com/developers/applications/me and click "New Application" You will need a discord account if you do not have one.
4. Name the app, customize it how you would like. 
5. Click the Token reveal link under "Client Secret" *DO NOT SHARE THIS CODE*
6. Go to the Tokens JSON file and input the token for your bot, your desired prefix (Recommend '#' or '!' or something similiar and memorable), as well as your ID (NOTE: OwnerID not used in anything currently functional)
7. Add your bot to your server by going to https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8 and replace CLIENTID with the clientID listed to the left of your token.
8. Download Botman code from github
9. Open Command prompt and cd into your Botman Folder
10. input the following code into command prompt to leverage Node.js
```bash
npm install discord.io winston –save.
```
11. in command prompt type to turn on the bot
```bash
node Main.js
```
12. Now message the bot and see it reply. Try using your prefix with ping as your first command to test the connection.
## Common Commands
Use your prefix before the commands to have the bot look for the command. 
ex. !ping or #ping
### ping 
Sends back 'pong!' with a counter of how long the response took.
### flipcoin 
Flips a coin and responds with 'Heads' or 'Tails'.
### pubgchallenge
Messages you a randomized challenge for your next PUBG match.
### pubgteamchallenge
Gives a challenge but for the whole family.
### dropzone
Gives you a random place to drop on the map.
### eightball [Yes/No question]
Ask a yes or no question and 8ball will give you the answers.
### silverstar
When you don\'t quite deserve a gold star.
### goodbot
Tell Botman that he is a good bot.
### badbot
Tell Botman he is a bad bot. This will *never* happen
### backmeup
For when you throw out a sick burn and you need someone to back you up.
### roastme
Self confidence levels too high? Try this command.
### dadjoke
Tells a really bad joke.
### kick
What do you think this does?
### say
Get the bot to say whatever you want.

## Music Commands

### join
Join Voice channel of msg sender
### add
Add a valid youtube link to the queue
### queue
Shows the current queue, up to 15 songs shown.
### play
Play the music queue if already joined to a voice channel
## The following commands only function while the play command is running!!
### pause
pauses the music
### resume
resumes the music
### skip
skips the playing song
### playtime
Shows the playtime of the song.
### volume+(+++)
increases volume by 2%/+
### volume-(---)
decreases volume by 2%/-