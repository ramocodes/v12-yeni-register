const { MessageEmbed } = require('discord.js');
const data = require('quick.db')
const settings = require("../settings/register.json")
exports.run = async (client, message, args) => {
    if(!settings.roles.yetkilirole.some(role => message.member.roles.cache.get(role))) return message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic: true})).setColor('0a0a0a').setDescription(`Bu Komutu Kullanabilmek İçin Yetkin Bulunmuyor.`)).then(message => message.delete({timeout: 4000}))

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!member) return message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic: true})).setColor('b60426').setDescription(`Lütfen Bir Kullanıcı Etiketleyiniz.`)).then(message => message.delete({timeout: 4000}))

let isim = args.filter(name => isNaN(name)).map(x => x.charAt(0).replace("x", "X").toUpperCase() + x.slice(1)).join(" ");
let yaş = args[2]
if(!isim) return message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic: true})).setColor('b60426').setDescription(`${member} Kullanıcısının İsmini Giriniz.`)).then(message => message.delete({timeout: 4000}))
if(!yaş) return message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic: true})).setColor('b60426').setDescription(`${member} Kullanıcısının Yaşını Giriniz.`)).then(message => message.delete({timeout: 4000}))
if(yaş < settings.info.yaşsınırı) return message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic: true})).setColor('b60426').setDescription(`${member} Kullanıcısının Yaşı **${settings.info.yaşsınırı}** Küçük olduğu İçin Kayıt İşlemine Devam edilemiyor.`)).then(message => message.delete({timeout: 4000}))

if(member.user.username.includes(settings.info.tag)) {
member.setNickname(`${settings.info.tag} ${isim} | ${yaş}`)
message.channel.send(new MessageEmbed().setAuthor(member.user.username, member.user.avatarURL({dynamic: true})).setDescription(`${member} Kullanıcısında Sanırım **${settings.info.tag}** Tagımız Bulunuyor Bu Yüzden İsmini "**${settings.info.tag} ${isim} | ${yaş}**" Olarak Güncellendim.`).setColor('ff1717'))
} else {
data.push(`isim.${message.guild.id}`, 
{user: member.id, 
name: isim, 
age: yaş})

member.setNickname(`${isim} | ${yaş}`)
message.channel.send(new MessageEmbed().setAuthor(member.user.username, member.user.avatarURL({dynamic: true})).setDescription(`${member} Kullanıcısının İsmi "**${isim} | ${yaş}**" Olarak Güncellendi.`).setColor('ff1717'))
}
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["i"],
    permLevel: 0
};

exports.help = {
    name: "isim"
}

