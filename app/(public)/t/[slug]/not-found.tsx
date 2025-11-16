export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">找不到此家教檔案</p>
        <a href="/" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md">
          回首頁
        </a>
      </div>
    </div>
  );
}


