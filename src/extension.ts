import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Composer Beep extension is now active");

  // Create an output channel for logging
  const outputChannel = vscode.window.createOutputChannel("Cursor Monitor");
  outputChannel.show();
  outputChannel.appendLine("Cursor Monitor started");

  // Log Cursor-related extensions
  const cursorExts = vscode.extensions.all.filter(
    (ext) => ext.id.includes("cursor") || ext.id.includes("anysphere")
  );
  outputChannel.appendLine("\nActive Cursor Extensions:");
  cursorExts.forEach((ext) => {
    outputChannel.appendLine(`- ${ext.id}`);
    // Log any exposed commands from these extensions
    const pkg = ext.packageJSON;
    if (pkg.contributes && pkg.contributes.commands) {
      pkg.contributes.commands.forEach((cmd: any) => {
        outputChannel.appendLine(`  Command: ${cmd.command}`);
      });
    }
  });

  // Monitor shadow workspace changes
  const fileSystemWatcher = vscode.workspace.createFileSystemWatcher(
    "**/.shadow-workspace/**"
  );

  fileSystemWatcher.onDidCreate((uri) => {
    outputChannel.appendLine(`\nShadow workspace file created: ${uri.fsPath}`);
  });

  fileSystemWatcher.onDidChange((uri) => {
    outputChannel.appendLine(`\nShadow workspace file changed: ${uri.fsPath}`);
  });

  // Monitor webview panel creation and visibility changes
  context.subscriptions.push(
    vscode.window.onDidChangeVisibleTextEditors((editors) => {
      editors.forEach((editor) => {
        const doc = editor.document;
        if (
          doc.uri.scheme === "vscode-webview" ||
          doc.fileName.includes("Cursor") ||
          doc.fileName.includes(".shadow-workspace")
        ) {
          outputChannel.appendLine(
            `\nCursor-related editor became visible: ${doc.uri.toString()}`
          );
        }
      });
    }),

    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        const doc = editor.document;
        if (
          doc.uri.scheme === "vscode-webview" ||
          doc.fileName.includes("Cursor") ||
          doc.fileName.includes(".shadow-workspace")
        ) {
          outputChannel.appendLine(
            `\nSwitched to Cursor-related editor: ${doc.uri.toString()}`
          );
          // Try to capture the content
          outputChannel.appendLine(
            `Content preview: ${doc.getText().substring(0, 100)}...`
          );
        }
      }
    }),

    // Monitor text changes in any Cursor-related documents
    vscode.workspace.onDidChangeTextDocument((event) => {
      const doc = event.document;
      if (
        doc.uri.scheme === "vscode-webview" ||
        doc.fileName.includes("Cursor") ||
        doc.fileName.includes(".shadow-workspace")
      ) {
        outputChannel.appendLine(
          `\nChanges in Cursor-related document: ${doc.uri.toString()}`
        );
        event.contentChanges.forEach((change) => {
          outputChannel.appendLine(`Change: "${change.text}"`);
        });
      }
    }),

    fileSystemWatcher
  );
}

export function deactivate() {}
