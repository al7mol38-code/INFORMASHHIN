const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

// --- إعداد بوت الديسكورد ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const PREFIX = "!";
// أيدي الروم المسموح له بالرد فيه
const ALLOWED_CHANNEL_ID = "1533721177049272513";

client.once('ready', () => {
    console.log(`✅ تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);
    console.log('🚀 البوت يعمل الآن كـ Background Worker ومحدد بروم معين فقط.');
});

client.on('messageCreate', async (message) => {
    // تجاهل رسائل البوتات أو الرسائل التي لا تبدأ بالبادئة
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    // شرط التحقق من الروم (إذا لم يكن الروم هو نفسه المحدد، يتم تجاهل الرسالة تماماً)
    if (message.channel.id !== ALLOWED_CHANNEL_ID) return;

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
