const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// --- 1. سيرفر Express لمنصة Render ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🤖 البوت يعمل بنجاح وسيرفر الويب متصل!');
});

app.listen(PORT, () => {
    console.log(`🌐 تم تشغيل سيرفر الويب على المنفذ: ${PORT}`);
});

// --- 2. الاتصال بـ MongoDB ---
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('🍃 تم الاتصال بنجاح بـ MongoDB'))
        .catch((err) => console.error('❌ خطأ في الاتصال بـ MongoDB:', err));
} else {
    console.log('⚠️ لم يتم إضافة MONGO_URI في متغيرات البيئة.');
}

// --- 3. إعداد بوت الديسكورد ---
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
    console.log(`✅ تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'معلوماتي') {
        const member = message.member;
        const user = message.author;

        // حساب الأيام
        const accountCreatedDays = Math.floor((Date.now() - user.createdTimestamp) / (1000 * 60 * 60 * 24));
        const joinedServerDays = Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24));

        const createdUnix = Math.floor(user.createdTimestamp / 1000);
        const joinedUnix = Math.floor(member.joinedTimestamp / 1000);

        // صياغة النصوص للتاريخ
        const createdValue = "<t:" + createdUnix + ":F>\n🔻 <t:" + createdUnix + ":R> (قبل " + accountCreatedDays + " يوم)";
        const joinedValue = "<t:" + joinedUnix + ":F>\n🔻 <t:" + joinedUnix + ":R> (قبل " + joinedServerDays + " يوم)";

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('👤 معلومات الحساب — ' + user.username)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { 
                    name: '🗓️ تاريخ إنشاء الحساب:', 
                    value: createdValue, 
                    inline: false 
                },
                { 
                    name: '📥 تاريخ دخول السيرفر:', 
                    value: joinedValue, 
                    inline: false 
                }
            )
            .setFooter({ text: 'طلب بواسطة: ' + user.tag, iconURL: user.displayAvatarURL() })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);
