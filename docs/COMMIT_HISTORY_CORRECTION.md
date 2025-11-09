# Commit Type Corrections

Over time, several commits were incorrectly marked as `chore` but actually represent features, fixes, or refactors.
This document clarifies their intended meaning for changelog and reference purposes.

---

## Features (`feat`)

1ae63da update content with tracks
592a164 adding authentication
cfd4529 implementing Content creation with Tracks
c7b015e creating Tracks within transaction
3b8da29 implementing CRUD for Tracks
5e18763 implementing creation of Tracks
37e6a2c implementing findAll, findOne, delete
9f1ae59 implementing YouTube service and Content endpoint
189046d adding YouTube module
7b424fd adding Tracks module
f816d9d adding Contents module

---

## Refactors (`refactor`)

e590df0 adding some optionals to query params
c7339b2 adding class validators to DTOs
f38bca4 solving some types and cleaning up
d7d3b70 transforming helper to class validator
325ad31 refactoring FindDto prop naming
f6d2da9 centralizing custom http error messages
0fab6af refactor to support Tracks on Content creation
07cc836 generalizing find.dto
aba061c changing findAll query parameter
368837a safer env value fetching

---

## Fixes (`fix`)

858415f handle YouTube service errors
47bf5a5 removing unused const
cff3d02 removing logs and adding missing await
acaf23e removing Tracks from Content creation, adding missing properties

---

## Documentation (`docs`)

8bcd0c5 updating AI_USAGE
e3fbab4 adding doc descriptions to DTOs
70ac7a9 first commit - db schema diagram added

---

## Chores (`chore`)

e7324a8 adding authorization req to Swagger and endpoints
71a006b adding swagger
0861a0f adding lint and vscode configs
1bdf91b changing repository name for Contents
29f8176 database setup

---

### Notes

- These corrections are informational only — no history was rewritten.
