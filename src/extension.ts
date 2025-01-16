import * as vscode from "vscode";
import * as path from "path";
import { exec } from "child_process";
import { platform } from "os";

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

  // Function to play sound using system audio
  async function playBeep() {
    const soundFilePath = path.join(
      context.extensionPath,
      "media",
      "notification-bloop.wav"
    );

    // Different commands for different operating systems
    let command = "";
    switch (platform()) {
      case "darwin":
        command = `afplay "${soundFilePath}"`;
        break;
      case "win32":
        command = `powershell -c (New-Object Media.SoundPlayer '${soundFilePath}').PlaySync()`;
        break;
      default: // Linux
        command = `paplay "${soundFilePath}" || aplay "${soundFilePath}"`;
        break;
    }

    return new Promise<void>((resolve, reject) => {
      exec(command, (error) => {
        if (error) {
          outputChannel.appendLine(`Error playing sound: ${error.message}`);
          reject(error);
        } else {
          resolve();
        }
      });
    });
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
          playBeep().catch((error) => {
            outputChannel.appendLine(`Failed to play sound: ${error.message}`);
          });
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
