import Nav from "./_components/Nav";
import Footer from "./_components/footer";

type Props = {
  children: React.ReactNode;
};
const LayoutRoot = async ({ children }: Props) => {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-[#800020] to-[#FF0000] text-white">
        <Nav />
        {children}
        <Footer />
      </main>
    </>
  );
};

export default LayoutRoot;
