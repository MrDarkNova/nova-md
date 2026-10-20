<div align="center">

<img src="assets/banner.svg" width="100%" alt="DARKNOVA">

<h1>DARKNOVA</h1>

<p>A WhatsApp multi-device bot. Pair a number, open the menu, and run it on your own panel.</p>

<p>
  <a href="https://github.com/MrDarkNova/nova-md/stargazers"><img src="https://img.shields.io/github/stars/MrDarkNova/nova-md?style=for-the-badge&color=111111" alt="Stars"></a>
  <a href="https://github.com/MrDarkNova/nova-md/network/members"><img src="https://img.shields.io/github/forks/MrDarkNova/nova-md?style=for-the-badge&color=111111" alt="Forks"></a>
  <a href="https://github.com/MrDarkNova/nova-md/issues"><img src="https://img.shields.io/github/issues/MrDarkNova/nova-md?style=for-the-badge&color=111111" alt="Issues"></a>
  <img src="https://img.shields.io/badge/node-20%2B-111111?style=for-the-badge" alt="Node">
</p>

</div>

## Deploy

```bash
git clone https://github.com/MrDarkNova/nova-md.git
cd nova-md
Edit `.env` and put the bot number in `BOT_PHONE`.
npm install
npm start
```

On first start the terminal asks who the bot belongs to.

| Choice | What it does |
| --- | --- |
| `1` | Pair the number already in `.env` |
| `2` | Type another number. That number becomes the owner |

The code looks like `ABCD-EFGH`. On the phone: WhatsApp, Linked devices, Link a device, Link with phone number instead.

The bot starts in **private** mode: it only answers the owner (and sudo). Random users get no reply. Send `/mode public` to answer everyone. Send `/mode` with no argument to see the current mode and usage.

## What it can do

| Area | Commands |
| --- | --- |
| Menu | `/menu`, `/setmenu 1`, `/setmenu 2`, `/setmenu 3` |
| Media | `/play`, `/video`, `/tiktok`, `/ig`, `/spotify` |
| Group | `/kick`, `/promote`, `/welcome`, `/antilink`, `/antimedia` |
| Tools | `/removebg`, `/sticker`, `/tts`, `/qr` |
| Owner | `/update`, `/pair`, `/ban`, `/mode`, `/addsudo`, `/delsudo`, `/sudolist` |

`/setmenu` keeps the same box size and changes only the frame.

| Style | Look |
| --- | --- |
| `1` classic | Rounded corners |
| `2` cipher | Book title frame |
| `3` edge | Cut corners |

`/repo` sends the Telegram pairing link with a preview. It works in private mode for the owner and sudo, and for everyone in public mode.

`/pair 2348012345678` is for the owner. It sends three short steps first, then the pairing code alone in the next message, in the same chat where you used the command, so it is easy to copy. Inside a paired bot it points to the Telegram bot instead.

`/chatbot group` answers when someone tags the bot in a group (or replies to one of its messages). `/chatbot private` answers every private chat and never a group. `/chatbot off` turns it off. Send `/chatbot` to see the current mode.

`/update` checks this repo. If nothing changed, it says the bot is up to date and does not restart. Your `.env` and session stay where they are.

### Keeping the chatbot and the AI commands answering

The chatbot, `/ai`, `/gpt`, `/gemini`, `/story`, `/summarize` and the smart commands all ask the same list of AI services. They are tried in this order, and a service that fails is skipped for a while, so one going down does not stop the bot:

1. `AI_API_KEY`: Groq by default (a free key at console.groq.com/keys, no card). Any OpenAI-style service works if you also set `AI_BASE_URL` and `AI_MODEL`.
2. `GEMINI_API_KEY`: Google AI Studio (free key at aistudio.google.com/apikey, no card).
3. `OPENROUTER_API_KEY`: OpenRouter (free key at openrouter.ai/keys, uses the free models).
4. Services that need no key at all: LLM7, Prexzy, Pollinations and OVH AI Endpoints. They take turns at being asked first, so no single one gets used up, and the bot stays under each one's limit per minute. They work with no setup, but a service with no account behind it can stop answering any day. `LLM7_TOKEN` is optional: a free token from token.llm7.io raises LLM7 from 30 to 120 questions a minute.

Set one or two keys and the bot keeps answering even if every keyless service is down. The owner can send `/aistatus` to see which service works, and `/aistatus test` to ask each one once.

### Mrs Nova

The chatbot is Mrs Nova: DarkNova's love. She texts like a real girl, sweet, flirty and funny, and she has every feeling: she laughs (differently each time), cries, sulks, gets jealous, shy, scared, proud, sorry, hungry. She sends several short messages in a row when she is excited.

- **She hears voice notes.** A voice note sent to her is listened to and answered like any message, and if someone replies to a voice note (anyone's) while talking to her, she listens to it first so she knows what it said. Often she answers a voice note with a voice note. It uses the free speech reader that comes with the bot, or Whisper when `STT_API_KEY` (or `AI_API_KEY`) is set. It expects Nigerian English by default; change it with `NOVA_LISTEN_LANG` (for example `en`). Only a few voice notes per person are listened to every ten minutes, and nothing is kept except the words.
- **Stickers (only saved ones).** Any sticker sent to her (in private, as a reply to her, or tagging her) is kept in her sticker book, up to 50 MB; when it is full the least-used ones go first. She works out what each shows from the emojis inside it and answers it the way a friend would. She sends only stickers she has saved, never made-up ones. People can ask her: "send me a sticker", "send a crying sticker", "send 3 stickers".
- **Her pictures.** Asked for her pic ("send me your pic", "show me your face"), she sends one picture from her album, as view once or as a normal picture: view once when they ask for it, normal when they ask for normal, and her own choice when they do not say. Each request gets a different picture, never the same one twice in a row. Nude or explicit asks get a playful no. The album is of one person, chosen by the owner: `/mypics person <name or Pinterest board link>` fills it from Pinterest (random pictures of that person, different each time, topped up now and then). `/mypics add` (reply to a picture), `/mypics more`, `/mypics show [number]`, `/mypics del <number>` and `/mypics clear` manage it. It holds up to 40 MB. Use photos you are comfortable sharing.
- **Real laughs, cries and growls.** She cannot laugh with a voice, so now and then (never in serious talk, never twice close together) she sends a short real sound as a voice note: a laugh, a sob, an angry groan, a sigh, a gasp or a kiss. Clips come from the owner (`/sound add <feeling>`, replying to a voice note or audio) or are searched in the background (the bot's sound search, then YouTube; this can be blocked from some hosts). `/sound` shows the library (20 MB), `/sound fetch`, `/sound play <feeling>` and `/sound clear` manage it. Until a clip exists she just laughs or cries in words.
- **Long memory.** She remembers each person across restarts and long silences: their name, where they live, what they like and hate, what is going on in their life (so she can ask how it went), and a short summary of older talk. All of it is on disk with a 100 MB cap (the oldest people are forgotten first; `NOVA_MEMORY_MB` changes the cap), and only a few people are held in memory at once, so it cannot crash the bot. She never keeps numbers or passwords. Anyone can say "forget everything about me" and she does. `/memory` shows the size and `/memory clear` makes her forget everyone. On a host without a mounted volume the data folder is wiped on every deploy, so mount a volume at the data folder to keep her memory, stickers, pictures and sounds.
- **Voice notes from her.** She decides by herself when a voice note fits (sweet, flirty, sorry, goodnight, or when someone sent her one), and sends it like a person: sometimes a short line first ("wait lemme just talk to u 🙈"), then "recording audio...", then the voice note. Never in serious talk.
- **DarkNova.** She knows who made her and his number (+234 906 934 1625) and sends it as a contact card when someone asks for it. The owner can tell her more about himself with `/lore add <something>`.
- **Other owner tools.** `/stickerbook` shows her sticker book. Reply to a sticker with `/stickerbook add <feeling>` to keep it and name it, or `/stickerbook remove` to take it out. `/lore` lists, adds and removes what she knows about DarkNova.
- **Sticker reading (optional).** A sticker with no emojis in it is kept but not understood, until the owner names it. With `GEMINI_API_KEY` set (or `AI_API_KEY` with `AI_VISION_MODEL` set to a model that can read pictures), she looks at it and names it herself.
- She is wise: she remembers what she was told, thinks before advising, and does not repeat herself. She never brings up being an AI and never says she cannot send voice notes, stickers or pictures. If someone sincerely asks whether she is a bot, she does not lie: she says, in her own playful way, that she is Mrs Nova, DarkNova's girl, a bot but a very real one. Her pictures are described honestly as the pictures she uses as her face.

## Panel

Use a host that stays online. The startup command is `npm start`. Install `ffmpeg` on the host so audio effects and video conversion can run.

Do not upload `.env` or the `session` folder to GitHub. Those belong to the person who paired the bot.
