#!/usr/bin/env python3
"""Construit le dossier du jeu à partir des fichiers officiels (questions, animaux, titres), pour qu'il reste exact."""
import json, html, re, sys
D = sys.argv[1]
data = json.load(open(D + '/data.json', encoding='utf-8'))
Q, A, MEMO = data['Q'], data['A'], data['MEMO']
ranks = re.findall(r"\[(\d+),'([^']+)','([^']+)','(\w+)'\]", data['ranks'])
tiers = data['tiers']
e = lambda s: html.escape(s.replace('\\u00A0', ' '), quote=False)

EMOJI = {'agame': 'Agame (lézard des rochers)', 'elephant': 'Éléphant', 'patas': 'Singe patas', 'calao': 'Calao', 'vautour': 'Vautour', 'tortue': 'Tortue sillonnée'}

def question_html(k):
    q = Q[k]; n = int(k[1:])
    whys = [o['why'] for o in q['opts']]
    same = len(set(whys)) == 1
    intrus = q.get('intrus')
    lead = f'<p class="lead">{e(q["lead"])}</p>' if q.get('lead') else ''
    kind = 'Vrai ou faux' if q.get('two') else ('Trouvez l’intrus' if intrus else f'{len(q["opts"])} choix')
    rows = []
    for i, o in enumerate(q['opts'], 1):
        ok = o['ok']
        mark = ('L’intrus' if intrus else 'Bonne réponse') if ok else ''
        why = '' if same else f'<p class="why">{e(o["why"])}</p>'
        rows.append(f'<li class="{"ok" if ok else "ko"}"><span class="n">{i}</span><div><p class="t">{e(o["t"])}'
                    f'{f" <span class=\"tag\">{mark}</span>" if mark else ""}</p>{why}</div></li>')
    shared = f'<p class="why shared">{e(whys[0])}</p>' if same else ''
    return (f'<article class="q" id="q{n}"><header><span class="qn">Question {n}</span><span class="kind">{kind}</span></header>'
            f'{lead}<p class="qt">{e(q["q"])}</p><ol class="opts">{"".join(rows)}</ol>{shared}</article>')

animals = []
for a in A:
    animals.append(f'''<section class="animal" id="{a['id']}">
  <div class="ahead"><img class="aportrait" src="img/animal-{a['id']}.jpg" width="320" height="320" loading="lazy" alt="{e(EMOJI.get(a['id'], a['name']))} en blocs">
  <div><p class="eyebrow">{e(EMOJI.get(a['id'], a['name']))}</p><h3>{e(a['theme'])}</h3></div>
  <blockquote>« {e(a['intro'])} »</blockquote></div>
  <div class="qs">{''.join(question_html(k) for k in a['q'])}</div>
</section>''')

rank_rows_unused = ''.join(f'<tr><td class="num">{"12/12" if s=="12" else (s+" à 11" if s=="10" else (s+" à 9" if s=="7" else "0 à 6"))}</td><td><b>{e(t)}</b></td><td>{e(m)}</td><td>{e(tiers[3-i][0])} {e(tiers[3-i][1])}</td></tr>'
                    for i, (s, t, m, _) in enumerate(ranks))
memo = ''.join(f'<li>{e(m)}</li>' for m in MEMO)
order = ' → '.join(f'{EMOJI[a["id"]].split(" (")[0]} ({", ".join(k[1:] for k in a["q"])})' for a in A)

face = re.search(r'<g shape-rendering="crispEdges">.*?</g>', open('/home/user/le-flair-de-roxy/index.html', encoding='utf-8').read(), re.S).group(0)
MED = {'or': ('#E8A92E', '#F6C855', '#C98A1E'), 'argent': ('#A9B2BD', '#DDE3EA', '#8C96A3'), 'bronze': ('#B36A35', '#D9925A', '#8E4F24'), 'chiot': ('#C9B79A', '#EFE4CF', '#A8956F')}
RANGE = {'12': '12 / 12', '10': '10 ou 11', '7': '7 à 9', '0': '0 à 6'}
medals = ''
for i, (sc, title, msg, key) in enumerate(ranks):
    mo, mi, st = MED[key]
    svg = (f'<svg viewBox="0 0 120 120" role="img" aria-label="Médaille {e(title)}"><path d="M40 4h14l10 34H50zM80 4H66L56 38h14z" fill="#3E5BA6"/>'
           f'<circle cx="60" cy="74" r="40" fill="{mo}"/><circle cx="60" cy="74" r="32" fill="{mi}" stroke="{st}" stroke-width="3"/>{face}</svg>')
    medals += f'<div>{svg}<span class="sc">{RANGE[sc]}</span><h3>{e(title)}</h3><p>{e(msg)}</p><p class="fin">Grand final : {e(tiers[3-i][0])}</p></div>'
WHERE = {'agame': 'Sur un rocher rouge, juste devant le départ.', 'elephant': 'Près de la mare, à droite du départ.', 'patas': 'Tout près du départ, un peu à droite.',
         'calao': 'Au pied de la falaise, près des greniers.', 'vautour': 'Perché sur un rocher, vers la falaise.', 'tortue': 'À l’ombre de la case à palabres, à gauche.'}
KIND = {'agame': ('createAgama', 'agama', .3, 3.4), 'elephant': ('createElephant', 'elephant', 1.35, 7.6), 'patas': ('createPatas', 'patas', .68, 3.5),
        'calao': ('createHornbill', 'hornbill', .5, 3.1), 'vautour': ('createVulture', 'vulture', .62, 3.4), 'tortue': ('createTortoise', 'tortoise', .4, 3.2)}
cast_data = []
for a in A:
    nm = EMOJI[a['id']].split(' (')[0]
    mk, kind, ty, dist = KIND[a['id']]
    cast_data.append({'id': a['id'], 'name': nm, 'theme': a['theme'], 'where': WHERE[a['id']], 'intro': a['intro'], 'q': [k[1:] for k in a['q']], 'make': mk, 'kind': kind, 'ty': ty, 'dist': dist})
c0 = cast_data[0]
picks = ''.join('<button data-id="%s" aria-pressed="%s"><img src="img/animal-%s.jpg" width="320" height="320" loading="lazy" alt=""><b>%s</b><span>%s</span></button>'
                % (c['id'], 'true' if i == 0 else 'false', c['id'], e(c['name']), e(c['theme'])) for i, c in enumerate(cast_data))
cast = ('<div class="castview">\n'
        '    <div class="stage" id="cstage" style="background-image:url(img/animal-%s.jpg)" role="img" aria-label="Animal en 3D"><span class="hint" id="cHint">Glissez pour le faire tourner</span><p class="bubble" id="cBubble" hidden></p></div>\n'
        '    <div class="cinfo" aria-live="polite">\n'
        '      <p class="eyebrow" id="cTheme">%s</p>\n      <h3 id="cName">%s</h3>\n      <p class="small" id="cWhere">%s</p>\n'
        '      <blockquote id="cIntro">« %s »</blockquote>\n'
        '      <div class="acts"><button id="cTalk" aria-pressed="false">Le faire parler</button><a id="cLink" href="#%s">Voir ses questions (%s) ›</a></div>\n'
        '    </div>\n  </div>\n'
        '  <div class="castpick" id="cpick" aria-label="Choisir un animal">%s</div>\n'
        '  <script type="application/json" id="castData">%s</script>'
        % (c0['id'], e(c0['theme']), e(c0['name']), e(c0['where']), e(c0['intro']), c0['id'], ' et '.join(c0['q']), picks, json.dumps(cast_data, ensure_ascii=False).replace('</', '<\\/')))
face = re.search(r'<g shape-rendering="crispEdges">.*?</g>', open('/home/user/le-flair-de-roxy/index.html', encoding='utf-8').read(), re.S).group(0)
MED = {'or': ('#E8A92E', '#F6C855', '#C98A1E'), 'argent': ('#A9B2BD', '#DDE3EA', '#8C96A3'), 'bronze': ('#B36A35', '#D9925A', '#8E4F24'), 'chiot': ('#C9B79A', '#EFE4CF', '#A8956F')}
RANGE = {'12': '12 / 12', '10': '10 ou 11', '7': '7 à 9', '0': '0 à 6'}
medals = ''
for i, (sc, title, msg, key) in enumerate(ranks):
    mo, mi, st = MED[key]
    svg = (f'<svg viewBox="0 0 120 120" role="img" aria-label="Médaille {e(title)}"><path d="M40 4h14l10 34H50zM80 4H66L56 38h14z" fill="#3E5BA6"/>'
           f'<circle cx="60" cy="74" r="40" fill="{mo}"/><circle cx="60" cy="74" r="32" fill="{mi}" stroke="{st}" stroke-width="3"/>{face}</svg>')
    medals += f'<div>{svg}<span class="sc">{RANGE[sc]}</span><h3>{e(title)}</h3><p>{e(msg)}</p><p class="fin">Grand final : {e(tiers[3-i][0])}</p></div>'
WHERE = {'agame': 'Sur un rocher rouge, juste devant le départ.', 'elephant': 'Près de la mare, à droite du départ.', 'patas': 'Tout près du départ, un peu à droite.',
         'calao': 'Au pied de la falaise, près des greniers.', 'vautour': 'Perché sur un rocher, vers la falaise.', 'tortue': 'À l’ombre de la case à palabres, à gauche.'}
persos = ('<a class="hero" href="#s-genese"><img src="img/roxy-jeu.jpg" width="700" height="880" loading="lazy" alt="Roxy en blocs">'
          '<span class="th">L’héroïne</span><b>Roxy</b><span class="where">Une chienne Shar-Peï. C’est elle que le joueur promène.</span><span class="go">Voir ses origines ›</span></a>')
for a in A:
    nm = EMOJI[a['id']].split(' (')[0]
    persos += (f'<a href="#{a["id"]}"><img src="img/animal-{a["id"]}.jpg" width="320" height="320" loading="lazy" alt="{e(nm)} en blocs">'
               f'<span class="th">{e(a["theme"])}</span><b>{e(nm)}</b><span class="where">{e(WHERE[a["id"]])}</span>'
               f'<span class="go">Questions {" et ".join(k[1:] for k in a["q"])} ›</span></a>')
page = open(D + '/template.html', encoding='utf-8').read()
page = page.replace('{{ANIMALS}}', '\n'.join(animals)).replace('{{MEMO}}', memo).replace('{{CAST}}', cast).replace('{{MEDALS}}', medals).replace('{{SCRIPTS}}', open(D + '/scripts.html', encoding='utf-8').read()).replace('{{ORDER}}', e(order))
assert '{{' not in page
open(D + '/dossier-du-jeu-roxy.html', 'w', encoding='utf-8').write(page)
print('ok', len(page), 'octets ;', sum(len(Q[k]['opts']) for k in Q), 'réponses ;', len(A), 'animaux')
