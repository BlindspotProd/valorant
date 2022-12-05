import { address } from "ip";
import { PORT } from "server";
import { Config } from "types/config";
import { VersionData } from "types/val_api";
import { assetWarmUp } from "./asset_warmup";
import type { Lockfile } from "./get_lockfile";

export interface ApiAgent {
  name: string;
  desc: string;
  devName: string;
  id: string;
  portrait: string;
  icon: string;
  bg: string;
  bgColors: string[];
  role: ApiRole;
  abilities: ApiAbility[];
  voiceLine: {
    duration: number;
    url: string;
  };
}

interface ApiAbility {
  slot: string;
  name: string;
  icon: string;
  desc: string;
}

export interface ApiRole {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export type StateStatus =
  | "AssetWarmUp"
  | "Initializing"
  | "LookingForValorantEXE"
  | "WaitingForMatch"
  | "Ready"
  | "AgentSelect"
  | "Loading"
  | "Unknown";

export class State {
  #initializing = false;
  #lockfile: Lockfile | null = null;
  agents: Map<string, ApiAgent> = new Map();
  version: VersionData | null = null;
  status: StateStatus = "Unknown";
  apiUrl: string;
  hostUrl: string;
  config: Config = {
    manualAgentSelect: false,
    pollingInterval: 1000,
  };

  constructor() {
    this.hostUrl = `http://${address()}:${PORT}`;
    this.apiUrl = `${this.hostUrl}/api`;
  }

  setConfig(config: Partial<Config>) {
    this.config = { ...this.config, ...config };
  }

  async init() {
    this.#initializing = true;
    if (!this.#initializing) return;
    this.setStatus("Initializing");
    await assetWarmUp(this);
    this.setStatus("LookingForValorantEXE");
  }

  setStatus(status: StateStatus) {
    this.status = status;
  }
}