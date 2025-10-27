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
        
        this.finalScore.textContent = `Iskor: ${this.score}/${this.questions.length}`;
        
        const percentage = (this.score / this.questions.length) * 100;
        let rank, description;
        
        if (percentage >= 90) {
            rank = "🏰 Marangal na Ginoo/Ginang";
            description = "Ikaw ay tunay na bihasa sa mga paraan ng kaharian ng gitnang panahon! Isang dalubhasa sa kasaysayan!";
        } else if (percentage >= 80) {
            rank = "⚔️ Kabalyero";
            description = "Magaling, matapang na kabalyero! Ang iyong kaalaman ay malaking tulong sa iyo sa mga sinaunang lupain na ito!";
        } else if (percentage >= 70) {
            rank = "🛡️ Eskuwyer";
            description = "Isang kapuri-puring pagtatanghal! Sa mas maraming pag-aaral, ikaw ay magiging isang tunay na kabalyero!";
        } else if (percentage >= 60) {
            rank = "🏹 Mamamana";
            description = "Maganda ang iyong layunin, ngunit may puwang pa para sa pagpapabuti sa iyong pag-aaral ng medyebal na panahon!";
        } else if (percentage >= 50) {
            rank = "🔨 Panday";
            description = "Ikaw ay may kaunting kaalaman, ngunit higit pang pagkatuto ang naghihintay sa iyo sa pandayan ng karunungan!";
        } else {
            rank = "👨‍🌾 Magsasaka";
            description = "Huwag matakot! Bawat panginoon ay minsang isang-pangkaraniwang tao. Pag-aralan ang panahon ng medieval at bumalik!";
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