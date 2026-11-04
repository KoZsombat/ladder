package main

import (
	"flag"
	"fmt"
	"os"

	"ladder/wordfreq/wordfreq"
)

// TODO: wire up the CLI.
//
//	flag.Int("n", 10, "how many words to show") and flag.Parse().
//	flag.Args() are the filenames. With none, read os.Stdin instead —
//	behaving sensibly in a pipe is what makes a tool feel finished.
//
//	Print one "count word" per line, aligned. On an error, write it to
//	STDERR and exit non-zero: a tool that prints errors to stdout
//	poisons whatever is downstream of the pipe.
func main() {
	n := flag.Int("n", 10, "how many words to show")
	flag.Parse()

	_ = n
	_ = wordfreq.New
	_ = fmt.Println
	_ = os.Stdout

	panic("TODO: main")
}
