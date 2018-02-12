import * as LSP from "vscode-languageserver-protocol";
import { ISettings } from "../../../lib";
import capabilities from "../capabilities";
import Session from "../session";

export default function(
  session: Session,
): LSP.RequestHandler<LSP.InitializeParams, LSP.InitializeResult, LSP.InitializeError> {
  return async event => {
    (session.initConf as any) = event;
    session.settings.reason = ISettings.withDefaults({ reason: event.initializationOptions }).reason;
    await session.initialize();
    return { capabilities };
  };
}
