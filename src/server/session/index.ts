import * as rpc from "vscode-jsonrpc";
import * as server from "vscode-languageserver";
import { ISettings } from "../../shared";
import { Merlin } from "../processes";

import Analyzer from "./analyzer";
import Environment from "./environment";
import Indexer from "./indexer";
import Synchronizer from "./synchronizer";

export {
  Environment,
}

/**
 * Manager for the session. Launched on client connection.
 */
export default class Session implements rpc.Disposable {
  public initConf: server.InitializeParams;
  public settings: ISettings = ({} as any);
  public readonly connection: server.IConnection = server.createConnection();
  public readonly analyzer: Analyzer;
  public readonly environment: Environment;
  public readonly indexer: Indexer;
  public readonly merlin: Merlin;
  public readonly synchronizer: Synchronizer;

  constructor() {
    this.analyzer = new Analyzer(this);
    this.environment = new Environment(this);
    this.indexer = new Indexer(this);
    this.merlin = new Merlin(this);
    this.synchronizer = new Synchronizer(this);
    return this;
  }

  public dispose(): void {
    this.analyzer.dispose();
    this.environment.dispose();
    this.indexer.dispose();
    this.merlin.dispose();
    this.synchronizer.dispose();
  }

  public async initialize(): Promise<void> {
    await this.environment.initialize();
    await this.merlin.initialize();
    await this.indexer.initialize();
    await this.synchronizer.initialize();
    await this.analyzer.initialize();
  }

  public listen(): void {
    this.synchronizer.listen();
    this.connection.listen();
  }

  public log(data: any): void {
    this.connection.console.log(JSON.stringify(data, null as any, 2)); // tslint:disable-line
  }

  public onDidChangeConfiguration({ settings }: server.DidChangeConfigurationParams): void {
    this.settings = settings;
    this.analyzer.onDidChangeConfiguration();
    this.synchronizer.onDidChangeConfiguration();
  }
}
