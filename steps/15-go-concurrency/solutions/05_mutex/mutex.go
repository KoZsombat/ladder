package mutex

import "sync"

type SafeCounter struct {
	mu sync.Mutex
	n  int
}

func (c *SafeCounter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.n++
}

func (c *SafeCounter) Value() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.n
}

type Registry struct {
	mu sync.RWMutex
	m  map[string]bool
}

func NewRegistry() *Registry { return &Registry{m: make(map[string]bool)} }

func (r *Registry) Add(name string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.m[name] = true
}

func (r *Registry) Has(name string) bool {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.m[name]
}
