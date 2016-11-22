import * as rpc from "vscode-jsonrpc";
import * as server from "vscode-languageserver";
import { merlin, types } from "../../shared";
import Session from "../session";

export default function(session: Session): server.RequestHandler<server.DocumentSymbolParams, types.SymbolInformation[], void> {
  return async (event, token) => {
    const request = merlin.Query.outline();
    const response = await session.merlin.query(request, event.textDocument, Infinity);
    if (token.isCancellationRequested) return [];
    if (response.class !== "return") return new rpc.ResponseError(-1, "onDocumentSymbol: failed", undefined);
    const symbols = merlin.Outline.intoCode(response.value, event.textDocument);
    return symbols;
  };
}
