package generics

func Map[T, U any](xs []T, f func(T) U) []U {
	out := make([]U, 0, len(xs))
	for _, v := range xs {
		out = append(out, f(v))
	}
	return out
}

func Filter[T any](xs []T, f func(T) bool) []T {
	out := make([]T, 0, len(xs))
	for _, v := range xs {
		if f(v) {
			out = append(out, v)
		}
	}
	return out
}

func Reduce[T, U any](xs []T, init U, f func(U, T) U) U {
	acc := init
	for _, v := range xs {
		acc = f(acc, v)
	}
	return acc
}

type Number interface {
	~int | ~int64 | ~float64
}

func Sum[T Number](xs []T) T {
	var total T
	for _, v := range xs {
		total += v
	}
	return total
}

func Keys[K comparable, V any](m map[K]V) []K {
	out := make([]K, 0, len(m))
	for k := range m {
		out = append(out, k)
	}
	return out
}
