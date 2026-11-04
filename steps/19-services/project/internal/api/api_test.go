package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"ladder/pinger/internal/store"
)

func srv() http.Handler { return New(store.NewMemory()).Routes() }

func TestHealthzDoesNotTouchTheStore(t *testing.T) {
	h := srv()
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest("GET", "/healthz", nil))
	if rec.Code != 200 {
		t.Errorf("healthz = %d", rec.Code)
	}
}

func TestCreateAndListTargets(t *testing.T) {
	h := srv()

	rec := httptest.NewRecorder()
	body := `{"url":"https://example.com","interval_s":10,"timeout_ms":2000}`
	h.ServeHTTP(rec, httptest.NewRequest("POST", "/targets", strings.NewReader(body)))
	if rec.Code != 201 && rec.Code != 200 {
		t.Fatalf("POST /targets = %d: %s", rec.Code, rec.Body)
	}

	rec = httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest("GET", "/targets", nil))
	if rec.Code != 200 {
		t.Fatalf("GET /targets = %d", rec.Code)
	}
	var list []map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &list); err != nil {
		t.Fatalf("not a JSON array: %s", rec.Body)
	}
	if len(list) != 1 {
		t.Errorf("listed %d targets, want 1", len(list))
	}
}

func TestBadInputIs400NotPanic(t *testing.T) {
	h := srv()
	for _, body := range []string{
		`{"url":"ftp://nope","interval_s":10,"timeout_ms":1000}`,
		`{"url":"not a url","interval_s":10,"timeout_ms":1000}`,
		`{"url":"https://ok.com","interval_s":0,"timeout_ms":1000}`,
		`not json at all`,
	} {
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, httptest.NewRequest("POST", "/targets", strings.NewReader(body)))
		if rec.Code != 400 {
			t.Errorf("POST %s = %d, want 400", body, rec.Code)
		}
	}
}

func TestUnknownTargetIs404(t *testing.T) {
	rec := httptest.NewRecorder()
	srv().ServeHTTP(rec, httptest.NewRequest("GET", "/targets/99999", nil))
	if rec.Code != 404 {
		t.Errorf("= %d, want 404", rec.Code)
	}
}

func TestMethodRouting(t *testing.T) {
	rec := httptest.NewRecorder()
	srv().ServeHTTP(rec, httptest.NewRequest("PUT", "/targets", nil))
	if rec.Code == 200 {
		t.Error("PUT /targets should not be routed to the create handler")
	}
}
