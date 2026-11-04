package records

import "errors"

// ErrShort means the buffer ended before the record did: the normal end of
// a log that was being written when the process died.
var ErrShort = errors.New("incomplete record")

// ErrCorrupt means the record is complete but its checksum does not match.
var ErrCorrupt = errors.New("corrupt record")
