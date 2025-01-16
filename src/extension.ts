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
    const content = doc.getText().toLowerCase();

    if (doc.languageId === "Log") {
      console.log("Skipping log document");
      return false;
    }

    return (
      scheme.includes("anysphere") ||
      uri.includes("anysphere") ||
      content.includes("anysphere") ||
      scheme.includes("cursor") ||
      content.includes("cursor")
    );
  }

  // Monitor text document changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const doc = event.document;
      if (isAnysphereDocument(doc)) {
        outputChannel.appendLine(`\n=== Anysphere Document Changed ===`);
        outputChannel.appendLine(`- URI: ${doc.uri.toString()}`);
        outputChannel.appendLine(`- Scheme: ${doc.uri.scheme}`);
        outputChannel.appendLine(`- Language ID: ${doc.languageId}`);

        event.contentChanges.forEach((change) => {
          if (change.text && change.text.trim()) {
            outputChannel.appendLine(`- Change Text: "${change.text}"`);
            outputChannel.appendLine(
              `- Change Range: ${JSON.stringify(change.range)}`
            );

            // Log the lines around the change for context
            const startLine = Math.max(0, change.range.start.line - 1);
            const endLine = Math.min(
              doc.lineCount - 1,
              change.range.end.line + 1
            );
            outputChannel.appendLine(`- Context:`);
            for (let i = startLine; i <= endLine; i++) {
              const line = doc.lineAt(i);
              outputChannel.appendLine(`  ${i}: ${line.text}`);
            }
          }
        });

        // Log some of the full content for context
        const fullContent = doc.getText();
        const contentPreview =
          fullContent.length > 500
            ? fullContent.substring(0, 500) + "..."
            : fullContent;
        outputChannel.appendLine(`- Full Content Preview:\n${contentPreview}`);
      }
    }),

    // Monitor when documents are opened
    vscode.workspace.onDidOpenTextDocument((doc) => {
      if (isAnysphereDocument(doc)) {
        outputChannel.appendLine(`\n=== Anysphere Document Opened ===`);
        outputChannel.appendLine(`- URI: ${doc.uri.toString()}`);
        outputChannel.appendLine(`- Scheme: ${doc.uri.scheme}`);
        outputChannel.appendLine(`- Language ID: ${doc.languageId}`);
        const content = doc.getText();
        const contentPreview =
          content.length > 500 ? content.substring(0, 500) + "..." : content;
        outputChannel.appendLine(`- Initial Content:\n${contentPreview}`);
      }
    }),

    // Monitor active editor changes
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && isAnysphereDocument(editor.document)) {
        const doc = editor.document;
        outputChannel.appendLine(`\n=== Anysphere Document Became Active ===`);
        outputChannel.appendLine(`- URI: ${doc.uri.toString()}`);
        outputChannel.appendLine(`- Scheme: ${doc.uri.scheme}`);
        outputChannel.appendLine(`- Language ID: ${doc.languageId}`);

        // Log visible content
        const visibleRanges = editor.visibleRanges;
        outputChannel.appendLine(`- Visible Ranges:`);
        visibleRanges.forEach((range) => {
          const visibleContent = doc.getText(range);
          outputChannel.appendLine(
            `  Range ${range.start.line}-${range.end.line}:\n${visibleContent}`
          );
        });
      }
    }),

    // Monitor when editors become visible
    vscode.window.onDidChangeVisibleTextEditors((editors) => {
      editors.forEach((editor) => {
        const doc = editor.document;
        if (isAnysphereDocument(doc)) {
          outputChannel.appendLine(
            `\n=== Anysphere Document Became Visible ===`
          );
          outputChannel.appendLine(`- URI: ${doc.uri.toString()}`);
          outputChannel.appendLine(`- Scheme: ${doc.uri.scheme}`);
          outputChannel.appendLine(`- Language ID: ${doc.languageId}`);
        }
      });
    })
  );
}

export function deactivate() {}
