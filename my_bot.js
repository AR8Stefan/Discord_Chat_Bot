const DotENV = require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const weather = require('weather-js');

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);

    client.user.setActivity("Coding");

    client.guilds.forEach((guild) => {
        console.log(guild.name);
        guild.channels.forEach((channel) => {
            console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
        })
        // General channel id: 547498593767129090 - TESTING PURPOSES ONLY
    })

    // Finds general channel and says 'greeting'
    let generalChannel = client.channels.get("547498593767129090");
    generalChannel.send("I am now online! :)");

    // CLAN General ID: 535660178666684436
    // let generalChannel = client.channels.get("535660178666684436");
    // generalChannel.send("Swazdo-Lah Tenno!");
})

// Displays when removed from a server/guild
client.on("guildDelete", guild => {
    console.log(`I've been removed from: ${guild.name} (id: ${guild.id})`);
});

// Makes the bot not loop its self
client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return
    }

    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage);
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1);

    // Commands
    if (primaryCommand === "help") {
        helpCommand(arguments, receivedMessage);
    } 
        else if (primaryCommand === "ping") { // Ping-Pong
            receivedMessage.channel.send("Pong!");
    } 
        else if (primaryCommand === "purge") { // Purges (Deletes) sent messages in channel - between 0 and 100
            purgeCommand(arguments, receivedMessage);
    }
        else if (primaryCommand === "weather") {
            weather.find({search: arguments.join(" "), degreetype: 'F'}, function(err, result) {
                if (err) receivedMessage.channel.send(err);

                var current = result[0].current;
                var location = result[0].current;

                const embed = new Discord.RichEmbed()
                    .setDescription(`***${current.skytext}***`)
                    .setAuthor(`Weather for ${current.observationpoint}`)
                    .setTumbnail(current.imageUrl)
                    .setColor(`0x00AE86`)
                    .addField('Time-Zone',`UTC ${location.timezone}`, true)
                    .addField('Degree Type:',location.degreetype, true)
                    .addField('Temperature:',`${current.temperature} Degrees`, true)
                    .addField('Feels Like',`${current.feelslike} Degrees`, true)
                    .addField('Winds',`${current.winddisplay}`, true)
                    .addField('Humidity',`${current.humidity} %`, true)

                // receivedMessage.channel.send(JSON.stringify(result[0].current, null, 2));
                receivedMessage.channel.send({embed});
            })
    } // List of Commands the chat-bot uses
        else if (primaryCommand === "commands") {
        receivedMessage.channel.send(
            [
                "!help",
                "!ping",
                "!purge",
                "!weather"
            ]
        )
    } 
}

// Purge Command - Removes a set number of messages from chat
function purgeCommand(arguments, receivedMessage) {
    if (isNaN(arguments[0])) {
        return receivedMessage.channel.send("Please enter a vaild number of messages to purge.");
    } else if (arguments[0] > 100) {
        return receivedMessage.channel.send("Please enter a number less than 100.");
    } else if (arguments[0]) {
        receivedMessage.channel.bulkDelete(arguments[0]);
        return receivedMessage.channel.send(`**Successfully deleted \`${arguments[0]}\` messages`);
    }
}

// Help commands - Need to make more in depth.
function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments);
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]` or `!commands` for a list of commands");
    }
}

client.login(process.env.TOKEN);