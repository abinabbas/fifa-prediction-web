export const pageContainerClass = "max-w-6xl mx-auto w-full px-5 sm:px-8";

export function PageContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`${pageContainerClass} ${className}`}>{children}</div>;
}
