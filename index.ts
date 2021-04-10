import { Machine, make, sm } from 'jssm';

import { Prompt } from './services/prompt'
import { Data } from './services/data'
import { StateService } from './services/state'

import { StateTypes, States, State } from './config/types'

import { Question, readOffQuestions, readOffPeople, returnRandomizedSet, scoresFrom, mostSimilarTo } from './config/question-control'

let textFSM = "\nWelcome => Verify;\nVerify 'Invalid' => Verify 'Valid' ~> Final_Instructions => ";
let allQuestions : Set<Question> = new Set<Question>();
allQuestions = returnRandomizedSet(readOffQuestions(), 45);

let FSM;
let answers : Map<Question, number> = new Map();
let states: States = {
    'Welcome': {
        type: StateTypes.Statement,
        text: () => "Welcome to Replicant's Character Quiz.",
        next: "Verify"
    },
    'Verify':{
        type: StateTypes.Question,
        text: () => "How many questions would you like to answer? (Enter a number between 5 & 45)",
        after: (state) => {
            if (parseInt(state.answer) >= 5 && parseInt(state.answer) <= 45 ){
                Data.set('number', parseInt(state.answer));
                FSM.action("Valid");
            }    
        },
        next: "Final_Instructions"
    },
    'Final_Instructions':{
        type: StateTypes.Statement,
        text: () =>{
            const number = Data.get('number').toString();
            return `Please answer the following ${number} questions 1 - 5, with 1 meaning 'Strongly Disagree' and 5 meaning 'Strongly Agree'.`
        },
        next: "Result"
    },
    'Result': {
        type: StateTypes.Statement,
        text: () => {
            let person = mostSimilarTo(scoresFrom(answers), readOffPeople());
            return "You got " + person.name;
        }, 
        after: () => {
            Prompt.close();
            process.exit();
        }
    }
}

let index : number = 0;
allQuestions.forEach((q)=>{
    //Add each question to the states.
    let newEntry : State = {
        type: StateTypes.Question, 
        text: () =>{
            return (parseInt(FSM.state())+1).toString() + ") " +q.questiontext;
        }, 
        after: (state) => {
            if ([1,2,3,4,5].includes(parseInt(state.answer))){
                answers.set(q, parseInt(state.answer));
                if((Data.get('number')-1).toString() == FSM.state()){
                    FSM.action("End");
                } else {
                    FSM.action("Valid");
                }
            }            
        },
    };
    states[index.toString()] = newEntry;
    if(index == 0) states['Final_Instructions'].next = '0';
    if(index != 0) states[(index-1).toString()].next = index.toString();

    //Add each question to the FSM
    textFSM += (index.toString() + ";\n" + index.toString() + " 'End' -> Result;\n" + index.toString() + " 'Invalid' => " + index.toString() + " 'Valid' ~> ");
    index++;
});

textFSM += "X;";
states[(index-1).toString()].next = 'Result';
FSM = new Machine(make(textFSM));

const StateManager = new StateService(FSM, states);