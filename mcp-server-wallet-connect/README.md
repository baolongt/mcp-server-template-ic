## Environment Setup

This project uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
REACT_APP_BACKEND_URL=http://localhost:9999/identity
REACT_APP_BACKEND_PUBKEY=your_public_key_here
REACT_APP_DELEGATE_EXPIRATION=86400000
```

### Environment Variables

- `REACT_APP_BACKEND_URL`: The URL of your identity backend service
- `REACT_APP_BACKEND_PUBKEY`: The public key used for delegation
- `REACT_APP_DELEGATE_EXPIRATION`: Delegation expiration time in milliseconds (default: 86400000 = 24 hours)

### URL Parameters

You can also override these values using URL parameters:

- `pubkey`: Override the public key value
- `expiration`: Override the delegation expiration time

Example: `http://localhost:3000?pubkey=new_key&expiration=3600000`
