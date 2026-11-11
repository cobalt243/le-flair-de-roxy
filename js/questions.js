/* Le Flair de Roxy — les 12 questions de formation validées (voir docs/questions-validees.md).
   Règles : mots simples, réponses de longueur semblable, mises en situation. */
(function(RX){
  const VF=(q,vrai,why)=>({q,opts:[{t:"Vrai",ok:vrai,why},{t:"Faux",ok:!vrai,why}],two:true});
  const BINS=(q,i,why)=>({q,opts:["On peut l’utiliser avec Claude","On l’anonymise d’abord","On ne la saisit pas sans autorisation"].map((t,k)=>({t,ok:k===i,why})),lead:"Que faites-vous de cette information ?"});
  RX.QUESTIONS={
    q1:VF("« Claude peut affirmer une chose fausse avec beaucoup d’assurance. »",true,"C’est ce qu’on appelle une hallucination. Vérifiez toujours les chiffres, les citations et les références."),
    q2:{q:"Un nouveau décret sur les ONG est paru hier. Que faites-vous pour que Claude vous en parle correctement ?",opts:[
      {t:"Je demande à Claude ce que dit le décret.",ok:false,why:"Le décret est peut-être plus récent que les connaissances de Claude : il risque de deviner."},
      {t:"J’active la recherche web et je demande la source officielle.",ok:true,why:"La recherche web donne accès aux textes récents. Ouvrez ensuite la source officielle pour confirmer."},
      {t:"Je donne le titre du décret et je demande un résumé.",ok:false,why:"Avec le titre seul, Claude n’a pas le texte : il devrait l’inventer."}]},
    q3:{q:"Lequel de ces deux prompts donnera le meilleur résumé pour notre bailleur ?",opts:[
      {t:"« Résume ce rapport. »",ok:false,why:"Claude ignore qui va lire et pourquoi : le résumé sera générique."},
      {t:"« Résume ce rapport T3 pour notre bailleur, qui le lira en 5 minutes. »",ok:true,why:"Il précise le lecteur, son temps et l’objet du document : Claude peut cibler l’essentiel."}]},
    q4:VF("« Vous pouvez demander à Claude de vous poser des questions avant de répondre. »",true,"C’est très utile : « Avant de rédiger, pose-moi jusqu’à 3 questions. » Claude comble alors ce qui manque avec vous."),
    q5:{q:"Chaque semaine, vous travaillez sur le même dossier, avec les mêmes documents et les mêmes consignes. Que choisissez-vous ?",opts:[
      {t:"Un Projet, qui garde vos documents et vos consignes.",ok:true,why:"Un Projet regroupe les documents de référence et des instructions permanentes : plus besoin de tout réexpliquer."},
      {t:"Une nouvelle conversation, en recollant tout à chaque fois.",ok:false,why:"Possible, mais vous perdez du temps à tout recharger chaque semaine."},
      {t:"La recherche web, pour retrouver vos documents.",ok:false,why:"Vos documents internes ne sont pas sur le web."}]},
    q6:{q:"Vous rédigez souvent le même type de document, selon une procédure maison. Que choisissez-vous ?",opts:[
      {t:"Une Skill, une méthode enregistrée que Claude réapplique.",ok:true,why:"Une Skill garde votre méthode et vos modèles : Claude les applique chaque fois que la tâche revient."},
      {t:"La recherche web, pour trouver un modèle en ligne.",ok:false,why:"Votre procédure est interne : elle n’est pas sur le web."},
      {t:"Une nouvelle conversation, en réexpliquant tout.",ok:false,why:"Vous refaites le même travail d’explication à chaque fois."}]},
    q7:BINS("L’itinéraire heure par heure d’une équipe qui part dans une zone dangereuse, pour que Claude l’aide à organiser le trajet.",2,"C’est une information de sécurité : si elle circulait, l’équipe pourrait être mise en danger. Ne la saisissez pas sans autorisation. Pour vous faire aider, restez général (« une région, 5 jours, 3 personnes »)."),
    q8:BINS("L’évaluation de performance d’un employé nommé, pour reformuler les commentaires.",1,"Retirez le nom et les détails identifiants : Claude peut reformuler sans savoir de qui il s’agit."),
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
    q12:{q:"Vous voulez que Claude prépare l’ordre du jour de la réunion d’équipe de lundi. Quel prompt choisissez-vous ?",opts:[
      {t:"« Prépare l’ordre du jour de la réunion de lundi, avec tous les sujets importants du moment. »",ok:false,why:"Claude ne connaît pas « les sujets importants du moment » : il devra deviner."},
      {t:"« Prépare l’ordre du jour de lundi : réunion d’1 h, 6 personnes, 4 points maximum avec durée et responsable. »",ok:true,why:"Durée, participants, nombre de points et format : tout est précisé, sans rien inventer."},
      {t:"« Prépare l’ordre du jour de lundi : réunion d’1 h, 4 points ; invente des sujets réalistes si je n’en donne pas. »",ok:false,why:"Bien cadré, mais demander d’inventer donne un ordre du jour sans lien avec la réalité."},
      {t:"« Prépare un ordre du jour professionnel et bien présenté pour notre prochaine réunion. »",ok:false,why:"« Professionnel » ne dit ni la durée, ni les participants, ni les sujets."}]}
  };
  RX.MEMO=["Claude peut se tromper avec assurance : vérifiez à la source.","Une demande précise (lecteur, format, limites) donne une meilleure réponse.","Pas de données personnelles ou sensibles sans autorisation."];
})(window.RX);
