# PocketRule 1.17.6 — Security Hardening

- Upgraded encrypted local storage to version 2 with a fresh random per-save salt.
- Added backward-compatible migration from the legacy fixed-salt storage format after successful PIN unlock.
- Added strict AES-GCM IV/ciphertext validation.
- Added PBKDF2 iteration bounds for encrypted backup imports to prevent resource-exhaustion payloads.
- Added backup size, collection-count, transaction-count, and restored-state size limits.
- Pinned direct JavaScript dependencies to tested versions, including patched Vite 7.3.6 and React 19.2.8.
- Added a production dependency security audit to the release AAB workflow.
- Hardened CI credential handling and cleanup for release signing material.
- Bumped Android version code to 11706 and app version to 1.17.6.
