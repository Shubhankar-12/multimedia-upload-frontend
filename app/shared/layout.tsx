import RequireAuth from "@/components/RequireAuth";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
