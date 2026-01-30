// Mini questionnaire "humeur" (inspiré des signes courants, formulé en mots simples)
// Score 0..3 par question. Résultat = indication (pas un diagnostic).

var questions = [
  "As-tu eu moins d’envie ou de plaisir à faire des choses que tu aimais ?",
  "Te sens-tu souvent triste, vide, ou découragée ?",
  "Ton sommeil a-t-il beaucoup changé (trop / pas assez) ?",
  "Te sens-tu souvent fatiguée, sans énergie, même après repos ?",
  "Ton appétit a-t-il changé (moins / plus) ou ton poids a varié sans le vouloir ?",
  "As-tu du mal à te concentrer (cours, lecture, conversations) ?",
  "Te sens-tu plus irritable, à fleur de peau, ou facilement fâchée ?",
  "As-tu l’impression de te dévaloriser ou de te sentir “nulle” souvent ?",
  "Te sens-tu ralentie (tout semble lourd) ou au contraire agitée (impossible de rester en place) ?",
  "As-tu eu souvent envie de t’isoler des autres ?"
];

var choices = [
  { label: "Pas du tout", score: 0 },
  { label: "Quelques jours", score: 1 },
  { label: "Plus de la moitié du temps", score: 2 },
  { label: "Presque tous les jours", score: 3 }
];

var answers = new Array(questions.length).fill(null);
var idx = 0;

var startCard = document.getElementById("startCard");
var quizCard = document.getElementById("quizCard");
var resultCard = document.getElementById("resultCard");

var startBtn = document.getElementById("startBtn");
var backBtn = document.getElementById("backBtn");
var nextBtn = document.getElementById("nextBtn");
var restartBtn = document.getElementById("restartBtn");

var qText = document.getElementById("qText");
var qCount = document.getElementById("qCount");
var choicesBox = document.getElementById("choices");
var bar = document.getElementById("bar");

var scoreOut = document.getElementById("scoreOut");
var maxOut = document.getElementById("maxOut");
var levelBadge = document.getElementById("levelBadge");
var explain = document.getElementById("explain");
var tips = document.getElementById("tips");

function show(el){ el.classList.remove("hidden"); }
function hide(el){ el.classList.add("hidden"); }

function render(){
  qText.textContent = questions[idx];
  qCount.textContent = "Question " + (idx + 1) + "/" + questions.length;

  var pct = Math.round((idx) / questions.length * 100);
  bar.style.width = pct + "%";

  choicesBox.innerHTML = "";
  for (var i = 0; i < choices.length; i++){
    var c = document.createElement("button");
    c.type = "button";
    c.className = "choice";
    c.textContent = choices[i].label;

    if (answers[idx] === choices[i].score) c.classList.add("selected");

    (function(score){
      c.addEventListener("click", function(){
        answers[idx] = score;
        render();
        nextBtn.disabled = false;
      });
    })(choices[i].score);

    choicesBox.appendChild(c);
  }

  backBtn.disabled = (idx === 0);
  nextBtn.disabled = (answers[idx] === null);
  nextBtn.textContent = (idx === questions.length - 1) ? "Voir résultat" : "Suivant";
}

function computeScore(){
  var sum = 0;
  for (var i = 0; i < answers.length; i++){
    sum += (answers[i] === null ? 0 : answers[i]);
  }
  return sum;
}

function buildTips(level){
  var list = [];
  if (level === "ok"){
    list.push({ t:"Petit check-in", d:"Garde une routine simple (sommeil, repas, bouger un peu). Note ton humeur 1x/jour." });
    list.push({ t:"Parle tôt", d:"Si ça dure ou empire, parle à un adulte de confiance (parent, ami proche, prof, intervenant)." });
  } else if (level === "warn"){
    list.push({ t:"Ne reste pas seule avec ça", d:"Choisis 1 personne safe aujourd’hui et dis-lui : “J’ai besoin d’en parler, ça va pas trop.”" });
    list.push({ t:"Plan léger 24h", d:"Un petit objectif: douche, manger quelque chose, 10 minutes dehors, 1 message à quelqu’un." });
    list.push({ t:"Demande de l’aide pro", d:"Un médecin, psychoéducateur, psychologue, ou 811 (Info-Social) peut t’aider à trier ça." });
  } else {
    list.push({ t:"Ça mérite du soutien rapidement", d:"Prends ça au sérieux: parle à un adulte de confiance aujourd’hui et demande un rendez-vous." });
    list.push({ t:"Si tu te sens en danger", d:"Appelle/texte 9-8-8 (Canada) ou 911 si urgence." });
    list.push({ t:"Support jeune", d:"Kids Help Phone: 1-800-668-6868 ou texte CONNECT au 686868." });
  }

  tips.innerHTML = "";
  for (var i=0;i<list.length;i++){
    var box = document.createElement("div");
    box.className = "tip";
    var title = document.createElement("strong");
    title.textContent = list[i].t;
    var desc = document.createElement("div");
    desc.textContent = list[i].d;
    box.appendChild(title);
    box.appendChild(desc);
    tips.appendChild(box);
  }
}

function showResult(){
  var score = computeScore();
  var max = questions.length * 3;

  scoreOut.textContent = String(score);
  maxOut.textContent = String(max);

  // Seuils simples (0-30):
  // 0-7 : faible, 8-15 : modéré, 16+ : élevé
  var level = "ok";
  var label = "Faible (plutôt rassurant)";
  var cls = "ok";
  var msg =
    "Tes réponses suggèrent peu de signes persistants. " +
    "Si tu te sens quand même mal ou si ça dure, c’est valide d’en parler à quelqu’un.";

  if (score >= 8 && score <= 15){
    level = "warn";
    label = "Modéré (à surveiller + en parler)";
    cls = "warn";
    msg =
      "Tes réponses montrent plusieurs signes qui méritent de l’attention. " +
      "Ce n’est pas un diagnostic, mais ça vaut le coup d’en parler à un adulte de confiance ou un pro.";
  } else if (score >= 16){
    level = "bad";
    label = "Élevé (soutien recommandé)";
    cls = "bad";
    msg =
      "Tes réponses montrent beaucoup de signes fréquents. " +
      "Ce n’est pas un diagnostic, mais ce serait important d’aller chercher du soutien rapidement.";
  }

  levelBadge.textContent = label;
  levelBadge.className = "badge " + cls;
  explain.textContent = msg;

  buildTips(level);

  hide(quizCard);
  show(resultCard);
}

startBtn.addEventListener("click", function(){
  hide(startCard);
  show(quizCard);
  idx = 0;
  render();
});

backBtn.addEventListener("click", function(){
  if (idx > 0){
    idx--;
    render();
  }
});

nextBtn.addEventListener("click", function(){
  if (answers[idx] === null) return;

  if (idx < questions.length - 1){
    idx++;
    render();
  } else {
    bar.style.width = "100%";
    showResult();
  }
});

restartBtn.addEventListener("click", function(){
  answers = new Array(questions.length).fill(null);
  idx = 0;
  hide(resultCard);
  show(startCard);
  bar.style.width = "0%";
});
