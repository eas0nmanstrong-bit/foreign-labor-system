# 外籍勞工仲介系統

這是一個完整的外籍勞工仲介管理系統，包含前端（React）和後端（Node.js + Express）。

## 專案結構

```
foreign-labor-system/
├── client/              # 前端專案
│   ├── src/             # React 原始碼
│   ├── package.json     # 前端依賴
│   └── ...
├── server/              # 後端專案
│   ├── src/             # Node.js 原始碼
│   ├── database.db      # SQLite 資料庫
│   ├── package.json     # 後端依賴
│   └── ...
└── docs/                # 專案文件
    ├── task.md                    # 任務清單
    ├── implementation_plan.md     # 實作計畫
    └── walkthrough.md             # 功能驗證報告
```

## 系統功能

### 已實作模組
- ✅ 使用者認證與授權（RBAC）
- ✅ 外勞管理（含 36 期付款計畫）
- ✅ 雇主管理
- ✅ 員工管理

### 系統特色
- 動態選單（基於權限）
- 完整的 CRUD 操作
- 資料關聯與導航
- 詳細的資料展示頁面

## 在新電腦上設置專案

### 1. 安裝依賴套件

**前端**：
```bash
cd client
npm install
```

**後端**：
```bash
cd server
npm install
```

### 2. 啟動專案

**後端**（在 `server` 資料夾）：
```bash
node src/app.js
```
後端將運行在 `http://localhost:3000`

**前端**（在 `client` 資料夾，另開終端機）：
```bash
npm run dev
```
前端將運行在 `http://localhost:5173`

### 3. 登入系統

**管理員帳號**：
- 帳號：`0000000`
- 密碼：`1234`

**員工帳號範例**：
- 帳號：`1200001`（王小明）
- 密碼：`1234`

所有員工的預設密碼都是 `1234`

## 資料庫資訊

- 資料庫類型：SQLite
- 資料庫檔案：`server/database.db`
- 包含資料：
  - 6 位員工（1 位管理員 + 5 位員工）
  - 77 筆外勞資料
  - 2 筆雇主資料
  - 完整的 36 期付款記錄

## 技術棧

### 前端
- React 18
- React Router v6
- Axios
- Tailwind CSS
- Vite

### 後端
- Node.js
- Express
- Sequelize ORM
- SQLite
- bcrypt（密碼加密）
- JWT（身份驗證）

## 開發資訊

- 開發日期：2025-11-22
- Node.js 版本：建議 v18 或以上
- npm 版本：建議 v9 或以上

## 資料庫備份與還原

### 快速備份
```bash
cd server
node export_data.js
```

### 還原資料
```bash
cd server
node restore_data.js export_[時間戳記]
```

### 當前資料統計
- 使用者: 6 筆
- 雇主: 12 筆
- 外勞: 77 筆
- 付款記錄: 2,772 筆

**詳細說明**: 請參考 `server/backups/` 資料夾中的備份檔案

⚠️ **重要**: 更新系統前請務必執行備份！

## 注意事項

1. **首次使用**：確保已安裝 Node.js 和 npm
2. **資料庫**：`database.db` 包含所有資料，請妥善保管
3. **環境變數**：目前使用預設設定，生產環境請設定適當的環境變數
4. **安全性**：預設密碼為 `1234`，正式使用前請修改

## 文件說明

- `docs/task.md`：開發任務清單
- `docs/implementation_plan.md`：系統實作計畫
- `docs/walkthrough.md`：功能驗證與測試報告

## 聯絡資訊

如有問題，請參考 `docs/walkthrough.md` 中的詳細說明。
