import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Composer Beep extension is now active");

  // Create an output channel for logging
  const outputChannel = vscode.window.createOutputChannel("Cursor Monitor");
  outputChannel.show();
  outputChannel.appendLine("Cursor Monitor started");

  // Helper function to check if this is a Cursor composer document
  function isComposerDocument(doc: vscode.TextDocument): boolean {
    return doc.uri.scheme === "composer-code-block-anysphere";
  }

  // Monitor text document changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const doc = event.document;
      if (isComposerDocument(doc)) {
        outputChannel.appendLine(`\n=== Composer Document Changed ===`);
        outputChannel.appendLine(`- URI: ${doc.uri.toString()}`);
        outputChannel.appendLine(`- Language: ${doc.languageId}`);

        event.contentChanges.forEach((change) => {
          if (change.text && change.text.trim()) {
            outputChannel.appendLine(`- Content: "${change.text}"`);
            // Get the full document content after the change
            const fullContent = doc.getText();
            outputChannel.appendLine(`- Full Content: "${fullContent}"`);
            // Try to parse if it's code
            if (
              doc.languageId === "javascript" ||
              doc.languageId === "typescript"
            ) {
              try {
                // Just checking if it's valid JS/TS
                Function(`return ${fullContent}`);
                outputChannel.appendLine("- Valid code detected");
              } catch (error: any) {
                outputChannel.appendLine(
                  `- Invalid/incomplete code: ${
                    error?.message || "Unknown error"
                  }`
                );
              }
            }
          }
        });
      }
    }),

    // Monitor when composer documents are opened
    vscode.workspace.onDidOpenTextDocument((doc) => {
      if (isComposerDocument(doc)) {
        outputChannel.appendLine(`\n=== Composer Document Opened ===`);
        outputChannel.appendLine(`- URI: ${doc.uri.toString()}`);
        outputChannel.appendLine(`- Language: ${doc.languageId}`);
        outputChannel.appendLine(`- Initial Content: "${doc.getText()}"`);
      }
    }),

    // Monitor when composer becomes active
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && isComposerDocument(editor.document)) {
        outputChannel.appendLine(`\n=== Composer Became Active ===`);
        outputChannel.appendLine(`- URI: ${editor.document.uri.toString()}`);
        outputChannel.appendLine(`- Language: ${editor.document.languageId}`);
        outputChannel.appendLine(`- Content: "${editor.document.getText()}"`);
        // Log selection if any
        const selection = editor.selection;
        if (!selection.isEmpty) {
          const selectedText = editor.document.getText(selection);
          outputChannel.appendLine(`- Selected Text: "${selectedText}"`);
        }
      }
    })
  );
}

export function deactivate() {}
