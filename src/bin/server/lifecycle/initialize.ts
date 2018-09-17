import { execSync } from "child_process";
import * as LSP from "vscode-languageserver-protocol";
import { ISettings } from "../../../lib";
import capabilities from "../capabilities";
import Session from "../session";

export default function(
  session: Session,
): LSP.RequestHandler<LSP.InitializeParams, LSP.InitializeResult, LSP.InitializeError> {
  return async event => {
    const overrides: typeof ISettings.defaults.reason | undefined | null = event.initializationOptions;
    (session.initConf as any) = event;
    session.settings.reason = ISettings.withDefaults(overrides);
    const opamCmd = execSync(`command -v ${session.settings.reason.path.opam} 2>&1 || echo >&2 ""`).toString();
    if (opamCmd === "") {
      session.hasOpam = undefined;
    } else {
      const version = execSync(`${session.settings.reason.path.opam} --version`).toString();
      session.hasOpam = version.substring(0, 1);
    }
    await session.initialize();
    return { capabilities };
  };
}
