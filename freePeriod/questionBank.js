const quiz = {
    1: {
        question: "Guess the City name",
        anagram: "True Me",
        answer: "Meerut",
        timer: 10
    },
    2: {
        question: "Guess the Hindi movie name",
        anagram: "Aloof Ant",
        answer: "Aflatoon",
        timer: 10
    },
    3: {
        question: "Guess the City name",
        anagram: "Solar Up",
        answer: "Solapur",
        timer: 10
    },
    4: {
        question: "Guess the City name",
        anagram: "Bare Kin",
        answer: "Bikaner",
        timer: 15
    },
    5: {
        question: "Guess the City name",
        anagram: "Hard Nude",
        answer: "Dehradun",
        timer: 15
    },
    6: {
        question: "Guess the Hindi movie name",
        anagram: "Real Too",
        answer: "Lootera",
        timer: 15
    },
    7: {
        question: "Guess the Hindi movie name",
        anagram: "My Radish",
        answer: "Drishyam",
        timer: 15
    },
    8: {
        question: "Guess the Hindi movie name",
        anagram: "In Scene Sharp Ex",
        answer: "Chennai Express",
        timer: 20
    },
    9: {
        question: "Guess the Hindi movie name",
        anagram: "Dew Ass",
        answer: "Swades",
        timer: 10
    },
    10: {
        question: "Guess the Hindi movie name",
        anagram: "Baring Sikh",
        answer: "Kabir Singh",
        timer: 10
    }
};

/*
quizData → quiz object
excludeKeys → array of keys that should NOT be returned
*/

function getRandomQuestion(quizData, excludeKeys = []) {

    let keys = Object.keys(quizData);

    // remove excluded keys
    let availableKeys = keys.filter(key => !excludeKeys.includes(Number(key)));

    if (availableKeys.length === 0) {
        return null;
    }

    let randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];

    return {
        key: Number(randomKey),
        data: quizData[randomKey]
    };
}