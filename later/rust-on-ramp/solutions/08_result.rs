use std::num::ParseIntError;

#[derive(Debug, PartialEq)]
pub enum CalcError {
    Parse(String),
    DivideByZero,
}

pub fn parse_num(s: &str) -> Result<i32, CalcError> {
    s.trim()
        .parse::<i32>()
        .map_err(|e| CalcError::Parse(e.to_string()))
}

pub fn divide(a: i32, b: i32) -> Result<i32, CalcError> {
    if b == 0 {
        Err(CalcError::DivideByZero)
    } else {
        Ok(a / b)
    }
}

pub fn parse_and_divide(a_str: &str, b_str: &str) -> Result<i32, CalcError> {
    let a = parse_num(a_str)?;
    let b = parse_num(b_str)?;
    divide(a, b)
}

pub fn sum_all(list: &[&str]) -> Result<i32, CalcError> {
    let mut total = 0;
    for s in list {
        total += parse_num(s)?;
    }
    Ok(total)
}

pub fn parse_pair(s: &str) -> Result<(i32, i32), CalcError> {
    let (a, b) = s.split_once(',').ok_or(CalcError::Parse("no comma".into()))?;
    Ok((a.trim().parse::<i32>()?, b.trim().parse::<i32>()?))
}

impl From<ParseIntError> for CalcError {
    fn from(e: ParseIntError) -> Self {
        CalcError::Parse(e.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_parse_num() {
        assert_eq!(parse_num(" 42 "), Ok(42));
        assert!(matches!(parse_num("x"), Err(CalcError::Parse(_))));
    }
    #[test]
    fn test_divide() {
        assert_eq!(divide(10, 2), Ok(5));
        assert_eq!(divide(1, 0), Err(CalcError::DivideByZero));
    }
    #[test]
    fn test_parse_and_divide() {
        assert_eq!(parse_and_divide("10", "2"), Ok(5));
        assert_eq!(parse_and_divide("10", "0"), Err(CalcError::DivideByZero));
        assert!(matches!(parse_and_divide("x", "2"), Err(CalcError::Parse(_))));
    }
    #[test]
    fn test_sum_all() {
        assert_eq!(sum_all(&["1", "2", "3"]), Ok(6));
        assert!(matches!(sum_all(&["1", "oops"]), Err(CalcError::Parse(_))));
        assert_eq!(sum_all(&[]), Ok(0));
    }
    #[test]
    fn test_parse_pair() {
        assert_eq!(parse_pair("3, 4"), Ok((3, 4)));
        assert!(matches!(parse_pair("3"), Err(CalcError::Parse(_))));
        assert!(matches!(parse_pair("3,x"), Err(CalcError::Parse(_))));
    }
}
