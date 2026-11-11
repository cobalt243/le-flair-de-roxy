/* Le Flair de Roxy — les 12 questions de formation validées.
   Règles : mots simples, réponses de longueur semblable, mises en situation. */
(function(RX){
  const VF=(q,vrai,why)=>({q,opts:[{t:"Vrai",ok:vrai,why},{t:"Faux",ok:!vrai,why}],two:true});
  const BINS=(q,i,why,whys)=>({q,opts:["On peut l’utiliser avec Claude","On l’anonymise d’abord","On ne la saisit pas sans autorisation"].map((t,k)=>({t,ok:k===i,why:(whys&&whys[k])||why})),lead:"Que faites-vous de cette information ?"});
  RX.QUESTIONS={
    q1:VF("« Claude peut affirmer une chose fausse avec beaucoup d’assurance. »",true,"C’est ce qu’on appelle une hallucination. Vérifiez toujours les chiffres, les citations et les références."),
    q2:{q:"Un nouveau décret sur les ONG est paru hier. Que faites-vous pour que Claude vous en parle correctement ?",opts:[
      {t:"Je demande à Claude ce que dit le décret.",ok:false,why:"Sans recherche web, le décret est peut-être plus récent que ses connaissances : il risque de deviner."},
      {t:"J’active la recherche web et je demande la source officielle.",ok:true,why:"La recherche web donne accès aux textes récents. Ouvrez ensuite la source officielle pour confirmer."},
      {t:"Je donne le titre du décret et je demande un résumé.",ok:false,why:"Avec le titre seul, Claude n’a pas le texte : il risque d’inventer ou de rester vague."}]},
    q3:{q:"Lequel de ces deux prompts donnera le meilleur résumé pour notre bailleur de fonds ?",opts:[
      {t:"« Résume ce rapport. »",ok:false,why:"Claude ignore qui va lire et pourquoi : le résumé sera générique."},
      {t:"« Résume ce rapport T3 pour notre bailleur de fonds, qui le lira en 5 minutes. »",ok:true,why:"Il précise le lecteur, son temps et l’objet du document : Claude peut cibler l’essentiel."}]},
    q4:{q:"Il est 22 h, vous êtes chez vous et vous devez relire un contrat de travail pour demain. Votre ordinateur du bureau est resté au travail. Que faites-vous ?",opts:[
      {t:"J’utilise mon compte Claude personnel, en retirant d’abord le nom de l’employé.",ok:false,why:"Même sans le nom, c’est un document de travail : il ne va pas dans un compte personnel."},
      {t:"Je me connecte au compte Claude de mon organisation depuis mon appareil.",ok:true,why:"Un document de travail va dans le compte de l’organisation : seul ce compte est couvert par le contrat et les règles de votre organisation."},
      {t:"J’utilise mon compte personnel, puis je supprime la conversation juste après.",ok:false,why:"Supprimer ensuite ne change rien : le document est déjà sorti du cadre de votre organisation."},
      {t:"J’utilise mon compte personnel en activant le mode incognito.",ok:false,why:"Le mode incognito reste un compte personnel : il n’est pas couvert par les règles de votre organisation."}]},
    q5:{q:"Chaque semaine, vous travaillez sur le même dossier, avec les mêmes documents et les mêmes consignes. Que choisissez-vous ?",opts:[
      {t:"Un Projet, qui garde vos documents et vos consignes.",ok:true,why:"Un Projet regroupe les documents de référence et des instructions permanentes : plus besoin de tout réexpliquer."},
      {t:"Une nouvelle conversation, en recollant tout à chaque fois.",ok:false,why:"Possible, mais vous perdez du temps à tout recharger chaque semaine."},
      {t:"La recherche web, pour retrouver vos documents.",ok:false,why:"Vos documents internes ne sont pas sur le web."}]},
    q6:{q:"Vous rédigez souvent le même type de document, selon une procédure maison. Que choisissez-vous ?",opts:[
      {t:"Une Skill, une méthode enregistrée que Claude réapplique.",ok:true,why:"Une Skill garde votre méthode et vos modèles : Claude peut la réappliquer chaque fois que la tâche revient."},
      {t:"La recherche web, pour trouver un modèle en ligne.",ok:false,why:"Votre procédure est interne : elle n’est pas sur le web."},
      {t:"Une nouvelle conversation, en réexpliquant tout.",ok:false,why:"Vous refaites le même travail d’explication à chaque fois."}]},
    q7:BINS("L’itinéraire heure par heure d’une équipe qui part dans une zone dangereuse, pour que Claude l’aide à organiser le trajet.",2,"C’est une information de sécurité : si elle circulait, l’équipe pourrait être mise en danger. Ne la saisissez pas sans autorisation. Pour vous faire aider, restez général (« une région, 5 jours, 3 personnes »). Anonymiser ne suffit pas : c’est l’itinéraire lui-même qui est sensible."),
    q8:BINS("L’évaluation de performance d’un employé nommé, pour reformuler les commentaires.",1,"Retirez le nom et les détails identifiants : Claude peut reformuler sans savoir de qui il s’agit.",["Avec le nom, vous partagez une donnée personnelle sans nécessité. Retirez d’abord le nom et les détails identifiants.",null,"Prudent, et c’est le bon réflexe si votre organisation l’exige. Mais ici, retirer le nom suffit : Claude peut reformuler sans savoir de qui il s’agit."]),
    q9:VF("« Si la réponse de Claude est bien rédigée et sûre d’elle, l’information a été vérifiée. »",false,"Le ton ne prouve rien. Une réponse fluide peut contenir une erreur : c’est vous qui vérifiez."),
    q10:{q:"Claude cite un chiffre de 74 % tiré d’un rapport. Comment le vérifier ?",opts:[
      {t:"Je demande à Claude : « Es-tu sûr ? »",ok:false,why:"Claude peut confirmer une erreur. Ce n’est pas une vérification."},
      {t:"Je demande la source exacte, puis j’ouvre le document original.",ok:true,why:"Seule la source originale fait foi. Si elle est introuvable, retirez le chiffre."},
      {t:"Je le garde s’il me paraît plausible.",ok:false,why:"Paraître plausible ne prouve rien : c’est justement ce que Claude fait le mieux."}]},
    q11:{q:"Vous avez demandé une note de 2 pages. Claude rend 6 pages très générales. Quelle relance est la plus efficace ?",opts:[
      {t:"« Fais plus court et va à l’essentiel. »",ok:false,why:"Claude choisira seul ce qui est « essentiel » : le résultat restera flou."},
      {t:"« 2 pages maximum : compare 3 options dans un tableau (coût, délai, risque) et termine par ta recommandation. »",ok:true,why:"Longueur, structure et contenu attendus : Claude sait exactement quoi corriger."},
      {t:"« 2 pages maximum : compare 3 options et annonce la décision finale de la direction. »",ok:false,why:"Claude ne doit pas décider à la place de la direction : il recommande, vous décidez."},
      {t:"« Propose-moi 3 versions différentes, je choisirai. »",ok:false,why:"Trois fois plus à relire, sans avoir dit ce qui n’allait pas."}]},
    q12:{q:"L’équipe de suivi-évaluation veut présenter 5 indicateurs en réunion, avec la cible et le résultat atteint. Quelle fonction de Claude utilisez-vous ?",opts:[
      {t:"Un artefact : une page que Claude crée (tableau de bord, graphiques) et que vous partagez.",ok:true,why:"Un artefact est une page, un outil ou un document que Claude crée et que vous ouvrez et partagez. Les chiffres, c’est vous qui les fournissez."},
      {t:"Un Projet, qui garde vos documents et vos consignes.",ok:false,why:"Un Projet organise votre travail, mais il ne produit pas la page à présenter."},
      {t:"La recherche web, pour trouver des chiffres en ligne.",ok:false,why:"Vos indicateurs sont internes : ils ne sont pas sur le web."}]}
  };
  RX.MEMO=["Claude peut se tromper avec assurance : vérifiez à la source.","Une demande précise (lecteur, format, limites) donne une meilleure réponse.","Pas de données personnelles ou sensibles sans autorisation."];
})(window.RX);
