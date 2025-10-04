

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
        this.soundManager = new SoundManager();
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
            this.soundManager.playClick();
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
        this.loadQuestion();
        this.startTimer();
    }
    
    loadQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        this.selectedAnswer = null;
        this.timeLeft = 30;
        
        this.questionCounter.textContent = `${this.currentQuestion + 1} / ${this.questions.length}`;
        this.questionNumber.textContent = `Katanungan ${this.currentQuestion + 1} sa ${this.questions.length}`;
        this.questionText.textContent = question.question;
        
        this.answersGrid.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.addEventListener('click', () => {
                this.soundManager.playClick();
                this.selectAnswer(index, btn);
            });
            this.answersGrid.appendChild(btn);
        });
        
        this.nextBtn.disabled = true;
        this.startTimer();
    }
    
    selectAnswer(index, btn) {
        if (!this.gameActive) return;
        
        // Remove previous selection
        document.querySelectorAll('.answer-btn').forEach(b => {
            b.classList.remove('selected');
        });
        
        // Mark new selection
        btn.classList.add('selected');
        this.selectedAnswer = index;
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
        this.timeDisplay.textContent = this.timeLeft;
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
        this.revealAnswer();
        this.nextBtn.disabled = false;
        this.gameActive = false;
    }
    
    nextQuestion() {
        if (this.selectedAnswer !== null) {
            this.clearTimer();
            this.checkAnswer();
        } else {
            this.currentQuestion++;
            this.gameActive = true;
            this.loadQuestion();
        }
    }
    
    checkAnswer() {
        const question = this.questions[this.currentQuestion];
        const correct = this.selectedAnswer === question.correct;
        
        if (correct) {
            this.score++;
            this.scoreDisplay.textContent = this.score;
            this.soundManager.playCorrect();
        } else {
            this.soundManager.playIncorrect();
        }
        
        this.revealAnswer();
        this.gameActive = false;
    }
    
    revealAnswer() {
        const question = this.questions[this.currentQuestion];
        const buttons = document.querySelectorAll('.answer-btn');
        
        buttons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === this.selectedAnswer && index !== question.correct) {
                btn.classList.add('incorrect');
            }
        });
        
        setTimeout(() => {
            this.currentQuestion++;
            this.gameActive = true;
            this.loadQuestion();
        }, 2000);
    }
    
    endGame() {
        this.clearTimer();
        this.gameArea.classList.add('hidden');
        this.resultsArea.classList.remove('hidden');
        
        // Play victory sound
        this.soundManager.playVictory();
        
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
        
        this.startGame();
    }
}

    // Initialize the game when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        new MedievalQuiz();
    });