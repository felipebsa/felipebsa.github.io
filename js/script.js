const root = document.documentElement;
const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

// tema claro/escuro
const temaSalvo = localStorage.getItem('fb-theme');
if (temaSalvo) root.dataset.theme = temaSalvo;

document.getElementById('themeToggle').addEventListener('click', () => {
  const novo = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = novo;
  localStorage.setItem('fb-theme', novo);
});

// navbar
const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('navToggle');
const menu = document.getElementById('navLinks');
const links = document.querySelectorAll('.nav-link');

function atualizarNavbar() {
  navbar.classList.toggle('is-scrolled', scrollY > 10);
}
atualizarNavbar();
addEventListener('scroll', atualizarNavbar, { passive: true });

function abrirMenu(aberto) {
  menu.classList.toggle('is-open', aberto);
  menuBtn.setAttribute('aria-expanded', aberto);
  menuBtn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

menuBtn.addEventListener('click', () => abrirMenu(!menu.classList.contains('is-open')));
links.forEach((link) => link.addEventListener('click', () => abrirMenu(false)));
document.addEventListener('keydown', (e) => e.key === 'Escape' && abrirMenu(false));
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) abrirMenu(false);
});

// marca na navbar a seção que tá na tela
const observarSecao = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      links.forEach((link) => link.classList.toggle('is-active', link.dataset.nav === entrada.target.id));
    });
  },
  { rootMargin: '-40% 0px -50% 0px' },
);
document.querySelectorAll('main section[id]').forEach((s) => observarSecao.observe(s));

// elementos aparecendo ao rolar
const observarReveal = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada, i) => {
      if (!entrada.isIntersecting) return;
      setTimeout(() => entrada.target.classList.add('is-visible'), i * 40);
      observarReveal.unobserve(entrada.target);
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
);
document.querySelectorAll('.reveal').forEach((el) => observarReveal.observe(el));

// brilho dos cards seguindo o mouse
document.querySelectorAll('.spot').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', e.clientX - r.left + 'px');
    card.style.setProperty('--my', e.clientY - r.top + 'px');
  });
});

// copiar e-mail
const toast = document.getElementById('toast');
let toastTimer;

function mostrarToast(texto) {
  toast.textContent = texto;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

document.getElementById('copyEmail').addEventListener('click', async (e) => {
  const email = e.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    mostrarToast('E-mail copiado');
  } catch {
    mostrarToast(email);
  }
});

// luz fraquinha atrás do mouse
const luz = document.getElementById('cursorLight');
if (matchMedia('(hover: hover)').matches) {
  addEventListener(
    'pointermove',
    (e) => {
      luz.classList.add('is-on');
      luz.style.setProperty('--cx', e.clientX + 'px');
      luz.style.setProperty('--cy', e.clientY + 'px');
    },
    { passive: true },
  );
  root.addEventListener('pointerleave', () => luz.classList.remove('is-on'));
}

// chuva na lateral esquerda
// cada gota cai reta e termina num traço tipo ------\____/--
// as posições são da página, então a chuva não acompanha a rolagem
const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');

const LARGURA_CONTEUDO = 1184;
const GRADE = 12;
const DENSIDADE = 0.00006;
const CORES = ['76, 29, 149', '91, 33, 182', '124, 58, 237'];

let largura = 0;
let altura = 0;
let alturaPagina = 0;
let dpr = 1;
let gotas = [];
let rodando = false;
let ultimoFrame = 0;

const aleatorio = (min, max) => min + Math.random() * (max - min);
const naGrade = (v) => Math.round(v / GRADE) * GRADE;

function novaGota(comecarNoMeio) {
  const colunas = Math.max(1, Math.floor((largura - GRADE * 2) / GRADE));
  const x = GRADE + Math.floor(Math.random() * colunas) * GRADE;
  const yInicio = naGrade(aleatorio(-200, alturaPagina));
  const yFim = yInicio + naGrade(aleatorio(260, 820));

  // vai pro lado que tiver mais espaço
  const lado = x < largura / 2 ? 1 : -1;
  const espaco = lado === 1 ? largura - x - GRADE : x - GRADE;
  const u = Math.max(GRADE / 2, Math.min(GRADE * 1.5, espaco / 7));

  const pontos = [
    [x, yInicio],
    [x, yFim],
  ];
  let px = x;
  let py = yFim;
  for (const [dx, dy] of [
    [2, 0],
    [1, 1],
    [2, 0],
    [1, -1],
    [1, 0],
  ]) {
    px += dx * u * lado;
    py += dy * u;
    pontos.push([px, py]);
  }

  const distancias = [0];
  for (let i = 1; i < pontos.length; i++) {
    const [ax, ay] = pontos[i - 1];
    const [bx, by] = pontos[i];
    distancias.push(distancias[i - 1] + Math.hypot(bx - ax, by - ay));
  }
  const total = distancias.at(-1);
  const rastro = aleatorio(50, 130);

  return {
    pontos,
    distancias,
    total,
    rastro,
    topo: yInicio - 10,
    base: yFim + u + 10,
    cabeca: comecarNoMeio ? aleatorio(0, total + rastro) : 0,
    velocidade: aleatorio(70, 190),
    cor: CORES[Math.floor(Math.random() * CORES.length)],
    opacidade: aleatorio(0.35, 0.75),
  };
}

function pontoNoCaminho(gota, d) {
  const { pontos, distancias } = gota;
  if (d <= 0) return pontos[0];
  for (let i = 1; i < pontos.length; i++) {
    if (d <= distancias[i]) {
      const t = (d - distancias[i - 1]) / (distancias[i] - distancias[i - 1]);
      const [ax, ay] = pontos[i - 1];
      const [bx, by] = pontos[i];
      return [ax + (bx - ax) * t, ay + (by - ay) * t];
    }
  }
  return pontos.at(-1);
}

function desenharGota(gota) {
  const de = Math.max(0, gota.cabeca - gota.rastro);
  const ate = Math.min(gota.cabeca, gota.total);
  if (ate <= de) return;

  // o rastro vai ficando mais fino e apagado no final
  let anterior = pontoNoCaminho(gota, de);
  for (let d = de + 4; d <= ate; d += 4) {
    const atual = pontoNoCaminho(gota, d);
    const k = (d - de) / (gota.cabeca - de);
    ctx.strokeStyle = `rgba(${gota.cor}, ${gota.opacidade * k * k})`;
    ctx.lineWidth = 0.4 + 1.3 * k;
    ctx.beginPath();
    ctx.moveTo(...anterior);
    ctx.lineTo(...atual);
    ctx.stroke();
    anterior = atual;
  }

  if (gota.cabeca < gota.total) {
    const [x, y] = pontoNoCaminho(gota, gota.cabeca);
    ctx.fillStyle = `rgba(167, 139, 250, ${gota.opacidade * 0.9})`;
    ctx.shadowColor = `rgba(${gota.cor}, 0.9)`;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(x, y, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function animar(agora) {
  if (!rodando) return;
  const dt = Math.min(0.05, (agora - ultimoFrame) / 1000);
  ultimoFrame = agora;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, largura, altura);
  ctx.translate(0, -scrollY);
  ctx.lineCap = 'round';

  gotas.forEach((gota, i) => {
    gota.cabeca += gota.velocidade * dt;
    if (gota.cabeca - gota.rastro > gota.total) gotas[i] = gota = novaGota(false);
    // só desenha o que tá aparecendo na tela
    if (gota.base > scrollY && gota.topo < scrollY + altura) desenharGota(gota);
  });

  requestAnimationFrame(animar);
}

function montarChuva() {
  largura = Math.floor((innerWidth - LARGURA_CONTEUDO) / 2);
  altura = innerHeight;
  alturaPagina = root.scrollHeight;

  // em tela menor não sobra espaço do lado
  if (largura < 80) {
    rodando = false;
    canvas.style.display = 'none';
    return;
  }

  dpr = Math.min(devicePixelRatio, 2);
  canvas.style.display = 'block';
  canvas.style.width = largura + 'px';
  canvas.style.height = altura + 'px';
  canvas.width = largura * dpr;
  canvas.height = altura * dpr;

  const quantidade = Math.round(largura * alturaPagina * DENSIDADE);
  gotas = Array.from({ length: quantidade }, () => novaGota(true));

  if (!rodando) {
    rodando = true;
    ultimoFrame = performance.now();
    requestAnimationFrame(animar);
  }
}

if (!reduzirMovimento) {
  let espera;
  const remontar = () => {
    clearTimeout(espera);
    espera = setTimeout(montarChuva, 150);
  };

  addEventListener('resize', remontar);

  // a página cresce quando as imagens terminam de carregar
  let ultimaAltura = 0;
  new ResizeObserver(() => {
    if (Math.abs(root.scrollHeight - ultimaAltura) > 50) {
      ultimaAltura = root.scrollHeight;
      remontar();
    }
  }).observe(document.body);

  montarChuva();
}
