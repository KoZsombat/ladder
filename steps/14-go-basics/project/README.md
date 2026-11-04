# Project — word-frequency CLI

**Done when:** `wordfreq -n 5 *.txt` prints the five commonest words across
every file, and the tests pass.

Small on purpose. It is the first Go program you own end to end, and it
exercises every exercise in this step: slices, maps, a struct with methods,
an interface you define where you consume it, and errors wrapped with
context.

    go test ./...
    go run ./cmd/wordfreq -n 5 somefile.txt
