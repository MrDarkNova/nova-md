# nova-public

Deploy **this** repo. It does not contain the bot source.

On start it clones the private bot into `app/` using `GITHUB_DEPLOY_KEY` and runs it. `/update` later pulls new code only.

These are never replaced:

- `.env`
- `session/`
- `data/` (settings, prefix, welcome, anti flags)

The key in `.env.example` is read-only for `MrDarkNova/nova-md`. Copy `.env.example` to `.env` on the host.

Start command: `npm start`
