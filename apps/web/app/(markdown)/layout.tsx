export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto my-4 prose lg:prose-lg prose-invert text-center">
        {children}
      </div>
    </>
  );
}
