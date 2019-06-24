## Signing a payload

---

The API expects the payload to be digitally signed following the [JWT standard](https://tools.ietf.org/html/rfc7519).

- JSON Web Tokens are a good way of securely transmitting information between parties.
- Because JWTs can be signed—for example, using public/private key pairs—you can be sure the senders are who they say they are.
- Additionally, as the signature is calculated using the header and the payload, you can also verify that the content hasn't been tampered with.

A collection of libraries for Token Signing for different languages can be found [here](https://jwt.io/#libraries-io).

## Example

The following example in Node.js® shows how to sign the receipt hash and send the generated token to the API:

It assumes that you have the following:

- a [JWKS](https://tools.ietf.org/html/rfc7517) endpoint under your domain that is registered with the [CA](https://ca.digitala-kvitton.se/) (used by the Hash Registry API to retrieve a public key identified by the `kid` parameter) <br>

  An example module to provide a [`JWKS` endpoint](https://www.npmjs.com/package/jwks-provider) in Node.js®

- `kid` is an optional header claim which holds a key identifier, particularly useful when you have multiple keys to sign the tokens and you need to look up the right one to verify the signature.
- `generateHash` is your implementation for calling the [Hash Generator](https://hash-generator.digitala-kvitton.se) to retrieve a hash for a receipt
- `privateKey` is your key that you use for signing and *<b>should be kept secret</b>*
- `ORGANIZATION_ID` is the receipt issuer organization number that was used when enrolling with the [CA](https://ca.digitala-kvitton.se/)


```javascript
const jwt = require('jsonwebtoken')
const kid = crypto
  .createHash('SHA256')
  .update(publicKey)
  .digest('hex')

const hash = await generateHash(receipt)

const payload = { hash }
const signOptions = {
  algorithm: 'RS256',
  keyid: kid,
  issuer: ORGANIZATION_ID
}
const token = jwt.sign(payload, privateKey, signOptions)

const response = await got('https://hash-registry.digitala-kvitton.se/register-hash', {
  method: 'POST',
  json: true,
  body: {
    token
  }
})
```
