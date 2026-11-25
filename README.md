# Bully Escape

A spooky 3D stealth and fighting game. Sneak through the school, hide in lockers and under desks, escape the bullies, and beat each bully in a playground fight.

- 24 levels: 1-5, 6-11, 12-17 and 18-23, each followed by a boss fight, then a final escape (level 24) with 24 bullies in a long maze
- First/third-person 3D hallways built with [three.js](https://threejs.org) (r128)
- Touch controls: joystick on the left, HIDE button on the right (PUNCH and KICK in fights), swipe to look around
- Keyboard: WASD move, arrow keys turn, Space hide, J punch, K kick

## Project layout

```
www/                 the game (this is the whole app)
  index.html
  css/style.css
  js/game.js         all game code
  assets/            bully pictures, logo, music
  lib/               three.js (created by npm install)
assets/              icon / splash sources and the original character art
android-res/         ready-made Android launcher icons
store/               Google Play icon, feature graphic and listing text
scripts/              vendor.js (copies three.js) and setup-android.js
capacitor.config.json  Android app settings
.github/workflows/pages.yml  publishes the web version on GitHub Pages
```

## 1. Play it on your computer

The game must be served over http (it can't be opened by double-clicking index.html).

```bash
npm install
npm start
```

Then open the address it prints. (No Node? `cd www && python3 -m http.server 8000` also works and uses the three.js CDN.)

## 2. Put it on GitHub

```bash
git init
git add .
git commit -m "Bully Escape"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/bully-escape.git
git push -u origin main
```

To get a playable web link: on GitHub go to **Settings > Pages > Build and deployment > Source: GitHub Actions**. The included workflow publishes the `www` folder every time you push to `main`.

## 3. Android app, ready for Google Play

The Android launcher icons are already made and sit in `android-res/` (all sizes, round and adaptive versions). One command builds the Android project and puts them in place.

You need: Node 20+ (22 recommended), [Android Studio](https://developer.android.com/studio) and Java 17+.

```bash
npm install
npm run android:setup     # creates android/, installs the icons, copies the game in
npm run open              # opens Android Studio
```

After any change to the game, run `npm run sync` and rebuild.

### Make the release file (.aab)
1. In Android Studio choose **Build > Generate Signed App Bundle / APK > Android App Bundle**.
2. Create a new keystore (**Create new...**). **Back up the keystore file and its passwords** - if you lose it you can't update your app. The repo ignores `*.keystore` and `*.jks` on purpose, so never commit them.
3. Choose the **release** build and finish. The file ends up in `android/app/release/app-release.aab`.
4. Upload it in Google Play Console (turn on Play App Signing when asked).

### Things to check
- **Target API level:** Google requires new apps to target a recent Android version. The `latest` Capacitor packages normally do. If Play Console complains, update `targetSdkVersion` in `android/variables.gradle` and run `npm i @capacitor/core@latest @capacitor/android@latest`.
- **App id:** `com.bullyescape.game` (in `capacitor.config.json`). Change it before your first upload - it can't change after.
- **Version:** raise `versionCode` (and `versionName`) in `android/app/build.gradle` for every update you upload.
- **Privacy policy:** fill in `[DATE]` and `[YOUR EMAIL]` in `www/privacy.html`; once GitHub Pages is on, it is at `https://YOUR-NAME.github.io/bully-escape/privacy.html`.
- The store texts, the 512x512 icon and the 1024x500 feature graphic are in `store/` (see `store/listing.md` for the full checklist).

## Artwork and music

The five characters (the nerd and four bullies) were created for this game and the originals (SVG and PNG) are in `assets/characters/`. The music track is `www/assets/music.mp3` (Apex_Pressure) - make sure you have the rights to publish it in an app.

## Editing tips

- Change bully counts, level lengths and speeds in `startLevel()` in `www/js/game.js`.
- Change the level rounds with the `BLK` list near `startLevel()`.
- Fight difficulty is in `startFight()` and the boss AI inside `update()` (search for `f.i`).
- Swap characters by replacing `www/assets/bully1.png` ... `bully4.png`, `hero_front.png` (fight) and `hero_back.png` (hallway view). Keep the file names; use transparent backgrounds and full-body, front-facing art.
