/* Le Flair de Roxy — les 12 questions de formation validées.
   Règles : mots simples, réponses de longueur semblable, mises en situation. */
(function(RX){
  const VF=(q,vrai,why)=>({q,opts:[{t:"Vrai",ok:vrai,why},{t:"Faux",ok:!vrai,why}],two:true});
  const BINS=(q,i,why,whys)=>({q,opts:["On peut l’utiliser avec Claude","On l’anonymise d’abord","On ne la saisit pas sans autorisation"].map((t,k)=>({t,ok:k===i,why:(whys&&whys[k])||why})),lead:"Que faites-vous de cette information ?"});
  RX.QUESTIONS={
    q1:VF("« Claude peut affirmer une chose fausse avec beaucoup d’assurance. »",true,"C’est ce qu’on appelle une hallucination. Le ton ne prouve rien : vérifiez toujours les chiffres, les citations et les références."),
    q2:{q:"Un nouveau décret sur les ONG est paru hier. Que faites-vous pour que Claude vous en parle correctement ?",opts:[
      {t:"Je demande à Claude ce que dit le décret.",ok:false,why:"Sans recherche web, le décret est peut-être plus récent que ses connaissances : il risque de deviner."},
      {t:"J’active la recherche web et je demande la source officielle.",ok:true,why:"La recherche web donne accès aux textes récents. Ouvrez ensuite la source officielle pour confirmer."},
      {t:"Je donne le titre du décret et je demande un résumé.",ok:false,why:"Avec le titre seul, Claude n’a pas le texte : il risque d’inventer ou de rester vague."}]},
    q3:{q:"Lequel de ces deux prompts donnera le meilleur résumé pour notre bailleur de fonds ?",opts:[
      {t:"« Résume ce rapport. »",ok:false,why:"Claude ignore qui va lire et pourquoi : le résumé sera générique."},
      {t:"« Résume ce rapport T3 pour notre bailleur de fonds, qui le lira en 5 minutes. »",ok:true,why:"Il précise qui va lire, en combien de temps et l’objet du document : Claude peut cibler l’essentiel."}]},
    q4:{q:"Il est 22 h. Chez vous, sur votre ordinateur de travail, vous devez relire un contrat de travail pour demain. Votre compte Claude personnel est déjà ouvert dans le navigateur. Que faites-vous ?",opts:[
      {t:"Je retire d’abord le nom de la personne, puis j’utilise mon compte personnel.",ok:false,why:"Même sans le nom, c’est un document de travail : il ne va pas dans un compte personnel."},
      {t:"Je passe au compte Claude de mon organisation avant d’ajouter le contrat.",ok:true,why:"Un document de travail va dans le compte de l’organisation : seul ce compte est couvert par le contrat et les règles de votre organisation. Par défaut, ses conversations ne servent pas à entraîner les modèles."},
      {t:"J’utilise mon compte personnel, puis je supprime la conversation juste après.",ok:false,why:"Supprimer ensuite ne change rien : le document est déjà sorti du cadre de votre organisation."},
      {t:"J’active le mode incognito de mon compte personnel avant d’ajouter le contrat.",ok:false,why:"Le mode incognito reste un compte personnel : il n’est pas couvert par les règles de votre organisation."}]},
    q5:{q:"Chaque semaine, vous travaillez sur le même dossier, avec les mêmes documents et les mêmes consignes. Que choisissez-vous ?",opts:[
      {t:"Un Projet, qui garde vos documents et vos consignes.",ok:true,why:"Un Projet regroupe les documents de référence et des instructions permanentes : plus besoin de tout réexpliquer."},
      {t:"Une nouvelle conversation, en recollant tout à chaque fois.",ok:false,why:"Possible, mais vous perdez du temps à tout recharger chaque semaine."},
      {t:"La recherche web, pour retrouver vos documents.",ok:false,why:"Vos documents internes ne sont pas sur le web."}]},
    q6:{q:"Vous rédigez souvent le même type de document, selon une procédure maison. Que choisissez-vous ?",opts:[
      {t:"Une Skill, une méthode enregistrée que Claude réapplique.",ok:true,why:"Une Skill garde votre méthode et vos modèles : Claude peut la réappliquer chaque fois que la tâche revient."},
      {t:"La recherche web, pour trouver un modèle en ligne.",ok:false,why:"Votre procédure est interne : elle n’est pas sur le web."},
      {t:"Une nouvelle conversation, en réexpliquant tout.",ok:false,why:"Vous refaites le même travail d’explication à chaque fois."}]},
    q7:BINS("L’itinéraire heure par heure d’une équipe qui part dans une zone dangereuse, pour que Claude l’aide à organiser le trajet.",2,"C’est une information de sécurité : si elle circulait, l’équipe pourrait être mise en danger. Ne la saisissez pas sans autorisation. Pour vous faire aider, restez général (« une région, 5 jours, 3 personnes »). Anonymiser ne suffit pas : c’est l’itinéraire lui-même qui est sensible."),
    q8:BINS("L’évaluation de performance d’une personne de votre équipe, avec son nom, pour reformuler les commentaires.",1,"Retirez le nom et les détails identifiants : Claude peut reformuler sans savoir de qui il s’agit. Pour les dossiers du personnel, suivez aussi la règle de votre organisation.",["Avec le nom, vous partagez une donnée personnelle sans nécessité. Retirez d’abord le nom et les détails identifiants.",null,"Prudent, et c’est le bon réflexe si votre organisation l’exige. Mais ici, retirer le nom suffit : Claude peut reformuler sans savoir de qui il s’agit."]),
    q9:{q:"Vous voulez que Claude s’appuie sur la dernière procédure interne de votre organisation. Que faites-vous ?",opts:[
      {t:"Je pose ma question : avec le compte de l’organisation, Claude connaît nos documents.",ok:false,why:"Le compte de l’organisation protège vos données, mais il ne donne pas accès à vos documents : Claude ne les lit que si vous les joignez ou si un connecteur est activé."},
      {t:"Je joins le document, ou je passe par un outil connecté à Claude.",ok:true,why:"Claude ne lit que ce qu’on lui donne : un fichier joint, ou un outil que votre organisation a connecté (un « connecteur »). Il n’y voit que ce à quoi vous avez déjà accès."},
      {t:"Je décris la procédure de mémoire et Claude complète le reste.",ok:false,why:"Claude compléterait avec des suppositions, pas avec votre vraie procédure."}]},
    q10:{q:"Claude a rédigé votre note pour la direction. Elle contient : « 74 % des projets ont atteint leurs cibles (rapport annuel) ». Vous devez l’envoyer dans 10 minutes et n’avez pas le rapport sous la main. Que faites-vous ?",opts:[
      {t:"J’envoie la note : Claude a cité le rapport, le chiffre est donc sourcé.",ok:false,why:"Une source citée n’est pas une source vérifiée : Claude peut se tromper même en citant un rapport."},
      {t:"Je demande à Claude « Es-tu sûr ? » et j’envoie s’il confirme.",ok:false,why:"Claude peut confirmer sa propre erreur : ce n’est pas une vérification."},
      {t:"J’écris « environ les trois quarts » pour rester prudent.",ok:false,why:"Arrondir ne corrige rien : si le chiffre est faux, « trois quarts » l’est aussi."},
      {t:"Je retire le chiffre ou j’indique « à vérifier » avant d’envoyer.",ok:true,why:"Un chiffre non vérifié ne part pas. Vous le remettrez quand vous aurez ouvert le rapport original."}]},
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
  RX.MEMO=["Claude peut se tromper avec assurance : vérifiez à la source.","Une demande précise (public, format, limites) donne une meilleure réponse.","Pas de données personnelles ou sensibles sans autorisation.","Pour le travail, toujours le compte Claude de l’organisation."];
})(window.RX);
