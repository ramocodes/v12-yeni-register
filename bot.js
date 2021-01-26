const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
const ms = require('ms');//
const settings = require("./settings/register.json")

require("./util/eventLoader")(client);

var prefix = settings.bots.prefix;

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === settings.owners.ownerid) permlvl = 5;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("ready", () => {
  console.log(client.user.username);
});



client.login(settings.bots.token);

// Eğer Sunucuya Taglı Katılırsa İsmi Tag Ramazan | 18 Katılmazsa Ramazan | 18 Ve Taglı Rolü veriyor
client.on("guildMemberAdd", member => {
  if(member.user.username.includes(settings.info.tag)) {
    member.setNickname(`${settings.info.tag} İsim | Yaş`)
    member.roles.add(settings.roles.tagrole)
    client.channels.cache.get(settings.channels.log).send(new Discord.MessageEmbed().setDescription(`${member} Adlı Kullanıcı Aramıza Taglı Katıldı Bu Yüzden Kullanıcının İsmini "**${settings.info.tag} İsim | Yaş**" Olarak Değiştirip <@&${settings.roles.tagrole}> Rolünü Verdim.`))
    } else {
    member.setNickname(`${isim} | ${yaş}`)
    }
})

//-----------------------TAG-ROL----------------------\\     STG

client.on("userUpdate", async (stg, yeni) => {
  var sunucu = client.guilds.cache.get('SUNUCU ID'); 
  var uye = sunucu.members.cache.get(yeni.id);
  var ekipTag = settings.info.tag; // Buraya Ekip Tag
  var ekipRolü = settings.roles.tagrole; // Buraya Ekip Rolünün ID
  var logKanali = settings.channels.log; // Loglanacağı Kanalın ID

  if (!sunucu.members.cache.has(yeni.id) || yeni.bot || stg.username === yeni.username) return;
  
  if ((yeni.username).includes(ekipTag) && !uye.roles.cache.has(ekipRolü)) {
    try {
      await uye.roles.add(ekipRolü);
      await uye.send(`Tagımızı aldığın için teşekkürler! Aramıza hoş geldin.`);
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setColor('GREEN').setDescription(`${yeni} adlı üye tagımızı alarak aramıza katıldı!`));
    } catch (err) { console.error(err) };
  };
  
  if (!(yeni.username).includes(ekipTag) && uye.roles.cache.has(ekipRolü)) {
    try {
      await uye.roles.remove(uye.roles.cache.filter(rol => rol.position >= sunucu.roles.cache.get(ekipRolü).position));
      await uye.send(`Tagımızı bıraktığın için ekip rolü ve yetkili rollerin alındı! Tagımızı tekrar alıp aramıza katılmak istersen;\nTagımız: **${ekipTag}**`);
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setColor('RED').setDescription(`${yeni} adlı üye tagımızı bırakarak aramızdan ayrıldı!`));
    } catch(err) { console.error(err) };
  };
});

//------------------------HOŞGELDİN-EMBEDLİ-----------------------\\     STG

client.on("guildMemberAdd", member => {
  require("moment-duration-format")
    var üyesayısı = member.guild.members.cache.size.toString().replace(/ /g, "    ")
    var üs = üyesayısı.match(/([0-9])/g)
    üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase()
    if(üs) {
      üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
        return {
          '0': ``,
          '1': ``,
          '2': ``,
          '3': ``,
          '4': ``,
          '5': ``,
          '6': ``,
          '7': ``,
          '8': ``,
          '9': ``}[d];})}
    const kanal = settings.channels.welcomelog
    let register = settings.roles.yetkilirole
  let user = client.users.cache.get(member.id);
  require("moment-duration-format");
    const kurulus = new Date().getTime() - user.createdAt.getTime();  
   const gecen = moment.duration(kurulus).format(` YY **[Yıl,]** DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`) 
  var kontrol;
if (kurulus < 1296000000) kontrol = 'Hesap Durumu: Güvenilir Değil.'
if (kurulus > 1296000000) kontrol = 'Hesap Durumu: Güvenilir Gözüküyor.'
  moment.locale("tr");
const embed = new Discord.MessageEmbed()
.setAuthor(member.guild.name, member.guild.iconURL({dynamic:true}))
.setDescription(`
<@`+member.id+`> Sunucumuza Katıldı ! 

Kayıt edilmek için teyit odasında <@&{register}> yetkililerine teyit vermen yeterli !

Seninle birlikte `+üyesayısı+` kişiye ulaştık !

Sunucumuzun kurallarına uymayı unutma, kurallarımızı okumanı tavsiye ederiz.

Sunucumuzun tagını (\`tagınız\`) alarak bizlere destek olabilirsin

İçeride keyifli vakitler geçirmeni dileriz.`)
.setImage(`https://media0.giphy.com/media/NKEt9elQ5cR68/200.gif`)
client.channels.cache.get(kanal).send(`<@&${register}>`)
client.channels.cache.get(kanal).send(embed)
});


//-----------------------GİRENE-ROL-VERME----------------------\\     STG

client.on("guildMemberAdd", member => {
  member.roles.add(settings.roles.unregister); 
})