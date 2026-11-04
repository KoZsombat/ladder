# Step 11 — Specifications have edges

**Exercises:** 2 (~45 min) · **Project:** JSON parser + conformance suite (2 h + 2 h)

Accepting valid input is easy. A parser's real job is REJECTING invalid
input, with a message that says what and where. The exercises isolate the
two places where JSON is genuinely hard — number grammar and UTF-16
surrogate pairs — so the project can be about the structure.

Then the project's second sitting runs your parser against 300 conformance
files and rejects it 40 times. That gap, between "it works on my input" and
"it is correct", is most of what separates professional software from a
script.
