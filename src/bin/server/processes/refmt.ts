import { ChildProcess } from "child_process";
import * as LSP from "vscode-languageserver-protocol";
import Session from "../session";

export default class ReFMT {
  public readonly process: ChildProcess;
  constructor(session: Session, id?: LSP.TextDocumentIdentifier, argsOpt?: string[]) {
    const uri = id ? id.uri : ".re";
    const command = session.settings.reason.path.refmt;

    const width = session.settings.reason.format.width;
    const widthArg = width === null ? [] : ["--print-width", `${width}`];

    const [cmd, cmdArgs] = session.makeOpamCmd(command);
    const args = argsOpt || ["--parse", "re", "--print", "re", "--interface", `${/\.rei$/.test(uri)}`].concat(widthArg);
    this.process = session.environment.spawn(cmd, cmdArgs.concat(args));
  }
}
