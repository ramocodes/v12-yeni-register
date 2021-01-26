const { MessageEmbed } = require('discord.js');
const data = require('quick.db')
const settings = require("../settings/register.json")
exports.run = async (client, message, args) => {
if(!settings.roles.yetkilirole.some(role => message.member.roles.cache.get(role))) return message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic: true})).setColor('0a0a0a').setDescription(`Bu Komutu Kullanabilmek İçin Yetkin Bulunmuyor.`)).then(message => message.delete({timeout: 4000}))

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member) return message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic: true})).setColor('0a0a0a').setDescription(`Lütfen Bir Kullanıcı Etiketleyiniz.`)).then(message => message.delete({timeout: 4000}))
if(!member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic: true})).setColor('0a0a0a').setDescription('Kullanıcının Yetkisi Sizle Aynı/Üst Pozisyonda.'))

let role = settings.roles.erkek
const rolx = role.map(role => `<@&${role}>`);
member.roles.add(role)
const embed = new MessageEmbed()
.setAuthor(member.user.username, member.user.avatarURL({dynamic: true}))
.setDescription(`${member} Kullanıcısı (${rolx}) Şeklinde Kayıt oldu.`)
.setColor('0089ff')
message.channel.send(embed)
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["e"],
    permLevel: 0
};

exports.help = {
    name: "erkek"
}

