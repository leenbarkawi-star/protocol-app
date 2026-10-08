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

The app source is not stored here. Rebuilding `index.html` needs the owner's passcode, or a new passcode that the owner then enters once on the phone.
