"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  total,
  pageSize,
}: {
  total: number;
  pageSize: number;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const page = Math.max(1, parseInt(params.get("page") || "1"));
  const pages = Math.max(1, Math.ceil(total / pageSize));

  const go = (n: number) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("page", String(n));
    router.push(`${path}?${sp.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <button
        className="border rounded px-3 py-1 disabled:opacity-50"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
      >
        Anterior
      </button>
      <span>
        Página {page} de {pages}
      </span>
      <button
        className="border rounded px-3 py-1 disabled:opacity-50"
        onClick={() => go(page + 1)}
        disabled={page >= pages}
      >
        Próxima
      </button>
    </div>
  );
}
