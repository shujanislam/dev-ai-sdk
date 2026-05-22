import './globals.css';

export const metadata = {
  title: 'dev-ai-sdk Next.js Example',
  description: 'Simple Next.js project using dev-ai-sdk'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
