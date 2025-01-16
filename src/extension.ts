import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Composer Beep extension is now active");

  // Create an output channel for logging
  const outputChannel = vscode.window.createOutputChannel("Composer Beep");
  outputChannel.show();
  outputChannel.appendLine("Composer Beep started");

  // Helper function to check if document is Anysphere-related
  function isAnysphereDocument(doc: vscode.TextDocument): boolean {
    const uri = doc.uri.toString().toLowerCase();
    const scheme = doc.uri.scheme.toLowerCase();

    if (doc.languageId === "Log") {
      return false;
    }

    return true;
  }

  // Monitor text document changes
  context.subscriptions.push(
    // Monitor status bar messages
    vscode.window.onDidChangeActiveTerminal(async (terminal) => {
      if (terminal) {
        outputChannel.appendLine(`\n=== Active Terminal Changed ===`);
        outputChannel.appendLine(`- Name: ${terminal.name}`);
        outputChannel.appendLine(
          `- Type: ${(await terminal.processId) ? "Process" : "Task"}`
        );
      }
    }),

    // Monitor progress notifications
    vscode.window.onDidChangeWindowState((e) => {
      outputChannel.appendLine(`\n=== Window State Changed ===`);
      outputChannel.appendLine(`- Focused: ${e.focused}`);
    }),

    // Monitor file system events
    vscode.workspace.onDidCreateFiles((e) => {
      outputChannel.appendLine(`\n=== Files Created ===`);
      e.files.forEach((file) => {
        outputChannel.appendLine(`- File: ${file.fsPath}`);
      });
    }),

    vscode.workspace.onDidDeleteFiles((e) => {
      outputChannel.appendLine(`\n=== Files Deleted ===`);
      e.files.forEach((file) => {
        outputChannel.appendLine(`- File: ${file.fsPath}`);
      });
    }),

    vscode.workspace.onDidRenameFiles((e) => {
      outputChannel.appendLine(`\n=== Files Renamed ===`);
      e.files.forEach((file) => {
        outputChannel.appendLine(`- Old: ${file.oldUri.fsPath}`);
        outputChannel.appendLine(`- New: ${file.newUri.fsPath}`);
      });
    }),

    // Monitor diagnostics changes
    vscode.languages.onDidChangeDiagnostics((e) => {
      outputChannel.appendLine(`\n=== Diagnostics Changed ===`);
      e.uris.forEach((uri) => {
        outputChannel.appendLine(`- URI: ${uri.toString()}`);
        const diagnostics = vscode.languages.getDiagnostics(uri);
        outputChannel.appendLine(`- Count: ${diagnostics.length}`);
      });
    }),

    // Monitor tree view visibility
    vscode.window.onDidChangeVisibleTextEditors((editors) => {
      outputChannel.appendLine(`\n=== Visible Editors Changed ===`);
      editors.forEach((editor) => {
        outputChannel.appendLine(`- URI: ${editor.document.uri.toString()}`);
        outputChannel.appendLine(`- ViewColumn: ${editor.viewColumn}`);
      });
    }),

    // Monitor when VS Code's UI state changes
    vscode.window.onDidChangeTextEditorViewColumn((e) => {
      outputChannel.appendLine(`\n=== Editor View Column Changed ===`);
      outputChannel.appendLine(
        `- Editor: ${e.textEditor.document.uri.toString()}`
      );
      outputChannel.appendLine(`- New Column: ${e.viewColumn}`);
    }),

    // Monitor terminal data
    vscode.window.onDidChangeTerminalState((terminal) => {
      outputChannel.appendLine(`\n=== Terminal State Changed ===`);
      outputChannel.appendLine(`- Name: ${terminal.name}`);
    }),

    // Monitor configuration changes
    vscode.workspace.onDidChangeConfiguration((e) => {
      outputChannel.appendLine(`\n=== Configuration Changed ===`);
      if (e.affectsConfiguration("cursorai")) {
        outputChannel.appendLine("- Cursor configuration changed");
      }
    }),

    // Monitor webview panel state
    vscode.window.onDidChangeActiveColorTheme((e) => {
      outputChannel.appendLine(`\n=== Theme Changed ===`);
      outputChannel.appendLine(`- Kind: ${e.kind}`);
    }),

    // Monitor commands being executed
    vscode.commands.registerCommand("*", (command: string) => {
      outputChannel.appendLine(`\n=== Command Executed ===`);
      outputChannel.appendLine(`- Command: ${command}`);
      return undefined;
    }),

    // Monitor text document changes
    vscode.workspace.onDidChangeTextDocument((event) => {
      const doc = event.document;
      if (isAnysphereDocument(doc)) {
        outputChannel.appendLine(`\n=== Document Changed ===`);
        outputChannel.appendLine(`- URI: ${doc.uri.toString()}`);
        outputChannel.appendLine(`- Scheme: ${doc.uri.scheme}`);
        outputChannel.appendLine(`- Language ID: ${doc.languageId}`);

        event.contentChanges.forEach((change) => {
          if (change.text && change.text.trim()) {
            outputChannel.appendLine(`- Change Text: "${change.text}"`);
            outputChannel.appendLine(
              `- Change Range: ${JSON.stringify(change.range)}`
            );
          }
        });
      }
    }),

    // Monitor when documents are opened
    vscode.workspace.onDidOpenTextDocument((doc) => {
      if (isAnysphereDocument(doc)) {
        outputChannel.appendLine(`\n=== Document Opened ===`);
        outputChannel.appendLine(`- URI: ${doc.uri.toString()}`);
        outputChannel.appendLine(`- Scheme: ${doc.uri.scheme}`);
        outputChannel.appendLine(`- Language ID: ${doc.languageId}`);
      }
    }),

    // Monitor active editor changes
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && isAnysphereDocument(editor.document)) {
        const doc = editor.document;
        outputChannel.appendLine(`\n=== Editor Became Active ===`);
        outputChannel.appendLine(`- URI: ${doc.uri.toString()}`);
        outputChannel.appendLine(`- Scheme: ${doc.uri.scheme}`);
        outputChannel.appendLine(`- Language ID: ${doc.languageId}`);
      }
    }),

    // Monitor editor selections
    vscode.window.onDidChangeTextEditorSelection((e) => {
      if (isAnysphereDocument(e.textEditor.document)) {
        outputChannel.appendLine(`\n=== Selection Changed ===`);
        outputChannel.appendLine(
          `- URI: ${e.textEditor.document.uri.toString()}`
        );
        outputChannel.appendLine(
          `- Selections: ${e.selections
            .map(
              (s) =>
                `[${s.start.line},${s.start.character}]-[${s.end.line},${s.end.character}]`
            )
            .join(", ")}`
        );
      }
    }),

    // Monitor editor visible ranges
    vscode.window.onDidChangeTextEditorVisibleRanges((e) => {
      if (isAnysphereDocument(e.textEditor.document)) {
        outputChannel.appendLine(`\n=== Visible Ranges Changed ===`);
        outputChannel.appendLine(
          `- URI: ${e.textEditor.document.uri.toString()}`
        );
        outputChannel.appendLine(
          `- Ranges: ${e.visibleRanges
            .map((r) => `[${r.start.line}-${r.end.line}]`)
            .join(", ")}`
        );
      }
    }),

    // Monitor file system watcher events
    vscode.workspace
      .createFileSystemWatcher("**/*", true, false, true)
      .onDidChange((uri) => {
        outputChannel.appendLine(
          `\n=== File Changed (via FileSystemWatcher) ===`
        );
        outputChannel.appendLine(`- URI: ${uri.toString()}`);
      })
  );

  // Register a status bar item to monitor clicks
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  statusBarItem.text = "Cursor Monitor";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

export function deactivate() {}
