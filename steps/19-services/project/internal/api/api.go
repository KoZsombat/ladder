package api

import (
	"net/http"

	"ladder/pinger/internal/store"
)

type API struct {
	store store.Store
}

func New(s store.Store) *API { return &API{store: s} }

// Routes wires the HTTP surface.
//
// TODO: implement this.
//
//	Go 1.22+ ServeMux handles method and path patterns with no router
//	dependency at all:
//
//	    mux.HandleFunc("GET /targets/{id}", a.getTarget)
//	    r.PathValue("id")
//
//	The surface, deliberately small:
//	    POST   /targets
//	    GET    /targets
//	    GET    /targets/{id}
//	    DELETE /targets/{id}
//	    GET    /targets/{id}/results?limit=
//	    GET    /healthz    liveness  — MUST NOT touch the database
//	    GET    /readyz     readiness — may touch the database
//
//	Why healthz must not touch the database: a liveness check that does will
//	report the process as dead during a slow query, and the orchestrator
//	will restart a service that was merely busy. That is the opposite of
//	what you wanted.
//
//	Handlers should do nothing but decode, validate, call a store method and
//	encode. Everything testable lives below them.
func (a *API) Routes() http.Handler {
	panic("TODO: Routes")
}

// TODO: implement the handlers.
//
//	Validation that the tests check: reject a URL that is not http/https and
//	an interval under one second, with 400 and a useful message — not 500,
//	and not a stack trace.
