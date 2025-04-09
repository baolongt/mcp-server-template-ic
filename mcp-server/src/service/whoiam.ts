import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { _SERVICE } from "../candid/whoami-canister.js";
import { DelegationIdentity } from "@dfinity/identity";
import { idlFactory } from "../candid/whoami-canister.did.js";

export class WhoamiService {
    private actor: _SERVICE;

    constructor(identity?: Identity | DelegationIdentity | undefined) {
        const agent = HttpAgent.createSync({ identity, host: "https://icp0.io" });
        this.actor = Actor.createActor(idlFactory, {
            agent,
            canisterId: "5uhnq-xaaaa-aaaab-qbmpa-cai",
        });
    }

    async greet(): Promise<string> {
        return await this.actor.greet();
    }
}