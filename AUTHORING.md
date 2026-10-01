# 제작 규칙 (Authoring Guide)

JLPT N5 문법 교재의 강의를 **일관되게** 만들기 위한 규칙 모음.
새 강의를 만들 때는 이 문서를 먼저 읽고, 기존 Lesson(특히 `lessons/n5/01.html`~`08.html`)의 구조를 복사해 시작한다.

> 핵심 철학: 문장을 **조각(명사+조사 / 화제·정보·질문 / 그룹→규칙)**으로 보여준다.
> 통째로 외우게 하지 않고, **같은 뼈대에 무엇이 바뀌는지**를 눈으로 보여준다.

**무엇을 어떤 순서로** 가르치는지는 [CURRICULUM.md](CURRICULUM.md)(전체 24강 로드맵)에서 확인한다.
새 강의를 시작하기 전, 해당 Lesson의 핵심 문법·"할 수 있게 되는 것"·이전/다음 연결·주의점을 로드맵에서 먼저 읽는다.

---

## 1. 폴더 / 파일 구조

```
index.html                 허브 (카드 자동 생성)
lessons/n5/0N.html         N5 강의 (asset 경로 ../../assets/...)
assets/css/styles.css      디자인 시스템 + 강의별 컴포넌트
assets/js/main.js          공통 인터랙션 (모든 Lesson 공유)
assets/data/lessons.js     강의 메타데이터 + 허브 렌더러
assets/fonts/              SCDream(본문) · omyu pretty(포인트)
README.md                  강의 목록 개요
AUTHORING.md               (이 문서)
```

새 강의 추가 체크리스트:
1. `lessons/n5/0N.html` 작성 (기존 Lesson 복사 → 교체)
2. `assets/data/lessons.js`의 `N5_LESSONS` 배열에 항목 1개 추가
3. `README.md` 강의 목록에 한 줄 추가
4. 새 시각화가 필요하면 `styles.css` 끝에 `LESSON N 전용 컴포넌트` 블록 추가, 공통 인터랙션은 `main.js`에 `initXxx` 추가 후 `DOMContentLoaded`에 등록
5. 검증 (§8) 후 커밋·푸시

**중요: 공통 자산(css/js/data)은 되도록 재사용·확장만 한다.** 기존 컴포넌트를 바꿀 때는 이전 Lesson이 깨지지 않는지 확인한다(예: `initTransformer`에 `data-mode`를 추가하되 기본값 noun 유지).

---

## 2. 페이지 골격 (HTML skeleton)

모든 Lesson은 동일한 뼈대를 쓴다.

```html
<!DOCTYPE html><html lang="ko"><head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lesson N · 제목 「패턴」 — JLPT N5 문법</title>
  <meta name="description" content="..." />
  <link rel="stylesheet" href="../../assets/css/styles.css" />
</head><body>
  <!-- 모바일 상단바 -->
  <div class="topbar">
    <button class="hamburger" ...><span></span></button>
    <div class="topbar__title">Lesson N · 짧은제목</div>
    <span class="topbar__prog" data-prog-txt>1 / 총섹션수</span>
  </div>
  <div class="scrim" aria-hidden="true"></div>

  <div class="app">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <div class="sidebar__logo jp">상징글자</div>
        <div class="sidebar__title">JLPT N5 문법<small>Lesson N · ...</small></div>
      </div>
      <nav><ul class="toc"> … <li><a href="#id"><span class="num">0</span> 라벨</a></li> … </ul></nav>
      <a class="sidebar__back" href="../../index.html">← 강의 목록으로</a>
    </aside>

    <div class="content"><div class="wrap">
      <header class="lesson-hero">
        <div class="kicker">JLPT N5 Grammar · Lesson N</div>
        <h1>제목</h1>
        <div class="lesson-hero__pattern jp">핵심패턴</div>
        <div class="progress">
          <div class="progress__bar"><div class="progress__fill"></div></div>
          <span class="progress__txt" data-prog-txt>1 / 총섹션수</span>
        </div>
      </header>

      <section id="id" class="section">
        <h2><span class="sec-no">00</span> 섹션 제목</h2>
        …
      </section>
      …
    </div></div>
  </div>

  <nav class="bottomnav">
    <a href="../../index.html"><span class="bn-ico">☰</span>강의목록</a>
    <button type="button" data-open-toc><span class="bn-ico">📑</span>목차</button>
    <a href="#첫섹션id"><span class="bn-ico">↑</span>맨 위로</a>
  </nav>

  <script src="../../assets/js/main.js"></script>
</body></html>
```

규칙:
- **사이드바 TOC의 `href="#id"`와 각 `<section id="id">`는 정확히 1:1 일치**해야 한다(스크롤스파이가 이걸로 동작).
- `data-prog-txt`는 상단바·히어로 2곳. 값 `1 / N`의 N은 **본문 `.section` 개수**와 맞춘다(진행바 JS가 자동 계산하므로 초기값만 맞추면 됨).
- `sec-no`는 `00`,`01`… 2자리. TOC `num`은 0,1,2… 로 섹션 순서와 일치.
- 섹션 0은 보통 "배우는 것"(목표), 마지막은 "다음 Lesson", 그 앞은 "핵심 · 10초 복습".

---

## 3. 표준 섹션 흐름

강의마다 조금씩 다르지만 대체로 이 순서를 따른다(대본의 "권장 순서"를 §로 압축):

1. 배우는 것 (`goal`/`intro`) — `.lead` + `ul.goals` + `.oneline`
2. 개념/패턴 설명 (`.gpat` Grammar Pattern)
3. 핵심 시각화들 (대본의 Priority 순서대로)
4. 대표 예문 (`.ex`)
5. 헷갈리는 부분 (`.mistakes` + 필요시 `.card--warn`)
6. (선택) Grammar Growth (`.growth`)
7. Check Quiz (`.quiz`) — 7~10문항
8. 오늘의 핵심 (`.keygrid`) + 10초 복습 (`.recall`)
9. 다음 Lesson (`.closing` + `.nextlist`)

대본이 주어지면: **대본의 "Priority 1~N" 시각화는 반드시 구현**하고, 나머지 시각화는 기존 컴포넌트로 최대한 재사용한다.

### 콘텐츠 원칙 (내용 작성 시 지킬 것)

- **학습 흐름**: 개념 이해 → 실제 문장에서 확인 → 헷갈리는 부분 → 문제. 회화식 반복(단어 바꿔 반복·긴 작문·역할극·자유회화·과한 번역연습)은 넣지 않는다.
- **대표 예문은 문법당 2~4개**. 많이 나열하지 않는다. 어휘는 **N5 기본 어휘** 중심. 필요하면 `日本へ / 行き / たいです`처럼 조각 구조를 짧게 덧붙인다.
- **이전 강과 연결(누적감)**: 새 문법은 이미 배운 문법 위에 쌓는다. 본문에서 "N강에서 배운 ~" 식으로 짚고, `.growth`(Grammar Growth)·`.coming`(Coming Soon)으로 연결감을 준다. → 연결 지점은 [CURRICULUM.md](CURRICULUM.md)의 "연결"을 참고.
- **예외/주의**: 규칙 / 대표 예외 / 자주 쓰는 형태를 구분해 설명한다. `行く→行って` 같은 중요한 예외는 `.card--warn`으로 눈에 띄게. 단, N5에서 몰라도 되는 세부 예외까지 확장하지 않는다(스코프는 §10, 범위는 CURRICULUM 자체검토).
- **오늘의 핵심은 3~6줄**로 짧게(모바일 한눈). `.keygrid` 카드 4~5개 수준.
- **퀴즈는 함정용 부자연스러운 문장 금지.** 기본 확인 → 약간 헷갈리는 순서. 문법 이해를 확인하는 것이 목적(빈칸 선택·올바른 형태·구조 이해 유형을 섞는다).
- **일반 설명 영역을 전부 카드로 만들지 않는다.** 카드/`.figure`는 Grammar Pattern·시각화·비교·경고·퀴즈 등 **강조가 필요한 것만**. 페이지가 조각조각 나 보이지 않게 한다.

---

## 4. 타이포 / 폰트 / 한자 읽기

- 한국어 본문: 기본 `--font-body`(SCDream). 포인트(라벨·kicker)는 `--font-cute`(omyu).
- **일본어는 반드시 `class="jp"`** (→ `--font-jp` 시스템 폰트, 약간 크게). 일본어 핵심 패턴은 한국어 설명보다 크게, Grammar Pattern이 가장 크게.
- **후리가나는 본문에 괄호로 상시 노출하지 않는다.** 한자에 탭/hover 툴팁:
  `<span class="furi" data-yomi="よみ">漢字</span>` (JS `initFurigana`가 처리, 모바일 탭 지원).
  - 같은 단어가 여러 번 나와도 매번 붙일 필요 없음(핵심/첫 등장 위주).
  - 예문의 읽기는 `.ex__reading`에 `漢字【よみ】` 형태로 보조 표기해도 됨.
- 읽기 안내는 **히라가나로**. 로마자는 화면에 쓰지 않는다.

---

## 5. 색 / 강조 규칙 (중요)

**강조색 1개(인디고 `--brand`) 중심.** 조사마다 영구적으로 다른 색을 주지 않는다.
문장 안에서는 **지금 설명 중인 요소만** 강조한다.

| 의미 | 토큰 | 용도 |
|---|---|---|
| 조사 전반 (は·を·に·へ·で·も·の·か) | `--particle` (= brand 계열) | `.pt`, `.pt--pill`, `.no` |
| 화제 TOPIC | `--topic` (indigo) | Sentence Anatomy 등 |
| 정보 INFORMATION / `が` / 2그룹 | `--info` (teal) | `が`는 항상 info, 2그룹도 info |
| 질문 QUESTION | `--ques` (amber) | `か` 변환 |
| 경고 / STATUS / 과거·부정 어미 / 불규칙·예외 | `--warn` (amber) | `.card--warn`, `.chg--neg` |
| 정답 / 오답 | `--ok` / `--no` | 퀴즈 |

변하는 어미 강조: `.chg`(긍정·brand) / `.chg--neg`(부정·warn). 고정되는 명사/어간은 중립색.
동사 그룹 색 관례: **1그룹=brand, 2그룹=info, 불규칙=warn** (Lesson 7~ 유지).

원칙: **색보다 역할명·위치·타이포로 의미를 전달**한다. 비슷한 단어가 많은 강(예: これ/それ/この)은 색 대신 그룹·공간으로 구분.

---

## 6. 재사용 컴포넌트 목록

새 시각화를 만들기 전에 아래에 맞는 게 있는지 먼저 확인한다.

### 레이아웃/텍스트
- `.card` (+`--key`/`--point`/`--warn`/`--tip`) — 강조 박스
- `.oneline` — 한 줄 핵심
- `ul.goals` / `ul.clean` — 목표/불릿
- `.gpat` — Grammar Pattern (중앙 큰 패턴, `data-gpat`면 조각 탭 설명)
- `.figure` + `.figure__title` + `.figure__cap` — 모든 시각화 컨테이너
- `.ex` (`__no`/`__jp`/`__ko`/`__reading`/`__struct`+`__row`) — 예문 카드
- `.coming` — Coming Soon 예고
- `.closing` + `.nextlist` — 다음 Lesson
- `.keygrid`/`.keycard`(`.full`) — 오늘의 핵심

### 문장 분해
- `.chunks` + `.chunk`(`__box`(`.is-pt`/`.is-no`/`.sm`)+`__cap`) — 명사+조사 블록, Sentence Blocks/Anatomy
- `.chunk-flow` — 블록 아래 흐름 한 줄
- `[data-nested]` + `.nested__l1`/`.nested__l2` + `.nested__ctrl[data-nested-btn]` — 탭하면 더 잘게 (JS `initNested`, `data-label`/`data-label-on`로 버튼 문구 변경)
- `.anatomy` + `[data-anatomy]` — 조각 탭 → 역할 강조 (JS `initAnatomy`, role-topic/info/ques/status)

### 비교/표
- `.vs2`(`.is-ha`/`.is-mo`) — 2열 비교 (은은한 색 2개)
- `.fourway`(`.fw`) — 2×2 (현재/과거 × 긍정/부정) → 모바일 1열
- `.axismap` — 2축 지도(비과거↔과거 / 긍정↔부정)
- `.cheat`(`__q`/`__arrow`/`__p`) — "질문 → 답" / "A → B" 행 목록 (매칭표에도 재사용)
- `.compare` / `.famgroup`+`.famrow`+`.famcell` / `.kosoado` — 한·일 대응, 지시어 패밀리, こそあど

### 그룹/활용 (Lesson 7~)
- `.groups3`(`.g3card` `.is-g1`/`.is-g2`/`.is-irr`) — 3그룹 개요
- `.shift`(`__center`/`__rays`/`__ray`) — 끝 글자 이동(1그룹)
- `.endlist`(`.endrow`) — 어미 목록
- `.decision`(`.decstep`/`.decpill`) — 단계별 판별 흐름

### 인터랙션 (JS 필요)
- `[data-transformer]` (JS `initTransformer`) — 시제×긍정부정 토글. `data-mode="noun"`(기본)/`"verb"`, `data-stem-jp`/`data-stem-ko`
- `[data-samenoun]` (JS `initSameNoun`) — 같은 명사+버튼별 문장 전환. 버튼 `.toggle`에 `data-jp`/`data-role`/`data-ko`
- `[data-spatial]` (JS `initSpatial`) — 위치 단어 버튼 → 예문 (`.locbtn`에 `data-jp`/`data-ko`)
- `.recall__card` (JS `initRecall`) — 탭하면 뒷면(일본어/정답) 노출. 10초 복습 + "직접 판별" 관찰용
- `[data-builder]` (JS `initBuilder`) — 프리셋 버튼으로 A/B 교체(Lesson 1 문장 빌더)
- `[data-ellipsis]`/`[data-transform]`/`[data-gpat]` — Lesson 1 전용(생략/평서→질문/패턴조각)

### 기타 조사/공간 (Lesson 4~5)
- `.place2`/`.scene`/`.zone` — に vs で 공간, Destination/Action Zone
- `.timeline` — 시간 핀
- `.pcards`(`.pcard`) — 조사 역할 카드
- `.exist2`(`.existcard`) — あります vs います
- `.qa2`(`.qacard`) — 질문→답 (は vs が 등)
- `.slot-filled`/`.slot-empty`/`.slotpair` — 빈 슬롯 유무(これ vs この)

---

## 7. 퀴즈 규칙

```html
<div class="qcard">
  <div class="q"><span class="qn">Q1</span> 질문 …</div>
  <div class="qstem jp">… <span class="blank">（　）</span> …</div>   <!-- 빈칸형이면 -->
  <ul class="mcq" data-answer="2">                                  <!-- 정답 옵션 번호 -->
    <li data-opt="1"><span class="opt">①</span><span class="jp">…</span></li>
    …
  </ul>
  <div class="qresult"></div>
  <button class="reveal-btn" style="display:none;">해설 보기</button>
  <div class="answer">
    <div class="atitle">정답 ② …</div>
    <div class="exp">해설 …</div>
  </div>
</div>
```

- `data-answer`는 정답의 `data-opt` 값. 선택 시 JS가 정답/오답(✓/✕) 표시 후 **해설 버튼을 노출**(정답 확인 전 해설 비노출).
- 7~10문항, 세로 배치. 앞쪽은 형태 확인, 뒤쪽은 구조 이해.
- 선택지 터치 영역 충분히(모바일), 흔들림 등 과한 애니메이션 금지.

---

## 8. 검증 체크리스트 (커밋 전 필수)

```bash
# 1) JS 문법
node --check assets/js/main.js && node --check assets/data/lessons.js

# 2) 섹션 id == TOC href (완전 일치해야 함)
diff <(grep -oE '<section id="[a-z0-9-]+"' lessons/n5/0N.html | grep -oE '"[a-z0-9-]+"' | tr -d '"' | sort) \
     <(grep -oE 'href="#[a-z0-9-]+"'       lessons/n5/0N.html | grep -oE '#[a-z0-9-]+'  | tr -d '#' | sort -u)

# 3) 태그 균형
echo "div $(grep -oc '<div' f)/$(grep -oc '</div>' f) · section $(grep -oc '<section' f)/$(grep -oc '</section>' f)"

# 4) 퀴즈 정답값 눈으로 확인
grep -oE 'data-answer="[0-9]"' lessons/n5/0N.html | grep -oE '[0-9]' | tr '\n' ' '

# 5) 인터랙션 훅 존재 확인 (data-samenoun, data-nested, recall__card 등)
```

- 일본어 입력은 **표기 정확성**이 생명. 조사 발음 주의: `は→わ`, `へ→え`, `を→お`(표기는 유지). 동사 활용 규칙(1그룹 끝음 변화, `う→わ`, `ある→ない`, `来る→来ない` 읽기 こない) 재확인.
- 모바일: 너비 고정 금지, wrap 허용. 긴 활용형(`ませんでした` 등) 줄바꿈 확인.

---

## 9. 메타데이터 / 커밋

`assets/data/lessons.js`:
```js
{ no: N, href: "lessons/n5/0N.html", title: "제목",
  pattern: "핵심패턴(<span class='pt'>조사</span> 강조 가능)",
  desc: "한 문단 설명", tags: ["…","…"], status: "ready" }
```

커밋 메시지: `Lesson N · 핵심 패턴` 제목 + 불릿 요약, 끝에
`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
브랜치 `main`, 원격 `origin`(github.com/yechanj/japgram). GitHub Pages로 공개.

---

## 10. 하지 않을 것 (스코프)

각 강 대본의 "이번 강에서 하지 않을 것"을 존중한다. 다음 Lesson에서 배울 내용을 미리 깊게 설명하지 말고, 필요하면 `.coming`(Coming Soon)으로 **연결감만** 준다. N5 범위를 넘는 문법 용어(활용 명칭 등)는 보조 설명 수준으로만.
