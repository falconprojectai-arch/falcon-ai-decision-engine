# JSON Contract Tester API — buyer quickstart

## Before paying
- Endpoint: `POST https://json-contract-tester-api.falcon-project-ai.workers.dev/v1/validate-batch`
- Price: **0.005 USDC per batch**
- Network: **Base Mainnet (eip155:8453)**
- Asset: Circle USD Coin
- No API key or account; x402 payment is the access mechanism.
- A syntactically valid unpaid JSON request returns HTTP 402 with `PAYMENT-REQUIRED`, even when the body is `{}`. Inspect the amount, asset, network and recipient before authorizing any payment.

## Agent Bazaar call-method note — 2026-11-07

The public Agent Bazaar listing currently shows a generic GET challenge example. For this API, **GET and HEAD are read-only discovery probes only**; they do not validate a batch. To run a billable validation, use **POST** with the JSON body shown below. Do not authorize a payment for a GET or HEAD probe.

## 1. Inspect the challenge without paying

```bash
curl -i https://json-contract-tester-api.falcon-project-ai.workers.dev/v1/validate-batch \
  -H 'Content-Type: application/json' \
  --data '{
    "schema":{"type":"object","required":["ok"],"properties":{"ok":{"type":"boolean"}}},
    "outputs":[{"id":"sample-1","json":{"ok":true}}]
  }'
```

Expected result before payment: **HTTP 402** and a `PAYMENT-REQUIRED` response header. This is only a challenge check, not a paid call.

Malformed JSON and request bodies over 64 KiB are rejected before payment. A JSON body that parses but has an invalid schema or batch shape is validated after payment verification and can return HTTP 400. The @x402/hono middleware settles only after a successful response; count only a successful 2xx response with PAYMENT-RESPONSE and an on-chain receipt as a completed payment. Validate requests against the OpenAPI contract before authorizing payment.

## 2. x402 JavaScript client

Use a dedicated, low-balance Base wallet for automated agent payments. Do not export or use the private key of a primary wallet. Never put a private key in source control, a browser page, or a chat. Keep it in a local environment variable or a secrets manager.

Install in a local Node.js project:

```bash
npm install @x402/fetch @x402/core @x402/evm viem
```

Create `buyer.mjs`:

```js
import { wrapFetchWithPayment } from "@x402/fetch";
import { x402Client } from "@x402/core/client";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const key = process.env.EVM_PRIVATE_KEY;
if (!key) throw new Error("Set EVM_PRIVATE_KEY in your local environment");

const signer = privateKeyToAccount(key);
const client = new x402Client();
client.register("eip155:8453", new ExactEvmScheme(signer));
const paidFetch = wrapFetchWithPayment(fetch, client);

const payload = {
  schema: {
    type: "object",
    required: ["ok", "result"],
    properties: {
      ok: { type: "boolean" },
      result: { type: "string" }
    }
  },
  outputs: [
    { id: "good", json: { ok: true, result: "done" } },
    { id: "bad", json: { ok: "yes", result: "done" } }
  ]
};

const response = await paidFetch(
  "https://json-contract-tester-api.falcon-project-ai.workers.dev/v1/validate-batch",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }
);

console.log("HTTP", response.status);
console.log(await response.json());
```

The wrapper handles the x402 challenge and retry using the signer. Run it only after checking the live challenge and funding a dedicated wallet with an amount you are willing to spend. This example is for a local Node.js agent, not a direct MetaMask browser connection.

## 3. Python agent integration (httpx)

The official x402 Python client can handle the HTTP 402 challenge and retry automatically. Install:

```bash
pip install "x402[httpx]" eth-account
```

Create `buyer.py`:

```python
import asyncio
import json
import os

from eth_account import Account
from x402 import x402Client
from x402.http import x402HTTPClient
from x402.http.clients import x402HttpxClient
from x402.mechanisms.evm import EthAccountSigner
from x402.mechanisms.evm.exact.register import register_exact_evm_client

URL = "https://json-contract-tester-api.falcon-project-ai.workers.dev/v1/validate-batch"

payload = {
    "schema": {
        "type": "object",
        "required": ["ok", "result"],
        "properties": {
            "ok": {"type": "boolean"},
            "result": {"type": "string"}
        }
    },
    "outputs": [
        {"id": "agent-output-1", "json": {"ok": True, "result": "done"}},
        {"id": "agent-output-2", "json": {"ok": "yes", "result": "done"}}
    ]
}

async def main() -> None:
    key = os.getenv("EVM_PRIVATE_KEY")
    if not key:
        raise RuntimeError("Set EVM_PRIVATE_KEY in your local environment")

    account = Account.from_key(key)
    client = x402Client()
    register_exact_evm_client(client, EthAccountSigner(account))
    payment_client = x402HTTPClient(client)

    async with x402HttpxClient(client) as http:
        response = await http.post(
            URL,
            content=json.dumps(payload),
            headers={"Content-Type": "application/json"},
        )
        await response.aread()
        print("HTTP", response.status_code)
        print(response.text)

        if response.is_success:
            settlement = payment_client.get_payment_settle_response(
                lambda name: response.headers.get(name)
            )
            print("Settlement:", settlement)

asyncio.run(main())
```

Run it only after inspecting the live unpaid challenge and confirming its network, token, amount, and recipient. Use a dedicated low-balance wallet; never put a private key in source control, a browser page, or an agent prompt. A successful HTTP response and the settlement receipt are separate checks.

## 4. Response semantics

HTTP 200 means the batch was processed. The JSON body separately reports:
- `valid`: true only when every sample passes.
- `summary`: total, passed and failed counts.
- `results[]`: each sample's PASS/FAIL status and structured diagnostics.

A successfully processed batch can legitimately contain failed samples; the batch is charged based on successful processing, not on whether every sample passes. A schema-invalid request returns 400 after payment verification; the middleware settles only after a successful response, so it should not produce a settled payment.

## Supported rules and limits

Supported subset: `type`, `required`, `properties`, `additionalProperties: false`, `items`, `enum`, `const`, numeric bounds, string length, and array length. The hosted API rejects `pattern`. It does not implement full JSON Schema, `$ref`, composition, or format assertions.

Limits: 64 KiB request body, 1–10 samples, 32 levels of nesting, 2,000 total JSON nodes. Do not send secrets, personal data, or confidential production payloads.

## Files
- OpenAPI: [openapi.yaml](./openapi.yaml)
- Live discovery manifest: https://json-contract-tester-api.falcon-project-ai.workers.dev/.well-known/x402
- Live OpenAPI JSON: https://json-contract-tester-api.falcon-project-ai.workers.dev/openapi.json
- Live preflight (no payment): [payment-preflight.html](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester-api/payment-preflight.html?v=d7e8552)
- API README: [README](./README.md)
