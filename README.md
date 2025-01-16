# Cursor Beep

A VS Code extension that interacts with the cursor composer text box.

## Features

- Adds a command to interact with the cursor position
- Displays the current line text
- Inserts a musical note emoji at the cursor position

## Installation

1. Clone this repository
2. Run `npm install`
3. Press F5 to start debugging

## Usage

1. Open the command palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type "Interact with Cursor Composer" and select the command
3. The extension will show the current line text and insert a musical note emoji at the cursor position

## Requirements

- VS Code 1.85.0 or higher

## Development

- Run `npm run watch` to start the compiler in watch mode
- Press F5 to open a new window with your extension loaded
- Run your command from the command palette by pressing (Ctrl+Shift+P or Cmd+Shift+P)
- Set breakpoints in your code inside `src/extension.ts` to debug your extension
