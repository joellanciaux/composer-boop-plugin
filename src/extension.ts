import * as vscode from "vscode";
import * as path from "path";
import { exec } from "child_process";
import { platform } from "os";

export function activate(context: vscode.ExtensionContext) {
  console.log("Composer Beep extension is now active");

  // Create an output channel for logging
  const outputChannel = vscode.window.createOutputChannel("Composer Beep");

  // Only show output channel when debugging
  if (process.env.VSCODE_DEBUG_MODE === "true") {
    outputChannel.show();
  }

  outputChannel.appendLine("Composer Beep started");

  // Helper function to check if document is a composer code block
  function isComposerCodeBlock(doc: vscode.TextDocument): boolean {
    return doc.uri.scheme === "composer-code-block-anysphere";
  }

  // Helper function to get current configuration
  function getConfig() {
    const config = vscode.workspace.getConfiguration("composerBeep");
    return {
      enabled: config.get<boolean>("enabled", true),
      delayMs: config.get<number>("delayMs", 1000),
      soundFile: config.get<string>("soundFile", "notification-bloop.wav"),
      volume: config.get<number>("volume", 1.0),
    };
  }

  // Create a debounced timer
  let debounceTimer: NodeJS.Timeout | undefined;

  // Function to play sound using system audio
  async function playBeep() {
    const config = getConfig();
    if (!config.enabled) {
      outputChannel.appendLine("Beep is disabled in settings");
      return;
    }

    const soundFilePath = path.join(
      context.extensionPath,
      "media",
      config.soundFile
    );

    // Different commands for different operating systems
    let command = "";
    switch (platform()) {
      case "darwin":
        // On macOS, afplay supports volume control (0 to 255)
        const macVolume = Math.floor(config.volume * 255);
        command = `afplay -v ${macVolume / 255} "${soundFilePath}"`;
        break;
      case "win32":
        command = `powershell -c (New-Object Media.SoundPlayer '${soundFilePath}').PlaySync()`;
        break;
      default: // Linux
        // On Linux, paplay supports volume (0 to 65536)
        const linuxVolume = Math.floor(config.volume * 65536);
        command = `paplay --volume=${linuxVolume} "${soundFilePath}" || aplay "${soundFilePath}"`;
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

        // Get current delay from settings
        const { delayMs } = getConfig();

        // Set new timer
        debounceTimer = setTimeout(() => {
          outputChannel.appendLine(
            `No changes for ${delayMs}ms - Playing sound`
          );
          playBeep().catch((error) => {
            outputChannel.appendLine(`Failed to play sound: ${error.message}`);
          });
        }, delayMs);
      }
    }),

    // Monitor configuration changes
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("composerBeep")) {
        const config = getConfig();
        outputChannel.appendLine("\n=== Configuration Changed ===");
        outputChannel.appendLine(`- Enabled: ${config.enabled}`);
        outputChannel.appendLine(`- Delay: ${config.delayMs}ms`);
        outputChannel.appendLine(`- Sound: ${config.soundFile}`);
        outputChannel.appendLine(`- Volume: ${config.volume}`);
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
