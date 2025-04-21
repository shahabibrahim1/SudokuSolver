import axios from 'axios';

export async function solveSudoku(grid: (number | null)[][]): Promise<number[][]> {
  const resp = await axios.post('/solve', { grid });
  return resp.data.grid as number[][];
}
