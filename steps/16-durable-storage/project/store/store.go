package store

import (
	"os"
	"sync"
)

type SyncPolicy int

const (
	SyncAlways SyncPolicy = iota // durable, slow
	SyncEveryN                   // the usual compromise
	SyncNever                    // fast, loses data on a power cut
)

type location struct {
	offset int64
	length uint32
}

type Store struct {
	mu     sync.Mutex
	dir    string
	path   string
	f      *os.File
	offset int64
	index  map[string]location // your project-10 hash table, in memory
	policy SyncPolicy
	syncN  int
	writes int
}

// Open opens or creates the store and rebuilds the index by replaying the log.
//
// TODO: implement this.
//
//	Open the file with O_RDWR|O_CREATE, then call replay().
func Open(dir string, policy SyncPolicy, syncN int) (*Store, error) {
	panic("TODO: Open")
}

// Put appends a record and updates the index.
//
// TODO: implement this.
//
//	Encode, Write, maybe Sync, then index[key] = location{offset, len}.
//
//	A successful Write does NOT mean the data is on disk — it means it is in
//	the operating system's page cache, and a power cut loses it. f.Sync() is
//	what forces it to the device, and it is slow: single-digit milliseconds
//	on a spinning disk, hundreds of microseconds on SSD.
//
//	Benchmark writes/second under all three policies. The numbers will be
//	further apart than you expect, and that gap is the durability/throughput
//	trade-off every database exposes as a config flag.
func (s *Store) Put(key, val []byte) error {
	panic("TODO: Put")
}

// Get reads a value. Returns (nil, nil) for a missing or deleted key.
//
// TODO: implement this.
//
//	Look up the index, ReadAt the record, verify the CRC, return the value.
//	One seek and one read; that is the whole point of keeping the index in
//	memory.
func (s *Store) Get(key []byte) ([]byte, error) {
	panic("TODO: Get")
}

// Delete appends a tombstone.
//
// TODO: implement this.
func (s *Store) Delete(key []byte) error {
	panic("TODO: Delete")
}

// Keys returns every live key.
//
// TODO: implement this.
func (s *Store) Keys() []string {
	panic("TODO: Keys")
}

func (s *Store) Close() error {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.f.Close()
}
