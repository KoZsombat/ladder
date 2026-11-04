# Step 18 — Framing

**Exercises:** 2 (~45 min) · **Project:** socket bridge (~2 h)
**Language:** Go

One lesson, and it changes how you read every network stack trace after it:
**a socket is a byte stream, not a message stream.**

One `write` of 100 bytes on one side does not produce one `read` of 100
bytes on the other. You may get 40 then 60, or one and a half messages, or
three messages at once. The stream has no idea where your messages begin and
end — you impose that yourself. That is framing.

    go test -race ./exercises/...
