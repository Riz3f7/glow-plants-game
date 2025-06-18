import type { Metadata } from "next";
import "./globals.css";
import "./amplify-config";
import { M_PLUS_Rounded_1c } from 'next/font/google';

// フォントの設定
const mPlusRounded1c = M_PLUS_Rounded_1c({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

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
    <html lang="ja" className={mPlusRounded1c.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        backgroundColor: '#f0f8ff'
      }}>
        <div className="game-container">
          {children}
        </div>
      </body>
    </html>
  );
}
