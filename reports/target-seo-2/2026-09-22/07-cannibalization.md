# 07 — Cannibalization

## 강사 cluster

한 허브 `/부산법률강사`가 부산 강사·특강·강연 PRIMARY.
`/법률강의`는 pillar supporting (이번 작업 미수정).

## 전세 cluster

| URL | Role |
|-----|------|
| `/전세사기피해대응절차` | 피해 대응 + 법무사 업무 (PRIMARY 전세사기·전세사기 법무사) |
| `/전세사기예방교육` | 계약 전 예방 교육 (protected) |
| `/부산임차권등기명령` | 절차 spoke (protected) |
| `/부산전세보증금반환법무사` | 반환 점검 spoke (protected) |

CANNIBALIZATION_RISK between 전세사기 / 전세사기 법무사: **낮음** — 동일 URL 집중, title은 법무사 유지.

## 법률 자문

`/부산법률상담` IMPROVE; `/부산기업법률자문`는 기업 한정 (protected).
