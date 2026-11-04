use std::collections::HashMap;

pub fn word_count(words: &[&str]) -> HashMap<String, usize> {
    let mut m = HashMap::new();
    for w in words {
        *m.entry(w.to_string()).or_insert(0) += 1;
    }
    m
}

pub fn repeated(counts: &HashMap<String, usize>) -> Vec<String> {
    let mut out: Vec<String> = counts
        .iter()
        .filter(|(_, &n)| n > 1)
        .map(|(k, _)| k.clone())
        .collect();
    out.sort();
    out
}

pub fn dedup_consecutive(v: &mut Vec<i32>) {
    v.dedup();
}

pub fn group_by_parity(v: &[i32]) -> HashMap<&'static str, Vec<i32>> {
    let mut m: HashMap<&'static str, Vec<i32>> = HashMap::new();
    for &x in v {
        let key = if x % 2 == 0 { "even" } else { "odd" };
        m.entry(key).or_insert_with(Vec::new).push(x);
    }
    m
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_word_count() {
        let c = word_count(&["a", "b", "a"]);
        assert_eq!(c.get("a"), Some(&2));
        assert_eq!(c.get("b"), Some(&1));
        assert_eq!(c.get("zzz"), None);
    }
    #[test]
    fn test_repeated() {
        let c = word_count(&["a", "b", "a", "c", "c", "c"]);
        assert_eq!(repeated(&c), vec!["a".to_string(), "c".to_string()]);
    }
    #[test]
    fn test_dedup_consecutive() {
        let mut v = vec![1, 1, 2, 2, 2, 3, 1];
        dedup_consecutive(&mut v);
        assert_eq!(v, vec![1, 2, 3, 1]);
    }
    #[test]
    fn test_group_by_parity() {
        let g = group_by_parity(&[1, 2, 3, 4]);
        assert_eq!(g.get("even"), Some(&vec![2, 4]));
        assert_eq!(g.get("odd"), Some(&vec![1, 3]));
    }
}
