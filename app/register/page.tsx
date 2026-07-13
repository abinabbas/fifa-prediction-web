import { Suspense } from "react";
import { RegisterContent } from "./RegisterContent";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#eef1f6]">
          <span className="text-2xl">⚽</span>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
