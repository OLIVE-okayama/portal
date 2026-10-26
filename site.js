
var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function(){
  var els = [].slice.call(document.querySelectorAll('.reveal, .stagger, .draw, .wipe'));
  if(!els.length) return;

  function showAll(){ els.forEach(function(e){ e.classList.add('in'); }); els = []; }
  if(REDUCE){ showAll(); return; }

  var ticking = false;
  function check(){
    ticking = false;
    if(!els.length) return;
    var trigger = window.innerHeight * 0.94;
    var remaining = [];
    for(var i = 0; i < els.length; i++){
      var el = els[i];
      var r = el.getBoundingClientRect();
      if(r.top < trigger){
        // already scrolled past -> reveal instantly, no transition
        if(r.bottom < 0) el.classList.add('in-fast');
        el.classList.add('in');
      } else remaining.push(el);
    }
    els = remaining;
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(check); } }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', check);
  window.addEventListener('pageshow', check);
  check();
  // fail-safe: nothing may stay invisible
  setTimeout(check, 400);
  setTimeout(showAll, 6000);
})();

(function(){
  var bar = document.getElementById('scrollProgress');
  if(!bar) return;
  var t = false;
  function up(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ requestAnimationFrame(up); t = true; } }, { passive:true });
  up();
})();

(function(){
  var btn = document.getElementById('navToggleBtn'), nav = document.getElementById('navLinks');
  if(!btn || !nav) return;
  btn.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); });
  });
})();

(function(){
  var b = document.getElementById('backToTop');
  if(!b) return;
  window.addEventListener('scroll', function(){ b.classList.toggle('show', window.scrollY > 700); }, { passive:true });
  b.addEventListener('click', function(){ window.scrollTo({ top:0, behavior: REDUCE ? 'auto' : 'smooth' }); });
})();

(function(){
  var hero = document.getElementById('heroSection');
  var glow = document.getElementById('heroGlow');
  var tilt = document.getElementById('heroTilt');
  if(!hero || REDUCE) return;
  hero.addEventListener('mousemove', function(e){
    var r = hero.getBoundingClientRect();
    var x = ((e.clientX - r.left) / r.width) * 100;
    var y = ((e.clientY - r.top) / r.height) * 100;
    if(glow){ glow.style.setProperty('--mx', x+'%'); glow.style.setProperty('--my', y+'%'); }
    if(tilt) tilt.style.transform = 'rotateX(' + (((y-50)/50)*-6) + 'deg) rotateY(' + (((x-50)/50)*8) + 'deg)';
  });
  hero.addEventListener('mouseleave', function(){ if(tilt) tilt.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
})();

(function(){
  var cs = document.querySelectorAll('.count[data-target]');
  if(!cs.length) return;
  function fmt(v,d){ return v.toLocaleString('ja-JP',{ minimumFractionDigits:d, maximumFractionDigits:d }); }
  function run(el){
    var target = parseFloat(el.getAttribute('data-target'));
    var d = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if(REDUCE || isNaN(target)){ el.textContent = fmt(target,d); return; }
    var start = null, dur = 1500;
    function step(ts){
      if(start === null) start = ts;
      var p = Math.min((ts-start)/dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1-p,3)), d);
      if(p < 1) requestAnimationFrame(step); else el.textContent = fmt(target,d);
    }
    requestAnimationFrame(step);
  }
  if(!('IntersectionObserver' in window)){ cs.forEach(run); return; }
  var io = new IntersectionObserver(function(en){
    en.forEach(function(e){ if(e.isIntersecting){ run(e.target); io.unobserve(e.target); } });
  }, { threshold:0.5 });
  cs.forEach(function(c){ io.observe(c); });
})();

(function(){
  var btns = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
  if(!btns.length) return;
  function select(btn){
    btns.forEach(function(b){
      var on = (b === btn);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if(p) p.classList.toggle('active', on);
    });
  }
  btns.forEach(function(b,i){
    b.addEventListener('click', function(){ select(b); });
    b.addEventListener('keydown', function(e){
      var n = null;
      if(e.key === 'ArrowRight') n = btns[(i+1) % btns.length];
      if(e.key === 'ArrowLeft')  n = btns[(i-1+btns.length) % btns.length];
      if(n){ e.preventDefault(); n.focus(); select(n); }
    });
  });
})();

(function(){
  var wrap = document.getElementById('roadWrap'), fill = document.getElementById('roadFill');
  if(!wrap || !fill) return;
  var t = false;
  function up(){
    var r = wrap.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh * 0.62 - r.top) / r.height;
    fill.style.height = Math.max(0, Math.min(1, p)) * r.height + 'px';
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ requestAnimationFrame(up); t = true; } }, { passive:true });
  window.addEventListener('resize', up);
  up();
})();

(function(){
  if(REDUCE) return;
  var arts = Array.prototype.slice.call(document.querySelectorAll('.section-art'));
  if(!arts.length) return;
  var t = false;
  function up(){
    var vh = window.innerHeight;
    arts.forEach(function(a){
      var r = a.getBoundingClientRect();
      if(r.bottom < -100 || r.top > vh + 100) return;
      var c = (r.top + r.height/2 - vh/2) / vh;
      a.style.transform = 'translateY(' + (c * -14).toFixed(2) + 'px)';
    });
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ requestAnimationFrame(up); t = true; } }, { passive:true });
  up();
})();

/* ---- 3D tilt on cards ---- */
(function(){
  if(REDUCE || !window.matchMedia('(hover:hover)').matches) return;
  var cards = document.querySelectorAll('.tilt-card');
  cards.forEach(function(card){
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      card.style.transform = 'perspective(900px) rotateX(' + (((y-0.5)*-7).toFixed(2)) + 'deg) rotateY(' + (((x-0.5)*9).toFixed(2)) + 'deg) translateY(-6px)';
    });
    card.addEventListener('pointerleave', function(){ card.style.transform = ''; });
  });
})();

/* ---- soft page transition between pages ---- */
(function(){
  if(REDUCE) return;
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a') : null;
    if(!a) return;
    if(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if(a.target && a.target !== '_self') return;
    var href = a.getAttribute('href');
    if(!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(href)) return;
    if(!/\.html$/.test(href)) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(function(){ window.location.href = href; }, 240);
  });
  window.addEventListener('pageshow', function(){ document.body.classList.remove('leaving'); });
})();

/* ---- ecosystem card <-> ring node linking ---- */
(function(){
  var cards = document.querySelectorAll('.eco-card[data-stage]');
  if(!cards.length) return;
  cards.forEach(function(card){
    var node = document.getElementById('eco-n' + card.getAttribute('data-stage'));
    if(!node) return;
    card.addEventListener('mouseenter', function(){ node.classList.add('hot'); });
    card.addEventListener('mouseleave', function(){ node.classList.remove('hot'); });
    card.addEventListener('focusin',  function(){ node.classList.add('hot'); });
    card.addEventListener('focusout', function(){ node.classList.remove('hot'); });
  });
})();

/* ---- お知らせを news.js から描画 ---- */
(function(){
  var list = document.getElementById('newsList');
  if(!list) return;
  function esc(s){ return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var data = (typeof NEWS !== 'undefined' && Object.prototype.toString.call(NEWS) === '[object Array]') ? NEWS : [];
  if(!data.length){
    list.innerHTML = '<p style="padding:18px 0; color:var(--ink-soft); font-size:.9rem;">お知らせは準備中です。</p>';
    return;
  }
  var limit = parseInt(list.getAttribute('data-limit') || '0', 10);
  var items = (limit > 0) ? data.slice(0, limit) : data;
  var html = '';
  items.forEach(function(n){
    if(!n || !n.title) return;
    var inner = '<span class="date">' + esc(n.date) + '</span>'
              + '<span class="news-title">' + esc(n.title) + '</span>'
              + '<span class="tag">' + esc(n.tag) + '</span>';
    if(n.url){
      var ext = /^https?:/i.test(n.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
      html += '<a class="news-item" href="' + esc(n.url) + '"' + ext + '>' + inner + '</a>';
    } else {
      html += '<div class="news-item">' + inner + '</div>';
    }
  });
  list.innerHTML = html;
  list.classList.add('in');
})();

/* ---- 記事ページの日付・タグを news.js と常に一致させる ----
   news.js側でtag（カテゴリ名）やdateを直しても、記事本体のHTMLを
   1本ずつ書き換えなくて済むように、ここで上書きする。 */
(function(){
  var meta = document.querySelector('.article-meta');
  if(!meta) return;
  var data = (typeof NEWS !== 'undefined' && Object.prototype.toString.call(NEWS) === '[object Array]') ? NEWS : [];
  if(!data.length) return;
  var file = location.pathname.split('/').pop();
  var item = null;
  for (var i = 0; i < data.length; i++){
    if (data[i] && data[i].url && data[i].url.split('/').pop() === file){ item = data[i]; break; }
  }
  if(!item) return;
  var d = meta.querySelector('.date'), t = meta.querySelector('.tag');
  if(d && item.date) d.textContent = item.date;
  if(t && item.tag)  t.textContent = item.tag;
})();

/* ============================================================
   MOTION LAYER  ―  動きの制御（内容は変更しません）
   ============================================================ */

/* ---- 1. カードのスポットライト追従 ---- */
(function(){
  if(REDUCE || !window.matchMedia('(hover:hover)').matches) return;
  var sel = '.gate,.benefit,.body-card,.eco-card,.phase-card,.qs,.step3,.ask,.pager a,.trivia-card';
  var pending = null;
  document.addEventListener('pointermove', function(e){
    var card = e.target.closest ? e.target.closest(sel) : null;
    if(!card) return;
    if(pending) return;
    pending = requestAnimationFrame(function(){
      pending = null;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (((e.clientX - r.left)/r.width)*100).toFixed(1) + '%');
      card.style.setProperty('--my', (((e.clientY - r.top)/r.height)*100).toFixed(1) + '%');
    });
  }, { passive:true });
})();

/* ---- 2. ボタンのマグネット挙動 ---- */
(function(){
  if(REDUCE || !window.matchMedia('(hover:hover)').matches) return;
  var btns = Array.prototype.slice.call(document.querySelectorAll('.btn'));
  btns.forEach(function(b){
    var raf = null;
    b.addEventListener('pointermove', function(e){
      if(raf) return;
      raf = requestAnimationFrame(function(){
        raf = null;
        var r = b.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width/2)) / (r.width/2);
        var dy = (e.clientY - (r.top + r.height/2)) / (r.height/2);
        b.style.transform = 'translate(' + (dx*5).toFixed(2) + 'px,' + (dy*3 - 3).toFixed(2) + 'px)';
      });
    }, { passive:true });
    b.addEventListener('pointerleave', function(){ b.style.transform = ''; });
    b.addEventListener('blur', function(){ b.style.transform = ''; });
  });
})();

/* ---- 3. 写真の視差 ---- */
(function(){
  if(REDUCE) return;
  var imgs = Array.prototype.slice.call(
    document.querySelectorAll('.photo-band img, .photo-split .ps-img img'));
  if(!imgs.length) return;
  var live = [], t = false;
  var io = new IntersectionObserver(function(en){
    en.forEach(function(e){
      var i = live.indexOf(e.target);
      if(e.isIntersecting){ if(i < 0) live.push(e.target); }
      else if(i >= 0) live.splice(i,1);
    });
    up();
  }, { rootMargin:'80px 0px' });
  imgs.forEach(function(im){ io.observe(im); });
  function up(){
    var vh = window.innerHeight;
    live.forEach(function(im){
      var r = im.getBoundingClientRect();
      var c = (r.top + r.height/2 - vh/2) / vh;      /* -1 .. 1 */
      var shift = Math.max(-1, Math.min(1, c)) * -13; /* px */
      im.style.setProperty('--par', shift.toFixed(1) + 'px');
    });
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ t = true; requestAnimationFrame(up); } }, { passive:true });
  window.addEventListener('resize', up);
  up();
})();

/* ---- 4. 舞い落ちるオリーブの葉（装飾） ---- */
(function(){
  if(REDUCE) return;
  var hosts = Array.prototype.slice.call(document.querySelectorAll('.hero, .quote-band, .page-head-band'));
  if(!hosts.length) return;
  hosts.forEach(function(host, hi){
    var box = document.createElement('div');
    box.className = 'petals';
    box.setAttribute('aria-hidden','true');
    var n = host.classList.contains('hero') ? 9 : (host.classList.contains('page-head-band') ? 5 : 6);
    for(var i = 0; i < n; i++){
      var leaf = document.createElement('i');
      var dur = 14 + Math.random()*13;
      leaf.style.left = (Math.random()*96).toFixed(1) + '%';
      leaf.style.animationDuration = dur.toFixed(1) + 's';
      leaf.style.animationDelay = (-Math.random()*dur).toFixed(1) + 's';
      leaf.style.setProperty('--drift', ((Math.random()*150) - 60).toFixed(0) + 'px');
      box.appendChild(leaf);
    }
    if(getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.appendChild(box);
  });
})();

/* ---- 5. トップへ戻るボタンの進捗リング＋ヘッダーの影 ---- */
(function(){
  var btn = document.getElementById('backToTop');
  var head = document.querySelector('header.site');
  if(!btn && !head) return;
  var t = false;
  function up(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if(btn) btn.style.setProperty('--p', p.toFixed(1));
    if(head) head.classList.toggle('stuck', h.scrollTop > 12);
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ t = true; requestAnimationFrame(up); } }, { passive:true });
  up();
})();

/* ---- 6. ヒーロー／見出し帯のスクロール連動 ---- */
(function(){
  if(REDUCE) return;
  var hero = document.querySelector('.hero-grid');
  var head = document.querySelector('.page-head-band .ph-inner');
  if(!hero && !head) return;
  var t = false;
  function up(){
    var y = window.scrollY || document.documentElement.scrollTop;
    var vh = window.innerHeight;
    if(hero){
      var p = Math.max(0, Math.min(1, y / (vh * 0.85)));
      hero.style.setProperty('--heroFade', (1 - p * 0.85).toFixed(3));
      hero.style.setProperty('--heroRise', (p * 54).toFixed(1) + 'px');
      hero.style.setProperty('--heroZoom', (1 - p * 0.03).toFixed(4));
    }
    if(head){
      var q = Math.max(0, Math.min(1, y / (vh * 0.7)));
      head.style.setProperty('--headFade', (1 - q * 0.8).toFixed(3));
      head.style.setProperty('--headRise', (q * 38).toFixed(1) + 'px');
    }
    t = false;
  }
  window.addEventListener('scroll', function(){ if(!t){ t = true; requestAnimationFrame(up); } }, { passive:true });
  window.addEventListener('resize', up);
  up();
})();

/* ---- 7. 「4つの物語」：カードに合わせてイラストを切り替える ---- */
(function(){
  var stage = document.getElementById('storyStage');
  if(!stage) return;
  var arts  = Array.prototype.slice.call(stage.querySelectorAll('.story-art'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.trivia-card[data-story]'));
  if(!arts.length || !cards.length) return;
  var current = '1', timer = null, touched = false;
  function show(id){
    if(id === current) return;
    current = id;
    arts.forEach(function(a){ a.classList.toggle('is-active', a.getAttribute('data-story') === id); });
    cards.forEach(function(c){ c.classList.toggle('is-active', c.getAttribute('data-story') === id); });
  }
  cards.forEach(function(c){
    var id = c.getAttribute('data-story');
    c.addEventListener('mouseenter', function(){ touched = true; stop(); show(id); });
    c.addEventListener('focusin',    function(){ touched = true; stop(); show(id); });
    c.addEventListener('click',      function(){ touched = true; stop(); show(id); });
    c.addEventListener('touchstart', function(){ touched = true; stop(); show(id); }, { passive:true });
  });
  cards[0].classList.add('is-active');
  /* 触れられるまでは、ゆっくり自動で巡回する */
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }
  function start(){
    if(REDUCE || touched || timer) return;
    timer = setInterval(function(){
      var n = (parseInt(current, 10) % arts.length) + 1;
      show(String(n));
    }, 5200);
  }
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(en){
      en.forEach(function(e){ if(e.isIntersecting) start(); else stop(); });
    }, { threshold:.35 });
    io.observe(stage);
  } else { start(); }
})();

/* ---- PBLフィールド一望（pbl.html）：地図・しぼり込み・一覧・くわしい内容 ---- */
(function(){
  var app = document.getElementById('pblApp');
  if(!app) return;
  if(typeof PBL === 'undefined' || typeof PBL_FIELDS === 'undefined' || typeof PBL_UNIVS === 'undefined' || typeof OKAYAMA_MAP === 'undefined') return;

  var FIELDS = PBL_FIELDS, UNIVS = PBL_UNIVS, SKILLS = (typeof PBL_SKILLS !== 'undefined') ? PBL_SKILLS : [];
  var DATA = PBL.filter(function(p){ return p && p.title; });
  /* 年の新しい順（同じ年なら pbl.js に書いた順） */
  DATA = DATA.map(function(p,i){ return { p:p, i:i }; }).sort(function(a,b){
    var ya = parseInt(a.p.year,10) || 0, yb = parseInt(b.p.year,10) || 0;
    return (yb - ya) || (a.i - b.i);
  }).map(function(x){ return x.p; });

  var fieldById = {}, univById = {}, skillById = {};
  FIELDS.forEach(function(f){ fieldById[f.id] = f; });
  UNIVS.forEach(function(u){ univById[u.id] = u; });
  SKILLS.forEach(function(k){ skillById[k.id] = k; });
  function skillsOf(p){ return (p.skills || []).map(function(id){ return skillById[id]; }).filter(Boolean); }

  function esc(s){ return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function el(tag){ return document.createElementNS(SVGNS, tag); }
  function fieldOf(p){ return fieldById[p.field] || { id:'', name:'その他', color:'#7fa33e', icon:'leaf' }; }
  function univOf(p){ return univById[p.univ] || { id:'', name:p.univ || '', short:p.univ || '', type:'', home:'', url:'' }; }

  var state = { muni:'', field:'', univ:'', skill:'', q:'', inter:false };
  var SHOW_STEP = 12, shown = SHOW_STEP;

  var mapSvg = document.getElementById('pblMap'), headMap = document.getElementById('pblHeadMap');
  var tip = document.getElementById('pblTip');
  var resetBtn = document.getElementById('pblMapReset'), allBtn = document.getElementById('pblAllArea'), allN = document.getElementById('pblAllAreaN');
  var chipsBox = document.getElementById('pblFields'), skillBox = document.getElementById('pblSkills'), skillGrid = document.getElementById('pblSkillGrid'), univSel = document.getElementById('pblUniv'), qIn = document.getElementById('pblQ');
  var interBtn = document.getElementById('pblInter'), clearBtn = document.getElementById('pblClear');
  var head = document.getElementById('pblHead'), grid = document.getElementById('pblGrid'), empty = document.getElementById('pblEmpty');
  var dlg = document.getElementById('pblDialog'), dlgInner = document.getElementById('pdInner');
  var univList = document.getElementById('pblUnivList');
  var mapWrap = mapSvg ? mapSvg.parentNode : app;

  /* ---------- 地図を描く ---------- */
  var pathEls = {}, lblEls = {}, cntEls = {}, cntTxt = {};
  (function buildMap(){
    if(!mapSvg) return;
    var gP = el('g'), gL = el('g');
    OKAYAMA_MAP.muni.forEach(function(m){
      var p = el('path');
      p.setAttribute('d', m.d); p.setAttribute('class', 'm zero'); p.setAttribute('data-muni', m.name);
      p.setAttribute('tabindex', '0'); p.setAttribute('role', 'button'); p.setAttribute('aria-label', m.name);
      gP.appendChild(p); pathEls[m.name] = p;

      var small = m.name.length >= 4 || /[町村]$/.test(m.name);
      var t = el('text');
      t.setAttribute('x', m.cx); t.setAttribute('y', m.cy); t.setAttribute('class', 'lbl' + (small ? ' small' : ''));
      t.textContent = m.name; gL.appendChild(t); lblEls[m.name] = t;

      var g = el('g'); g.setAttribute('class', 'cnt'); g.style.display = 'none';
      var half = m.name.length * (small ? 8.8 : 10.5);
      g.setAttribute('transform', 'translate(' + (m.cx + half + 14) + ',' + (m.cy - 17) + ')');
      var c = el('circle'); c.setAttribute('r', '17'); var ct = el('text'); ct.setAttribute('y', '1');
      g.appendChild(c); g.appendChild(ct); gL.appendChild(g); cntEls[m.name] = g; cntTxt[m.name] = ct;

      if(headMap){ var hp = el('path'); hp.setAttribute('d', m.d); headMap.appendChild(hp); }
    });
    mapSvg.appendChild(gP); mapSvg.appendChild(gL);

    function pick(e){
      var t = e.target; while(t && t !== mapSvg && !(t.getAttribute && t.getAttribute('data-muni'))) t = t.parentNode;
      return (t && t !== mapSvg) ? t.getAttribute('data-muni') : null;
    }
    mapSvg.addEventListener('click', function(e){
      var name = pick(e); if(!name) return;
      setState({ muni: state.muni === name ? '' : name });
      if(state.muni && window.innerWidth <= 980 && head) head.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block:'start' });
    });
    mapSvg.addEventListener('keydown', function(e){
      if(e.key !== 'Enter' && e.key !== ' ') return;
      var name = pick(e); if(!name) return;
      e.preventDefault(); setState({ muni: state.muni === name ? '' : name });
    });
    if(tip){
      mapSvg.addEventListener('mousemove', function(e){
        var name = pick(e);
        if(!name){ tip.classList.remove('on'); return; }
        var n = mapCounts[name] || 0;
        tip.innerHTML = esc(name) + (n ? '　' + n + '件' : '') + '<small>' + (n ? 'クリックでしぼり込む' : 'この条件の事例はまだありません') + '</small>';
        tip.style.left = e.clientX + 'px'; tip.style.top = (e.clientY - 10) + 'px';
        tip.classList.add('on');
      });
      mapSvg.addEventListener('mouseleave', function(){ tip.classList.remove('on'); });
    }
  })();

  /* ---------- しぼり込み ---------- */
  function matches(p, ignore){
    if(ignore !== 'muni'  && state.muni  && p.muni  !== state.muni)  return false;
    if(ignore !== 'field' && state.field && p.field !== state.field) return false;
    if(ignore !== 'univ'  && state.univ  && p.univ  !== state.univ)  return false;
    if(ignore !== 'skill' && state.skill && (p.skills || []).indexOf(state.skill) < 0) return false;
    if(state.inter && !p.inter) return false;
    if(state.q){
      var hay = [p.title, p.summary, p.partner, p.muni, p.when, p.students, p.learn, univOf(p).name, fieldOf(p).name].concat(skillsOf(p).map(function(k){ return k.name; })).join(' ').toLowerCase();
      if(hay.indexOf(state.q.toLowerCase()) < 0) return false;
    }
    return true;
  }
  function countBy(key, ignore){
    var c = {};
    DATA.forEach(function(p){ if(matches(p, ignore)) c[p[key]] = (c[p[key]] || 0) + 1; });
    return c;
  }

  var mapCounts = {};
  function paintMap(){
    if(!mapSvg) return;
    mapCounts = countBy('muni', 'muni');
    var max = 0; OKAYAMA_MAP.muni.forEach(function(m){ max = Math.max(max, mapCounts[m.name] || 0); });
    var accent = state.field ? fieldOf({ field:state.field }).color : (getComputedStyle(document.documentElement).getPropertyValue('--olive').trim() || '#789c3a');
    mapWrap.style.setProperty('--pbl-accent', accent);
    OKAYAMA_MAP.muni.forEach(function(m){
      var n = mapCounts[m.name] || 0, p = pathEls[m.name], g = cntEls[m.name];
      if(n){
        var k = 0.28 + 0.72 * Math.sqrt(n / (max || 1));
        p.style.fill = accent; p.style.fillOpacity = k.toFixed(2);
        p.classList.remove('zero'); p.setAttribute('aria-label', m.name + '：' + n + '件');
        g.style.display = ''; cntTxt[m.name].textContent = n; g.classList.toggle('hot', n === max && max >= 3);
        lblEls[m.name].classList.remove('dim');
      } else {
        p.style.fill = ''; p.style.fillOpacity = ''; p.classList.add('zero'); p.setAttribute('aria-label', m.name + '：事例なし');
        g.style.display = 'none'; lblEls[m.name].classList.add('dim');
      }
      p.classList.toggle('sel', state.muni === m.name);
    });
    mapSvg.classList.toggle('has-sel', !!state.muni);
    if(resetBtn) resetBtn.hidden = !state.muni;
    if(allBtn){
      var na = mapCounts['県内各地'] || 0;
      allBtn.setAttribute('aria-pressed', state.muni === '県内各地' ? 'true' : 'false');
      if(allN) allN.textContent = na ? na + '件' : '';
    }
  }

  function renderChips(){
    if(!chipsBox) return;
    var c = countBy('field', 'field');
    chipsBox.innerHTML = FIELDS.map(function(f){
      var n = c[f.id] || 0;
      return '<button type="button" class="chip" style="--fc:' + esc(f.color) + '" data-field="' + esc(f.id) + '" aria-pressed="' + (state.field === f.id ? 'true' : 'false') + '">'
           + '<i></i>' + esc(f.name) + '<span class="n">' + n + '</span></button>';
    }).join('');
  }
  if(chipsBox) chipsBox.addEventListener('click', function(e){
    var b = e.target.closest ? e.target.closest('[data-field]') : null; if(!b) return;
    var id = b.getAttribute('data-field');
    setState({ field: state.field === id ? '' : id });
  });
  function countSkills(ignore){
    var c = {};
    DATA.forEach(function(p){ if(matches(p, ignore)) (p.skills || []).forEach(function(id){ c[id] = (c[id] || 0) + 1; }); });
    return c;
  }
  function renderSkillChips(){
    if(!skillBox || !SKILLS.length) return;
    var c = countSkills('skill');
    skillBox.innerHTML = SKILLS.map(function(k){
      var n = c[k.id] || 0;
      return '<button type="button" class="chip" data-skill="' + esc(k.id) + '" aria-pressed="' + (state.skill === k.id ? 'true' : 'false') + '"' + (n ? '' : ' style="opacity:.55"') + '>'
           + '<i></i>' + esc(k.name) + '<span class="n">' + n + '</span></button>';
    }).join('');
    if(skillGrid){
      var els = skillGrid.querySelectorAll('.psk');
      for(var i = 0; i < els.length; i++) els[i].classList.toggle('is-on', els[i].getAttribute('data-skill') === state.skill);
    }
  }
  if(skillBox) skillBox.addEventListener('click', function(e){
    var b = e.target.closest ? e.target.closest('[data-skill]') : null; if(!b) return;
    var id = b.getAttribute('data-skill');
    setState({ skill: state.skill === id ? '' : id });
  });

  (function buildUnivSelect(){
    if(!univSel) return;
    var c = countBy('univ', null);
    UNIVS.forEach(function(u){
      var o = document.createElement('option'); o.value = u.id; o.textContent = u.name + '（' + (c[u.id] || 0) + '件）';
      univSel.appendChild(o);
    });
    univSel.addEventListener('change', function(){ setState({ univ: univSel.value }); });
  })();

  var qTimer = null;
  if(qIn) qIn.addEventListener('input', function(){
    clearTimeout(qTimer);
    qTimer = setTimeout(function(){ setState({ q: qIn.value.trim() }); }, 180);
  });
  if(interBtn) interBtn.addEventListener('click', function(){ setState({ inter: !state.inter }); });
  if(clearBtn) clearBtn.addEventListener('click', function(){ setState({ muni:'', field:'', univ:'', skill:'', q:'', inter:false }); });
  if(resetBtn) resetBtn.addEventListener('click', function(){ setState({ muni:'' }); });
  if(allBtn) allBtn.addEventListener('click', function(){ setState({ muni: state.muni === '県内各地' ? '' : '県内各地' }); });

  /* ---------- 一覧 ---------- */
  function photoHTML(p){
    var f = fieldOf(p);
    if(p.img) return '<img src="' + esc(p.img) + '" alt="" loading="lazy" decoding="async">';
    return '<svg class="ph-ico" aria-hidden="true"><use href="#i-' + esc(f.icon || 'leaf') + '"/></svg><span class="ph-txt">写真準備中</span>';
  }
  /* くわしい内容の写真枠：写真が無いときは県地図でその市町村を光らせる */
  var miniTpl = null;
  function miniMap(muni){
    if(!miniTpl){
      miniTpl = el('svg'); miniTpl.setAttribute('viewBox', '0 0 ' + OKAYAMA_MAP.w + ' ' + OKAYAMA_MAP.h); miniTpl.setAttribute('aria-hidden', 'true');
      OKAYAMA_MAP.muni.forEach(function(m){ var q = el('path'); q.setAttribute('d', m.d); q.setAttribute('data-muni', m.name); miniTpl.appendChild(q); });
    }
    var svg = miniTpl.cloneNode(true), wrap = document.createElement('div'); wrap.className = 'pd-minimap';
    var ps = svg.querySelectorAll('path');
    for(var i = 0; i < ps.length; i++){
      if(muni === '県内各地') ps[i].classList.add('all');
      else if(ps[i].getAttribute('data-muni') === muni) ps[i].classList.add('hit');
    }
    wrap.appendChild(svg); return wrap;
  }
  function tagsHTML(p){
    var f = fieldOf(p);
    return '<div class="pc-tags"><span class="pc-field">' + esc(f.name) + '</span>' + (p.inter ? '<span class="pc-inter">大学間連携</span>' : '') + '</div>';
  }
  function cardHTML(p, idx){
    var f = fieldOf(p), u = univOf(p);
    return '<article class="pbl-card" style="--fc:' + esc(f.color) + '" data-i="' + idx + '" tabindex="0" role="button" aria-haspopup="dialog">'
      + '<div class="pc-photo">' + photoHTML(p) + (p.year ? '<span class="ph-year">' + esc(p.year) + '</span>' : '') + '</div>'
      + '<div class="pc-body">' + tagsHTML(p)
      + '<h3 class="pc-title">' + esc(p.title) + '</h3>'
      + '<p class="pc-univ">' + esc(u.name) + (u.type ? '<span class="pc-type">' + esc(u.type) + '</span>' : '') + '</p>'
      + (p.partner ? '<p class="pc-partner">連携：' + esc(p.partner) + '</p>' : '')
      + (skillsOf(p).length ? '<div class="pc-skills" aria-label="求められるスキル">' + skillsOf(p).slice(0, 3).map(function(k){ return '<span>' + esc(k.name) + '</span>'; }).join('') + '</div>' : '')
      + '<p class="pc-meta"><span><svg class="ico" aria-hidden="true"><use href="#i-pin"/></svg>' + esc(p.muni) + '</span>'
      + '<span><svg class="ico" aria-hidden="true"><use href="#i-calendar"/></svg>' + esc(p.when || p.year) + '</span></p>'
      + '</div></article>';
  }
  var current = [];
  function renderList(){
    current = DATA.filter(function(p){ return matches(p, null); });
    var n = current.length;
    /* 見出し：件数と、いま効いている条件 */
    var tags = '';
    if(state.muni)  tags += '<button type="button" class="tag" data-clear="muni" style="--fc:var(--gold)">' + esc(state.muni) + '<span class="x">✕</span></button>';
    if(state.field) tags += '<button type="button" class="tag" data-clear="field" style="--fc:' + esc(fieldOf({field:state.field}).color) + '">' + esc(fieldOf({field:state.field}).name) + '<span class="x">✕</span></button>';
    if(state.univ)  tags += '<button type="button" class="tag" data-clear="univ" style="--fc:var(--navy)">' + esc((univById[state.univ] || {}).name || state.univ) + '<span class="x">✕</span></button>';
    if(state.skill) tags += '<button type="button" class="tag" data-clear="skill" style="--fc:var(--gold)">' + esc((skillById[state.skill] || {}).name || state.skill) + '<span class="x">✕</span></button>';
    if(state.inter) tags += '<button type="button" class="tag" data-clear="inter" style="--fc:var(--navy)">大学間連携<span class="x">✕</span></button>';
    if(state.q)     tags += '<button type="button" class="tag" data-clear="q" style="--fc:var(--ink-soft)">「' + esc(state.q) + '」<span class="x">✕</span></button>';
    var any = !!(state.muni || state.field || state.univ || state.skill || state.inter || state.q);
    head.innerHTML = '<b>' + n + '<em>件</em></b>' + (any ? tags : '<span>すべての事例（新しい順）</span>');
    if(clearBtn) clearBtn.hidden = !any;

    grid.innerHTML = current.slice(0, shown).map(function(p){ return cardHTML(p, DATA.indexOf(p)); }).join('');
    var old = grid.parentNode.querySelectorAll('.pbl-more');
    for(var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);
    if(n > shown){
      var more = document.createElement('div'); more.className = 'pbl-more';
      more.innerHTML = '<button type="button" class="btn btn-ghost">さらに表示（残り ' + (n - shown) + '件）</button>';
      grid.parentNode.insertBefore(more, empty);
      more.querySelector('button').addEventListener('click', function(){ shown += SHOW_STEP * 2; renderList(); });
    }
    empty.hidden = n > 0;
  }
  head.addEventListener('click', function(e){
    var b = e.target.closest ? e.target.closest('[data-clear]') : null; if(!b) return;
    var k = b.getAttribute('data-clear'), o = {}; o[k] = (k === 'inter') ? false : ''; setState(o);
  });
  grid.addEventListener('click', function(e){
    var c = e.target.closest ? e.target.closest('.pbl-card') : null; if(!c) return;
    openDetail(parseInt(c.getAttribute('data-i'), 10));
  });
  grid.addEventListener('keydown', function(e){
    if(e.key !== 'Enter' && e.key !== ' ') return;
    var c = e.target.closest ? e.target.closest('.pbl-card') : null; if(!c) return;
    e.preventDefault(); openDetail(parseInt(c.getAttribute('data-i'), 10));
  });

  /* ---------- くわしい内容 ---------- */
  var lastFocus = null;
  function openDetail(idx){
    var p = DATA[idx]; if(!p || !dlg) return;
    var f = fieldOf(p), u = univOf(p);
    lastFocus = document.activeElement;
    dlgInner.style.setProperty('--fc', f.color);
    var meta = '<dl class="pd-meta">'
      + '<dt><svg class="ico" aria-hidden="true"><use href="#i-pin"/></svg>地域</dt><dd>' + esc(p.muni) + '</dd>'
      + (p.when ? '<dt><svg class="ico" aria-hidden="true"><use href="#i-calendar"/></svg>時期</dt><dd>' + esc(p.when) + '</dd>' : '')
      + (p.partner ? '<dt><svg class="ico" aria-hidden="true"><use href="#i-hands"/></svg>連携先</dt><dd>' + esc(p.partner) + '</dd>' : '')
      + (p.students ? '<dt><svg class="ico" aria-hidden="true"><use href="#i-users"/></svg>参加した学生</dt><dd>' + esc(p.students) + '</dd>' : '')
      + '</dl>';
    var ext = p.url && /^https?:/i.test(p.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    dlgInner.innerHTML = '<button class="pd-close" type="button" aria-label="閉じる"><svg class="ico" aria-hidden="true"><use href="#i-close"/></svg></button>'
      + '<div class="pd-photo">' + photoHTML(p) + '<span class="pd-muni"><svg class="ico" aria-hidden="true"><use href="#i-pin"/></svg>' + esc(p.muni) + '</span></div>'
      + '<div class="pd-body">' + tagsHTML(p)
      + '<h2 id="pdTitle">' + esc(p.title) + '</h2>'
      + '<p class="pd-univ">' + esc(u.name) + (u.type ? '<span class="pc-type">' + esc(u.type) + '</span>' : '') + (u.home ? '<span class="pc-type">本部：' + esc(u.home) + '</span>' : '') + '</p>'
      + meta
      + (p.summary ? '<p class="pd-summary">' + esc(p.summary) + '</p>' : '')
      + (skillsOf(p).length ? '<p class="pd-skills-head"><svg class="ico" aria-hidden="true"><use href="#i-cap"/></svg>このプロジェクトで求められるスキル</p><div class="pd-skills">'
          + skillsOf(p).map(function(k){ return '<button type="button" data-skill="' + esc(k.id) + '" title="このスキルが活きる事例を見る"><i></i>' + esc(k.name) + '</button>'; }).join('') + '</div>' : '')
      + (p.learn ? '<div class="pd-learn"><svg class="ico" aria-hidden="true"><use href="#i-seedling"/></svg><div><b>貢献するために、何を学ぶ？</b><p>' + esc(p.learn) + '</p></div></div>' : '')
      + (p.source ? '<p class="pd-source">出典：' + esc(p.source) + '</p>' : '')
      + '<div class="pd-actions">'
      + (p.url ? '<a class="btn btn-primary" href="' + esc(p.url) + '"' + ext + '><span>大学の記事を読む</span><svg class="ico" aria-hidden="true"><use href="#i-link"/></svg></a>' : '')
      + (u.id ? '<button type="button" class="btn btn-ghost" data-univ="' + esc(u.id) + '">' + esc(u.short || u.name) + 'の他の事例</button>' : '')
      + '</div></div>';
    if(!p.img){ var ph = dlgInner.querySelector('.pd-photo'); if(ph) ph.insertBefore(miniMap(p.muni), ph.firstChild); }
    if(typeof dlg.showModal === 'function'){ if(!dlg.open) dlg.showModal(); } else { dlg.setAttribute('open', ''); }
    document.body.classList.add('pbl-lock');
    dlgInner.scrollTop = 0; var body = dlgInner.querySelector('.pd-body'); if(body) body.scrollTop = 0;
  }
  function closeDetail(){
    if(!dlg) return;
    if(dlg.open && typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
    document.body.classList.remove('pbl-lock');
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if(dlg){
    dlg.addEventListener('click', function(e){
      if(e.target === dlg){ closeDetail(); return; }
      var b = e.target.closest ? e.target.closest('.pd-close, [data-univ], [data-skill]') : null; if(!b) return;
      if(b.classList.contains('pd-close')){ closeDetail(); return; }
      if(b.getAttribute('data-skill')){ var sk = b.getAttribute('data-skill'); closeDetail(); setState({ skill:sk, muni:'', field:'', univ:'', q:'', inter:false }); var ex0 = document.getElementById('explore'); if(ex0) ex0.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block:'start' }); return; }
      var id = b.getAttribute('data-univ'); closeDetail(); setState({ univ:id, muni:'', field:'', skill:'', q:'', inter:false });
      var ex = document.getElementById('explore'); if(ex) ex.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block:'start' });
    });
    dlg.addEventListener('close', function(){ document.body.classList.remove('pbl-lock'); });
    dlg.addEventListener('cancel', function(){ document.body.classList.remove('pbl-lock'); });
  }

  /* ---------- 大学・高専一覧 ---------- */
  (function buildUnivList(){
    if(!univList) return;
    var c = countBy('univ', null);
    univList.innerHTML = UNIVS.map(function(u){
      var n = c[u.id] || 0, seen = {}, fs = [];
      DATA.forEach(function(p){ if(p.univ === u.id && !seen[p.field]){ seen[p.field] = 1; fs.push(fieldOf(p)); } });
      return '<div class="pu t-' + esc(u.type) + '">'
        + '<div class="pu-name">' + esc(u.name) + (u.type ? '<span class="pc-type">' + esc(u.type) + '</span>' : '') + '</div>'
        + (u.home ? '<div class="pu-sub"><svg class="ico" aria-hidden="true"><use href="#i-pin"/></svg>' + esc(u.home) + '</div>' : '')
        + '<div class="pu-fields" aria-label="取り組んでいる分野">' + fs.map(function(f){ return '<span style="--fc:' + esc(f.color) + '"><i></i>' + esc(f.name) + '</span>'; }).join('') + '</div>'
        + '<div class="pu-n">' + (n ? '掲載 ' + n + '件' + (fs.length ? '・' + fs.length + '分野' : '') : '事例は準備中') + '</div>'
        + (u.note ? '<div class="pu-note">※ ' + esc(u.note) + '</div>' : '')
        + '<div class="pu-act"><button type="button" data-univ="' + esc(u.id) + '"' + (n ? '' : ' disabled') + '><svg class="ico" aria-hidden="true"><use href="#i-search"/></svg>事例を見る</button>'
        + (u.url ? '<a href="' + esc(u.url) + '" target="_blank" rel="noopener noreferrer">公式サイト<svg class="ico" aria-hidden="true"><use href="#i-link"/></svg></a>' : '')
        + '</div></div>';
    }).join('');
    univList.addEventListener('click', function(e){
      var b = e.target.closest ? e.target.closest('button[data-univ]') : null; if(!b || b.disabled) return;
      setState({ univ: b.getAttribute('data-univ'), muni:'', field:'', skill:'', q:'', inter:false });
      var ex = document.getElementById('explore'); if(ex) ex.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block:'start' });
    });
  })();

  /* ---------- 学びの入口（スキル別の見取り図） ---------- */
  (function buildSkillGrid(){
    if(!skillGrid || !SKILLS.length) return;
    var c = countSkills(null);
    skillGrid.innerHTML = SKILLS.map(function(k){
      var n = c[k.id] || 0, seen = {}, fs = [];
      DATA.forEach(function(p){ if((p.skills || []).indexOf(k.id) >= 0 && !seen[p.field]){ seen[p.field] = 1; fs.push(fieldOf(p)); } });
      return '<div class="psk" data-skill="' + esc(k.id) + '" tabindex="0" role="button" aria-label="' + esc(k.name) + 'が活きる事例を見る">'
        + '<div class="psk-top"><div class="psk-name">' + esc(k.name) + '</div><div class="psk-n">' + n + '<small>件</small></div></div>'
        + '<div class="psk-row"><b>高校で</b><span>' + esc(k.hs) + '</span><b>大学で</b><span>' + esc(k.uni) + '</span></div>'
        + '<div class="psk-fields" aria-label="活きる分野">' + fs.map(function(f){ return '<i style="--fc:' + esc(f.color) + '" title="' + esc(f.name) + '"></i>'; }).join('') + '</div>'
        + '<span class="psk-go">このスキルが活きる事例を見る</span></div>';
    }).join('');
    function go(el){
      var id = el.getAttribute('data-skill');
      setState({ skill: state.skill === id ? '' : id, muni:'', field:'', univ:'', q:'', inter:false });
      var ex = document.getElementById('explore'); if(ex && state.skill) ex.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block:'start' });
    }
    skillGrid.addEventListener('click', function(e){ var el = e.target.closest ? e.target.closest('.psk') : null; if(el) go(el); });
    skillGrid.addEventListener('keydown', function(e){ if(e.key !== 'Enter' && e.key !== ' ') return; var el = e.target.closest ? e.target.closest('.psk') : null; if(el){ e.preventDefault(); go(el); } });
  })();

  /* ---------- 数字の帯 ---------- */
  (function stats(){
    var us = {}, ms = {}, fs = {};
    DATA.forEach(function(p){ us[p.univ] = 1; if(p.muni !== '県内各地') ms[p.muni] = 1; fs[p.field] = 1; });
    var v = { univ: UNIVS.length, muni: Object.keys(ms).length, proj: DATA.length, field: Object.keys(fs).length };
    Object.keys(v).forEach(function(k){
      var e = document.querySelector('[data-stat="' + k + '"]'); if(!e) return;
      e.setAttribute('data-target', v[k]); e.textContent = v[k];
    });
  })();

  /* ---------- 状態の更新と URL ---------- */
  function syncControls(){
    if(univSel) univSel.value = state.univ;
    if(qIn && qIn.value.trim() !== state.q) qIn.value = state.q;
    if(interBtn) interBtn.setAttribute('aria-pressed', state.inter ? 'true' : 'false');
  }
  function writeHash(){
    var parts = [];
    if(state.muni) parts.push('m=' + encodeURIComponent(state.muni));
    if(state.field) parts.push('f=' + encodeURIComponent(state.field));
    if(state.univ) parts.push('u=' + encodeURIComponent(state.univ));
    if(state.skill) parts.push('s=' + encodeURIComponent(state.skill));
    if(state.inter) parts.push('i=1');
    if(state.q) parts.push('q=' + encodeURIComponent(state.q));
    var h = parts.length ? '#' + parts.join('&') : (location.pathname + location.search);
    try{ history.replaceState(null, '', h); }catch(e){}
  }
  function readHash(){
    var h = location.hash.replace(/^#/, ''); if(h.indexOf('=') < 0) return false;
    h.split('&').forEach(function(kv){
      var i = kv.indexOf('='); if(i < 0) return;
      var k = kv.slice(0,i), v = decodeURIComponent(kv.slice(i+1));
      if(k === 'm') state.muni = v; if(k === 'f' && fieldById[v]) state.field = v; if(k === 'u' && univById[v]) state.univ = v; if(k === 's' && skillById[v]) state.skill = v;
      if(k === 'i') state.inter = v === '1'; if(k === 'q') state.q = v;
    });
    return true;
  }
  function setState(patch){
    Object.keys(patch).forEach(function(k){ state[k] = patch[k]; });
    shown = SHOW_STEP;
    render(); writeHash();
  }
  function render(){ paintMap(); renderChips(); renderSkillChips(); syncControls(); renderList(); }

  var fromHash = readHash();
  render();
  if(fromHash){ var ex = document.getElementById('explore'); if(ex) setTimeout(function(){ ex.scrollIntoView({ block:'start' }); }, 50); }
  window.addEventListener('hashchange', function(){ if(readHash()) render(); });
})();
