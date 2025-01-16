import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Composer Beep extension is now active");

  // Create an output channel for logging
  const outputChannel = vscode.window.createOutputChannel("Composer Beep");
  outputChannel.show();
  outputChannel.appendLine("Composer Beep started");

  // Helper function to check if document is a composer code block
  function isComposerCodeBlock(doc: vscode.TextDocument): boolean {
    return doc.uri.scheme === "composer-code-block-anysphere";
  }

  // Create a debounced timer
  let debounceTimer: NodeJS.Timeout | undefined;

  // Function to play sound using the terminal
  async function playBeep() {
    // Use the terminal bell character to make a sound
    const terminal =
      vscode.window.terminals[0] ||
      (await vscode.window.createTerminal("beep"));
    terminal.sendText("\u0007", false); // Send bell character
    // Hide the terminal after beeping
    terminal.hide();
  }

  // Monitor text document changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const doc = event.document;
      if (isComposerCodeBlock(doc)) {
        outputChannel.appendLine(`\n=== Composer Code Block Changed ===`);
        outputChannel.appendLine(`- URI: ${doc.uri.toString()}`);

        // Clear existing timer
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        // Set new timer
        debounceTimer = setTimeout(() => {
          outputChannel.appendLine("No changes for 1 second - Playing sound");
          playBeep();
        }, 1000);
      }
    })
  );

  // Clean up on deactivate
  context.subscriptions.push({
    dispose: () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    },
  });
}

export function deactivate() {}
