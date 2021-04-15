const Discord = require("discord.js");
const config = require("./config.json");
const usuarios=require("./user.json");
var contador = [];
const client = new Discord.Client();
const fs = require('fs')
/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://galo:tadeito123@cluster0.zxf7f.mongodb.net/Ejemplo?retryWrites=true&w=majority";
const Client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var contador=config.Contador;*/

function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}

client.on('ready', () => {
  console.log('I am ready!');
});

function inicializarContador(){

  usuarios.forEach(element =>{
    contador.push(element.contador);
  });

}
inicializarContador();

client.on('guildMemberRemove', (member) => {

  usuarios.forEach(user => {

    if(user.id == member.user.id){

      //Actualizo el contador local

      contador[user.posicion]++;

      //Actualizo el contador Json

      jsonReader("./user.json", (err, customer) => {
        if (err) {
          console.log("Error reading file:", err);
          return;
        }
        // increase customer order count by 1
        customer[user.posicion].contador = contador[user.posicion];
        fs.writeFile("./user.json", JSON.stringify(customer), err => {
          if (err) console.log("Error writing file:", err);
        });
      });
      
    }
  });





  
  
});


client.on('message', message => {
  
  if (message.content.startsWith('!contador')) {

    var mencionado = message.mentions.members.first();
    
    
    if(mencionado){
      usuarios.forEach(elemnt =>{

        if(mencionado.id == elemnt.id){
          const embed= new Discord.MessageEmbed;
          embed.setTitle("El bot de " + elemnt.nombre + " fue Expulsado: " + contador[elemnt.posicion] +" veces");
          embed.setAuthor(mencionado.user.username, mencionado.user.displayAvatarURL());
          embed.setColor(0x00AE86);
          embed.setFooter("Este Animal Salvaje es: "+elemnt.nombre, client.user.avatarURL());
          embed.setImage(elemnt.imagen);
          embed.setTimestamp();
          message.guild.channels.cache.get("577609123315580966").send(embed);
        }
  
      });
    } else{
      message.reply("You didn't mention the user to kick!");
    }

    
  }
});




client.login(config.BOT_TOKEN);




