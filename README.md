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

- **Stickers.** Any sticker sent to her (in private, as a reply to her, or tagging her) is kept in her sticker book. She works out what it shows from the emojis the sticker pack put inside it, and answers it the way a friend would: a hug for a crying sticker, a laugh for a laughing one, sometimes with words instead. 34 drawn stickers (one for each feeling) are built in, so she can send stickers from day one. People can ask her: "send me a sticker", "send a crying sticker", "send 3 stickers", and she sends ones she has saved.
- **Voice notes.** She decides by herself when a voice note fits (sweet, flirty, sorry, goodnight), and sends it like a person: a short line first ("wait lemme just talk to u 🙈"), then "recording audio...", then the voice note. Never in serious talk.
- **DarkNova.** She knows who made her and his number (+234 906 934 1625) and sends it as a contact card when someone asks for it. The owner can tell her more about himself with `/lore add <something>`.
- **Owner tools.** `/stickerbook` shows her sticker book. Reply to a sticker with `/stickerbook add <feeling>` to keep it and name it, or `/stickerbook remove` to take it out. `/lore` lists, adds and removes what she knows about DarkNova.
- **Sticker reading (optional).** A sticker with no emojis in it is kept but not understood, until the owner names it. With `GEMINI_API_KEY` set (or `AI_API_KEY` with `AI_VISION_MODEL` set to a model that can read pictures), she looks at it and names it herself.
- She never brings up being an AI and never says she cannot send voice notes or stickers. If someone sincerely asks whether she is a bot, she does not lie: she says, in her own playful way, that she is Mrs Nova, DarkNova's girl, a bot but a very real one.

## Panel

Use a host that stays online. The startup command is `npm start`. Install `ffmpeg` on the host so audio effects and video conversion can run.

Do not upload `.env` or the `session` folder to GitHub. Those belong to the person who paired the bot.
