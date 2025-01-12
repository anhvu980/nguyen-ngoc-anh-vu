/**
 * This approach is simple and works well for small to moderate values of n. However, as n grows larger, it may not be as efficient as other approaches due to the time required to sum each number individually.
 * @param n 
 * @returns 
 */
function sum_to_n_a(n: number): number {
  let sum: number = 0;
  for (let i: number = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * This approach leverages Array.from() and Array.reduce() to perform the summation. It may be less efficient for large values of n due to the array creation.
 * @param n 
 * @returns 
 */
function sum_to_n_b(n: number): number {
  return Array.from({ length: n }, (_, i) => i + 1).reduce((acc, curr) => acc + curr, 0);
}

/**
 * This approach is more elegant and demonstrates recursion, but it is less efficient than the formula-based approach, especially for larger values of n due to the overhead of function calls and potential stack overflow for very large n.
 * @param n 
 * @returns 
 */
function sum_to_n_c(n: number): number {
  if (n === 1) {
    return 1;
  }
  return n + sum_to_n_c(n - 1);
}
