---
tags:
  - tech
  - lists
---

# Scripting Rules

- Always set -xeu
- Always mkdir -p
- Always pushd and popd
- Always quote your variables, especially if they're holding paths
- File should be (mostly) relative the $PWD. Any paths passed in should be realpath'd
- This is a good pattern: ARG="${1:-}"
- mktemp -d for temporary directories. Use it.
- trap (cleanup stuff) EXIT
s