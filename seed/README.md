Seed data for CyberSafe

This folder contains sample Firestore seed data for local development and a browser-based seeder that uses your existing `dist/scripts/firebase-config.js` to write documents into Firestore.

How to use

1. Local emulator (recommended):
   - Start the Firebase emulator with relaxed rules (or rules you control).
   - Open `seed/import-seed.html` in a browser. It will load `dist/scripts/firebase-config.js` and attempt to write the seed data to your Firestore instance (emulator or production depending on config).

2. Production (not recommended without protecting rules):
   - Ensure you understand your Firestore security rules. Running the seeder will write data to your production Firestore if the config in `dist/scripts/firebase-config.js` points to a production project.

Notes
- The seeder tries to set timestamps with `firebase.firestore.FieldValue.serverTimestamp()`.
- If your rules block client writes, either temporarily loosen them for seeding or run the Firebase Admin SDK with a service account (not included here).
- Files included:
  - `import-seed.html` — simple web page that writes seed data via the client SDK.
  - `modules.json`, `lessons.json`, `quizzes.json`, `badges.json`, `users.json` — readable JSON copies of the seed data.

If you want, I can also add a Node.js seeder that uses the Admin SDK (requires a service account key) — say so and I'll add it.