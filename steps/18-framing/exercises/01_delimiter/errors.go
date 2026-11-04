package framing

import "errors"

// ErrTooLong means no delimiter arrived within the size cap.
var ErrTooLong = errors.New("message exceeds the size cap with no delimiter")
