import { DelegationChain, DelegationIdentity } from "@dfinity/identity";
import { useIdentity } from "@nfid/identitykit/react";
import { fromBase64 } from "@slide-computer/signer";
import { useEffect } from "react";
import { BACKEND_PUBKEY, DELEGATE_EXPIRATION } from "../constant";
import { ConnectWallet } from "@nfid/identitykit/react"

function isDelegationIdentity(identity: any): identity is DelegationIdentity {
    return identity && typeof identity === 'object' && 'getDelegation' in identity;
}

export const Page = () => {
    const identity = useIdentity();

    useEffect(() => {
        if (identity) {
            console.log(identity);

            const delegateToBackend = async () => {
                if (!isDelegationIdentity(identity)) {
                    console.error('Identity is not a DelegationIdentity');
                    return;
                }

                const delegation = await DelegationChain.create(
                    identity, // No need for casting now
                    { toDer: () => fromBase64(BACKEND_PUBKEY) },
                    new Date(Date.now() + DELEGATE_EXPIRATION),
                    {
                        previous: identity.getDelegation(),
                    },
                );

                console.log('Delegation:', JSON.stringify(delegation.toJSON()));

                // Send delegation to backend
                try {
                    const response = await fetch('http://localhost:9000/identity', {
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
                } catch (error) {
                    console.error('Error sending delegation to backend:', error);
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
                    <p style={{ marginTop: '20px', wordBreak: 'break-all' }}>
                        My principal: {identity.getPrincipal().toText()}
                    </p>
                )}
            </div>
        </div>
    );
}