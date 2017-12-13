import * as LSP from "vscode-languageserver-protocol";
import { merlin } from "../../../lib";
import * as command from "../command";
import Session from "../session";
import * as support from "../support";

export default function(session: Session): LSP.RequestHandler<LSP.TextDocumentPositionParams, LSP.Location[], void> {
  return support.cancellableHandler(async (event, token) => {
    const occurrences = await command.getOccurrences(session, event, token);
    if (occurrences == null) {
      return [];
    }
    const highlights = occurrences.map(loc => {
      const uri = event.textDocument.uri;
      const range = merlin.Location.intoCode(loc);
      return LSP.Location.create(uri, range);
    });
    return highlights;
  });
}
