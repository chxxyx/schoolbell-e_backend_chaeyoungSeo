function numIslands(grid: number[][]): number {
    if (!grid || grid.length === 0) return 0;

    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    // 방향 배열 (가로, 세로, 대각선 포함 8방향)
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],  // ↖ ↑ ↗
        [0, -1],         [0, 1],     // ←   →
        [1, -1], [1, 0], [1, 1]      // ↙ ↓ ↘
    ];

    // DFS 함수
    function dfs(x: number, y: number) {
        // 범위를 벗어나거나, 이미 방문한 Land(0)이라면 return
        if (x < 0 || y < 0 || x >= rows || y >= cols || grid[x][y] === 0) return;

        // 방문 처리 (1 → 0으로 변경)
        grid[x][y] = 0;

        // 8방향 탐색
        for (const [dx, dy] of directions) {
            dfs(x + dx, y + dy);
        }
    }

    // 전체 grid 순회
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) {  // 새로운 Island 발견
                count++;
                dfs(i, j);  // DFS 탐색 시작
            }
        }
    }

    return count;
}

// 테스트 케이스 실행
const grid = [
    [1, 0, 1, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0]
];

console.log(numIslands(grid)); // 출력: 4
