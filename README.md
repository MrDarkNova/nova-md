# nova-public

Deploy **this** repo. It does not contain the bot source.

On start it clones the private bot into `app/` and runs it. `/update` later pulls new code only.

These are never replaced:

- `.env`
- `session/`
- `data/` (settings, prefix, welcome, anti flags)

## Host env

Copy `.env.example` to `.env`.

`GITHUB_TOKEN` must be a GitHub token that can read `MrDarkNova/nova-md`. A public repo cannot open a private one without it. Do not commit the token.

Start command: `npm start`

When the private bot is obfuscated later, this repo still only fetches that build. The readable source stays off this repo.
