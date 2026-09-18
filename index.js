const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

// --- 1. الاتصال بـ MongoDB ---
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('🍃 تم الاتصال بنجاح بـ MongoDB'))
        .catch((err) => console.error('❌ خطأ في الاتصال بـ MongoDB:', err));
} else {
    console.log('⚠️ لم يتم إضافة MONGO_URI في متغيرات البيئة.');
}

// --- 2. إعداد بوت الديسكورد ---
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
    console.log('🚀 البوت يعمل الآن كـ Background Worker بدون الحاجة لسيرفر ويب.');
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

        // الوقت الحالي لعرضه بشكل دقيق (اختياري إضافي)
        const nowUnix = Math.floor(Date.now() / 1000);
        const timeValue = "📅 التاريخ والوقت: <t:" + nowUnix + ":F>\n⏳ (منذ <t:" + nowUnix + ":R>)";

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            // تم استخدام المنشن هنا مباشرة في العنوان أو يمكن جعله نصاً
            .setTitle('👤 معلومات الحساب الخاصة بـ ' + user.tag)
            // إضافة صورة بروفايل من كتب الأمر كـ Author أو Thumbnail
            .setAuthor({ 
                name: user.tag + ' (' + user.toString() + ')', 
                iconURL: user.displayAvatarURL({ dynamic: true }) 
            })
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
                },
                { 
                    name: '⏰ وقت طلب الأمر:', 
                    value: timeValue, 
                    inline: false 
                }
            )
            .setFooter({ text: 'طلب بواسطة: ' + user.tag, iconURL: user.displayAvatarURL() })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);
