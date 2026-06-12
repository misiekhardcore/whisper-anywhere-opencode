# whisper-anywhere-opencode

[opencode](https://opencode.ai) plugin for [whisper-anywhere](https://github.com/misiekhardcore/whisper-anywhere) voice dictation.

Hold your configured hotkey, speak, release — text appears directly in the opencode TUI chat input.

## Prerequisites

- [whisper-anywhere](https://github.com/misiekhardcore/whisper-anywhere) must be installed and working
- opencode must be installed

## Install

### Via npm (recommended)

```bash
npm install -g whisper-anywhere-opencode
```

Then add to your `opencode.json`:

```json
{
  "plugin": ["whisper-anywhere-opencode"]
}
```

### Via file copy (no npm needed)

```bash
git clone https://github.com/misiekhardcore/whisper-anywhere-opencode
mkdir -p ~/.config/opencode/plugins
cp whisper-anywhere-opencode/whisper-anywhere.ts ~/.config/opencode/plugins/
```

opencode auto-discovers plugins in `~/.config/opencode/plugins/` — no config changes needed.

## Usage

1. Start opencode — the plugin spawns `whisper-anywhere --stdout` automatically
2. Press your configured whisper-anywhere hotkey, speak, release
3. Transcribed text appears in the TUI chat input
4. Type `/voice` to toggle dictation on/off

## How it works

The plugin spawns `whisper-anywhere --stdout` as a child process. When you release the hotkey, whisper-anywhere writes `{"text": "..."}` as a JSON line to stdout. The plugin reads this line and injects the text into the opencode TUI via `client.tui.appendPrompt()`.

When the plugin is not loaded (opencode not running), whisper-anywhere falls back to ydotool for global hotkey typing.

## License

MIT
