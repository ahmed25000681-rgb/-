# Security Specification for CyberArchitect

## Data Invariants
1. **Ethical Compliance**: No user can access Level 1+ content without signing the "Ethical Code of Conduct".
2. **Sequential Progression**: Users cannot update their `currentLevel` ahead of their actual progress (logic enforced via specific action updates).
3. **Identity Integrity**: All writes (`authorId`, `uid`) must match the `request.auth.uid`.
4. **Content Immutability**: Historical articles and lessons cannot be modified by regular users.
5. **PII Protection**: User email and progress are only visible to the owner.

## The Dirty Dozen Payloads

1. **Self-Promotion Hack**: `update /users/victim_uid { currentLevel: 3 }` as `attacker_uid`. -> DENIED
2. **Ethical Bypass**: `read /articles/advanced_lesson` where `signedCodeOfConduct == false`. -> DENIED
3. **Shadow Article**: `create /articles/{id} { title: "Backdoor", ... }` as non-admin. -> DENIED
4. **Forum Impersonation**: `create /forum_posts/{id} { authorId: "not_me", ... }`. -> DENIED
5. **Metadata Poisoning**: `update /articles/lesson_1 { content: "Poisoned content" }`. -> DENIED
6. **Badge Theft**: `update /users/my_id { badges: ['Expert'] }`. -> DENIED
7. **Profile Scraping**: `list /users` as regular user. -> DENIED
8. **ID Poisoning**: `get /articles/very_long_id_exceeding_128_chars_junk_junk...`. -> DENIED
9. **Timestamp Spoofing**: `create /forum_posts/id { createdAt: "2020-01-01" }`. -> DENIED
10. **Ghost Comments**: `create /forum_posts/id/comments/id { authorId: "fake" }`. -> DENIED
11. **Negative Level**: `update /users/my_id { currentLevel: -1 }`. -> DENIED
12. **Null Conduct**: `create /users/my_id { signedCodeOfConduct: null }`. -> DENIED

## Firestore Rules Draft (DRAFT_firestore.rules)
(I will now write the hard rules to DRAFT_firestore.rules)
