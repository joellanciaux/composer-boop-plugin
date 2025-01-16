import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Cursor Beep extension is now active");

  // Create an output channel for logging
  const outputChannel = vscode.window.createOutputChannel(
    "Cursor Command Monitor"
  );
  outputChannel.show();
  outputChannel.appendLine("Cursor Command Monitor started");

  // Log all available commands on startup
  vscode.commands.getCommands(true).then((commands) => {
    const cursorCommands = commands.filter((cmd) => cmd.includes("cursorai"));
    outputChannel.appendLine("Available Cursor commands:");
    cursorCommands.forEach((cmd) => outputChannel.appendLine(`- ${cmd}`));
    outputChannel.appendLine(`Total commands: ${commands.length}`);
  });

  // Monitor all command executions
  const commandListener = vscode.commands.registerCommand(
    "*",
    async (command: string, ...args: any[]) => {
      console.log("Command executed:", command);
      if (command.includes("cursorai")) {
        const info = {
          timestamp: new Date().toISOString(),
          command,
          args: args.length ? JSON.stringify(args) : "none",
          activeFile:
            vscode.window.activeTextEditor?.document.fileName || "none",
        };

        outputChannel.appendLine(`\nCommand Executed:`);
        Object.entries(info).forEach(([key, value]) => {
          outputChannel.appendLine(`${key}: ${value}`);
        });
      }
      return undefined;
    }
  );

  // Monitor text changes in the editor
  const textChangeListener = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      const doc = event.document;
      console.log("Text changed in:", doc.fileName);
      if (doc.fileName.includes("Cursor") || doc.uri.scheme === "output") {
        outputChannel.appendLine(`\nText changed in: ${doc.fileName}`);
        event.contentChanges.forEach((change) => {
          outputChannel.appendLine(`Change: "${change.text}"`);
        });
      }
    }
  );

  context.subscriptions.push(commandListener, textChangeListener);
}

export function deactivate() {}
