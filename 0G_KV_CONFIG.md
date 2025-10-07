# 0g App Code Storage Configuration Guide

## Environment Variables

Add this environment variable to your `.env.local` file:

```bash
# 0g Storage Configuration
# Your private key with balance to pay for gas fees
PRIVATE_KEY=your_private_key_here
```

**Note**: The flow contract address is now automatically retrieved using the `getFlowContract` function from the 0g-ts-sdk, so no environment variable is needed for that.

## API Usage

### Base URL
```
/api/0g-kv
```

### Endpoints

#### 1. Health Check (GET)
```bash
GET /api/0g-kv
```

#### 2. Store App Code (POST)
```bash
POST /api/0g-kv
Content-Type: application/json

{
  "action": "store",
  "appName": "my-app",
  "code": "console.log('Hello World');"
}
```

#### 3. Retrieve App Code (POST)
```bash
POST /api/0g-kv
Content-Type: application/json

{
  "action": "retrieve",
  "appName": "my-app"
}
```

## Testing with curl

### Store app code
```bash
curl -X POST http://localhost:3000/api/0g-kv \
  -H "Content-Type: application/json" \
  -d '{
    "action": "store",
    "appName": "my-app",
    "code": "console.log(\"Hello World\");"
  }'
```

### Retrieve app code
```bash
curl -X POST http://localhost:3000/api/0g-kv \
  -H "Content-Type: application/json" \
  -d '{
    "action": "retrieve",
    "appName": "my-app"
  }'
```

## Key Changes

- **Simplified Configuration**: Only one environment variable needed (`PRIVATE_KEY`)
- **App Code Focus**: Designed specifically for storing and retrieving application code
- **Automatic Contract Resolution**: Uses `getFlowContract()` function to automatically get the flow contract
- **Type Safety**: Improved type handling for better compatibility

## Notes

- Make sure your private key has sufficient balance to pay for gas fees
- The appName should be unique for each app you want to store
- The code field can contain any string (JavaScript, Python, etc.)
- All operations are performed on the 0g testnet
- The flow contract is automatically resolved using the 0g-ts-sdk