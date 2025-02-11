export function ErrorMessage({ children }: { children: React.ReactNode }) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded p-3 text-red-500">
        {children}
      </div>
    );
}