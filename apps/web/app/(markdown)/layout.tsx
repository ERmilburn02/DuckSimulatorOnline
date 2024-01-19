export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-11/12 mx-auto my-4 prose prose-invert text-center">
        {children}
      </div>
    </>
  );
}
