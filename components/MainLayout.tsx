import Header from "./Header";
import ChatAssistant from "./ChatAssistant";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-sage">
      <Header />
      <main className="px-4 sm:px-8 pt-5 pb-24 sm:py-8 max-w-[1600px] mx-auto">
        {children}
      </main>
      <ChatAssistant />
    </div>
  );
}
