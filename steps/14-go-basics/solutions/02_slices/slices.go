package slices

func Evens(xs []int) []int {
	out := make([]int, 0, len(xs))
	for _, v := range xs {
		if v%2 == 0 {
			out = append(out, v)
		}
	}
	return out
}

func Sum(xs []int) int {
	total := 0
	for _, v := range xs {
		total += v
	}
	return total
}

func Reverse(xs []int) []int {
	out := make([]int, len(xs))
	for i, v := range xs {
		out[len(xs)-1-i] = v
	}
	return out
}

func Chunk(xs []int, size int) [][]int {
	if size <= 0 {
		return nil
	}
	var out [][]int
	for i := 0; i < len(xs); i += size {
		end := min(i+size, len(xs))
		out = append(out, xs[i:end])
	}
	return out
}
