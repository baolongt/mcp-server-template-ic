import express from "express";
import { Request, Response } from "express-serve-static-core";
import cors from "cors";
import { getDelegatedIdentity } from "./identity.js";

// Create a singleton to store identity across the application
export class IdentityStore {
    private static instance: IdentityStore;
    private delegationChain: string | null = null;

    private constructor() { }

    public static getInstance(): IdentityStore {
        if (!IdentityStore.instance) {
            IdentityStore.instance = new IdentityStore();
        }
        return IdentityStore.instance;
    }

    async getIdentity() {
        if (!this.delegationChain) {
            throw new Error("No delegation chain found");
        }
        return getDelegatedIdentity(this.delegationChain)
    }

    async getDelegationChain() {
        return this.delegationChain;
    }


    async setDelegationChain(
        delegationChain: string,
    ) {
        this.delegationChain = delegationChain;
    }

    isAuthenticated(): boolean {
        return this.delegationChain !== null;
    }
}

export function startExpressServer(port: number = 8888): void {
    const app = express();
    const identityStore = IdentityStore.getInstance();

    app.use(express.json());
    app.use(cors());

    app.get("/ping", (req: Request, res: Response) => {
        res.json({ message: "pong" });
    });

    app.get("/identity", async (req: Request, res: Response) => {
        const delegationChain = await identityStore.getDelegationChain();


        if (!delegationChain) {
            res.status(400).json({ error: "No delegation chain found" });
            return;
        }

        const delegateIdentity = await getDelegatedIdentity(delegationChain);


        res.json(delegateIdentity.getPrincipal().toString());
    });

    app.post("/identity", async (req: Request, res: Response) => {
        identityStore.setDelegationChain(JSON.stringify(req.body));
    });

    app.listen(port, () => {
    });
}

startExpressServer();