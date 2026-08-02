// i18n — Carino Learn chrome (fleet convention, see Topo/js/i18n.js).
// English strings ARE the keys, so a missing entry falls back to English.
// Course CONTENT (module titles, stages, labs, reference tables) is data and
// deliberately stays English; this file covers the platform chrome: navbar,
// diagnostics, overview head, stage-card furniture, buttons and hints.
// Locale comes from the fleet resolver (carino-lang.js): ?lang > cookie >
// browser > en. This script is deferred and placed after carino-lang.js, so
// window.CarinoLang exists when it runs. Japanese deliberately says "PC".

const I18N = {
    es: {
        'Late shift.': 'Turno nocturno.',
        'Good morning.': 'Buenos días.',
        'Good afternoon.': 'Buenas tardes.',
        'Good evening.': 'Buenas noches.',
        // Overview head
        'Carino Learn · interactive modules': 'Carino Learn · módulos interactivos',
        'Hands-on, beginner-friendly modules — each with an interactive lab you can poke at and a checklist you can tick off. Progress is saved in your browser.': 'Módulos prácticos y aptos para principiantes: cada uno con un laboratorio interactivo para experimentar y una lista que puedes ir marcando. El progreso se guarda en tu navegador.',
        'Overall progress': 'Progreso general',
        // Navbar + diagnostics
        'Status': 'Estado',
        'Current module': 'Módulo actual',
        'Stages cleared': 'Etapas completadas',
        'Completion': 'Completado',
        'Platform': 'Plataforma',
        'Modules': 'Módulos',
        'All stages': 'Todas las etapas',
        'Overall': 'Global',
        'Progress': 'Progreso',
        'saved locally': 'guardado localmente',
        'Session': 'Sesión',
        'Local time': 'Hora local',
        'Course progress': 'Progreso del curso',
        'Carino Systems — back to hub': 'Carino Systems — volver al hub',
        'Learn — reload': 'Learn — recargar',
        // Greeting + progress strings (JS-generated)
        'Pick a module.': 'Elige un módulo.',
        'Overall:': 'Global:',
        'stages cleared.': 'etapas completadas.',
        'ready when you are.': 'listo cuando tú lo estés.',
        'complete.': 'completado.',
        'cleared.': 'completadas.',
        'complete': 'completadas',
        'stages': 'etapas',
        // Stage cards
        'Done': 'Hecho',
        'Suggested time': 'Tiempo sugerido',
        'copy': 'copiar',
        'copied ✓': 'copiado ✓',
        'select & copy': 'selecciona y copia',
        'copy document': 'copiar documento',
        'Line-by-line': 'Línea por línea',
        'Documents for this stage': 'Documentos de esta etapa',
        'Do this': 'Haz esto',
        'Quick drills': 'Ejercicios rápidos',
        'Go deeper': 'Profundiza',
        // Course page chrome
        'Interactive lab': 'Laboratorio interactivo',
        'course': '· curso',
        'Start at stage 0 →': 'Empieza en la etapa 0 →',
        'Cheat-sheet': 'Guía rápida',
        'Reset progress': 'Reiniciar progreso',
        'the path': 'el camino',
        'Keep open while you work': 'Mantenla abierta mientras trabajas',
        'Track': 'Bloque',
        'Reset your progress on this course?': '¿Reiniciar tu progreso en este curso?',
        // Slice tiles
        'module complete': 'módulo completado',
        'Tick when you have finished every stage of this module': 'Marca cuando hayas terminado todas las etapas de este módulo',
        'No courses loaded.': 'No hay cursos cargados.',
    },
    'pt-BR': {
        'Late shift.': 'Turno da noite.',
        'Good morning.': 'Bom dia.',
        'Good afternoon.': 'Boa tarde.',
        'Good evening.': 'Boa noite.',
        'Carino Learn · interactive modules': 'Carino Learn · módulos interativos',
        'Hands-on, beginner-friendly modules — each with an interactive lab you can poke at and a checklist you can tick off. Progress is saved in your browser.': 'Módulos práticos e amigáveis para iniciantes: cada um com um laboratório interativo para explorar e uma lista para ir marcando. O progresso fica salvo no seu navegador.',
        'Overall progress': 'Progresso geral',
        'Status': 'Status',
        'Current module': 'Módulo atual',
        'Stages cleared': 'Etapas concluídas',
        'Completion': 'Conclusão',
        'Platform': 'Plataforma',
        'Modules': 'Módulos',
        'All stages': 'Todas as etapas',
        'Overall': 'Geral',
        'Progress': 'Progresso',
        'saved locally': 'salvo localmente',
        'Session': 'Sessão',
        'Local time': 'Hora local',
        'Course progress': 'Progresso do curso',
        'Carino Systems — back to hub': 'Carino Systems — voltar ao hub',
        'Learn — reload': 'Learn — recarregar',
        'Pick a module.': 'Escolha um módulo.',
        'Overall:': 'Geral:',
        'stages cleared.': 'etapas concluídas.',
        'ready when you are.': 'pronto quando você estiver.',
        'complete.': 'concluído.',
        'cleared.': 'concluídas.',
        'complete': 'concluídas',
        'stages': 'etapas',
        'Done': 'Feito',
        'Suggested time': 'Tempo sugerido',
        'copy': 'copiar',
        'copied ✓': 'copiado ✓',
        'select & copy': 'selecione e copie',
        'copy document': 'copiar documento',
        'Line-by-line': 'Linha por linha',
        'Documents for this stage': 'Documentos desta etapa',
        'Do this': 'Faça isto',
        'Quick drills': 'Exercícios rápidos',
        'Go deeper': 'Aprofunde-se',
        'Interactive lab': 'Laboratório interativo',
        'course': '· curso',
        'Start at stage 0 →': 'Comece na etapa 0 →',
        'Cheat-sheet': 'Guia rápido',
        'Reset progress': 'Zerar progresso',
        'the path': 'o caminho',
        'Keep open while you work': 'Deixe aberto enquanto trabalha',
        'Track': 'Bloco',
        'Reset your progress on this course?': 'Zerar seu progresso neste curso?',
        'module complete': 'módulo concluído',
        'Tick when you have finished every stage of this module': 'Marque quando terminar todas as etapas deste módulo',
        'No courses loaded.': 'Nenhum curso carregado.',
    },
    ja: {
        'Late shift.': '夜勤お疲れさま。',
        'Good morning.': 'おはようございます。',
        'Good afternoon.': 'こんにちは。',
        'Good evening.': 'こんばんは。',
        'Carino Learn · interactive modules': 'Carino Learn · インタラクティブモジュール',
        'Hands-on, beginner-friendly modules — each with an interactive lab you can poke at and a checklist you can tick off. Progress is saved in your browser.': '実践的で初心者にやさしいモジュール。各モジュールに、触って試せるインタラクティブなラボと、チェックして進められるリストが付いています。進捗はブラウザに保存されます。',
        'Overall progress': '全体の進捗',
        'Status': 'ステータス',
        'Current module': '現在のモジュール',
        'Stages cleared': 'クリアしたステージ',
        'Completion': '達成率',
        'Platform': 'プラットフォーム',
        'Modules': 'モジュール',
        'All stages': '全ステージ',
        'Overall': '全体',
        'Progress': '進捗',
        'saved locally': 'ローカル保存',
        'Session': 'セッション',
        'Local time': '現地時刻',
        'Course progress': 'コースの進捗',
        'Carino Systems — back to hub': 'Carino Systems — ハブに戻る',
        'Learn — reload': 'Learn — 再読み込み',
        'Pick a module.': 'モジュールを選んでください。',
        'Overall:': '全体:',
        'stages cleared.': 'ステージクリア。',
        'ready when you are.': 'いつでも始められます。',
        'complete.': '完了。',
        'cleared.': 'クリア。',
        'complete': '完了',
        'stages': 'ステージ',
        'Done': '完了',
        'Suggested time': '目安時間',
        'copy': 'コピー',
        'copied ✓': 'コピー済み ✓',
        'select & copy': '選択してコピー',
        'copy document': '文書をコピー',
        'Line-by-line': '一行ずつ解説',
        'Documents for this stage': 'このステージの文書',
        'Do this': 'やってみよう',
        'Quick drills': 'クイックドリル',
        'Go deeper': 'さらに深く',
        'Interactive lab': 'インタラクティブラボ',
        'course': 'コース',
        'Start at stage 0 →': 'ステージ0から始める →',
        'Cheat-sheet': 'チートシート',
        'Reset progress': '進捗をリセット',
        'the path': '道のり',
        'Keep open while you work': '作業中は開いたままに',
        'Track': 'トラック',
        'Reset your progress on this course?': 'このコースの進捗をリセットしますか？',
        'module complete': 'モジュール完了',
        'Tick when you have finished every stage of this module': 'このモジュールの全ステージを終えたらチェック',
        'No courses loaded.': 'コースが読み込まれていません。',
    },
    ru: {
        'Late shift.': 'Ночная смена.',
        'Good morning.': 'Доброе утро.',
        'Good afternoon.': 'Добрый день.',
        'Good evening.': 'Добрый вечер.',
        'Carino Learn · interactive modules': 'Carino Learn · интерактивные модули',
        'Hands-on, beginner-friendly modules — each with an interactive lab you can poke at and a checklist you can tick off. Progress is saved in your browser.': 'Практичные модули для начинающих: в каждом — интерактивная лаборатория, которую можно потрогать, и чек-лист для отметок. Прогресс сохраняется в браузере.',
        'Overall progress': 'Общий прогресс',
        'Status': 'Статус',
        'Current module': 'Текущий модуль',
        'Stages cleared': 'Пройдено этапов',
        'Completion': 'Выполнено',
        'Platform': 'Платформа',
        'Modules': 'Модули',
        'All stages': 'Все этапы',
        'Overall': 'Итого',
        'Progress': 'Прогресс',
        'saved locally': 'хранится локально',
        'Session': 'Сессия',
        'Local time': 'Местное время',
        'Course progress': 'Прогресс курса',
        'Carino Systems — back to hub': 'Carino Systems — назад в хаб',
        'Learn — reload': 'Learn — перезагрузить',
        'Pick a module.': 'Выберите модуль.',
        'Overall:': 'Итого:',
        'stages cleared.': 'этапов пройдено.',
        'ready when you are.': 'начинайте, когда будете готовы.',
        'complete.': 'пройден.',
        'cleared.': 'пройдено.',
        'complete': 'выполнено',
        'stages': 'этапов',
        'Done': 'Готово',
        'Suggested time': 'Рекомендуемое время',
        'copy': 'копировать',
        'copied ✓': 'скопировано ✓',
        'select & copy': 'выделите и скопируйте',
        'copy document': 'копировать документ',
        'Line-by-line': 'Построчный разбор',
        'Documents for this stage': 'Документы этого этапа',
        'Do this': 'Сделайте это',
        'Quick drills': 'Быстрые упражнения',
        'Go deeper': 'Копнуть глубже',
        'Interactive lab': 'Интерактивная лаборатория',
        'course': '· курс',
        'Start at stage 0 →': 'Начать с этапа 0 →',
        'Cheat-sheet': 'Шпаргалка',
        'Reset progress': 'Сбросить прогресс',
        'the path': 'маршрут',
        'Keep open while you work': 'Держите открытым во время работы',
        'Track': 'Трек',
        'Reset your progress on this course?': 'Сбросить прогресс по этому курсу?',
        'module complete': 'модуль пройден',
        'Tick when you have finished every stage of this module': 'Отметьте, когда завершите все этапы модуля',
        'No courses loaded.': 'Курсы не загружены.',
    },
};

// Hero headline keeps its <em> emphasis, so it is applied as trusted,
// hand-written markup rather than through data-i18n / textContent.
const HERO_HTML = {
    en: 'Learn the machine, from the <em>silicon up</em>.',
    es: 'Aprende la máquina, desde el <em>silicio hacia arriba</em>.',
    'pt-BR': 'Aprenda a máquina, do <em>silício para cima</em>.',
    ja: '<em>シリコンから</em>積み上げて、マシンを学ぼう。',
    ru: 'Изучите машину — <em>от кремния и выше</em>.',
};

let LOCALE = 'en';

function currentFleetLang() {
    return (window.CarinoLang && window.CarinoLang.current) || 'en';
}

function setLocale(l) {
    LOCALE = (l === 'en' || I18N[l]) ? l : 'en';
    document.documentElement.lang = LOCALE;
}

function t(key) {
    const dict = I18N[LOCALE];
    return (dict && dict[key]) || key;
}

// Static markup: elements carrying data-i18n use their original English text
// as the key (captured on first pass so locale switches stay reversible).
function applyStaticI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        if (!el.dataset.i18nKey) el.dataset.i18nKey = el.textContent.trim();
        el.textContent = t(el.dataset.i18nKey);
    });
}

// Prominent title attributes + the hero headline (explicit assignments).
function applyI18nExtras() {
    const set = (sel, attr, key) => {
        const el = document.querySelector(sel);
        if (el) el.setAttribute(attr, t(key));
    };
    set('.brand-name', 'title', 'Carino Systems — back to hub');
    set('.app-tag', 'title', 'Learn — reload');
    set('.prog-mini', 'title', 'Course progress');
    set('#diagToggle', 'title', 'Progress');
    const hero = document.querySelector('.overview-title');
    if (hero) hero.innerHTML = HERO_HTML[LOCALE] || HERO_HTML.en;
}

// carino-lang.js is deferred and sits before this (also deferred) script, so
// the fleet resolver has already run: pick the locale up synchronously, then
// paint on DOMContentLoaded and repaint on every fleet language switch.
setLocale(currentFleetLang());

document.addEventListener('DOMContentLoaded', () => {
    applyStaticI18n();
    applyI18nExtras();
});

window.addEventListener('carino:langchange', () => {
    setLocale(currentFleetLang());
    applyStaticI18n();
    applyI18nExtras();
});
