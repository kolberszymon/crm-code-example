export const MainComponentTransparent = ({ children }) => {
  return (
    <div className="bg-transparent w-full min-h-screen  text-zinc-950 mb-16">
      {children}
    </div>
  );
};
