const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const PREFIX = "!";

client.once('ready', () => {
    console.log(`✅ تم تشغيل البوت بنجاح باسم: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'معلوماتي') {
        const member = message.member;
        const user = message.author;

        const accountCreatedDays = Math.floor((Date.now() - user.createdTimestamp) / (1000 * 60 * 60 * 24));
        const joinedServerDays = Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24));

        const createdUnix = Math.floor(user.createdTimestamp / 1000);
        const joinedUnix = Math.floor(member.joinedTimestamp / 1000);

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`👤 معلومات الحساب — ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { 
                    name: '🗓️ تاريخ إنشاء الحساب:', 
                    value: <t:${createdUnix}:F>\n🔻 <t:${createdUnix}:R> (قبل **${accountCreatedDays}** يوم), 
                    inline: false 
                },
                { 
                    name: '📥 تاريخ دخول السيرفر:', 
                    value: <t:${joinedUnix}:F>\n🔻 <t:${joinedUnix}:R> (قبل **${joinedServerDays}** يوم), 
                    inline: false 
                }
            )
            .setFooter({ text: طلب بواسطة: ${user.tag}, iconURL: user.displayAvatarURL() })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);
