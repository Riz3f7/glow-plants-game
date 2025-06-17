import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "植物育成ゲーム",
  description: "AWS Amplifyでホスティングされる、ターン制の植物育成シミュレーションゲーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        backgroundColor: '#f0f8ff'
      }}>
        <div className="game-container">
          {children}
        </div>
      </body>
    </html>
  );
}
