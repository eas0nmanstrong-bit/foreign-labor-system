# 自動提交並推送修復檔案
# 這個腳本會強制 Git 追蹤新檔案並推送到 GitHub

Write-Host "=== 開始提交修復檔案 ===" -ForegroundColor Green

# 切換到專案目錄
Set-Location "D:\新增資料夾\foreign-labor-system"

Write-Host "1. 檢查 Git 狀態..." -ForegroundColor Yellow
git status

Write-Host "`n2. 添加新檔案到 Git..." -ForegroundColor Yellow
git add client/public/_redirects
git add client/render.json
git add client/vite.config.js

Write-Host "`n3. 提交變更..." -ForegroundColor Yellow
git commit -m "修復 Render 前端路由問題 - 添加 _redirects 檔案"

Write-Host "`n4. 推送到 GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n=== 完成！===" -ForegroundColor Green
Write-Host "變更已推送到 GitHub，Render 將在 5-10 分鐘內自動部署。" -ForegroundColor Cyan
Write-Host "請等待部署完成後測試：https://foreign-labor-frontend.onrender.com/login" -ForegroundColor Cyan

Read-Host "`n按 Enter 鍵關閉視窗"
