# Protocol

A personal checklist app, installed on a phone home screen. The app in `index.html` is encrypted and opens only with the owner's passcode.

## Publishing a weekly meal plan

No passcode is needed for this. Write the plan as plain JSON outside the repository, then encrypt it with the public key:

    node tools/encrypt-plan.mjs /path/to/plan-plain.json > plan.json

Commit and push `plan.json`. Never commit the plain version.

Plain plan shape:

    {"start":"YYYY-MM-DD","who":"2 adults",
     "days":[{"breakfast":{"name":"","desc":""},"lunch":{"name":"","desc":""},"dinner":{"name":"","desc":""}}],
     "signature":{"day":0,"meal":"lunch"},
     "grocery":[{"aisle":"","items":[""]}],
     "notes":[""],
     "recipes":{"0-lunch":{"serves":2,"time":"25 minutes","ingredients":[""],"steps":[""]}}}

`days` has 7 entries starting on `start`. Recipe keys are `<day index>-<breakfast|lunch|dinner>`.

## Changing the app itself

The app source is not stored here in readable form. With the owner's passcode:

    PASSCODE=... node tools/decrypt-app.mjs > /tmp/app-plain.html   # recover the source, outside the repo
    # edit /tmp/app-plain.html
    PASSCODE=... node tools/build-app.mjs /tmp/app-plain.html > index.new.html && mv index.new.html index.html

`build-app.mjs` keeps the existing salt, so a phone that is already unlocked stays unlocked. Never commit the plain file.

Ticks live in the phone's localStorage under `pd:day-YYYY-MM-DD`, keyed by the item ids in the schedule. Keep those ids stable.
