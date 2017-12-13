import * as LSP from "vscode-languageserver-protocol";
import { parser } from "../../../lib";
import * as command from "../command";
import Session from "../session";
import * as support from "../support";

export default function(session: Session): LSP.RequestHandler<LSP.TextDocumentPositionParams, LSP.Hover, void> {
  return support.cancellableHandler(async (event, token) => {
    const position = { position: event.position, uri: event.textDocument.uri };
    const word = await command.getWordAtPosition(session, position);
    const markedStrings: LSP.MarkedString[] = [];
    const itemTypes = await command.getType(session, event, token);
    const itemDocs = await command.getDocumentation(session, token, event);
    for (const { type: value } of itemTypes) {
      let language = "plaintext";
      if (/\.mli?/.test(event.textDocument.uri)) {
        language = "ocaml.hover.type";
      }
      if (/\.rei?/.test(event.textDocument.uri)) {
        language = /^[A-Z]/.test(word) ? "reason.hover.signature" : "reason.hover.type";
      }
      markedStrings.push({ language, value });
      if (itemDocs && !parser.ocamldoc.ignore.test(itemDocs)) {
        markedStrings.push(parser.ocamldoc.intoMarkdown(itemDocs));
      }
    }
    return { contents: markedStrings };
  });
}
