const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

// --- إعداد بوت الديسكورد (بدون MongoDB) ---
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
    console.log('🚀 البوت يعمل الآن كـ Background Worker بدون سيرفر ويب وبدون MongoDB.');
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

        // الوقت الحالي لطلب الأمر
        const nowUnix = Math.floor(Date.now() / 1000);
        const timeValue = "📅 التاريخ والوقت: <t:" + nowUnix + ":F>\n⏳ (منذ <t:" + nowUnix + ":R>)";

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('👤 معلومات الحساب')
            // وضع اسم المستخدم مع المنشن الخاص به وصورة بروفايله في رأس الـ Embed
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
