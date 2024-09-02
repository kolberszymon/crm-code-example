export const MainComponent = ({ children }) => {
  return (
    <div className="bg-white w-full min-h-screen p-[16px] rounded-md shadow-md text-zinc-950 mb-16">
      {children}
    </div>
  );
};
