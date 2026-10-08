// Encrypts a weekly meal plan so only the unlocked app can read it.
// Usage: node tools/encrypt-plan.mjs plan-plain.json > plan.json
// Needs no secret: it uses the public key in tools/plan-public-key.pem.
import {readFileSync} from 'node:fs';
import {publicEncrypt, randomBytes, createCipheriv, constants} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
const pub = readFileSync(join(here, 'plan-public-key.pem'));
const plain = JSON.stringify(JSON.parse(readFileSync(process.argv[2], 'utf8')));
const key = randomBytes(32), iv = randomBytes(12);
const c = createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([c.update(plain, 'utf8'), c.final(), c.getAuthTag()]);
const k = publicEncrypt({key: pub, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256'}, key);
process.stdout.write(JSON.stringify({v: 1, k: k.toString('base64'), iv: iv.toString('base64'), ct: ct.toString('base64')}) + '\n');
