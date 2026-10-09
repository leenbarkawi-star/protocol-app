// Rebuilds the encrypted index.html from a plain app file.
// Usage: PASSCODE=... node tools/build-app.mjs app-plain.html > index.new.html
// Reuses the salt in the current index.html, so a phone that is already unlocked stays unlocked.
// The plain app must contain the placeholder /*PRIVJWK*/null, or already hold the private key
// (which is the case for a file produced by tools/decrypt-app.mjs).
import {readFileSync} from 'node:fs';
import {pbkdf2Sync, randomBytes, createCipheriv} from 'node:crypto';
const pass = (process.env.PASSCODE || '').toLowerCase().replace(/[^a-z0-9]/g, '');
if (!pass) throw new Error('Set PASSCODE');
const cur = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const D = JSON.parse(/var D=(\{.*?\});/s.exec(cur)[1].replace(/([{,])(\w+):/g, '$1"$2":'));
const app = readFileSync(process.argv[2], 'utf8');
if (app.includes('/*PRIVJWK*/null')) throw new Error('Plain app has no private key. Start from tools/decrypt-app.mjs output.');
const key = pbkdf2Sync(pass, Buffer.from(D.s, 'base64'), D.n, 32, 'sha256'), iv = randomBytes(12);
const c = createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([c.update(app, 'utf8'), c.final(), c.getAuthTag()]);
process.stdout.write(cur.replace(/var D=\{.*?\};/s, `var D={s:"${D.s}",iv:"${iv.toString('base64')}",n:${D.n},ct:"${ct.toString('base64')}"};`));
