## 啟動前端
```bash
cd frondend
npm install
npm run dev
```

## 啟動後端(Windows 要把 bin 換成 Script)
```bash
cd backend
source ../benclass/bin/activate
uvicorn api.main:app --reload
```