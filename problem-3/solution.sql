CREATE TABLE approval_requests (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY, 
    title         VARCHAR(255) NOT NULL,         
    content       TEXT NOT NULL,                
    requester_id  BIGINT NOT NULL,               -- 요청한 사용자 ID
    status        ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE approval_steps (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY, 
    request_id    BIGINT NOT NULL,               -- 결재 요청 ID (approval_requests FK)
    approver_id   BIGINT NOT NULL,               -- 결재자 ID
    step_order    INT NOT NULL,                  -- 결재 순서 (1: 첫 번째 승인자, 2: 두 번째 승인자)
    status        ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    decision_date TIMESTAMP NULL,                -- 승인/반려 처리된 날짜
    comments      TEXT NULL,                     -- 결재자의 의견
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES approval_requests(id) ON DELETE CASCADE
);


SELECT 
    ar.id AS request_id,
    ar.title,
    ar.content,
    ar.requester_id,
    ar.status AS request_status,
    as1.id AS step_id,
    as1.step_order,
    as1.status AS step_status
FROM approval_requests ar
JOIN approval_steps as1 ON ar.id = as1.request_id
LEFT JOIN approval_steps as2 ON as1.request_id = as2.request_id 
    AND as1.step_order = as2.step_order + 1
WHERE as1.approver_id = {사용자_ID}
    AND as1.status = 'PENDING'
    AND (as2.status = 'APPROVED' OR as2.step_order IS NULL) -- 이전 단계가 승인된 경우만 포함
ORDER BY ar.created_at ASC;
