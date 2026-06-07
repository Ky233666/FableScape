# Web Mobile QA Workflow

This project targets Cocos Creator Web Mobile H5. Use this workflow after building or previewing the game.

## Installed Codex Skill

The `playwright` Codex skill has been installed locally at:

```text
C:\Users\KangYun\.codex\skills\playwright
```

Restart Codex to make the skill available in future sessions.

## What To Check

- The game opens in a 9:16 mobile viewport.
- Title page story catalog is selectable.
- `结局图鉴` opens and closes correctly.
- A full 5-round playthrough reaches an ending.
- After tapping `开始体验`, a soft confirmation sound plays and the ambient BGM fades in. Browser/site audio must be unmuted.
- Each choice updates status bars, scene visuals, feedback text, mechanism explanation, and tokens.
- Each configured `soundCue` produces an audible response even when no imported `AudioClip` assets are bound.
- Ending page tabs work: `概念结果`, `隐喻轨迹`, `概念自检`.
- `回到转折点` returns to the last decision point with previous state preserved.

## Type Check

```powershell
.\tools\check-cocos-types.ps1
```

## Browser QA After Web Mobile Build

Build from Cocos Creator as `Web Mobile`, then serve the build directory with any static server. Example:

```powershell
npx http-server .\build\web-mobile -p 4173
```

After restarting Codex, use the installed `playwright` skill to open and screenshot:

```powershell
$env:CODEX_HOME="$HOME\.codex"
$env:PWCLI="$env:CODEX_HOME\skills\playwright\scripts\playwright_cli.sh"
```

On Windows PowerShell, if the shell wrapper is not directly runnable, use the skill instructions and fall back to:

```powershell
npx playwright-cli open http://127.0.0.1:4173 --viewport-size=390,844
npx playwright-cli screenshot
```

Store screenshots outside generated Cocos folders unless they are meant to be committed.
