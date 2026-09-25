# LIVE SERP review required

Manual Naver **웹** tab checks (logged-in state may differ).  
Last automated evidence: **2026-09-25 ~23:50 KST** — see `inheritance-serp/*.csv`.

## Queries

1. **부산 상속 법무사**  
   https://search.naver.com/search.naver?where=web&query=%EB%B6%80%EC%82%B0+%EC%83%81%EC%86%8D+%EB%B2%95%EB%AC%B4%EC%82%AC  

   - Confirm Daom rank + URL (`/부산상속법무사` vs homepage).  
   - Note if blog/tistory uses title「부산 상속 법무사｜상속등기·상속포기·한정승인」.

2. **부산 상속포기 법무사**  
   https://search.naver.com/search.naver?where=web&query=%EB%B6%80%EC%82%B0+%EC%83%81%EC%86%8D%ED%8F%AC%EA%B8%B0+%EB%B2%95%EB%AC%B4%EC%82%AC  

   - **Primary:** Daom URL must move to `/부산상속포기` post-deploy.  
   - Compare competitor dedicated 포기 URLs.

3. **부산 상속전문 법무사**  
   https://search.naver.com/search.naver?where=web&query=%EB%B6%80%EC%82%B0+%EC%83%81%EC%86%8D%EC%A0%84%EB%AC%B8+%EB%B2%95%EB%AC%B4%EC%82%AC  

   - Page 1 vs 2 lawyer dominance.  
   - Whether `/부산상속전문법무사` appears (should stay weak/noindex).

## Record updates
- Append rows to `reports/inheritance-serp/serp-busan-*.csv`  
- Merge snapshot → `inheritance-seo/2026-09-25/01-live-serp-evidence.csv`
