import { type ReactNode } from "react";

type MobilePageStubProps = {
  title: string;
  children?: ReactNode;
};

/** Consistent phone padding for placeholder screens inside dashboard shells. */
export function MobilePageStub({ title, children }: MobilePageStubProps) {
  return (
    <div className="mx-auto w-full max-w-[800px] px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-xl font-black text-[#0B1A2D] sm:text-2xl">{title}</h1>
      <div className="mt-3 text-sm font-medium text-slate-500">
        {children ?? "Placeholder"}
      </div>
    </div>
  );
}
