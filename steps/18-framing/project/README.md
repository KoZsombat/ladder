# 16 — Socket bridge

**Builds on:** 02, 15. **Language:** Go parent, Python child. **Time:** ~2 h.
**Done when:** 10,000 requests in a tight loop all return correct results in
order, and Ctrl-C leaves no orphan process.

A parent process calls a function that actually runs in a child process
written in another language.

**The one lesson:** a socket is a byte stream, not a message stream. One
`write` of 100 bytes on one side does not produce one `read` of 100 bytes on
the other. You may get 40 then 60, or one and a half messages, or three
messages at once. The stream has no idea where your messages begin and end —
you impose that yourself. That is framing.

After this you know what HTTP keep-alive actually is, why `Content-Length`
exists, why WebSocket has a framing layer, and what your database driver does
between `query()` and the rows arriving.

Run: `go test ./...` (needs `python3` on PATH)
