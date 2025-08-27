"use client";
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import clsx from "clsx";

type Props = {
  categories: string[];
  sizes: string[];
  colors: string[];
};

export default function Filters({ categories, sizes, colors }: Props) {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();

  const current = useMemo(() => {
    const cat = params.getAll("cat");
    const size = params.getAll("size");
    const color = params.getAll("color");
    const min = params.get("min");
    const max = params.get("max");
    const sort = params.get("sort") || "offers";
    const q = params.get("q") || "";
    return { cat, size, color, min, max, sort, q };
  }, [params]);

  const toggle = (key: string, value: string) => {
    const sp = new URLSearchParams(params.toString());
    const values = sp.getAll(key);
    if (values.includes(value)) {
      const next = values.filter((v) => v !== value);
      sp.delete(key);
      next.forEach((v) => sp.append(key, v));
    } else {
      sp.append(key, value);
    }
    sp.delete("page");
    router.push(`${path}?${sp.toString()}`);
  };

  const setRange = (min?: string, max?: string) => {
    const sp = new URLSearchParams(params.toString());
    if (min) sp.set("min", min);
    else sp.delete("min");
    if (max) sp.set("max", max);
    else sp.delete("max");
    sp.delete("page");
    router.push(`${path}?${sp.toString()}`);
  };

  const setSort = (v: string) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("sort", v);
    sp.delete("page");
    router.push(`${path}?${sp.toString()}`);
  };

  return (
    <aside className="sticky-top hidden lg:block pr-4 border-r">
      <div className="flex items-center justify-between py-2">
        <h2 className="font-semibold">Filtros</h2>
        <button
          className="text-blue-600 text-sm"
          onClick={() => router.push(path)}
        >
          Limpar tudo
        </button>
      </div>

      <details open className="py-3 border-t">
        <summary className="font-semibold cursor-pointer">Categoria</summary>
        <div className="grid grid-cols-2 gap-2 py-3">
          {categories.map((c) => (
            <label
              key={c}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={current.cat.includes(c)}
                onChange={() => toggle("cat", c)}
              />
              {c}
            </label>
          ))}
        </div>
      </details>

      <details open className="py-3 border-t">
        <summary className="font-semibold cursor-pointer">Tamanho</summary>
        <div className="grid grid-cols-3 gap-2 py-3">
          {sizes.map((s) => (
            <label
              key={s}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={current.size.includes(s)}
                onChange={() => toggle("size", s)}
              />
              {s}
            </label>
          ))}
        </div>
      </details>

      <details open className="py-3 border-t">
        <summary className="font-semibold cursor-pointer">Cor</summary>
        <div className="grid grid-cols-2 gap-2 py-3">
          {colors.map((c) => (
            <label
              key={c}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={current.color.includes(c)}
                onChange={() => toggle("color", c)}
              />
              {c}
            </label>
          ))}
        </div>
      </details>

      <details open className="py-3 border-t">
        <summary className="font-semibold cursor-pointer">Preço</summary>
        <div className="flex items-center gap-2 py-3 flex-wrap">
          <label className="text-sm">
            De R${" "}
            <input
              className="border rounded px-2 py-1 w-24"
              placeholder="0"
              defaultValue={current.min || ""}
              onBlur={(e) =>
                setRange(
                  e.currentTarget.value || undefined,
                  current.max || undefined
                )
              }
            />
          </label>
          <label className="text-sm">
            Até R${" "}
            <input
              className="border rounded px-2 py-1 w-24"
              placeholder="999"
              defaultValue={current.max || ""}
              onBlur={(e) =>
                setRange(
                  current.min || undefined,
                  e.currentTarget.value || undefined
                )
              }
            />
          </label>
        </div>
      </details>

      <div className="py-3 border-t flex items-center justify-between">
        <label className="text-sm">Ordenar por:</label>
        <select
          className="border rounded px-2 py-1"
          defaultValue={current.sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="offers">Ofertas</option>
          <option value="low">Menor preço</option>
          <option value="high">Maior preço</option>
          <option value="new">Novidades</option>
        </select>
      </div>
    </aside>
  );
}
