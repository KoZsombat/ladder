package records

import (
	"bytes"
	"testing"
)

func TestRoundTrip(t *testing.T) {
	rec := Encode([]byte("name"), []byte("zsombor"))
	k, v, n, err := Decode(rec)
	if err != nil {
		t.Fatal(err)
	}
	if string(k) != "name" || string(v) != "zsombor" {
		t.Errorf("got %q=%q", k, v)
	}
	if n != len(rec) {
		t.Errorf("n = %d, want %d", n, len(rec))
	}
}

func TestEmptyKeyAndValue(t *testing.T) {
	rec := Encode([]byte(""), []byte(""))
	k, v, n, err := Decode(rec)
	if err != nil || len(k) != 0 || len(v) != 0 || n != HeaderSize {
		t.Errorf("= %q %q %d %v", k, v, n, err)
	}
}

func TestBinarySafe(t *testing.T) {
	val := []byte{0x00, 0xff, 0x0a, 0x00, 0x7f}
	rec := Encode([]byte("k"), val)
	_, v, _, err := Decode(rec)
	if err != nil || !bytes.Equal(v, val) {
		t.Errorf("binary value did not survive: %v %v", v, err)
	}
}

func TestShortHeader(t *testing.T) {
	rec := Encode([]byte("k"), []byte("v"))
	if _, _, _, err := Decode(rec[:5]); err == nil {
		t.Error("want an error for a truncated header")
	}
}

func TestShortBody(t *testing.T) {
	rec := Encode([]byte("key"), []byte("a longer value"))
	if _, _, _, err := Decode(rec[:len(rec)-3]); err == nil {
		t.Error("want an error for a truncated body")
	}
}

func TestCorruptIsDistinguishedFromShort(t *testing.T) {
	rec := Encode([]byte("key"), []byte("value"))
	bad := append([]byte(nil), rec...)
	bad[len(bad)-1] ^= 0xff // flip a bit in the value

	_, _, _, err := Decode(bad)
	if err == nil {
		t.Fatal("a flipped bit must be detected")
	}
	if err == ErrShort {
		t.Error("a complete-but-damaged record is ErrCorrupt, not ErrShort")
	}
}

func TestScan(t *testing.T) {
	var buf []byte
	for _, p := range [][2]string{{"a", "1"}, {"b", "2"}, {"c", "3"}} {
		buf = append(buf, Encode([]byte(p[0]), []byte(p[1]))...)
	}
	var got []string
	end, err := Scan(buf, func(k, v []byte) { got = append(got, string(k)+"="+string(v)) })
	if err != nil {
		t.Fatal(err)
	}
	if end != len(buf) {
		t.Errorf("end = %d, want %d", end, len(buf))
	}
	if len(got) != 3 || got[2] != "c=3" {
		t.Errorf("got %v", got)
	}
}

func TestScanStopsAtATornTail(t *testing.T) {
	var buf []byte
	for _, p := range [][2]string{{"a", "1"}, {"b", "2"}} {
		buf = append(buf, Encode([]byte(p[0]), []byte(p[1]))...)
	}
	good := len(buf)
	buf = append(buf, Encode([]byte("c"), []byte("3"))...)
	torn := buf[:len(buf)-4] // the process died mid-write

	var got []string
	end, _ := Scan(torn, func(k, v []byte) { got = append(got, string(k)) })
	if len(got) != 2 {
		t.Errorf("recovered %d records, want 2", len(got))
	}
	if end != good {
		t.Errorf("end = %d, want %d — this is where the store truncates", end, good)
	}
}
