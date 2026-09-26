# nova-public

Deploy this repo. Startup command: `npm start`

Do not put `rm` or `bash` in the startup command. This panel only runs commands from `/usr/local/bin`.

On start it copies `.env.example` to `.env` if needed, clears old update leftovers, fetches the private bot into `app/`, and runs it. `.env`, `session/`, and `data/` are not replaced on `/update`.
