import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Cursor Beep extension is now active");

  let disposable = vscode.commands.registerCommand(
    "cursor-beep.interact",
    () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        // Get the current cursor position
        const position = editor.selection.active;

        // Get the current line text
        const line = editor.document.lineAt(position.line);

        // Show a message with the current line text
        vscode.window.showInformationMessage(`Current line: ${line.text}`);

        // Insert some text at the cursor position
        editor.edit((editBuilder) => {
          editBuilder.insert(position, "🎵");
        });
      } else {
        vscode.window.showWarningMessage("No active text editor found");
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
