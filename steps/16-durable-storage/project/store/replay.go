package store

// replay rebuilds the in-memory index by scanning the whole log.
//
// TODO: implement this. This function is where `kill -9` survivability lives.
//
//	Loop from offset 0:
//	  read HeaderSize bytes
//	    io.EOF               -> clean end of file, break
//	    io.ErrUnexpectedEOF  -> TORN header: the process died mid-write.
//	                            NOT an error. Log it and break; the log ends
//	                            here.
//	  read keyLen+valLen bytes
//	    short read           -> torn body, same treatment
//	  verify the CRC
//	    mismatch             -> torn or corrupt, same treatment: stop here
//	  index[key] = location{...}, or delete(index, key) for a tombstone
//	  advance the offset
//
//	THE ORDERING BUG TO AVOID: you are walking in log order, so a later
//	record for a key must OVERWRITE the earlier one. If you keep the first
//	occurrence you will serve stale values, and every test that writes a key
//	twice will fail in a confusing way.
//
//	Finally: Truncate the file to the last good offset, so the next write
//	starts from clean ground rather than appending after garbage.
func (s *Store) replay() error {
	panic("TODO: replay")
}
