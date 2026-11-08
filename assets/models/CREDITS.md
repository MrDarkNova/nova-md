# 3D model credits

The people, animals and cars in the game's pictures are baked from free game models. The bot draws them itself
(`src/lib/render3d.js`); nothing here is downloaded at run time.

- **Characters** (`male.*`, `female.*`) and **animals** (`pets.*`): Quaternius modular characters and animals, released
  under CC0 (public domain) - https://quaternius.com
- **Cars** (`cars.*`): "Generic passenger car pack", licensed CC BY 4.0. Credit is given here as the licence asks.
- Hats, glasses, chains, watches, bags, capes and robes are built in code from simple shapes (`src/lib/prims.js`).

The packs were made with the scripts in `tools/models/` (build time only, they need three.js and sharp; the bot does not).
