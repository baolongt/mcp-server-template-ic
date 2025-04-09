import { DelegationChain, DelegationIdentity } from "@dfinity/identity";
import { initWallet } from "./wallet.js";

export const getDelegatedIdentity = async (
    delegation: string
) => {
    const json_parsed = JSON.parse(delegation);
    const delegationChain = DelegationChain.fromJSON(json_parsed);

    const backendIdentity = initWallet();

    const delegatedIdentity = DelegationIdentity.fromDelegation(
        backendIdentity,
        delegationChain
    );


    return delegatedIdentity;
}
