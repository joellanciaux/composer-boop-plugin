import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Cursor Beep extension is now active");

  // Log all available commands
  vscode.commands.getCommands(true).then((commands) => {
    console.log(
      "Available commands:",
      commands.filter((cmd) => cmd.includes("cursor"))
    );
  });

  // Register a command to try to accept changes
  let acceptCommand = vscode.commands.registerCommand(
    "cursor-beep.accept",
    async () => {
      try {
        // Try different possible command IDs that Cursor might use
        const possibleCommands = [
          "cursor.acceptChanges",
          "cursor.accept",
          "cursorAccept",
          "acceptChanges",
        ];

        for (const cmd of possibleCommands) {
          try {
            await vscode.commands.executeCommand(cmd);
            console.log(`Successfully executed command: ${cmd}`);
          } catch (e) {
            console.log(`Failed to execute command: ${cmd}`, e);
          }
        }
      } catch (error) {
        console.error("Error executing accept command:", error);
      }
    }
  );

  // Watch for command execution
  let cmdListener = vscode.commands.registerCommand("*", (command) => {
    if (command.includes("cursor") || command.includes("accept")) {
      console.log("Intercepted command:", command);
    }
  });

  // Original interact command
  let interactCommand = vscode.commands.registerCommand(
    "cursor-beep.interact",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const position = editor.selection.active;
        const line = editor.document.lineAt(position.line);
        vscode.window.showInformationMessage(`Current line: ${line.text}`);
        editor.edit((editBuilder) => {
          editBuilder.insert(position, "🎵");
        });
      } else {
        vscode.window.showWarningMessage("No active text editor found");
      }
    }
  );

  context.subscriptions.push(acceptCommand, cmdListener, interactCommand);
}

export function deactivate() {}
