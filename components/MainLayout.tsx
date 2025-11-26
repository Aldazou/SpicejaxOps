import Header from "./Header";
import ChatAssistant from "./ChatAssistant";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="p-8 animate-fade-in">{children}</main>
      <ChatAssistant />
    </div>
  );
}
