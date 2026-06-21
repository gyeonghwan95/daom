let kakaoMapsLoadPromise: Promise<void> | null = null;

export function loadKakaoMaps(appKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Kakao Maps는 브라우저에서만 사용할 수 있습니다."));
  }

  if (window.kakao?.maps) {
    return new Promise((resolve) => {
      window.kakao!.maps.load(resolve);
    });
  }

  kakaoMapsLoadPromise ??= new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-map-sdk="true"]',
    );

    if (existing) {
      existing.addEventListener("load", () => {
        window.kakao?.maps.load(resolve);
      });
      existing.addEventListener("error", () => {
        reject(new Error("Kakao Maps SDK 로드 실패"));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;
    script.async = true;
    script.dataset.kakaoMapSdk = "true";
    script.onload = () => {
      window.kakao?.maps.load(resolve);
    };
    script.onerror = () => {
      kakaoMapsLoadPromise = null;
      reject(new Error("Kakao Maps SDK 로드 실패"));
    };
    document.head.appendChild(script);
  });

  return kakaoMapsLoadPromise;
}
