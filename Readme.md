# PASS IT! 🎮

**[Play it now](https://pass-it-five.vercel.app/)**

A pass-and-play party game for 2–8 people sharing one phone. No app to install, no account to make, no wifi required once the page has loaded.

## How it works

Everyone crowds around one phone. The game picks a player, passes go around the group, and each turn drops that player into a quick 10–30 second challenge: react to a flash, guess how a friend answered, repeat a color sequence, or get voted on by the group. Points add up over a set number of rounds, and the game ends with a leaderboard plus a few fitting titles: Winner, Clown, Tryhard, Menace, and the one nobody wants, Most Useless Player.

## Mini-games

- **Reaction Tap**: wait for the flash, tap as fast as you can. Tap early and you get nothing.
- **Quick Fire**: pick one of two options under pressure.
- **Memory Sequence**: watch a pattern, repeat it back, and see how long you can keep it going.
- **Group Vote**: the phone gets passed around so everyone can vote yes or no on a prompt about the current player.

## Running it locally

The game is plain HTML, CSS, and JavaScript with no build step, but it's loaded as ES modules, so it needs to be served over HTTP rather than opened directly as a file.

```bash
npx serve .
```

Then open the local address it gives you. Any static file server works the same way.

## Deploying

This is a static site, so it deploys the same way to either:

- **Vercel**: import the repo, set the framework preset to "Other," and leave the build command empty.
- **GitHub Pages**: point Pages at the repo root or `main` branch.

No environment variables, no backend, nothing to configure.

## Installing it as an app

The site ships with a web manifest and icon set, so on a phone you can add it to the home screen (Chrome: menu → "Add to Home screen"; Safari: share → "Add to Home Screen") and it opens full-screen with its own icon, no browser chrome. Handy since this is the kind of game that gets replayed with a different group every time.

## Project structure

```
index.html
manifest.webmanifest
icons/
  icon.svg
  icon-192.png
  icon-512.png
  apple-touch-icon.png
css/
  main.css
js/
  app.js              entry point, wires the screens together
  game-state.js        turn order, scoring, match log
  players.js            setup screen, name entry, localStorage
  ui.js                  pass screen, score reveal
  scoring.js             final ranking
  titles.js              end-of-match title assignment
  results.js             leaderboard screen
  challenges/
    index.js             picks the next mini-game, no repeats until the pool cycles
    reaction-tap.js
    quick-fire.js
    memory-sequence.js
    group-vote.js
```

Each mini-game is its own file with the same interface, `mount(container, player, onComplete)`, so adding a new one later doesn't touch the rest of the game.

## What's saved between games

Just the last set of player names, so you don't have to retype them for round two. Nothing else persists: no accounts, no server, no tracking.

## License

MIT
