"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  // applied from https://github.com/wmaurer/vscode-jumpy/blob/master/src/jumpy-vscode.ts#L95
  function getSvgDataUri(code: string) {
    const dec = {
      fontSize: 14,
      bgColor: "purple",
      fgColor: "white",
      fontFamily: "sans-serif"
    };
    const width = dec.fontSize;

    // prettier-ignore
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${10+dec.fontSize}" height="${dec.fontSize}" width="${width}">`;
    // prettier-ignore
    svg += `<rect width="${width}" height="${dec.fontSize+2}" rx="2" ry="2" style="fill: ${dec.bgColor}; stroke: ${dec.fgColor}; stroke-width: 1"></rect>`;
    // prettier-ignore
    svg += `<text font-family="${dec.fontFamily}" font-size="${dec.fontSize}px" textLength="${width - 2}" textAdjust="spacing" fill="${dec.fgColor}" x="3" y="${dec.fontSize - 1}" alignment-baseline="baseline">`;
    svg += code;
    svg += `</text>`;
    svg += `</svg>`;

    return vscode.Uri.parse(`data:image/svg+xml;utf8,${svg}`);
  }

  // decorations, based on configuration
  const editorConfig = vscode.workspace.getConfiguration("editor");
  const fontSize = (editorConfig.get<number>("fontSize") || 16) - 1;

  const width = fontSize + 6;
  const left = -width;
  type Svgs = { [key: string]: vscode.Uri };
  const svgs: Svgs = {};

  for (const text of ["2", "3", "4", "5", "6", "7", "8", "9", "*"]) {
    svgs[text] = getSvgDataUri(text);
  }
  const decotype = vscode.window.createTextEditorDecorationType({
    after: {
      margin: `0 0 0 ${left}px`,
      height: "16px",
      width: `${width}px`
    }
  });

  vscode.window.onDidChangeTextEditorSelection(e => {
    // console.log("did change selection!", e.selections);
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      if (e.selections.length > 1) {
        const contentIconPath = getSvgDataUri(
          e.selections.length > 9 ? "*" : "" + e.selections.length
        );
        editor.setDecorations(
          decotype,
          e.selections.map(s => ({
            range: new vscode.Range(s.start, s.end),
            renderOptions: {
              after: { contentIconPath }
            }
          }))
        );
      } else {
        editor.setDecorations(decotype, []);
      }
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
