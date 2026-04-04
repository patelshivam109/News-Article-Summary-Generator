Frontend (React + Vite)

Quick start:

1. cd frontend
2. npm install
3. npm run dev

The dev server proxies `/api` and `/tts` to the Flask backend at `http://127.0.0.1:5000`.

Build for production with `npm run build` and copy the `dist` output to your Flask `static` folder if desired.
