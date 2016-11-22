import * as server from "vscode-languageserver";
import { types } from "../../shared";
import * as command from "../command";
import Session from "../session";

export default function(session: Session): server.RequestHandler<server.DocumentRangeFormattingParams, types.TextEdit[], void> {
  return async (event, token) => {
    const itxt = await command.getTextDocument(session, event.textDocument);
    const idoc = types.TextDocument.create(event.textDocument.uri, itxt.languageId, itxt.version, itxt.getText());
    if (token.isCancellationRequested) return [];
    const otxt = await command.getFormatted(session, idoc, event.range);
    if (token.isCancellationRequested) return [];
    if (otxt == null) return [];
    const edits: types.TextEdit[] = [];
    edits.push(types.TextEdit.replace(event.range, otxt));
    return edits;
  };
}
