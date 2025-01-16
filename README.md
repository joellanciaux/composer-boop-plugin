# Composer Beep

A VS Code extension that plays a sound notification when you stop typing in Cursor's composer window.

## Features

- Plays a configurable sound when you stop typing in Cursor's composer
- Customizable delay time
- Multiple sound options
- Adjustable volume
- Works on macOS, Windows, and Linux

## Installation

1. Install from VS Code Marketplace
2. Or install the VSIX file manually:
   - Download the latest `.vsix` file from the releases
   - In VS Code, go to Extensions
   - Click "..." at the top and choose "Install from VSIX"

## Configuration

This extension can be configured through VS Code settings:

- `composerBeep.enabled`: Enable or disable the beep sound (default: true)
- `composerBeep.delayMs`: Delay in milliseconds before playing sound (default: 1000)
- `composerBeep.soundFile`: Choose the notification sound:
  - notification-bloop.wav
  - notification-click.wav
  - notification-pop.wav
- `composerBeep.volume`: Adjust sound volume from 0.0 to 1.0 (default: 1.0)

## Usage

1. Open Cursor
2. Start typing in the composer window
3. When you stop typing, you'll hear a notification sound after the configured delay

## Requirements

- VS Code 1.85.0 or higher
- Cursor installed

## Known Issues

- Volume control is not supported on Windows
- Some Linux distributions might require `paplay` or `aplay` to be installed

## Release Notes

### 0.0.1

Initial release:

- Basic sound notification functionality
- Configurable delay and sound options
- Volume control (macOS and Linux)

## Development

1. Clone the repository
2. Run `npm install`
3. Press F5 to start debugging
4. Make changes and test
5. Package with `npm run package`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
