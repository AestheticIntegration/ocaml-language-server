import * as server from "vscode-languageserver";
import { ISettings, merlin } from "../../../lib";
import capabilities from "../capabilities";
import Session from "../session";

export default function (session: Session): server.RequestHandler<server.InitializeParams, server.InitializeResult, server.InitializeError> {
  return async (event) => {
    (session.initConf as any) = event;
    session.settings.reason = event.initializationOptions ? event.initializationOptions : ISettings.defaults.reason;
    await session.initialize();
    const request = merlin.Sync.protocol.version.set(3);
    const response = await session.merlin.sync(request);
    if (response.class !== "return" || response.value.selected !== 3) {
      session.connection.dispose();
      throw new Error("onInitialize: failed to establish protocol v3");
    }
    return { capabilities };
  };
}
