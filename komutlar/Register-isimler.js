const { MessageEmbed } = require('discord.js');
const data = require('quick.db')
const settings = require("../settings/register.json")
exports.run = async (client, message, args) => {
if(!settings.roles.yetkilirole.some(role => message.member.roles.cache.get(role))) return message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic: true})).setColor('0a0a0a').setDescription(`Bu Komutu Kullanabilmek İçin Yetkin Bulunmuyor.`)).then(message => message.delete({timeout: 4000}))

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
var number = 1;
let stat = data.get(`isim.${message.guild.id}`)
if(!stat) return message.channel.send(new MessageEmbed().setDescription(`${member} Kullanıcısının Daha Önce İsimi Değiştirilmemiş.`))

let isimler = stat.filter(x => x.user === member.id).map(x => `\`${number++}.\` \`${x.name} | ${x.age}\`\n`).join("\n")

const embed = new MessageEmbed()
.setAuthor(member.user.username, member.user.avatarURL({dynamic: true}))
.setDescription(`${member} Kullanıcısı **${number-1}** Kere Kayıt Olmuş
${isimler}`)
message.channel.send(embed)

}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["isimler"],
    permLevel: 0
};

exports.help = {
    name: "isimler"
}

