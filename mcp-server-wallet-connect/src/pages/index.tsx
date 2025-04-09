import { DelegationChain, DelegationIdentity } from "@dfinity/identity";
import { useIdentity } from "@nfid/identitykit/react";
import { fromBase64 } from "@slide-computer/signer";
import { useEffect, useState } from "react";
import { BACKEND_PUBKEY, DELEGATE_EXPIRATION, BACKEND_URL } from "../constant";
import { ConnectWallet } from "@nfid/identitykit/react"

function isDelegationIdentity(identity: any): identity is DelegationIdentity {
    return identity && typeof identity === 'object' && 'getDelegation' in identity;
}

export const Page = () => {
    const identity = useIdentity();
    const [delegationStatus, setDelegationStatus] = useState<string>("");

    useEffect(() => {
        if (identity) {
            console.log(identity);

            const delegateToBackend = async () => {
                if (!isDelegationIdentity(identity)) {
                    console.error('Identity is not a DelegationIdentity');
                    setDelegationStatus("Error: Identity is not a DelegationIdentity");
                    return;
                }

                console.log('BACKEND_PUBKEY:', BACKEND_PUBKEY);
                console.log('DELEGATE_EXPIRATION:', DELEGATE_EXPIRATION);

                try {
                    const delegation = await DelegationChain.create(
                        identity,
                        { toDer: () => fromBase64(BACKEND_PUBKEY) },
                        new Date(Date.now() + DELEGATE_EXPIRATION),
                        {
                            previous: identity.getDelegation(),
                        },
                    );

                    console.log('Delegation:', JSON.stringify(delegation.toJSON()));
                    setDelegationStatus("Delegation created successfully. Sending to backend...");

                    // Send delegation to backend using the configured URL
                    const response = await fetch(BACKEND_URL+"/identity", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(delegation.toJSON()),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to send delegation to backend: ${response.statusText}`);
                    }

                    console.log('Delegation successfully sent to backend');
                    setDelegationStatus("Delegation successfully sent to backend");
                } catch (error) {
                    console.error('Error with delegation process:', error);
                    setDelegationStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            };

            delegateToBackend();
        }
    }, [identity]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            textAlign: 'center',
        }}>
            <div style={{
                maxWidth: '500px',
                width: '100%',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
            }}>
                <ConnectWallet />
                {identity && (
                    <div>
                        <p style={{ marginTop: '20px', wordBreak: 'break-all' }}>
                            My principal: {identity.getPrincipal().toText()}
                        </p>
                        {delegationStatus && (
                            <p style={{ 
                                marginTop: '10px',
                                padding: '10px', 
                                borderRadius: '5px',
                                backgroundColor: delegationStatus.includes('Error') ? '#ffeeee' : '#eeffee',
                                color: delegationStatus.includes('Error') ? '#cc0000' : '#007700'
                            }}>
                                {delegationStatus}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}