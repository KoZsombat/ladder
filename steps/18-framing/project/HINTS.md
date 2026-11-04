# 16 — Hints

## Tier 1
Do `ReadLoop` first and entirely on its own — its tests do not need Python.
If that is right, the rest is plumbing.

## Tier 2 — the framing loop
```go
func ReadLoop(r io.Reader, maxMessage int, handle func(line []byte)) error {
    var buf []byte
    tmp := make([]byte, 4096)
    for {
        n, err := r.Read(tmp)
        if n > 0 {
            buf = append(buf, tmp[:n]...)
            for {
                i := bytes.IndexByte(buf, '\n')
                if i < 0 { break }
                line := buf[:i]
                handle(line)
                buf = buf[i+1:]
            }
            if len(buf) > maxMessage {
                return fmt.Errorf("message exceeds %d bytes with no delimiter", maxMessage)
            }
        }
        if err != nil {
            if errors.Is(err, io.EOF) { return nil }
            return err
        }
    }
}
```

## Tier 3 — Spawn's retry loop
```go
cmd := exec.CommandContext(ctx, "python3", "child/server.py")
cmd.Env = append(os.Environ(), "BRIDGE_SOCK="+sockPath)
cmd.Stderr = os.Stderr
if err := cmd.Start(); err != nil { return nil, err }

var conn net.Conn
deadline := time.Now().Add(5 * time.Second)
for {
    c, err := net.Dial("unix", sockPath)
    if err == nil { conn = c; break }
    if time.Now().After(deadline) {
        cmd.Process.Kill()
        return nil, fmt.Errorf("child never came up: %w", err)
    }
    time.Sleep(20 * time.Millisecond)
}
```
Run the test from the project root so the relative path to `child/server.py`
resolves, or build an absolute path from `runtime.Caller`.

## Tier 4 — Call
```go
func (b *Bridge) Call(ctx context.Context, fn string, args ...any) (any, error) {
    b.mu.Lock()
    b.nextID++
    id := b.nextID
    ch := make(chan Response, 1)      // BUFFERED: the reader must never block
    b.pending[id] = ch
    b.mu.Unlock()

    defer func() { b.mu.Lock(); delete(b.pending, id); b.mu.Unlock() }()

    payload, _ := json.Marshal(Request{ID: id, Func: fn, Args: args})
    if _, err := b.conn.Write(append(payload, '\n')); err != nil { return nil, err }

    select {
    case res := <-ch:
        if !res.OK { return nil, errors.New(res.Error) }
        return res.Value, nil
    case <-ctx.Done():
        return nil, ctx.Err()
    case <-b.closed:
        return nil, errors.New("bridge closed")
    }
}
```
The buffered channel is not a detail: with an unbuffered one, a reply whose
caller has already given up blocks the reader goroutine forever, and every
subsequent call hangs.

## Tier 5 — stretch
Swap delimiter framing for length-prefix framing: four bytes of length, then
that many bytes. No escaping needed, any payload allowed. That is what
Postgres, gRPC and WebSocket actually use.
