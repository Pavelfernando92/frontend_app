import Nav from "./_components/Nav";

type Props = {
  children: React.ReactNode;
};
const LayoutRoot = ({ children }: Props) => {
  return (
    <main className="min-h-screen bg-gray-100">
      <Nav />
      {children}
    </main>
  );
};

export default LayoutRoot;
