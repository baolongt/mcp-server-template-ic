import { IdentityKitAuthType, InternetIdentity, OISY } from '@nfid/identitykit';
import './App.css';
import { IdentityKitProvider, useIdentity } from "@nfid/identitykit/react"
import "@nfid/identitykit/react/styles.css"
import { Page } from './pages';

const App = () => {


  return (
    <IdentityKitProvider
      authType={IdentityKitAuthType.DELEGATION}
      signers={[InternetIdentity, OISY]}
      signerClientOptions={{
        targets: [] 
      }}>
      <div className="App">
          <Page />
      </div>
    </IdentityKitProvider>
  )
}

export default App;