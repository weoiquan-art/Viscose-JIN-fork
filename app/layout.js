import "./globals.css";

export const metadata = {
  title: "JIN Studio · 作品",
  description: "JIN Studio 的角色、影像与创作。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hans">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
