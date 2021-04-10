import * as fs from 'fs';

//Question struct
export class Question{
    questiontext : string;
    factors : Map<string, number>;//for each OCEAN personality level
    
    public constructor(msg: string, fctrs: Map<string, number>){
        this.questiontext = msg;
        this.factors = fctrs;
    };
}

//Person struct
export class Person{
    name : string;
    scores : Map<string, number>;
}

function getPos(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}

//Reads questions.txt and turns them into questions
export function readOffQuestions():Set<Question>{
    let returnquestions : Set<Question> = new Set<Question>();
    let file = fs.readFileSync('./config/questions.txt','utf8').split("\r\n");
    for(let text of file){
        let newEntry : Question = {questiontext : text.substring(getPos(text, "\"", 1)+1, getPos(text, "\"", 2)), factors : new Map<string, number>()};
        let preScores = text.substring(getPos(text, "{", 2)+1, getPos(text, "}", 1)).replace('\'', "") .split(", ");
        for (let ps of preScores){
            newEntry.factors.set(ps.charAt(0), parseInt(ps.substring(2)));
        }
        returnquestions.add(newEntry);
    }
    return returnquestions;
}

//Reads people.txt and turns them each into people
export function readOffPeople():Set<Person>{
    let returnpeople : Set<Person> = new Set<Person>();
    let file = fs.readFileSync('./config/people.txt','utf8').split("\r\n");
    for(let text of file){
        let newEntry : Person = {name: text.substring(getPos(text, "\"", 1)+1, getPos(text, "\"", 2)), scores : new Map<string, number>()};
        let preScores = text.substring(getPos(text, "{", 2), getPos(text, "}", 1)).replace("'", "") .split(", ");
        preScores.forEach((ps)=>{
            newEntry.scores.set(ps.charAt(1), parseInt(ps.substring(4)));
        });
        returnpeople.add(newEntry);
    }
    return returnpeople;
}

//Random Integer Generator (The maximum is exclusive and the minimum is inclusive)
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

/* Selects a random, non-repeating question from the question set */
function randomQuestionFrom(questions: Set<Question>):Question{
    let items = Array.from(questions);
    return items[Math.floor(Math.random() * items.length)]
}

/* Randomizes the set and returns this newly randomized set */
export function returnRandomizedSet(questions: Set<Question>, limit: number = 0):Set<Question>{
    let newset : Set<Question> = new Set<Question>();
    if (limit == 0) limit = 12;
    for(let i : number = limit; i > 0; i--){
        let newEntry : Question;
        newEntry = randomQuestionFrom(questions);
        questions.delete(newEntry);
        newset.add(newEntry);
    }
    return newset;
}

/* Tallies each category's point total; each score is mulitiplied based on the answer's magnitude and correlation*/
export function scoresFrom(answers: Map<Question, number>):Map<string, number>{
    let scoreTotal = new Map<string, number>();
    answers.forEach((answerValue, query) =>{
        query.factors.forEach((queryValue, letter) => {
            if(scoreTotal.has(letter)){
                scoreTotal.set(letter, scoreTotal.get(letter) + (queryValue * (answerValue - 3)));
            } else {
                scoreTotal.set(letter, queryValue * (answerValue - 3));
            }
        });
    });
    return scoreTotal;
}

/* Normalizes each category -- squaring each category's score, adding them all up, then divding each one by the subtotal */
export function normalize(scores: Map<string, number>):Map<string, number>{
    let normalizedScores  = new Map<string, number>();
    let subtotal : number = 0;
    scores.forEach((values, letter) => {subtotal += Math.pow(values, 2);});
    if(subtotal == 0) return;
    scores.forEach((values, letter) => {normalizedScores.set(letter, values/Math.sqrt(subtotal) );});
    return normalizedScores;
}

/* For each matching category of two score sets, multipies them and adds the similarity to obtain the Cosine Similarity*/
export function cosineSimilarityOf(first_input : Map<string, number>, second_input : Map<string, number>):number{
    let cosineTotal : number = 0;
    first_input.forEach ((values, letter) => {
        letter = letter.toString();
        if(second_input.has(letter) == true){
            cosineTotal += first_input.get(letter) * second_input.get(letter);
        }
    });
    return cosineTotal;
}

/* Compares the a given set of answers to a set of pre-defined ones, returning the one with the highest cosine similarity */
export function mostSimilarTo(scores: Map<string, number>, people : Set<Person>):Person{
    let chosenPerson : Person = new Person();
    let similarity : number = -1;
    if (people.size == 0) return; 
    people.forEach((person)=> {
        let currentSimilarity : number = cosineSimilarityOf(normalize(person.scores), normalize(scores));
        if(currentSimilarity > similarity){
            similarity = currentSimilarity;
            chosenPerson = person;
        }
    });
    return chosenPerson;
}
