import Image from "next/image";

type ProofItem = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

/** 부산 밖 부동산·지역 관청과 오간 실제 서류. 신청인·지번·수신인 연락처는 가려진 것만 쓴다. */
const ITEMS: ProofItem[] = [
  {
    src: "/image/서류/신청서_상속_타지역.jpg",
    alt: "경상북도 포항시와 강원특별자치도 부동산의 협의분할 상속 소유권이전등기 신청서(인적사항·지번 가림)",
    caption:
      "경상북도 포항시와 강원특별자치도에 있는 부동산의 협의분할 상속등기 신청서입니다. 인적사항과 지번은 가렸습니다.",
    width: 1500,
    height: 1854,
  },
  {
    src: "/image/서류/우편_상속_타지역.jpg",
    alt: "부산 기장군, 강원도 원주시, 경상북도 포항시 관청 세무과로 보내는 취득세 신고 서류 우편 봉투(수신 주소·연락처 가림)",
    caption:
      "부동산이 있는 지역의 관청 세무과(부산 기장군·원주시·포항시)로 상속 취득세 신고 서류를 보낸 우편입니다. 수신 주소와 연락처는 가렸습니다.",
    width: 1500,
    height: 1838,
  },
];

/**
 * 비대면·타지역 상속 안내의 근거 자료. "가능합니다"라는 설명만 두지 않고,
 * 부산 밖 부동산을 다룬 실제 서류(개인정보 가림)를 함께 보여 준다.
 */
export function RemoteCaseProof({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-6 ${className}`.trim()} role="group" aria-label="부산 밖 부동산 처리 서류 예시">
      <p className="text-sm font-semibold text-navy sm:text-base">
        부산 밖 부동산도 이렇게 진행해 왔습니다
      </p>
      <p className="mt-1 text-sm leading-relaxed text-navy/75">
        실제로 다룬 서류입니다. 의뢰인 정보는 가렸습니다.
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {ITEMS.map((item) => (
          <figure key={item.src} className="overflow-hidden rounded-lg border border-beige-dark bg-white">
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(min-width: 640px) 420px, 100vw"
              className="h-auto w-full"
              loading="lazy"
            />
            <figcaption className="px-3 py-3 text-xs leading-relaxed text-navy/75 sm:text-sm">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
