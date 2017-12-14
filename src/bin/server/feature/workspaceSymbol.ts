import * as LSP from "vscode-languageserver-protocol";
import Session from "../session";
import * as support from "../support";

export default function(
  session: Session,
): LSP.RequestHandler<LSP.WorkspaceSymbolParams, LSP.SymbolInformation[], void> {
  return support.cancellableHandler(session, async (event, _token) => {
    return session.indexer.findSymbols({ name: { $regex: event.query } });
  });
}
