import { BUSAN_REGISTRY_OFFICES } from "@/lib/geo/busan-registry";

/**
 * 부산 부동산 소재지별 관할 등기소 표 — 공식 기준(src/lib/geo/busan-registry.ts, 2021 등기국 통합 이후).
 * 2026-11-24 AI 브리핑 측정: "부산 부동산등기·소유권이전등기 법무사"에서 AI가 경쟁 블로그의 등기소 관할(일부 오류)을 인용했다.
 * 정확한 표를 핵심 부동산 페이지 몇 곳에만 둔다(같은 표를 수십 쪽에 반복하지 않음).
 */
export function BusanRegistryTable() {
  const offices = Object.values(BUSAN_REGISTRY_OFFICES);
  return (
    <table className="mt-3 w-full border-collapse text-left text-sm" data-registry-table>
      <caption className="mb-1 text-left text-xs font-semibold text-navy/60">
        부산 부동산 소재지별 관할 등기소
      </caption>
      <thead>
        <tr className="border-t border-beige-dark/70">
          <th scope="col" className="w-[7.5rem] py-2 pr-3 font-medium text-navy sm:w-40">
            부동산 소재지
          </th>
          <th scope="col" className="py-2 font-medium text-navy">
            관할 등기소
          </th>
        </tr>
      </thead>
      <tbody>
        {offices.map((o) => (
          <tr key={o.id} className="border-t border-beige-dark/70 align-top">
            <td className="py-2 pr-3 text-navy/80">{o.districts.join("·")}</td>
            <td className="py-2 leading-relaxed text-navy/80">
              {o.name}
              <span className="block text-xs text-navy/55">{o.address}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
