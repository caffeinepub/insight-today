# Insight Today

## Current State
The app uses `firstAdminClaimed : Bool` (non-stable) to track whether the first admin has been assigned. On every deployment/upgrade, this resets to `false`. The AccessControl state is also initialized fresh each time. This causes the user's admin privileges to be lost on every redeploy.

## Requested Changes (Diff)

### Add
- `stable var storedAdminPrincipal : ?Principal` to persist the admin's identity across upgrades
- Logic in `claimFirstAdmin` to re-grant admin if the caller is the previously stored admin (handles upgrade wipes)

### Modify
- `claimFirstAdmin`: check stable principal instead of in-memory flag; allow original admin to re-claim after upgrades
- `firstAdminClaimed` replaced with stable admin principal tracking

### Remove
- Non-stable `firstAdminClaimed` boolean

## Implementation Plan
1. Replace `firstAdminClaimed` with `stable var storedAdminPrincipal : ?Principal = null`
2. Update `claimFirstAdmin` to: (a) assign if no admin stored yet, (b) re-assign if caller matches stored admin principal
3. This ensures admin access persists across all future deployments
