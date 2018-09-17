import { ChildProcess } from "child_process";
import Session from "../session";

export default class OcpIndent {
  public readonly process: ChildProcess;
  constructor(session: Session, args: string[] = []) {
    const command = session.settings.reason.path.ocpindent;
    const [cmd, cmdArgs] = session.makeOpamCmd(command);
    this.process = session.environment.spawn(cmd, cmdArgs.concat(args));
    this.process.on("error", error => session.error(`Error formatting file: ${error}`));
  }
}
