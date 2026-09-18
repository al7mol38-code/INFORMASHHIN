import os
import time
from datetime import datetime
import discord
from dotenv import load_dotenv

# تحميل متغيرات البيئة من ملف .env (محلياً) أو من رندر
load_dotenv()
TOKEN = os.getenv("TOKEN")

# --- إعدادات البوت والـ Intents ---
intents = discord.Intents.default()
intents.message_content = True
intents.guilds = True
intents.members = True

client = discord.Client(intents=intents)

PREFIX = "="
ALLOWED_CHANNEL_ID = 1533721177049272513  # أيدي الروم المسموح به

@client.event
async def on_ready():
    print(f"✅ تم تسجيل الدخول بنجاح باسم: {client.user}")
    print("🚀 البوت يعمل الآن بايثون (Python) كـ Background Worker ومحدد بروم معين فقط.")

@client.event
async def on_message(message):
    # تجاهل رسائل البوتات أو الرسائل التي لا تبدأ بالبادئة
    if message.author.bot or not message.content.startswith(PREFIX):
        return

    # التحقق من أن الرسالة في الروم المخصص فقط
    if message.channel.id != ALLOWED_CHANNEL_ID:
        return

    # استخراج الأمر
    command = message.content[len(PREFIX):].strip().lower()

    if command == "معلوماتي":
        user = message.author
        member = message.guild.get_member(user.id) or user

        # حساب الأيام منذ إنشاء الحساب ودخول السيرفر
        now_timestamp = int(time.time())
        
        created_timestamp = int(user.created_at.timestamp())
        created_days = (datetime.now(user.created_at.tzinfo) - user.created_at).days

        joined_timestamp = int(member.joined_at.timestamp()) if member.joined_at else created_timestamp
        joined_days = (datetime.now(member.joined_at.tzinfo) - member.joined_at).days if member.joined_at else 0

        # صياغة تواريخ ديسكورد الديناميكية (<t:timestamp:F> إلخ)
        created_value = f"<t:{created_timestamp}:F>\n🔻 <t:{created_timestamp}:R> (قبل {created_days} يوم)"
        joined_value = f"<t:{joined_timestamp}:F>\n🔻 <t:{joined_timestamp}:R> (قبل {joined_days} يوم)"
        time_value = f"📅 التاريخ والوقت: <t:{now_timestamp}:F>\n⏳ (منذ <t:{now_timestamp}:R>)"

        # بناء الـ Embed
        embed = discord.Embed(
            title="👤 معلومات الحساب",
            color=0x5865F2,
            timestamp=datetime.now()
        )
        
        # وضع صورة البروفايل والمنشن في الـ Author
        embed.set_author(
            name=f"{user} ({user.mention})",
            icon_url=user.display_avatar.url
        )
        embed.set_thumbnail(url=user.display_avatar.url)
        
        embed.add_field(name="🗓️ تاريخ إنشاء الحساب:", value=created_value, inline=False)
        embed.add_field(name="📥 تاريخ دخول السيرفر:", value=joined_value, inline=False)
        embed.add_field(name="⏰ وقت طلب الأمر:", value=time_value, inline=False)
        
        embed.set_footer(text=f"طلب بواسطة: {user}", icon_url=user.display_avatar.url)

        await message.channel.send(embed=embed)

# تشغيل البوت باستخدام التوكن من متغيرات البيئة
client.run(TOKEN)
