// SOUND EFFECTC
class SoundManager {
    constructor() {
        this.isInitialized = false;
        this.sounds = {};
    }
    
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            await Tone.start();
            this.createSounds();
            this.isInitialized = true;
        } catch (error) {
            console.log('Audio initialization failed:', error);
        }
    }
    
    createSounds() {
        // Medieval bell sound for correct answers
        this.sounds.correct = new Tone.Synth({
            oscillator: { type: "sine" },
            envelope: { attack: 0.1, decay: 0.3, sustain: 0.3, release: 1.2 }
        }).toDestination();
        
        // Deep horn sound for incorrect answers
        this.sounds.incorrect = new Tone.Synth({
            oscillator: { type: "sawtooth" },
            envelope: { attack: 0.2, decay: 0.1, sustain: 0.1, release: 0.8 }
        }).toDestination();
        
        // Sword clang for button clicks
        this.sounds.click = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
        }).toDestination();
        
        // Timer tick sound
        this.sounds.tick = new Tone.Synth({
            oscillator: { type: "square" },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
        }).toDestination();
        
        // Victory fanfare
        this.sounds.victory = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1.0 }
        }).toDestination();
        
        // Game start sound
        this.sounds.gameStart = new Tone.Synth({
            oscillator: { type: "sine" },
            envelope: { attack: 0.3, decay: 0.2, sustain: 0.3, release: 0.8 }
        }).toDestination();
    }
    
    async playCorrect() {
        if (!this.isInitialized) return;
        // Medieval bell sequence
        this.sounds.correct.triggerAttackRelease("C5", "8n");
        setTimeout(() => this.sounds.correct.triggerAttackRelease("E5", "8n"), 150);
        setTimeout(() => this.sounds.correct.triggerAttackRelease("G5", "4n"), 300);
    }
    
    async playIncorrect() {
        if (!this.isInitialized) return;
        // Deep horn sound
        this.sounds.incorrect.triggerAttackRelease("C2", "2n");
    }
    
    async playClick() {
        if (!this.isInitialized) return;
        // Quick metallic sound
        this.sounds.click.triggerAttackRelease("16n");
    }
    
    async playTick() {
        if (!this.isInitialized) return;
        this.sounds.tick.triggerAttackRelease("C4", "32n");
    }
    
    async playVictory() {
        if (!this.isInitialized) return;
        // Victory fanfare sequence
        const notes = ["C4", "E4", "G4", "C5"];
        notes.forEach((note, i) => {
            setTimeout(() => this.sounds.victory.triggerAttackRelease(note, "4n"), i * 200);
        });
    }
    
    async playGameStart() {
        if (!this.isInitialized) return;
        // Ascending medieval tune
        const notes = ["G3", "A3", "B3", "C4"];
        notes.forEach((note, i) => {
            setTimeout(() => this.sounds.gameStart.triggerAttackRelease(note, "8n"), i * 150);
        });
    }
}





// PRE-QUIZ CONTENT
class MedievalQuiz {
    constructor() {
        // Initialize background music
        this.bgMusic = document.getElementById('bgMusic');
        this.bgMusic.volume = 1.0;
        
        // Initialize sound manager
        this.soundManager = new SoundManager();
        
        // Setup audio context on construction
        this.setupAudioContext();
        
        this.totalTimeInSeconds = 1200; // 20 minutes = 1200 seconds
        this.timeLeft = this.totalTimeInSeconds;
        this.timer = null;

        this.questions = [
            {
                question: "Ano ang tawag sa sistemang pang-ekonomiya kung saan ang manor ang sentro ng buhay?",
                answers: ["Merkatilismo", "Manoryalismo", "Piyudalismo", "Kapitalismo"],
                correct: 1
            },
            {
                question: "Sino ang itinuturing na pinakamakapangyarihang pinuno ng Simbahang Katoliko sa Gitnang Panahon?",
                answers: ["Arsobispo", "Papa", "Obispo", "Kardinal"],
                correct: 1
            },
            {
                question: "Ano ang pangunahing layunin ng Krusada?",
                answers: ["Palawakin ang teritoryo ng Pransiya", "Bawiin ang Banal na Lupain mula sa mga Muslim", "Magtatag ng bagong relihiyon", "Magpalaganap ng sining"],
                correct: 1
            },
            {
                question: "Ano ang naging papel ng Simbahang Katoliko sa Gitnang Panahon?",
                answers: ["Tagapagtanggol ng mga Muslim", "Sentro ng kapangyarihang espiritwal at politikal", "Tagapagtatag ng mga lungsod", "Tagapagsimula ng Renaissance"],
                correct: 1
            },
            {
                question: "Ano ang tawag sa pamumuno ng mga panginoong maylupa sa kanilang mga nasasakupan?",
                answers: ["Demokrasya", "Piyudalismo", "Monarkiya", "Oligarkiya"],
                correct: 1
            },
            {
                question: "Ano ang naging papel ng mga kabalyero sa sistemang piyudal?",
                answers: ["Tagapagtanggol ng manor at tagapagsilbi sa panginoong maylupa", "Tagapagturo ng relihiyon", "Tagapamahala ng lungsod", "Tagapagtayo ng simbahan"],
                correct: 0
            },
            {
                question: "Ano ang ibig sabihin ng “fief” sa sistemang piyudalismo?",
                answers: ["Serbisyong panrelihiyon", "Lupaing ipinagkakaloob sa basalyo kapalit ng serbisyo", "Templo ng mga pari", "Palasyo ng hari"],
                correct: 1
            },
            {
                question: "Siya ang kinikilala bilang ang unang emperador ng Banal na Imperyong Romano?",
                answers: ["Charlemagne", "Otto 1", "Clovis I", "Pepin II"],
                correct: 1
            },
            {
                question: "Ito ang kasunduan na humati sa imperyo ni Charlemagne?",
                answers: ["Kasunduan ng Paris", "Kasunduan ng Verdun", "Kasunduan ng Roma", "Kasunduan ng Versailles"],
                correct: 1
            },
            {
                question: "Ano ang pangunahing yaman ng panginoon sa sistemang manoryal?",
                answers: ["Ginto at pilak", "Buwis mula sa mga serf", "Kita mula sa kalakalan", "Lupa at serbisyo ng mga magsasaka"],
                correct: 3
            },
            {
                question: "Sino ang tumatanggap ng lupa mula sa panginoong maylupa sa sistemang piyudal?",
                answers: ["Basalyo", "Serf", "Hari", "Pari"],
                correct: 0
            },
            {
                question: "Anong dinastiya ang pinagmulan ng Banal na Imperyong Romano?",
                answers: ["Carolingian", "Merovingian", "Saxon", "Habsburg"],
                correct: 0
            },
            {
                question: "Ano ang tawag sa pinuno ng Banal na Imperyong Romano?",
                answers: ["Emperador", "Papa", "Basalyo", "Panginoon Maylupa"],
                correct: 0
            },
            {
                question: "Ano ang tawag sa mga alagad ng simbahan na maaaring secular o regular?",
                answers: ["Basalyo", "Pari at Monghe", "Serf", "Bourgeoisie"],
                correct: 0
            },
            {
                question: "Siya ang tinaguriang “Ama ng Europa”?",
                answers: ["Clovis I", "Otto I", "Charlemagne", "Charles Martel"],
                correct: 2
            },
            {
                question: "Ang Santo Papang nagkorona kay Charlemagne bilang emperador ng Banal na Imperyong Romano?",
                answers: ["Papa John III", "Papa Gregory III", "Papa Leo III", "Papa Francis"],
                correct: 2
            },
            {
                question: "Ano ang tawag sa lupang pag-aari ng isang panginoon sa sistemang piyudal?",
                answers: ["Manor", "Polis", "Fief", "Estate"],
                correct: 0
            },
            {
                question: "Ano ang tawag sa sentrong pang-ekonomiya sa ilalim ng manoryalismo?",
                answers: ["Bayan", "Manor", "Lungsod", "Fief"],
                correct: 1
            },
            {
                question: "Anong institusyon ang may kapangyarihang mag-excommunicate o magtanggal sa isang tao mula sa simbahan?",
                answers: ["Hari", "Simbahang Katoliko", "Parlamento", "Guild"],
                correct: 0
            },
            {
                question: "Ano ang naging epekto ng pagbagsak ng Imperyong Romano sa pag-usbong ng Simbahang Katoliko?",
                answers: ["Nawala ang kapangyarihan ng simbahan", "Lumakas ang kapangyarihan ng Papa bilang lider ng mga Kristiyanismo", "Nawala ang relihiyon sa Europa", "Nagsimula ang mga Krusada"],
                correct: 1
            },
            {
                question: "Ano ang papel ng mga monasteryo sa Gitnang Panahon?",
                answers: ["Sentro ng kalakalan", "Sentro ng edukasyon at pagpapanatili ng kaalaman", "Sentro ng pamahalaan", "Sentro ng piyudalismo"],
                correct: 1
            },
            {
                question: "Sino ang naglunsad ng unang Krusada noong 1096?",
                answers: ["Papa Urban II", "Papa Gregory VII", "Charlemagne", "Otto I"],
                correct: 0
            },
            {
                question: "Ano ang pangunahing layunin ng Banal na Imperyong Romano?",
                answers: ["Palawakin ang Islam", "Pagkaisahin ang Kanlurang Europa", "Palakasin ang kalakalan", "Itaguyod ang Renaissance"],
                correct: 1
            },
            {
                question: "Ano ang naging epekto ng paglakas ng Simbahang Katoliko sa Europa?",
                answers: ["Pagkawala ng mga hari", "Paglawak ng impluwensya sa pulitika at kultura", "Pagbaba ng edukasyon", "Paglakas ng Islam"],
                correct: 1
            },
            {
                question: "Ano ang tawag sa kapangyarihan ng Simbahan na magpatalsik ng mga pinuno ng estado?",
                answers: ["Ekskomunikasyon", "Indulhensiya", "Sakramento", "Felibustero"],
                correct: 0
            },
            {
                question: "Sino ang Papa na nakipaglaban kay Haring Henry IV ukol sa karapatan sa pagtatalaga ng mga opisyal ng simbahan?",
                answers: ["Gregory I", "Gregory VII", "Urban II", "Leo III"],
                correct: 1
            },
            {
                question: "Sino ang namumuno sa manor?",
                answers: ["Serf", "Panginoong maylupa", "Hari", "Obispo"],
                correct: 1
            },
            {
                question: "Ano ang pangunahing layunin ng manoryalismo?",
                answers: ["Pagpapalawak ng kalakalan", "Pagkakaroon ng sariling sapat na pagkain", "Pagpapalaganap ng relihiyon", "Pag-unlad ng sining"],
                correct: 1
            },
            {
                question: "Ano ang pangunahing dahilan ng pagiging makasarili ng manor?",
                answers: ["Kakulangan ng kalakalan", "Takot sa pagsalakay", "Pag-unlad ng siyensiya", "Paglakas ng Simbahang Katoliko"],
                correct: 1
            },
            {
                question: "Ano ang naging papel ng Simbahang Katoliko sa Krusada?",
                answers: ["Nagbigay ng armas", "Nagbasbas at nag-udyok sa mga Kristiyano", "Nagpatayo ng mga paaralan", "Nagpalaganap ng Islam"],
                correct: 1
            }
        ];
        
        
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 30;
        this.timer = null;
        this.selectedAnswer = null;
        this.gameActive = true;
        
        this.initializeElements();
        this.bindEvents();
        this.startGame();
    }
    
    setupAudioContext() {
        // Create audio context on first user interaction
        const setupAudio = () => {
            // Create new audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();

            // Start background music
            this.bgMusic.play()
                .then(() => {
                    console.log('Background music started');
                })
                .catch(e => {
                    console.log('Background music failed to start:', e);
                });

            // Remove the event listener once audio is set up
            document.removeEventListener('click', setupAudio);
        };

        // Add click listener to start audio
        document.addEventListener('click', setupAudio, { once: true });
    }
    
    initializeElements() {
        this.questionCounter = document.getElementById('questionCounter');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.questionNumber = document.getElementById('questionNumber');
        this.questionText = document.getElementById('questionText');
        this.answersGrid = document.getElementById('answersGrid');
        this.nextBtn = document.getElementById('nextBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.gameArea = document.getElementById('gameArea');
        this.resultsArea = document.getElementById('resultsArea');
        this.finalScore = document.getElementById('finalScore');
        this.rankTitle = document.getElementById('rankTitle');
        this.rankDescription = document.getElementById('rankDescription');
        this.playAgainBtn = document.getElementById('playAgainBtn');
    }
    
    bindEvents() {
        this.nextBtn.addEventListener('click', () => {
            // Prevent default behavior
            event.preventDefault();
            
            this.soundManager.playClick();
            // Use nextQuestion instead of direct manipulation
            this.nextQuestion();
        });
        this.restartBtn.addEventListener('click', () => {
            this.soundManager.playClick();
            this.restartGame();
        });
        this.playAgainBtn.addEventListener('click', () => {
            this.soundManager.playClick();
            this.restartGame();
        });
        
        // Initialize audio on first user interaction
        document.addEventListener('click', () => {
            this.soundManager.initialize();
        }, { once: true });
    }

    startGame() {
        this.gameActive = true;
        this.soundManager.playGameStart();
        this.timeLeft = this.totalTimeInSeconds;
        this.loadQuestion();
        this.startTimer();

        // Ensure background music is playing
        if (this.bgMusic.paused) {
            this.bgMusic.play()
                .catch(e => console.log('Background music failed to start:', e));
        }
    }
    
    loadQuestion() {
        // Add check to prevent resetting
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }

        // Clear previous answers and states
        this.selectedAnswer = null;
        this.nextBtn.disabled = true;

        const question = this.questions[this.currentQuestion];
        
        // Update display counters
        this.questionCounter.textContent = `${this.currentQuestion + 1} / ${this.questions.length}`;
        this.questionNumber.textContent = `Katanungan ${this.currentQuestion + 1} sa ${this.questions.length}`;
        this.questionText.textContent = question.question;
        
        // Clear and rebuild answers grid
        this.answersGrid.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            // Use arrow function to maintain context
            btn.addEventListener('click', () => {
                if (!this.selectedAnswer && this.gameActive) {
                    this.soundManager.playClick();
                    this.selectAnswer(index, btn);
                }
            });
            this.answersGrid.appendChild(btn);
        });
    }

    nextQuestion() {
        // Prevent accidental double-clicks
        if (!this.gameActive) return;
        
        // Only proceed if an answer was selected
        if (this.selectedAnswer !== null) {
            // Increment before loading next question
            this.currentQuestion++;
            
            // Check if we should end the game
            if (this.currentQuestion >= this.questions.length) {
                this.endGame();
            } else {
                this.loadQuestion();
            }
        }
    }

    selectAnswer(index, btn) {
        if (!this.gameActive || this.selectedAnswer !== null) return;
        
        // Remove previous selection
        document.querySelectorAll('.answer-btn').forEach(b => {
            b.classList.remove('selected');
        });
        
        // Mark new selection
        btn.classList.add('selected');
        this.selectedAnswer = index;
        
        // Check answer immediately after selection
        this.checkAnswer();
    }
    
    checkAnswer() {
        const question = this.questions[this.currentQuestion];
        const correct = this.selectedAnswer === question.correct;
        
        // Get all answer buttons
        const buttons = document.querySelectorAll('.answer-btn');
        
        // Disable all buttons after selection
        buttons.forEach(btn => btn.disabled = true);
        
        // Show correct and incorrect answers
        buttons.forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
            }
            if (index === this.selectedAnswer && index !== question.correct) {
                btn.classList.add('incorrect');
            }
        });
        
        // Update score and play sound
        if (correct) {
            this.score++;
            this.scoreDisplay.textContent = this.score;
            this.soundManager.playCorrect();
        } else {
            this.soundManager.playIncorrect();
        }
        
        // Enable next button
        this.nextBtn.disabled = false;
    }
    
    startTimer() {
        this.clearTimer();
        this.updateTimeDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimeDisplay();
            
            if (this.timeLeft <= 10 && this.timeLeft > 0) {
                this.timeDisplay.classList.add('warning');
                this.soundManager.playTick();
            }
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    updateTimeDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Add warning when 5 minutes or less remain
        if (this.timeLeft <= 300) {
            this.timeDisplay.classList.add('warning');
        }
    }
    
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.timeDisplay.classList.remove('warning');
    }
    
    timeUp() {
        this.clearTimer();
        this.gameActive = false;
        this.endGame();
    }
    
    endGame() {
        this.clearTimer();
        this.gameArea.classList.add('hidden');
        this.resultsArea.classList.remove('hidden');
        
        // Play victory sound
        this.soundManager.playVictory();
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
        
        this.finalScore.textContent = `Your Score: ${this.score}/${this.questions.length}`;
        
        const percentage = (this.score / this.questions.length) * 100;
        let rank, description;
        
        if (percentage >= 90) {
            rank = "🏰 Noble Lord/Lady";
            description = "Thou art truly learned in the ways of the medieval realm! A master of history!";
        } else if (percentage >= 80) {
            rank = "⚔️ Knight";
            description = "Well done, brave knight! Thy knowledge serves thee well in these ancient lands!";
        } else if (percentage >= 70) {
            rank = "🛡️ Squire";
            description = "A respectable showing! With more study, thou shall become a true knight!";
        } else if (percentage >= 60) {
            rank = "🏹 Archer";
            description = "Thy aim is fair, but there is room for improvement in thy medieval studies!";
        } else if (percentage >= 50) {
            rank = "🔨 Blacksmith";
            description = "Thou hast some knowledge, but more learning awaits thee at the forge of wisdom!";
        } else {
            rank = "👨‍🌾 Peasant";
            description = "Fear not! Every lord was once a peasant. Study the medieval times and return!";
        }
        
        this.rankTitle.textContent = rank;
        this.rankDescription.textContent = description;
    }
    
    restartGame() {
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.gameActive = true;
        
        this.scoreDisplay.textContent = this.score;
        this.resultsArea.classList.add('hidden');
        this.gameArea.classList.remove('hidden');

        this.bgMusic.currentTime = 0;
        this.bgMusic.play()
            .catch(e => console.log('Background music failed to restart:', e));
        
        this.startGame();
    }
}

    // Initialize the game when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        new MedievalQuiz();
    });