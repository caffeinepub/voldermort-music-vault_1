# Voldermort Music Vault

## Current State
Admin login uses Internet Identity. Backend mutations (addVideo, updateVideo, deleteVideo) require the caller to be the hardcoded owner principal or an access-control admin. Frontend shows an II login button, then checks `isCallerAdmin()` on the backend.

## Requested Changes (Diff)

### Add
- Passcode login screen on the AdminPage (input field + submit button)
- Passcode is `238929` -- validated purely on the frontend
- Session-based auth state stored in sessionStorage so it persists across page refreshes but clears on browser close

### Modify
- `AdminPage.tsx`: remove all Internet Identity imports/hooks; replace login screen with passcode form; replace identity-based logout with a simple "Lock" action that clears sessionStorage
- `main.mo`: remove the caller principal checks from `addVideo`, `updateVideo`, `deleteVideo` (backend auth is no longer used; passcode is the frontend gate)
- Remove the principal ID display from the admin header (no longer relevant)

### Remove
- Internet Identity login button and all II-related UI
- `useIsAdmin` hook usage from AdminPage
- The `adminLoading` and "Access Denied" states

## Implementation Plan
1. Edit `main.mo` to remove `Runtime.trap("Unauthorized")` guards from the three mutation functions
2. Rewrite `AdminPage.tsx` with passcode login flow replacing II flow
