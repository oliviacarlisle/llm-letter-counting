import fs from 'node:fs';

function generateWords(numWords, wordLength) {
    const words = [];

    for (let i = 0; i < numWords; i++) {
        let word = '';

        for (let j = 0; j < wordLength; j++) {
            const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
            word += randomChar;
        }

        words.push(word);
    }

    fs.writeFileSync('words.txt', words.join('\n'));
    console.log(`Generated ${numWords} words and wrote them to words.txt`);
}

generateWords(5, 7);