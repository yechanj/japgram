/* =========================================================
   JLPT N5 Grammar Course — 공통 인터랙션 (바닐라 JS · 외부 의존 없음)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. 모바일 사이드바 드로어 ---------- */
  function initSidebar() {
    var sidebar = document.querySelector(".sidebar");
    var burger = document.querySelector(".hamburger");
    var scrim = document.querySelector(".scrim");
    if (!sidebar || !burger) return;
    function open() {
      sidebar.classList.add("open");
      if (scrim) scrim.classList.add("show");
      burger.setAttribute("aria-expanded", "true");
    }
    function close() {
      sidebar.classList.remove("open");
      if (scrim) scrim.classList.remove("show");
      burger.setAttribute("aria-expanded", "false");
    }
    burger.addEventListener("click", function () {
      sidebar.classList.contains("open") ? close() : open();
    });
    if (scrim) scrim.addEventListener("click", close);
    document.querySelectorAll("[data-open-toc]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        sidebar.classList.contains("open") ? close() : open();
      });
    });
    sidebar.querySelectorAll(".toc a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 860px)").matches) close();
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- 2. 스크롤스파이 + 진행바 ---------- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
    var sections = Array.prototype.slice.call(document.querySelectorAll(".content .section"));
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      if (document.getElementById(id)) map[id] = a;
    });
    if (links.length) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("active"); });
            if (map[en.target.id]) map[en.target.id].classList.add("active");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      sections.forEach(function (s) { if (map[s.id]) obs.observe(s); });
    }

    // 읽기 진행바
    var fill = document.querySelector(".progress__fill");
    var ptxts = document.querySelectorAll("[data-prog-txt]");
    var total = sections.length || 1;
    function updateProg() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      var pct = Math.max(4, Math.min(100, Math.round(ratio * 100)));
      if (fill) fill.style.width = pct + "%";
      // 현재 섹션 index
      var current = 1;
      sections.forEach(function (s, i) {
        if (s.getBoundingClientRect().top <= 120) current = i + 1;
      });
      ptxts.forEach(function (t) { t.textContent = current + " / " + total; });
    }
    window.addEventListener("scroll", updateProg, { passive: true });
    window.addEventListener("resize", updateProg);
    updateProg();
  }

  /* ---------- 3. Quiz reveal (해설 보기) ---------- */
  function initQuizReveal() {
    document.querySelectorAll(".reveal-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var ans = btn.parentElement.querySelector(".answer");
        if (!ans) return;
        var shown = ans.classList.toggle("show");
        btn.textContent = shown ? "해설 숨기기" : "해설 보기";
      });
    });
  }

  /* ---------- 4. MCQ (정답 선택 후에만 해설 노출) ---------- */
  function initMCQ() {
    document.querySelectorAll(".mcq").forEach(function (list) {
      var answer = list.getAttribute("data-answer");
      var card = list.closest(".qcard");
      var revealBtn = card ? card.querySelector(".reveal-btn") : null;
      var result = card ? card.querySelector(".qresult") : null;
      list.querySelectorAll("li").forEach(function (li) {
        li.addEventListener("click", function () {
          if (list.getAttribute("data-done")) return;
          list.setAttribute("data-done", "1");
          var picked = li.getAttribute("data-opt");
          list.querySelectorAll("li").forEach(function (x) {
            if (x.getAttribute("data-opt") === answer) x.classList.add("correct");
          });
          var correct = picked === answer;
          if (!correct) li.classList.add("wrong");
          if (result) {
            result.classList.add("show", correct ? "ok" : "no");
            result.innerHTML = correct
              ? "<span>✓</span> 정답입니다."
              : "<span>✕</span> 다시 확인해보세요.";
          }
          // 정답 선택 이후에만 해설 버튼 활성화
          if (revealBtn) revealBtn.style.display = "inline-block";
        });
      });
    });
  }

  /* ---------- 5. Grammar Pattern — 조각 탭 설명 ---------- */
  function initGrammarPattern() {
    document.querySelectorAll("[data-gpat]").forEach(function (root) {
      var pop = root.querySelector(".gpat__pop");
      var toks = root.querySelectorAll(".gpat__tok");
      toks.forEach(function (tok) {
        tok.addEventListener("click", function () {
          var wasActive = tok.classList.contains("active");
          toks.forEach(function (t) { t.classList.remove("active"); });
          if (wasActive) { if (pop) pop.classList.remove("show"); return; }
          tok.classList.add("active");
          if (pop) {
            pop.innerHTML = tok.getAttribute("data-exp");
            pop.classList.add("show");
          }
        });
      });
    });
  }

  /* ---------- 6. Sentence Builder — 프리셋 ---------- */
  function initBuilder() {
    document.querySelectorAll("[data-builder]").forEach(function (root) {
      var aEl = root.querySelector("[data-slot-a]");
      var bEl = root.querySelector("[data-slot-b]");
      var rjp = root.querySelector("[data-result-jp]");
      var rko = root.querySelector("[data-result-ko]");
      var btns = root.querySelectorAll(".preset-btn");
      function apply(btn) {
        var a = btn.getAttribute("data-a");
        var b = btn.getAttribute("data-b");
        var ko = btn.getAttribute("data-ko");
        if (aEl) aEl.textContent = a;
        if (bEl) bEl.textContent = b;
        if (rjp) rjp.innerHTML = a + "<span class='pt'>は</span>" + b + "です。";
        if (rko) rko.textContent = ko;
        btns.forEach(function (x) { x.classList.remove("active"); });
        btn.classList.add("active");
      }
      btns.forEach(function (b) { b.addEventListener("click", function () { apply(b); }); });
      if (btns.length) apply(btns[0]);
    });
  }

  /* ---------- 7. Ellipsis — 단계별 생략 ---------- */
  function initEllipsis() {
    document.querySelectorAll("[data-ellipsis]").forEach(function (root) {
      var btn = root.querySelector(".ellipsis__ctrl");
      var target = root.querySelector("[data-ellipsis-word]");
      if (!btn || !target) return;
      var step = 0; // 0: 전체, 1: 흐림, 2: 사라짐
      function render() {
        target.classList.remove("faded", "gone");
        if (step === 1) target.classList.add("faded");
        if (step === 2) target.classList.add("gone");
        btn.textContent = step === 0 ? "생략해보기 →"
          : step === 1 ? "완전히 생략 →" : "처음부터 다시";
      }
      btn.addEventListener("click", function () {
        step = (step + 1) % 3;
        render();
      });
      render();
    });
  }

  /* ---------- 8. Transformation — +か 추가 ---------- */
  function initTransform() {
    document.querySelectorAll("[data-transform]").forEach(function (root) {
      var btn = root.querySelector("[data-transform-btn]");
      var result = root.querySelector("[data-transform-result]");
      if (!btn || !result) return;
      btn.addEventListener("click", function () {
        result.style.visibility = "visible";
        var add = result.querySelector(".add");
        if (add) { add.style.animation = "none"; void add.offsetWidth; add.style.animation = ""; }
        btn.disabled = true;
        btn.style.opacity = ".55";
      });
    });
  }

  /* ---------- 9. Sentence Anatomy — 조각 탭 → 역할 강조 ---------- */
  function initAnatomy() {
    document.querySelectorAll("[data-anatomy]").forEach(function (root) {
      var pieces = root.querySelectorAll(".anatomy__piece");
      var roles = root.querySelectorAll(".arole");
      pieces.forEach(function (p) {
        p.addEventListener("click", function () {
          var role = p.getAttribute("data-role");
          var wasActive = p.classList.contains("active");
          pieces.forEach(function (x) { x.classList.remove("active"); });
          if (wasActive) {
            roles.forEach(function (r) { r.classList.remove("dim"); });
            return;
          }
          p.classList.add("active");
          roles.forEach(function (r) {
            r.classList.toggle("dim", r.getAttribute("data-role") !== role);
          });
        });
      });
    });
  }

  /* ---------- 10. Furigana 툴팁 (탭/hover) ---------- */
  function initFurigana() {
    var pop = document.createElement("div");
    pop.className = "furi-pop";
    document.body.appendChild(pop);
    var hideTimer = null;

    function show(el) {
      var yomi = el.getAttribute("data-yomi");
      if (!yomi) return;
      pop.textContent = yomi;
      pop.classList.add("show");
      var r = el.getBoundingClientRect();
      pop.style.left = (r.left + r.width / 2) + "px";
      pop.style.top = (r.top - 6) + "px";
    }
    function hide() { pop.classList.remove("show"); }

    document.querySelectorAll(".furi").forEach(function (el) {
      el.addEventListener("mouseenter", function () { clearTimeout(hideTimer); show(el); });
      el.addEventListener("mouseleave", function () { hideTimer = setTimeout(hide, 80); });
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        if (pop.classList.contains("show") && pop.textContent === el.getAttribute("data-yomi")) {
          hide();
        } else { show(el); }
      });
    });
    document.addEventListener("click", hide);
    window.addEventListener("scroll", hide, { passive: true });
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initSidebar();
    initScrollSpy();
    initQuizReveal();
    initMCQ();
    initGrammarPattern();
    initBuilder();
    initEllipsis();
    initTransform();
    initAnatomy();
    initFurigana();
  });
})();
