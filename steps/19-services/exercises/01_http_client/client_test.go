package client

import (
	"context"
	"net"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"
	"time"
)

func TestBuildHasATimeout(t *testing.T) {
	c := Build(3*time.Second, 32)
	if c.Timeout == 0 {
		t.Error("no Timeout — a request can hang until the OS gives up")
	}
}

func TestBuildRaisesTheIdleConnLimit(t *testing.T) {
	c := Build(time.Second, 32)
	tr, ok := c.Transport.(*http.Transport)
	if !ok {
		t.Fatal("expected a *http.Transport")
	}
	if tr.MaxIdleConnsPerHost != 32 {
		t.Errorf("MaxIdleConnsPerHost = %d, want 32 (the default 2 is the trap)", tr.MaxIdleConnsPerHost)
	}
}

func TestBuildDoesNotFollowRedirects(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/from" {
			http.Redirect(w, r, "/to", http.StatusFound)
			return
		}
		w.WriteHeader(200)
	}))
	defer srv.Close()

	status, _, err := Fetch(context.Background(), Build(time.Second, 8), srv.URL+"/from", time.Second)
	if err != nil {
		t.Fatal(err)
	}
	if status != http.StatusFound {
		t.Errorf("status = %d, want 302 — the redirect is information", status)
	}
}

func TestFetchStatusAndTiming(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(60 * time.Millisecond)
		w.WriteHeader(201)
	}))
	defer srv.Close()

	status, took, err := Fetch(context.Background(), Build(time.Second, 8), srv.URL, time.Second)
	if err != nil {
		t.Fatal(err)
	}
	if status != 201 {
		t.Errorf("status = %d", status)
	}
	if took < 50*time.Millisecond || took > 2*time.Second {
		t.Errorf("took = %v, want roughly 60ms", took)
	}
}

func TestFetchTimesOut(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(3 * time.Second)
	}))
	defer srv.Close()

	start := time.Now()
	if _, _, err := Fetch(context.Background(), Build(10*time.Second, 8), srv.URL, 80*time.Millisecond); err == nil {
		t.Error("want a timeout error")
	}
	if elapsed := time.Since(start); elapsed > time.Second {
		t.Errorf("took %v — the per-request timeout is not reaching the request", elapsed)
	}
}

func TestTHEDRAIN_ConnectionsAreReused(t *testing.T) {
	var opened int64
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("0123456789012345678901234567890123456789"))
	}))
	srv.Config.ConnState = func(_ net.Conn, s http.ConnState) {
		if s == http.StateNew {
			atomic.AddInt64(&opened, 1)
		}
	}
	defer srv.Close()

	c := Build(2*time.Second, 16)
	for i := 0; i < 30; i++ {
		if _, _, err := Fetch(context.Background(), c, srv.URL, 2*time.Second); err != nil {
			t.Fatalf("request %d: %v", i, err)
		}
	}
	if n := atomic.LoadInt64(&opened); n > 5 {
		t.Errorf("opened %d connections for 30 requests — the body is not being drained", n)
	}
}
