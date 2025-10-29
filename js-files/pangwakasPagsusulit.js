// Game state
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;

// Sample questions array - you can easily duplicate and modify this structure
const questions = [
    {
        question: "Sino ang huling emperador ng Kanlurang Imperyong Romano?",
        answers: ["Charlemagne", "Romulus Augustulus", "Odoacer", "Cloves I"],
        correct: 1,
        explanation: "Si Romulus Augustulus ang huling emperador ng Kanlurang Imperyong Romano na pinatalsik noong Setyembre 4, 476 AD ni Odoacer, na naging hudyat ng pagbagsak ng Kanlurang Imperyong Romano."
    },
    {
        question: "Sino ang unang hari na pinagkaisa ang buong tribong Frank at nagpabinyag sa 496 AD?",
        answers: ["Peppin III", "Charles Martel", "Clovis I", "Otto I"],
        correct: 2,
        explanation: "Si Clovis I ang unang hari na pinagkaisa ang buong tribong Frank at siya rin ang unang Frankish king na nagpabinyag sa Kristiyanismo noong 496 AD. "
    },
    {
        question: "Anong labanan ang nagtapos sa paglawak ng Islam sa Kanlurang Europa noong 732 C.E.?",
        answers: ["Labanan sa Lechfeld", "Labanan sa Tours", "Labanan sa Verdun", "Labanan sa Patlang ng Catalan"],
        correct: 1,
        explanation: "Ang Labanan sa Tours na naganap noong 732 C.E. ay isang mahalagang labanan kung saan napigilan ng mga Frank, na pinamumunuan ni Charles Martel, ang paglawak ng mga Muslim mula sa Spain patungo sa Kanlurang Europa."
    },
    {
        question: "Ano ang tawag sa seremonya kung saan nangangako ang vassal ng katapatan sa kanilang lord?",
        answers: ["Homage", "Koronasyon", "Investiture", "Chivalry"],
        correct: 0,
        explanation: "Ang Homage ay ang seremonya kung saan nangangako ang vassal ng katapatan sa kanilang lord, karaniwang ginagawa sa pamamagitan ng paglalagay ng kamay ng vassal sa pagitan ng mga kamay ng lord bilang tanda ng pangakong katapatan."
    },
    {
        question: "Sino ang kauna-unahang kinoronahang Emperador ng Banal na Imperyong Romano noong 962?",
        answers: ["Charlemagne", "Romulus Augustulus", "Pepin III", "Otto I"],
        correct: 3,
        explanation: "Si Otto I ang kauna-unahang in koronahang Emperador ng Banal na Imperyong Romano noong 962. Siya ang itinuturing na tagapagtatag ng Banal na Imperyong Romano bilang isang pampolitikang entidad noong ika-10 siglo."
    },
    {
        question: "Ano ang tawag sa sistemang pang-ekonomiya noong Gitnang Panahon kung saan halos lahat ng kalakal at serbisyo ay ginawa sa mga manor?",
        answers: ["Kapitalismo", "Manoryalismo", "Piyudalismo", "Komunismo"],
        correct: 1,
        explanation: "Ang sistemang pang-ekonomiya noong Gitnang Panahon ay tinatawag na manoryalismo. Sa sistemang ito, ang manor ay sentro ng pangkabuhayan kung saan nagmumula ang mga produkto at serbisyo para sa mga tao sa paligid nito."
    },
    {
        question: "Sino ang mga may-ari ng manor?",
        answers: ["Panginoong-maylupa", "Magsasaka", "Hari ng bansa", "Mangangalakal"],
        correct: 0,
        explanation: "Ang manor ay isang malaking lupain na pag-aari ng isang panginoong-maylupa. Siya ang nagbibigay ng proteksyon at lupain sa mga magsasaka na naninirahan dito."
    },
    {
        question: "Ano ang tawag sa mga taong nagtatrabaho sa manor upang isagawa ang mga gawain?",
        answers: ["Serf", "Panginoon", "Mangangalakal", "Kabalyero"],
        correct: 0,
        explanation: "Ang mga serf ang mga tao na nagtatrabaho sa manor sa ilalim ng pyudal na sistema. Sila ay mga magsasaka na nasa kalagayan ng pagkaalipin at kinakailangang magserbisyo sa panginoon ng manor."
    },
    {
        question: "Ano ang naging opisyal na relihiyon ng Imperyong Romano ayon kay Theodosius I?",
        answers: ["Hinduismo", "Islam", "Kristiyanismo", "Budismo"],
        correct: 2,
        explanation: "Noong 380 CE sa pamamagitan ng Kautusan ng Tesalonica ni Theodosius I, ang kristiyanismo ang naging opisyal na relihiyon ng Imperyong Romano."
    },
    {
        question: "Ano ang tawag sa mga doktrinang pangrelihiyon na taliwas sa mga turo ng Simbahang Katoliko?",
        answers: ["Heresy", "Paggunita", "Papacy", "Monasticism"],
        correct: 0,
        explanation: "Ang heresy ang tawag sa mga paniniwala o katuruang taliwas o hindi tinatanggap ng Simbahang Katoliko dahil lumalabag ito sa kanilang doktrina."
    },
    {
        question: "Ano ang titulo ng pinakamataas na pinuno ng Simbahang Katoliko?",
        answers: ["Patriarch", "Kardinal", "Papa ", "Pari"],
        correct: 2,
        explanation: "Ang Papa o Santo Papa ang itinuturing na pinakamataas na pinuno ng Simbahang Katoliko. Siya ang Obispo ng Roma at may pinakamataas na awtoridad sa lahat ng iba pang mga miyembro ng Simbahan."
    },
    {
        question: "Saan ang sentro ng Greek Orthodox Church?",
        answers: ["Rome", "Constantinople", "Athens", "Alexandria"],
        correct: 1,
        explanation: "Ang sentro ng Greek Orthodox Church ay ang Constantinople (ngayon ay Istanbul). Tinatawag itong Bagong Roma at dito nagkakaroon ng malaking impluwensiya ang simbahan sa mga usaping panrelihiyon sa Silangang bahagi ng dating Imperyong Romano."
    },
    {
        question: "Ilang pangunahing krusada ang nailunsad mula 1095 hanggang 1291?",
        answers: ["Limang krusada", "Labing-dalawang krusada", "Siyam na krusada", "Tatlong krusada"],
        correct: 2,
        explanation: "Mula noong 1095 hanggang 1291, mayroong siyam na pangunahing krusada na nailunsad upang muling makuha ang Banal na Lupain mula sa mga Muslim."
    },
    {
        question: "Bakit tinawag si Charlemagne na Ama ng Europa?",
        answers: ["Siya ang nagtatag ng Imperyong Romano", "Pinagkaisa ang malaking bahagi ng Europa at pinalaganap ang edukasyon at Kristiyanismo", "Inalis ang piyudalismo", "Tinapos ang Imperyong Byzantine"],
        correct: 1,
        explanation: "Tinawag si Charlemagne na Ama ng Europa dahil sa kanyang tagumpay sa pagpapag-isa ng malaking bahagi ng Kanluran at Gitnang Europa sa ilalim ng kanyang pamumuno. Bukod pa dito, ang kanyang mga reporma sa edukasyon at pagsulong sa kristiyanismo ay naglatag ng pundasyon sa kultura at politika ng Europa sa Gitnang Panahon."
    },
    {
        question: "Ano ang epekto ng Kasunduan sa Verdun noong 843?",
        answers: ["Hinati ang Imperyong Caroloningian sa tatlo na naging pundasyon ng mga modernong bansa", "Nagkaisa muli ang Imperyong Carolingian", "Tinapos ang Banal na Imperyong Romano", "Nagpatatag ng isang Imperyong Byzantine"],
        correct: 0,
        explanation: "Ang Kasunduan sa Verdun noong 843 ay nagtapos sa digmaang sibil ng Imperyong Carolingian sa pamamagitan ng paghati ng imperyo sa tatlong bahagi, na pinamumunuan ng tatlong apo ni Charlemagne. Ang paghating ito ang naging pundasyon ng mga modernong bansa tulad ng France at Germany."
    },
    {
        question: "Paano ipinakita ng koronasyon ni Otto I ang kapangyarihan ng simbahan?",
        answers: ["Ipinakita na ang emperador ang may ganap na kapangyarihan", "Ipinakita na ang papa ang may kapangyarihang koronahan ang emperador", "Tinapos ang alitan ng simbahan at estado", "Ipinakita nito mas makapangyarihan pa ang espada kaysa sa tungkod"],
        correct: 1,
        explanation: "Ipinakita ng koronasyon ni Otto I noong 962 na ang papa ang may awtoridad na koronahan ang emperador, kaya ipinapakita nito ang kapangyarihan ng simbahan sa pagbibigay ng lehitimong kapangyarihan sa pinuno ng estado."
    },
    {
        question: "Bakit naging mahalaga ang manor noong Gitnang Panahon?",
        answers: ["Dahil sentro ito ng kalakalan sa buong mundo", "Dahil dito umaasa ang mga tao sa kanilang mga pang-araw-araw na pangangailangan dahil sa kakaunti at maliliit pa ang mga bayan", "Dahil dito nakatira ang hari", "Dahil ito ang naging palasyo ng mga maharlika"],
        correct: 1,
        explanation: "Noong Gitnang Panahon, ang manor ang sentro ng lipunan at ekonomiya kung saan umaasa ang mga tao sa produksiyon ng manor para sa kanilang pang-araw-araw na pangangailangan. Dahil kakaunti pa at maliliit ang mga bayan, halos lahat ng pangangailangan ng tao ay mula sa manor tulad ng pagkain, serbisyong panlipunan, at iba pang mga kagamitan."
    },
     {
        question: "Bakit kinukuha ng manor ang asin at bakal sa ibang lugar?",
        answers: ["Dahil walang kakayahan ang manor na gumawa nito sa kanilang lugar", "Dahil ayaw ng mga tao sa manor ang paggamit ng asin at bakal", "Dahil sobra-sobra ang produksyon ng manor", "Dahil Hindi kailangan ang mga ito sa manor"],
        correct: 0,
        explanation: "Noong Gitnang Panahon, ang mga manor ay walang kakayahang gumawa o magproseso ng mga produkto tulad ng asin at bakal sa kanilang sariling lupain kaya kinukuha nila ito mula sa ibang lugar upang magamit sa paggawa ng mga kasangkapan, sandata, at iba pang pangangailangan."
    },
    {
        question: "Bakit mahalaga sa Simbahang Katoliko ang mga monastaryo?",
        answers: ["Dahil dito ang sentro ng kalakalan noong Gitnang Panahon", "Dahil dito nalilinang ang kakayahan ng mga kabalyero sa pakikidigma", "Dahil ito ang paaralan ng mga maharlika at panginoong-maylupa", "Dahil dito naninirahan ang mga monghe na nag-aalay ng buhay para sa espiritwal na pagsasanay at dasal"],
        correct: 3,
        explanation: "Mahalaga ang mga monastaryo sa Simbahang Katoliko dahil ito ang lugar kung saan naninirahan ang mga monghe na buong-pusong naglalaan ng kanilang buhay sa espiritwal na pagsasanay, pagninilay, at panalangin. Sa monastaryo rin nailalago ang pananampalataya at nagiging sentro ng pag-aaral at pag-aalaga sa kultura at relihiyon noong Gitnang Panahon."
    },
    {
        question: " Ano ang dahilan kung bakit nahati ang Simbahang Kristiyano noong 1054?",
        answers: ["Dahil sa digmaan ng mga Kristiyano", "Dahil sa pagkakaiba ng wika, paniniwala, at kapangyarihan ng Papa sa Rome at Patriarch sa Constantinople", "Dahil sa panghihimasok ng Banal na Imperyong Romano", "Dahil sa mga krusadang naganap upang bawiin ang Jerusalem sa kamay ng mga Muslim"],
        correct: 1,
        explanation: "Noong 1054 ay naganap ang “Great Schism” na humati sa simbahan sa pagitan ng Simbahang Romano Katoliko sa Kanluran at ng Silangang Orthodox. Napakahalagang dahilan ng paghati ng Simbahang Kristiyano ay ang mga pagkakaiba sa wika, mga paniniwala, at sa kung sino ang may lehitimong kapangyarihang mamuno- Papa sa Roma o Patriarch sa Constantinople."
    },
    {
        question: "Bakit ipinagawa ni Constantine the Great ang Edict of Milan?",
        answers: ["Para ipagbawal ang Kristiyanismo sa Imperyong Romano", "Para mapalakas ang kapangyarihang politikal ng emperador", "Para gawing opisyal na relihiyon ang Kristiyanismo sa buong imperyo", "Para wakasan ang pag-uusig sa mga Kristiyano at pahintulutan ang kalayaan sa pananampalataya"],
        correct: 3,
        explanation: "Ang Edict of Milan na ipinagawa ni Constantine the Great noong 313 CE ay nagbigay ng legal na pahintulot sa mga Kristiyano na malayang magsagawa ng kanilang relihiyon nang walang takot sa pag-uusig. Layunin nito na wakasan ang matagal nang pag-uusig sa mga Kristiyano at bigyan sila ng kalayaan sa pananampalataya."
    },
    {
        question: "Paano nakatulong ang sistema ng piyudalismo sa pamamahala sa gitna ng kawalang-tatag sa Europa?",
        answers: ["Sa pagbibigay ng lokal na kontrol at katapatan sa pagitan ng mga panginoon at vassal", "Sa pagpapalawak ng sentral na autoridad ng hari", "Sa pag-alis ng mga maharlika sa politika", "Sa pagwawalang-bahala sa lokal na pamahalaan"],
        correct: 0,
        explanation: "Sa panahon ng kaguluhan at madalas na pagsalakay ng mga barbaro, ang sistema ng piyudalismo ay nagbigay proteksyon at pagpapalakas ng lokal na pamamahala, kung saan ang mga vassal ay nagsisilbing mandirigma at tagapagtanggol ng kanilang lupain kapalit ng lupang ginagamit nil mula sa panginoong-maylupa. Dahil dito, nanatiling matiwasay ang ilang bahagi ng Europa."
    },
    {
        question: "Bakit itinuturing na nagsasarili ang mga manor?",
        answers: ["Dahil nakagagawa sila ng karamihan ng kalakal at serbisyo na kailangan sa kanilang manor", "Dahil hindi sila nakikipagkalakalan sa ibang lungsod sa labas ng manor", "Dahil ligtas sila sa panganib mula sa digmaan", "Dahil maraming tao ang nagtatrabaho sa manor"],
        correct: 0,
        explanation: "Ang manor ay mayroong sariling produksyon ng pagkain, serbisyo, at iba pang kalakal na kailangan ng mga tao kaya hindi sila umaasa sa labas o kalakalan sa ibang lugar. Ito ang dahilan kung bakit ang manor nagsasariling yunit sa ekonomiya noong Gitnang Panahon"
    },
    {
        question: "Bakit naging iskandalo ang Ikaapat na Krusada sa Constantinople?",
        answers: ["Dahil tumulong ang mga Krusador sa mga Muslim","Dahil sa pagdarambong ng mga krusador sa mga Kristiyanong bayan", "Dahil ito ang dahilan ng pagkakawatak-watak ng simbahan", " Dahil dito mas lumakas ang Orthodox Church"],
        correct: 1,
        explanation: "Ang Ikaapat na Krusada ay naging iskandalo dahil sa halip na labanan ang mga Muslim upang mabawi ang Jerusalem, sinakop at dinambong ng mga krusador ang Kristiyanong lungsod ng Constantinople noong 1204. Nagresulta ito sa malawakang pagpatay, pagnanakaw, at paglapastangan sa isang Kristiyanong lugar."
    },
    {
        question: "Paano mo magagamit ang konsepto ng Donasyon ni Pepin sa pagsusuri sa ugnayan ng Simbahan at Estado sa modernong panahon?",
        answers: ["Bilang halimbawa ng impluwensiya ng simbahan sa politika ng estado","Bilang patunay ng paghihiwalay ng simbahan at estado", "Bilang paglaban ng simbahan sa politika ng estado", "Bilang pagtanggi ng simbahan sa kapangyarihang politikal"],
        correct: 0,
        explanation: "Ipinapakita ng “Donasyon ni Pepin” kung paanong nakialam at nakaimpluwensiya ang Simbahan sa mga usaping politikal, na nagbibigay ng kapangyarihan sa Simbahan sa larangan ng politika."
    },
    {
        question: "Paano mo magagamit ang ideya ng manoryalismo sa pagbuo ng komunidad ngayon?",
        answers: ["Pagpapatayo ng mga pook-pasyalan para malibang ang mga mamamayan","Pag-asa sa pakikipagkalakalan sa mga malalaking siyudad", "Pag-aangkat ng lahat ng produkto mula ibang lugar", "Pagpapalakas sa pagsasaka magkaroon ng sapat na pagkain ang komunidad"],
        correct: 3,
        explanation: "Ang pangunahing ideya ng manoryalismo ay pagiging self-sufficient o nagsasarili ang manor, kaya't mahalaga ang pagpapalakas sa pagsasaka upang magkaroon ng sapat na pagkain ang buong komunidad."
    },
    {
        question: "Paano mo magagamit ang impormasyon tungkol sa pagkakahati ng Simbahang Kristiyano sa pag-aaral ng relihiyon sa Pilipinas?",
        answers: ["Gamitin bilang dahilan upang ipagtanggol ang Simbahang Katoliko at usigin ang iba pang relihiyon","Gamitin bilang dahilan upang pag-isahin ang bansa sa pamamagitan ng paglaban sa mga Muslim ng Mindanao", "Gamitin bilang dahilan upang malaman ang kasaysayan ng iba't ibang sekta ng Kristiyanismo at ang kanilang mga paniniwala", "Gamiting dahilan upang suwayin ang utos ng pamahalaan dahil mas makapangyarihan ang simbahan kaysa sa estado"],
        correct: 2,
        explanation: "Ang impormasyon tungkol sa pagkakahati ng Simbahang Kristiyano ay mahalaga upang maunawaan ang kasaysayan ng iba't ibang sekta ng Kristiyanismo sa Pilipinas at ang kani-kanilang paniniwala. Ito ay nagbibigay ng konteksto sa pag-aaral ng relihiyon nang hindi ginagamit bilang dahilan ng pagkakabahagi o pagkakagulo ngunit bilang isang paraan upang mapalalim ang kaalaman tungkol sa mga ugat at epekto ng relihiyosong pagkakaiba-iba sa lipunan."
    },
    {
        question: "Ano ang magandang modelo na maaaring likhain upang maiwasan ang pagbagsak ng isang imperyo, gamit ang kasaysayan ng Imperyong Romano?",
        answers: ["Sentralisadong pamahalaan na may mabilis na pagtugon sa mga krisis","Pagbibigay ng ganap na kalayaan at kapangyarihan sa mga lokal na maharlika", "Pagkakaroon ng mataas na antas na agwat sa pagitan ng mga mahihirap at mayayaman upang masupil ang anumang banta sa politika ", "Paghahati-hati ng teritoryo at mataas na buwis upang lumaki ang pondo ng imperyo na magagamit sa digmaan "],
        correct: 0,
        explanation: "Isa sa mga dahilan ng pagbagsak ng Imperyong Romano ay ang kakulangan ng epektibong sentralisadong pamahalaan na mabilis na makatutugon sa mga panloob at panlabas na krisis tulad ng mga pagsalakay ng barbaro, krisis sa ekonomiya, at kahirapan sa pampulitikang kaayusan. Ang paghahati-hati at lalong pagpapahina ng sentral na kapangyarihan ay nagdulot ng kahinaan sa imperyo na naging daan sa pagbagsak nito."
    },
    {
        question: "Paano mo gagawan ng paraan ang manor para magkaroon ng sapat na pagkain panahon ng tagtuyot?",
        answers: ["Palakasin ang pwersa militar upang masakop ang ibang manor at mapalawak ang territoryo","Umasa ng tulong mula sa ibang manor kapalit ng pagbibigay ng buwis", "Magbawas ng mga serf upang mas mapahaba ang paggamit at pagkonsumo ng mga natitirang pagkain", "Magtatayo ng imbakan ng pagkain mula sa masaganang panahong nagtatanim"],
        correct: 3,
        explanation: "Sa panahon ng tagtuyot, kulang ang pagkain dahil sa kakulangan ng ani. Kung nagtatayo ng imbakan ng pagkain kapag masagana ang ani, masisiguro na may sapat na pagkain na maiipon at magagamit sa panahon ng tagtuyot."
    },
    {
        question: "Paano ka gagawa ng dula ukol sa mga Krusada na naglalahad ng mga motibong relihiyoso at politikal?",
        answers: ["Itatanghal ang mga pangunahing tauhan ng mga krusada upang maipakita ang kanilang katapangan at katapatan sa simbahan","Iiugnay ang relihiyosong paniniwala sa mga politikal na interes at personal na ambisyon ng mga namumuno", "Ipagtatanghal lang ang mga labanan bilang pangunahing batayan sa pagkakaroon ng mga krusada", "Itatago ang mga seryosong isyung dulot ng mga krusada upang mapanatili ang kabanalan ng layunin ng mga ito"],
        correct: 1,
        explanation: "Ang mga Krusada ay hindi lamang laban para sa relihiyon kundi may halong mga politikal na motibo at personal na layunin ng mga pinuno. Mahalaga na ipakita sa dula ang ugnayan ng relihiyosong paniniwala at politikal na interes upang maunawaan ang buong konteksto ng mga Krusada."
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
const explanationPopup = document.getElementById('explanationPopup');
const explanationText = document.getElementById('explanationText');
const continueBtn = document.getElementById('continueBtn');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

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
    },
    popup: () => {
        playSound(440, 0.1, 'sine'); // A4 note
        setTimeout(() => playSound(554.37, 0.1, 'sine'), 100); // C#5 note
    },
    continue: () => {
        playSound(587.33, 0.1, 'sine'); // D5 note
        setTimeout(() => playSound(440, 0.1, 'sine'), 150); // A4 note
    }
};

let isMusicPlaying = false;

// Initialize game
function initGame() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    answered = false;
    updateDisplay();
    showQuestion();
}

// Initialize music
function initMusic() {
    bgMusic.volume = 0.3;
    bgMusic.play()
        .then(() => {
            isMusicPlaying = true;
        })
        .catch(error => {
            console.log("Autoplay prevented:", error);
        });
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
    
    // Show explanation popup after a short delay with sound
    setTimeout(() => {
        explanationText.textContent = question.explanation;
        explanationPopup.style.display = 'flex';
        sounds.popup(); // Play popup sound
    }, 1000);
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
    
    finalScore.textContent = `Ang Iyong Huling Iskor: ${score}/${questions.length}`;
    
    // Determine rank based on score
    let rank;
    if (score <= 7) {
        rank = "Walang Kasanayan";
    } else if (score <= 14) {
        rank = "Mahinang Kasanayan";
    } else if (score <= 22) {
        rank = "Halos Bihasa";
    } else if (score <= 26) {
        rank = "Bihasa";
    } else {
        rank = "Lubos na Bihasa";
    }
    
    document.getElementById('rankDescription').textContent = rank;
    
    // Custom message based on rank
    let message;
    switch(rank) {
        case "Walang Kasanayan":
            message = "Magpatuloy sa pag-aaral upang mapaunlad ang iyong kaalaman sa Gitnang Panahon.";
            break;
        case "Mahinang Kasanayan":
            message = "May pundasyon ka na. Pag-aralan pang mabuti ang mga aralin sa Gitnang Panahon.";
            break;
        case "Halos Bihasa":
            message = "Magaling! Konting pag-aaral pa upang maging ganap na bihasa.";
            break;
        case "Bihasa":
            message = "Napakahusay! Tunay kang may malalim na pang-unawa sa Gitnang Panahon.";
            break;
        case "Lubos na Bihasa":
            message = "Perpekto! Ikaw ay isang mahusay na iskolar ng Gitnang Panahon!";
            break;
    }
    
    gameOverMessage.textContent = message;
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
continueBtn.addEventListener('click', () => {
    sounds.continue(); // Play continue sound
    explanationPopup.style.display = 'none';
    
    if (currentQuestion < questions.length - 1) {
        nextQuestion();
    } else {
        endGame();
    }
});

// Initialize game on load
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    initMusic(); // Add this line
});

// Add this to handle user interaction requirement
document.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play()
            .then(() => {
                isMusicPlaying = true;
                musicToggle.classList.remove('muted');
                musicToggle.innerHTML = '<i class="ri-volume-up-fill"></i>';
            })
            .catch(error => console.log("Playback failed:", error));
    }
}, { once: true });

// Handle audio context for mobile devices
document.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
});