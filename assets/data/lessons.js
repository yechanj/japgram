/* =========================================================
   강의 메타데이터
   - 새 강의 추가: N5_LESSONS 배열에 항목 한 줄 등록
   - href 예) "lessons/n5/01.html"
   ========================================================= */
window.N5_LESSONS = [
  {
    no: 1,
    href: "lessons/n5/01.html",
    title: "일본어 문장의 첫 번째 뼈대",
    pattern: "A<span class='pt'>は</span>B です",
    desc: "일본어 문장을 만드는 가장 기본 구조 「AはBです」. 조사 は가 화제를 표시한다는 개념, です로 정중하게 끝맺기, か로 질문 만들기, 그리고 문맥상 생략까지.",
    tags: ["は (화제)", "です", "～ですか", "は→わ 읽기", "생략"],
    status: "ready"
  },
  {
    no: 2,
    href: "lessons/n5/02.html",
    title: "아니다 · 이었다 · 아니었다",
    pattern: "です <span class='pt'>/</span> でした",
    desc: "명사문을 です·ではありません·でした·ではありませんでした로 변형해 현재/과거 × 긍정/부정을 조절하고, 조사 も(~도)까지 배웁니다. 명사는 그대로 두고 문장 끝만 활용한다는 감각을 익힙니다.",
    tags: ["ではありません", "でした", "ではありませんでした", "も (~도)", "は vs も"],
    status: "ready"
  },
  {
    no: 3,
    href: "lessons/n5/03.html",
    title: "누구의 것? 어떤 것?",
    pattern: "A <span class='pt'>の</span> B ・ これ / この",
    desc: "명사를 연결하는 の(A가 B를 설명), 사물을 가리키는 これ/それ/あれ, 명사를 꾸미는 この/その/あの와 どれ·どの. これ vs この의 차이와 こそあど 패턴을 익힙니다.",
    tags: ["の (명사 연결)", "これ / それ / あれ", "この / その / あの", "どれ / どの", "こそあど"],
    status: "ready"
  }
];

/* ---------- 허브 렌더링 ---------- */
(function () {
  function lessonCard(l) {
    var ready = l.status === "ready";
    var tags = (l.tags || []).map(function (t) { return "<span class='lc-tag'>" + t + "</span>"; }).join("");
    var statusTxt = ready ? "학습 시작 →" : "준비 중";
    var cls = "lesson-card" + (ready ? "" : " disabled");
    var href = ready ? l.href : "#";
    return (
      "<a class='" + cls + "' href='" + href + "'>" +
        "<div class='lc-no'>Lesson " + l.no + "</div>" +
        (l.pattern ? "<div class='lc-pat jp'>" + l.pattern + "</div>" : "") +
        "<h3>" + l.title + "</h3>" +
        "<p>" + l.desc + "</p>" +
        (tags ? "<div class='lc-tags'>" + tags + "</div>" : "") +
        "<div class='lc-status'>" + statusTxt + "</div>" +
      "</a>"
    );
  }

  function emptyCard() {
    return (
      "<div class='lesson-card disabled'>" +
        "<div class='lc-no'>준비 중</div>" +
        "<h3>곧 추가됩니다</h3>" +
        "<p>다음 Lesson이 순차적으로 업로드됩니다.</p>" +
        "<div class='lc-status'>준비 중</div>" +
      "</div>"
    );
  }

  window.N5_renderHub = function (gridSel) {
    var mount = document.querySelector(gridSel);
    if (!mount) return;
    var lessons = (window.N5_LESSONS || []).slice().sort(function (a, b) { return a.no - b.no; });
    var cards = lessons.length ? lessons.map(lessonCard).join("") : emptyCard();
    // 예정된 다음 강의 placeholder 하나 추가
    cards += emptyCard();
    mount.innerHTML =
      "<div class='grid-head'><span class='grid-head__ico'>あ</span>" +
      "<span>JLPT N5 · 기초 문법</span></div>" +
      "<div class='lesson-grid'>" + cards + "</div>";
  };
})();
