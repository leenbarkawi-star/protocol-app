// Recovers the plain app source from index.html. Needs the owner's passcode.
// Usage: PASSCODE=... node tools/decrypt-app.mjs > /somewhere/outside/the/repo/app-plain.html
// Never commit the output: it contains the app's private key and all content.
import {readFileSync} from 'node:fs';
import {pbkdf2Sync, createDecipheriv} from 'node:crypto';
const pass = (process.env.PASSCODE || '').toLowerCase().replace(/[^a-z0-9]/g, '');
if (!pass) throw new Error('Set PASSCODE');
const cur = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const D = JSON.parse(/var D=(\{.*?\});/s.exec(cur)[1].replace(/([{,])(\w+):/g, '$1"$2":'));
const key = pbkdf2Sync(pass, Buffer.from(D.s, 'base64'), D.n, 32, 'sha256');
const buf = Buffer.from(D.ct, 'base64'), tag = buf.subarray(buf.length - 16), body = buf.subarray(0, buf.length - 16);
const d = createDecipheriv('aes-256-gcm', key, Buffer.from(D.iv, 'base64')); d.setAuthTag(tag);
process.stdout.write(Buffer.concat([d.update(body), d.final()]).toString('utf8'));
