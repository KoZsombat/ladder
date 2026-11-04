# 08_result

## Hint 1
`parse_and_divide` is three lines with `?`. The last task is an `impl From`
block, not a function body.

## Hint 2
```rust
pub fn parse_num(s: &str) -> Result<i32, CalcError> {
    s.trim().parse::<i32>().map_err(|e| CalcError::Parse(e.to_string()))
}

pub fn divide(a: i32, b: i32) -> Result<i32, CalcError> {
    if b == 0 { Err(CalcError::DivideByZero) } else { Ok(a / b) }
}
```

## Hint 3
```rust
pub fn parse_and_divide(a_str: &str, b_str: &str) -> Result<i32, CalcError> {
    let a = parse_num(a_str)?;
    let b = parse_num(b_str)?;
    divide(a, b)
}

pub fn sum_all(list: &[&str]) -> Result<i32, CalcError> {
    let mut total = 0;
    for s in list { total += parse_num(s)?; }
    Ok(total)
}

impl From<ParseIntError> for CalcError {
    fn from(e: ParseIntError) -> Self { CalcError::Parse(e.to_string()) }
}
```

## Solution
See `solutions/08_result.rs`.
