# The child side. This one is COMPLETE — read it, because the receive loop
# here is the same six lines you are implementing in Go.
import json, os, socket, sys

FUNCS = {
    "add": lambda a, b: a + b,
    "greet": lambda name: f"hello {name}",
    "boom": lambda: (_ for _ in ()).throw(ValueError("intentional")),
    "echo": lambda x: x,
}

PATH = os.environ.get("BRIDGE_SOCK") or f"/tmp/bridge-{os.getpid()}.sock"

# A stale socket file makes bind() fail. Always unlink first.
if os.path.exists(PATH):
    os.unlink(PATH)

srv = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
srv.bind(PATH)
srv.listen(1)
sys.stderr.write(f"child listening on {PATH}\n")
sys.stderr.flush()

try:
    conn, _ = srv.accept()
    buf = b""
    while True:
        chunk = conn.recv(4096)
        if not chunk:
            break
        buf += chunk
        # THE SAME LOOP as the Go side: while a complete message is buffered,
        # slice it off and keep the remainder.
        while b"\n" in buf:
            line, buf = buf.split(b"\n", 1)
            if not line.strip():
                continue
            req = json.loads(line)
            try:
                val = FUNCS[req["func"]](*req.get("args", []))
                res = {"id": req["id"], "ok": True, "value": val}
            except Exception as e:
                # An error is a RESPONSE, not a dropped connection.
                res = {"id": req["id"], "ok": False, "error": f"{type(e).__name__}: {e}"}
            conn.sendall(json.dumps(res).encode() + b"\n")
finally:
    try:
        os.unlink(PATH)
    except OSError:
        pass
