# 實作計畫 - 外籍勞工仲介系統

## 目標
開發一個擁有統一網頁介面的外籍勞工仲介全方位管理系統。關鍵需求是使用者介面為單一入口，但各模組（勞工、客戶、合約、員工）的可用性嚴格由後端資料庫權限 (RBAC) 控制。

## 需要使用者審閱
> [!IMPORTANT]
> **架構決策**: 我們將使用 **單頁應用程式 (SPA)** 架構。
> - **前端**: React (Vite) + TailwindCSS。
> - **後端**: Node.js (Express) + SQLite (為了便攜性和易於設定)。
> - **安全性**: 使用 JWT 進行身分驗證。選單將根據檢查使用者角色的 API 回應 (`/api/menus`) 動態渲染。

## 預計變更

### 後端 (`/server`)
#### [NEW] 專案結構
- `package.json`: Express, SQLite3, Sequelize (或 raw SQL), jsonwebtoken, bcrypt。
- `src/app.js`: 主要入口點。
- `src/database.js`: SQLite 連線和架構初始化。
- `src/models/`: 定義 `User` (使用者), `Role` (角色), `Permission` (權限), `Menu` (選單)。
- `src/routes/auth.js`: 登入端點。
- `src/routes/system.js`: 獲取使用者選單和權限的端點。
- `src/middleware/auth.js`: JWT 驗證和權限檢查。

#### [NEW] 資料庫架構 (SQLite)
- **Users (使用者)**: `id`, `username`, `password`, `role_id`
- **Roles (角色)**: `id`, `name` (例如：'Admin', 'Coordinator')
- **Menus (選單)**: `id`, `label`, `path`, `icon`, `permission_required`
- **Permissions (權限)**: `id`, `code` (例如：'labor:read', 'labor:write')
- **RolePermissions (角色權限)**: `role_id`, `permission_id`
- **Clients (雇主)**: ... (existing fields)
- **Labors (外勞)**:
    - `id`
    - `worker_no` (外勞編號)
    - `name_en` (英文姓名)
    - `name_zh` (中文翻譯姓名)
    - `passport_no` (護照號碼)
    - `entry_date` (入境日)
    - `arc_no` (居留證號碼)
    - `arc_expiry_date` (居留證效期)
    - `employment_date` (任用日)
    - `client_id` (所屬雇主 - 關聯 Client)
    - `maintenance_id` (維護人員 - 關聯 User)
    - `residence_address` (居住住址) [NEW]
    - `lease_id` (租約 - 預留關聯 Contract) [NEW]
- **LaborPayments (外勞應收款)**: [NEW]
    - `id`
    - `labor_id` (關聯 Labor)
    - `period` (期數 1-36)
    - `due_date` (應收款日)
    - `service_fee` (服務費)
    - `arc_fee` (居留證費)
    - `medical_fee` (體檢費)
    - `tax` (所得稅)
    - `utilities` (水電費)
    - `other_fee` (其他費用)
    - `total_amount` (應收合計)
    - `received_amount` (實收金額)
    - `received_date` (收款日期)
    - `invoice_no` (發票編號)
    - `invoice_date` (發票日期)
    - `note` (備註)
    - `status` (狀態: 未收款/已收款)

### API 設計 (`/api/labors`)
- `GET /`: 取得外勞列表 (支援搜尋、依雇主篩選)
- `GET /:id`: 取得單一外勞詳情
- `POST /`: 新增外勞
- `PUT /:id`: 更新外勞
- `DELETE /:id`: 刪除外勞

### API 設計 (`/api/clients`)
- `GET /`: 取得雇主列表 (支援搜尋/篩選)
- `GET /:id`: 取得單一雇主詳情
- `POST /`: 新增雇主
- `PUT /:id`: 更新雇主
- `DELETE /:id`: 刪除雇主

### API 設計 (`/api/users`) [NEW]
- `GET /`: 取得員工列表
- `GET /:id`: 取得單一員工詳情
- `POST /`: 新增員工 (設定帳號、密碼、角色)
- `PUT /:id`: 更新員工資料 (不含密碼)
- `PUT /:id/password`: 重設密碼
- `DELETE /:id`: 刪除/停用員工
#### [NEW] 專案結構
- `package.json`: React, Vite, React Router DOM, Axios, TailwindCSS。
- `src/App.jsx`: 主要路由器和佈局包裝器。
- `src/context/AuthContext.jsx`: 管理使用者狀態並在載入時獲取權限。
- `src/components/Layout/Sidebar.jsx`: **關鍵元件**。根據從後端接收到的列表動態渲染導航項目。
- `src/pages/`:
    - `Login.jsx` (登入)
    - `Dashboard.jsx` (儀表板)
    - `Labor/LaborList.jsx` (勞工列表)
    - `Client/ClientList.jsx` (客戶列表)
    - `Contract/ContractList.jsx` (合約列表)
    - `Client/ClientList.jsx` (客戶列表)
    - `Contract/ContractList.jsx` (合約列表)
    - `Employee/EmployeeList.jsx` (員工列表) [NEW]
    - `Employee/EmployeeForm.jsx` (新增/編輯員工) [NEW]
    - `Admin/UserManagement.jsx` (使用者管理 - 可與員工管理合併)

## 驗證計畫

### 自動化測試
- **後端測試**: 建立測試腳本 `server/tests/rbac.test.js` 以驗證：
    - 管理員角色收到完整的選單列表。
    - 員工角色收到受限的選單列表。
    - 未經授權存取受限端點會返回 403。

### 手動驗證
1.  **設定**: 執行 `npm run seed` 建立預設使用者 (admin/admin, staff/staff)。
2.  **以管理員身分登入**:
    - 驗證側邊欄顯示：儀表板、勞工、客戶、合約、員工、設定。
    - 驗證所有頁面的存取權。
3.  **以員工身分登入**:
    - 驗證側邊欄 **僅** 顯示：儀表板、勞工 (可能為唯讀)。
    - 驗證客戶/合約模組被隱藏。
    - 嘗試手動導航至 `/admin` 並驗證重新導向或「存取被拒」頁面。
