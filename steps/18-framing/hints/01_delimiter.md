# 01_delimiter

## Hint 1
The TODO comment is the whole shape. The two things it does not spell out
are where the copy goes and how to handle the error from Read.

## Hint 2
```go
func ReadLines(r io.Reader, maxMessage int, fn func(line []byte)) error {
	var buf []byte
	tmp := make([]byte, 4096)
	for {
		n, err := r.Read(tmp)
		if n > 0 {
			buf = append(buf, tmp[:n]...)
			for {
				i := bytes.IndexByte(buf, '\n')
				if i < 0 {
					break
				}
				line := make([]byte, i)
				copy(line, buf[:i])        // the copy — see the aliasing test
				fn(line)
				buf = buf[i+1:]
			}
			if len(buf) > maxMessage {
				return ErrTooLong
			}
		}
		if err != nil {
			if errors.Is(err, io.EOF) {
				return nil
			}
			return err
		}
	}
}
```

## Hint 3 — why n > 0 is checked before err
`io.Reader` is allowed to return data AND an error from the same call.
Checking the error first and returning throws away bytes you were given.
This is in the `io.Reader` contract and it catches everyone once.

## Hint 4 — the alternative
`bufio.Scanner` does all of this for you, and in real code you would use it.
You are writing it by hand once so that when a scanner's 64KB token limit
bites you, or when you need length-prefix framing instead of a delimiter,
you know exactly what is happening underneath.
