export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          header {
            display: none !important;
          }
        `
      }} />
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </>
  );
}
