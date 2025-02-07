## 3. 쿼리 설명

- **`approval_requests`와 `approval_steps`를 조인**하여 결재 요청과 관련된 결재 단계를 가져옵니다.
- **`as1.approver_id = {사용자_ID}`**: 현재 사용자가 결재해야 하는 건만 필터링합니다.
- **`as1.status = 'PENDING'`**: 아직 처리되지 않은 결재 건만 조회합니다.
- **`LEFT JOIN approval_steps as2`**: 이전 결재자의 승인 상태를 확인합니다.
  - **`as2.status = 'APPROVED' OR as2.step_order IS NULL`**: 이전 결재자가 승인 상태이거나, 첫 번째 결재자인 경우만 포함됩니다.
- **결재 요청 생성일 기준**으로 정렬 (`ORDER BY ar.created_at ASC`)하여, 오래된 요청이 먼저 처리되도록 합니다.

## 4. 예제 데이터 및 결과

### 테스트 데이터

#### `approval_requests` 테이블

| id | title      | requester_id | status  | created_at           |
|----|-----------|--------------|---------|----------------------|
| 1  | 예산 승인 | 100          | PENDING | 2024-02-05 10:00:00 |

#### `approval_steps` 테이블

| id | request_id | approver_id | step_order | status    | decision_date |
|----|-----------|-------------|------------|-----------|---------------|
| 1  | 1         | 200         | 1          | APPROVED  | 2024-02-05 12:00:00 |
| 2  | 1         | 300         | 2          | PENDING   | NULL          |

### 사용자 ID가 300일 때 조회 결과

| request_id | title      | requester_id | request_status | step_id | step_order | step_status |
|------------|-----------|--------------|----------------|---------|------------|-------------|
| 1          | 예산 승인 | 100          | PENDING        | 2       | 2          | PENDING     |

### 결론

- **사용자 300**은 결재해야 하는 건이 **PENDING** 상태이고, 이전 단계인 **팀장(200)**이 **승인(APPROVED)** 상태이므로, 현재 결재할 수 있는 상태입니다.
