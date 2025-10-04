// Game state
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;

// Sample questions array - you can easily duplicate and modify this structure
const questions = [
    {
        question: "Ano ang mas malalim na dahilan ng pagbagsak ng Kanlurang Imperyong Romano batay sa kombinasyon ng panloob at panlabas na salik?",
        answers: ["Labis na pagpapalawak ng teritoryo", "Kakulangan sa pinuno", "Pagbagsak ng ekonomiya at patuloy na pananakop ng mga barbaro", "Pagtaas ng populasyon"],
        correct: 2
    },
    {
        question: "Ano ang pangunahing epekto ng Edict of Milan ni Constantine sa Kristiyanismo?",
        answers: ["Ginawang opisyal na relihiyon ng estado ang Kristiyanismo", "Inilunsad ang Unang Krusada", "Ipinatigil ang pag-uusig sa mga Kristiyano", "Inalis ang kapangyarihan ng Papa"],
        correct: 2
    },
    {
        question: "Paano ipinakita ni Theodosius I ang suporta sa Kristiyanismo bilang opisyal na relihiyon ng imperyo?",
        answers: ["Pinagtibay ang Nicene Creed", "Itinayo ang St. Peter’s Basilica", "Ipinagbawal ang Kristiyanismo", "Ipinatayo ang mga monastery"],
        correct: 0
    },
    {
        question: "Sino ang pinuno ng mga Visigoth na sumalakay sa Roma noong 410 C.E.?",
        answers: ["Atila", "Alarico", "Clovis", "Otto I"],
        correct: 1
    },
    {
        question: "Ang Donasyon ni Pepin ay nagbigay ng kapangyarihang politikal sa alin sa mga sumusunod?",
        answers: ["Hari ng England", "Papa at Simbahang Katoliko", "Emperador ng Silangan", "Hari ng Germany"],
        correct: 1
    },
    {
        question: "Ano ang pangunahing sistemang pang-ekonomiya sa Gitnang Panahon?",
        answers: ["Kapitalismo", "Komunismo", "Merkantilismo", "Manoryalismo"],
        correct: 3
    },
    {
        question: "Ano ang nilalayon ng Petrine Doctrine?",
        answers: ["Muling pagsanib ng Silangan at Kanlurang simbahan", "Pagkilala sa Obispo ng Rome bilang tagapagmana ni San Pedro", "Pagbabawal sa mga imahen", "Pagpapatayo ng mga bagong simbahan"],
        correct: 1
    },
    {
        question: "Ano ang pangunahing pagkakaiba ng Roman Catholic at Eastern Orthodox Church sa pamumuno?",
        answers: ["Ang wika ng pagsamba", "Ang uri ng banal na kasulatan", "Ang pagkilala sa Papa bilang pinakamataas na pinuno ng simbahan", "Ang pagsunod sa Nicene Creed"],
        correct: 2
    },
    {
        question: "Ano ang tawag sa seremonya kung saan binibigyan ng lupain ang vassal bilang pagkilala?",
        answers: ["Investiture", "Homage", "Chivalry", "Concordat"],
        correct: 0
    },
    {
        question: "Ano ang tawag sa sistemang panlipunan at pampolitikal sa Europa matapos bumagsak ang Imperyong Romano?",
        answers: ["Piyudalismo", "Manoryalismo", "Merkantilismo", "Kapitalismo"],
        correct: 0
    },
    {
        question: "Saan pangunahing nagmumula ang mga kalakal at serbisyo sa ilalim ng sistemang manoryal?",
        answers: ["Palengke ng lungsod", "Mga pagawaan ng simbahan", "Lupain ng maharlika o panginoong maylupa", "Sentro ng kalakalan"],
        correct: 2
    },
    {
        question: "Bakit mahalaga ang Unang Krusada sa kasaysayan ng Kristiyanismo?",
        answers: ["Ito ang nagpatibay ng pagkakaiba ng Katoliko at Orthodox", "Nabawi ang Jerusalem mula sa mga Muslim", "Pinatibay nito ang kapangyarihan ng Constantinople", "Nasakop nito ang buong Asya Minor"],
        correct: 1
    },
    {
        question: "Sa anong paraan ipinakita ni Papa Gregory VII ang kanyang reporma sa simbahan?",
        answers: ["Ipinag-utos ang pagsali sa krusada", "Tinanggal ang karapatan ng hari sa pagtalaga ng obispo", "Inilunsad ang Petrine Doctrine", "Nagtayo ng bagong monastery"],
        correct: 1
    },
    {
        question: "Sino ang kinoronahan ni Papa Leo III bilang Emperador ng Banal na Imperyong Romano noong 800 C.E.?",
        answers: ["Otto I", "Pepin III", "Charles Martel", "Charlemagne"],
        correct: 3
    },
    {
        question: "Ano ang tawag sa panunumpa ng katapatan ng isang vassal sa kanyang lord?",
        answers: ["Oath of Fealty", "Treaty of Verdun", "Edict of Milan", "Chivalry"],
        correct: 0
    },
    {
        question: "Ano ang pangunahing ikinabubuhay ng mga naninirahan sa manor?",
        answers: ["Pangingisda", "Pagtitinda", "Pangangalakal", "Pagsasaka"],
        correct: 3
    },
    {
        question: "Ano ang simbolikong kahulugan ng “crux” sa krusada?",
        answers: ["Krus", "Tagumpay", "Simbahan", "Pagtataboy"],
        correct: 0
    },
    {
        question: "Bakit tinawag na “Krusada ng mga Hari” ang Ikatlong Krusada?",
        answers: ["Pinangunahan ito ng mga obispo", "Pinamunuan ito ang tatlong hari ng Europa", "Lahat ng sumali ay mula sa maharlika", "Inilunsad ito ng Papa"],
        correct: 1
    },
    {
        question: "Ano ang dahilan ng pagkabigo ng Ikalawang Krusada?",
        answers: ["Kakulangan sa armadong pwersa", "Kakulangan sa tiwala ng simbahan", "Hindi nasakop ang Damascus", "Pagtanggi ng Constantinople sa tulong"],
        correct: 2
    },
    {
        question: "Ano ang naging iskandalo sa Ikaapat na Krusada?",
        answers: ["Pagkawala ng Santo Papa", "Pananakop sa Zara at Constantinople", "Pagkamatay ng mga Krusador", "Pagkakaisa ng Silangan at Kanlurang Europa"],
        correct: 1
    },
    {
        question: "Ano ang epekto ng Treaty of Verdun noong 843?",
        answers: ["Pagkahati ng Imperyong Carolingian", "Pagwawakas ng Imperyong Roman", "Pagkabuo ng Simbahang Katoliko", "Pagbagsak ng Feudalism"],
        correct: 0
    },
    {
        question: "Ano ang papel ng College of Cardinals sa Simbahang Katoliko?",
        answers: ["Nangunguna sa mga misa", "Nagtatalaga ng mga emperador", "Naghahalal ng bagong Papa", "Namumuno sa monasteryo"],
        correct: 2
    },
    {
        question: "Ano ang lohikal na epekto ng Homage at Oath of Fealty sa ugnayan ng lord at vassal?",
        answers: ["Napilitan ang lord na maging hari", "Naging pantay ang lord at vassal", "Pinalalim nito ang pananagutang politikal at militar", "Naalis ang kapangyarihan ng hari"],
        correct: 2
    },
    {
        question: "Ano ang kahalagahan ng Papal States?",
        answers: ["Sentro ng kalakalan", "Lugar ng mga pagsasanay militar", "Simbolo ng temporal at espiritwal na kapangyarihan ng papa", "Lungsod ng mga kabalyero"],
        correct: 2
    },
    {
        question: "Ano ang papel ng mga serf sa sistemang manoryal?",
        answers: ["Namumuno sa manor", "Nag-aangkat ng produkto", "Gumagawa ng batas", "Nagsasagawa ng mga gawain sa manor"],
        correct: 3
    },
    {
        question: "Alin sa mga sumusunod ang tunay na dahilan ng paglunsad ng mga krusada?",
        answers: ["Pagpapalawak ng teritoryo ng Simbahang Katoliko", "Pagtaas ng populasyon", "Pagbagsak ng ekonomiya at patuloy na pananakop ng mga barbaro", "Pagbawi sa Jerusalem mula sa mga Muslim"],
        correct: 3
    },
    {
        question: "Paano nakatulong ang Donasyon ni Pepin sa paglakas ng kapangyarihan ng Simbahan?",
        answers: ["Nagbigay ito ng lupa sa Simbahan bilang sentro ng kapangyarihan", "Ibinigay nito ang kalayaan sa mga maharlika", "Pinayagan nitong bumoto ang mga obispo", "Ipinatupad nito ang mga batas ng Simbahan sa buong Europa"],
        correct: 0
    },
    {
        question: "Bakit maituturing na self-sufficient ang sistemang manoryal?",
        answers: ["May sariling pamahalaan ang manor", "Gumagawa ng sariling batas ang manor", "Lahat ng pangangailangan ay nililikha sa loob ng manor", "Malaya ang mga serf na umalis"],
        correct: 2
    },
    {
        question: "Paano nagkaroon ng kapangyarihang politikal ang Papa sa panahon ng Gitnang Panahon?",
        answers: ["Dahil siya ay mahal ng mamamayan", "Dahil sa kanyang karunungan", "Dahil sa kanyang yaman", "Dahil sa doktrinang Petrine at suporta ng mga hari"],
        correct: 3
    },
    {
        question: "Ano ang ipinapahiwatig ng Krusada ng mga Bata sa pananampalataya noong panahon ng Krusada?",
        answers: ["Mataas ang tiwala sa militar", "Malalim ang pananalig ng mga tao kahit sa murang edad", "Hindi na pinaniniwalaan ang simbahan", "Ang simbahan ay hindi kasangkot sa mga krusada"],
        correct: 1
    }
];

// DOM elements
const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const answersGrid = document.getElementById('answersGrid');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const scoreDisplay = document.getElementById('scoreDisplay');
const progressFill = document.getElementById('progressFill');
const gameOver = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartBtn = document.getElementById('restartBtn');
const quizContainer = document.getElementById('quizContainer');

// Sound effects using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Sound effects
const sounds = {
    select: () => playSound(400, 0.1, 'triangle'),
    correct: () => {
        playSound(523, 0.2, 'sine');
        setTimeout(() => playSound(659, 0.2, 'sine'), 100);
        setTimeout(() => playSound(784, 0.3, 'sine'), 200);
    },
    incorrect: () => {
        playSound(200, 0.3, 'sawtooth');
        setTimeout(() => playSound(150, 0.3, 'sawtooth'), 150);
    },
    complete: () => {
        playSound(523, 0.2, 'sine');
        setTimeout(() => playSound(659, 0.2, 'sine'), 100);
        setTimeout(() => playSound(784, 0.2, 'sine'), 200);
        setTimeout(() => playSound(1047, 0.4, 'sine'), 300);
    }
};

// Initialize game
function initGame() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    answered = false;
    updateDisplay();
    showQuestion();
}

// Show current question
function showQuestion() {
    const question = questions[currentQuestion];
    questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    questionText.textContent = question.question;
    
    // Clear previous answers
    answersGrid.innerHTML = '';
    
    // Create answer options
    question.answers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.dataset.answer = index;
        answerDiv.innerHTML = `<div class="answer-text">${answer}</div>`;
        answersGrid.appendChild(answerDiv);
    });
    
    // Add event listeners
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach(option => {
        option.addEventListener('click', selectAnswer);
    });
    
    // Reset buttons
    submitBtn.style.display = 'block';
    submitBtn.disabled = true;
    nextBtn.style.display = 'none';
    answered = false;
    selectedAnswer = null;
    
    // Update progress
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = progress + '%';
    
    // Add particles
    createParticles();
}

// Select answer
function selectAnswer(e) {
    if (answered) return;
    
    // Remove previous selection
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Select current answer
    e.currentTarget.classList.add('selected');
    selectedAnswer = parseInt(e.currentTarget.dataset.answer);
    submitBtn.disabled = false;
    
    // Play select sound
    sounds.select();
}

// Submit answer
function submitAnswer() {
    if (selectedAnswer === null || answered) return;
    
    answered = true;
    const question = questions[currentQuestion];
    const answerOptions = document.querySelectorAll('.answer-option');
    
    // Show correct/incorrect
    answerOptions.forEach((option, index) => {
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedAnswer && selectedAnswer !== question.correct) {
            option.classList.add('incorrect');
        }
    });
    
    // Update score
    if (selectedAnswer === question.correct) {
        score++;
        sounds.correct();
    } else {
        sounds.incorrect();
    }
    
    updateDisplay();
    
    // Show next button or finish game
    submitBtn.style.display = 'none';
    if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
            nextBtn.style.display = 'block';
        }, 1000);
    } else {
        setTimeout(endGame, 1500);
    }
}

// Next question
function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

// End game
function endGame() {
    quizContainer.style.display = 'none';
    gameOver.style.display = 'block';
    
    finalScore.textContent = `Your Final Score: ${score}/${questions.length}`;
    
    // Custom message based on score
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) {
        gameOverMessage.textContent = "Perpekto! Tunay kang bihasa sa kaalaman ng Gitnang Panahon!";
    } else if (percentage >= 80) {
        gameOverMessage.textContent = "Napakagaling! Napatunayan mong ikaw ay isang karapat-dapat na iskolar!";
    } else if (percentage >= 60) {
        gameOverMessage.textContent = "Magaling! Kapuri-puri ang iyong kaalaman sa panahon ng Gitnang Panahon!";
    } else {
        gameOverMessage.textContent = "Matapang na pagsisikap! Ipagpatuloy ang iyong pag-aaral upang maging isang tunay na dalubhasa sa Gitnang Panahon!";
    }
    
    sounds.complete();
}

// Restart game
function restartGame() {
    gameOver.style.display = 'none';
    quizContainer.style.display = 'block';
    initGame();
}

// Update display
function updateDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Create floating particles
function createParticles() {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => particle.remove());
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(particle);
    }
}

// Event listeners
submitBtn.addEventListener('click', submitAnswer);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartGame);

// Initialize game on load
document.addEventListener('DOMContentLoaded', initGame);

// Handle audio context for mobile devices
document.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
});