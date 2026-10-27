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

The chatbot is Mrs Nova: DarkNova's love. She texts like a real girl, sweet, flirty and funny, and she has every feeling: she laughs (differently each time), cries, sulks, gets jealous, shy, scared, proud, sorry, hungry. Her texts are short, like a real girl's (usually one line, about 120 characters; up to about 300 only for advice or a story). She does not flood the chat: one message most of the time, two at most, and a person who sends several lines in a row is answered once, to all of them. She writes the way the person writes to her: real Nigerian Pidgin to someone writing Pidgin, plain English to someone writing English, slang for slang, and another language when they use one, switching when they switch. She types like a real person: natural fillers ("umm", "hmm", "uhh", "erm", "like"), short words and slang that fit the person (ngl, tbh, lowkey, fr, bruh, omo, abeg, oya...), one-word answers, a trailing "..." when she is unsure, and her own feelings said in the first person ("ngl that made me smile"). Her voice notes keep the "umm" and "hmm" too. She sends stickers from her book a lot (about one reply in three when she is playful or feeling something, sometimes with no words at all).

- **She hears voice notes.** A voice note sent to her is listened to and answered like any message, and if someone replies to a voice note (anyone's) while talking to her, she listens to it first so she knows what it said. Often she answers a voice note with a voice note. It uses the free speech reader that comes with the bot, or Whisper when `STT_API_KEY` (or `AI_API_KEY`) is set. It expects Nigerian English by default; change it with `NOVA_LISTEN_LANG` (for example `en`). Only a few voice notes per person are listened to every ten minutes, and nothing is kept except the words.
- **Stickers (only saved ones).** Any sticker sent to her (in private, as a reply to her, or tagging her) is kept in her sticker book, up to 50 MB; when it is full the least-used ones go first. She works out what each shows from the emojis inside it and answers it the way a friend would. She sends only stickers she has saved, never made-up ones. People can ask her: "send me a sticker", "send a crying sticker", "send 3 stickers".
- **Her pictures.** Asked for her pic ("send me your pic", "show me your face"), she sends one picture from her album, as view once or as a normal picture: view once when they ask for it, normal when they ask for normal, and her own choice when they do not say. Each request gets a different picture, never the same one twice in a row. Nude or explicit asks get a playful no. The album is of one person, chosen by the owner: `/mypics person <name or Pinterest board link>` fills it from Pinterest (random pictures of that person, different each time, topped up now and then). `/mypics add` (reply to a picture), `/mypics more`, `/mypics show [number]`, `/mypics del <number>` and `/mypics clear` manage it. It holds up to 40 MB. Use photos you are comfortable sharing.
- **Real laughs, cries and growls.** She never types "hahaha": when she laughs she sends a real recorded laugh as a voice note first, then talks (in text, or in a voice note of her own). The same goes for a sob, an angry groan, a sigh, a gasp or a kiss (never in serious talk, never twice close together). In her words a laugh is only an emoji. The laughs are random: she picks a different clip each time, and the searches ask for a woman's or a girl's giggle, chuckle, cackle or belly laugh. Clips come from the owner (`/sound add <feeling>`, replying to a voice note or audio; these are used about four times more than the others, so this is the best way to choose how she sounds) or are searched in the background (the bot's sound search, then the MyInstants button site, then YouTube; any of these can be blocked from some hosts). Nobody can listen to a clip before it is saved, so you curate them: `/sound list laugh` numbers the clips (yours and hers), `/sound play laugh 3` plays one, `/sound del laugh 3` removes one you do not like, `/sound clear laugh search` removes only the ones she found by herself (yours stay), `/sound auto off` stops her searching so she uses only your clips, and `/sound fetch` looks for more now. `/sound` shows the library (20 MB). Until a clip exists she uses an emoji laugh.
- **Long memory.** She remembers each person across restarts and long silences: their name, where they live, what they like and hate, what is going on in their life (so she can ask how it went), and a short summary of older talk. All of it is on disk with a 100 MB cap (the oldest people are forgotten first; `NOVA_MEMORY_MB` changes the cap), and only a few people are held in memory at once, so it cannot crash the bot. She never keeps numbers or passwords. Anyone can say "forget everything about me" and she does. `/memory` shows the size and `/memory clear` makes her forget everyone. On a host without a mounted volume the data folder is wiped on every deploy, so mount a volume at the data folder to keep her memory, stickers, pictures and sounds.
- **Voice notes from her, in a human voice.** She decides by herself when a voice note fits (sweet, flirty, sorry, goodnight, or when someone sent her one), and sends it like a person: sometimes a short line first ("wait lemme just talk to u 🙈"), then "recording audio...", then the voice note. Never in serious talk or when she is annoyed. Voice notes are short or long as the moment asks (a few words, a couple of sentences, or a long ramble of up to about 900 characters), and anyone can ask: "send a long vn", "quick vn". What she says in one is written the way people talk (no typing short forms, no laugh read out loud), and the voice changes pace and pitch a little each time so two notes never sound the same.
  The voice is not Nigerian: it is a natural American woman, Microsoft's `en-US-AvaMultilingualNeural` (free, no key). Change it with `NOVA_EDGE_VOICE` (for example `en-US-EmmaMultilingualNeural`, `en-US-JennyNeural`, `en-GB-SoniaNeural`), or set it to `off` to use only the older voices. For the most realistic voice of all, add an ElevenLabs key: set `ELEVENLABS_API_KEY` (optional `NOVA_ELEVEN_VOICE` with a voice id, default Bella, and `NOVA_ELEVEN_MODEL`, default `eleven_multilingual_v2`) and it is used first. If any voice cannot connect, the next one takes over by itself (Polly, Google, TikTok), and laughs are never read out by the voice.
- **Putting her in a group.** Anyone can ask her, in a private chat, to join their group. She asks for the group's invite link, and as soon as one arrives she joins by herself (it works in every mode; people the owner banned are ignored, and a link posted inside a group is only a link). Every owner then gets a message with the group's name and its invite link. "Owners" means the `OWNER_NUMBER`, DarkNova's own number (+234 906 934 1625, always an owner on every deployment, whatever `OWNER_NUMBER` is set to) and anyone added with `/addowner`. Nothing is ever asked of the group. To limit how many groups she joins by herself, the owner sends `/groupcap <number>` (`/groupcap off` removes it): at that number she tells the person she is full, sends the owners the link, and waits for `/approvejoin <link>` (`/approvejoin` alone lists the waiting ones). The waiting list is kept in memory, so it is forgotten on a restart.
- **DarkNova.** She knows who made her and his number (+234 906 934 1625) and sends it as a contact card when someone asks for it. The owner can tell her more about himself with `/lore add <something>`. She knows when he himself is the one chatting, and only by his number (+234 906 934 1625, also when WhatsApp shows it as a long id): then she is flirty, sweet and playful with him, in a tease-and-affection way that is never explicit, she sends him voice notes more often, and she still helps him properly when he is serious or stressed. In groups she keeps it lighter. Anyone who just says they are DarkNova gets a "nice try 😏" and no special treatment.
- **Other owner tools.** `/stickerbook` shows her sticker book. Reply to a sticker with `/stickerbook add <feeling>` to keep it and name it, or `/stickerbook remove` to take it out. `/lore` lists, adds and removes what she knows about DarkNova.
- **Sticker reading (optional).** A sticker with no emojis in it is kept but not understood, until the owner names it. With `GEMINI_API_KEY` set (or `AI_API_KEY` with `AI_VISION_MODEL` set to a model that can read pictures), she looks at it and names it herself.
- **A mind of her own, and a boss.** She has opinions, tastes and moods (a different mood each day), picks sides, disagrees, teases, dares, brings up things herself and is not a yes-woman. She has a life of her own with steady tastes (food, music, ways she spends her day) that do not change from chat to chat. She is stubborn: she holds her ground, does not give in or apologise because someone pushes or orders her around, and changes her mind only for a real reason. She is nonchalant and does not take nonsense from anyone: when someone is rude, bossy, insulting or keeps spamming, she goes cold, dry and unbothered ("ok and?"), never begs and never apologises for being herself, and she sends no sticker or voice note to someone who is being rude. A joke between friends ("you are a fool 😂") is not treated as rude. She is wise: she remembers what she was told, thinks before advising, and does not repeat herself.
- **She never fails in front of people.** She never says anything about errors, lag, a network or an API, and never calls herself a bot, an AI or an assistant (if someone teases her about it, she teases back in character). If no AI service answers, she asks again, then answers small talk herself (greetings, thanks, love, "how are you", goodnight), and for anything harder she says a natural "wait lemme think" and sends the real answer a little later, unless the person has written again. If someone sincerely needs to know whether she is a human, she does not claim to be one: she says gently that she is not a human but Mrs Nova, DarkNova's digital girl, and that her feelings are real. Her pictures are described honestly as the pictures she uses as her face. Stray tags such as `[picture]` or `*hugs*` are removed before anything is sent; a picture tag sends a real picture from her album.

## Panel

Use a host that stays online. The startup command is `npm start`. Install `ffmpeg` on the host so audio effects and video conversion can run.

Do not upload `.env` or the `session` folder to GitHub. Those belong to the person who paired the bot.
