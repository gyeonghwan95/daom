# SERP 캐러셀 상세 규칙

## 이미지 소유

`SERP_OWNED_IMAGES`는 PAGE_VISUALS가 없는 URL만 받는다. 한 URL 한 파일.

허용:

- 해당 구·군청·지원 실사 (`구청_북구청.jpg`, `썸네일-기장군청.jpg`, `썸네일-서부지원.jpg` 등)
- 공탁 갤러리처럼 그 페이지 전용으로 만든 카드
- 장소를 제목에 넣지 않은 사무소·업무 사진 (서구·동구처럼 구청 사진이 없을 때)

금지:

- 사상구 페이지에 해운대구청 사진
- 기장 페이지에 북구청 사진
- 기본 `getServiceImage("inheritance-registration")`를 구·군 카드로 재사용
- 글자만 다른 복제 이미지

alt는 사진 속 장소를 사실대로 쓰고, 그 구에 사무소가 있다고 쓰지 않는다.

## 팩 설계

- 4–7장. 5장 목표.
- href는 전부 indexable, self-canonical.
- 한 팩 안에서 이미지 경로 중복 금지. 리졸버가 중복 이미지를 skip한다.
- 상속 팩에 포기 URL을 넣어도 된다. 단, 포기 페이지를 상속 챔피언으로 리타이틀하지 않는다.
- 법인등기 허브(`/부산등기법무사`) 제목을 법인 챔피언처럼 바꾸지 않는다.

명시 팩이 없는 구·군은 `BUSAN_DISTRICT_HUBS`를 현재 위치 다음부터 회전하고 `/부산공탁`을 한 장 넣는다.

## 템플릿 연결

`PageSerpCarousel`을 넣는 위치: FAQ 앞 또는 관련 링크 앞. 이미 같은 ItemList를 그리는 블록이 있으면 하나만 남긴다.

이미 연결됨:

- HOME, PageDataTemplate, TopicHub, SearchIntent, Counsel, Corporate, Registry, 부산법무사 허브, NaverRecovery, PrioritySeo, Lecture, RegistrationChoiceCards

`/부산법인법무사`·`/부산부동산등기`는 상단 선택 카드가 팩을 담당하므로 하단 반복을 넣지 않는다.

## 검증 명령

```bash
npm run audit:serp-carousel
```

필수 경로가 4장 미만이면 exit 1. 파일 없는 소유 이미지도 실패.

라이브 확인(배포 후):

- 홈 소스에 `"@type":"ItemList"` 와 사상구·기장·강서·북구·공탁 href
- 각 카드 URL의 `og:image`가 기본 OG와 다름
- Yeti/네이버 수집은 사용자 승인 없이 제출하지 않음

## 관측

캐러셀은 색인·클릭·이미지 고유성에 따라 네이버가 켠다. 배포 직후 안 보여도 코드 실패가 아니다. D+7에 브랜드·구·군·공탁 질의로 모듈 유무만 기록한다.
