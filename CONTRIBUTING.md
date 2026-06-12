# Contributing

## How to contribute

- **Issues**: Open a GitHub issue for bugs, feature requests, or questions.
- **PRs**: Fork the repo, create a feature branch, and open a pull request.
- **Code style**: Follow the existing style — keep it simple.

## Development

The plugin is a single TypeScript file. It uses the `@opencode-ai/plugin` package for type definitions.

To test locally:

```bash
cp whisper-anywhere.ts ~/.config/opencode/plugins/
# launch opencode and /voice toggle
```

To test changes, edit the plugin file and restart opencode.

## Release

No build step — just push changes. Users pull the latest version.

## Related repositories

- [whisper-anywhere](https://github.com/misiekhardcore/whisper-anywhere) — the voice dictation daemon this plugin depends on
