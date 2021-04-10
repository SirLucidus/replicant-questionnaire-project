import * as foo from "./question-control"

test('Random Generator Works ', () => {
    expect(foo.getRandomInt(1, 10)).toBeGreaterThanOrEqual(1);
  });

test('0 subtotal returns null ', () => {
    let mapp  = new Map([
        ["A", 0],
        ["B", 0],
        ["C", 0],
        ["D", 0]
    ]); 
    expect(foo.normalize(mapp)).toBeNull;
});

test('Comparing a valid score map to a list with no people returns null ', () => {
    let mapp  = new Map([
        ["O", 1],
        ["C", 5],
        ["E", -2],
        ["A", 4],
        ["N", 2]
    ]); 
    expect(foo.mostSimilarTo(mapp, new Set<foo.Person>())).toBeNull;
});


test('Correctly calculate the scores from answers ', () => {
    let result  = new Map([
        ["O", 2],
        ["C", 4],
        ["E", -1],
        ["A", 2],
        ["N", -2]
    ]); 
    let answers = new Map([
        [new foo.Question("", new Map([ ["O", 1], ["C", 1], ["E", 0], ["A", 0], ["N", 0] ])), 5],
        [new foo.Question("", new Map([ ["O", 0], ["C", 1], ["E", 0], ["A", 0], ["N", 0] ])), 5],
        [new foo.Question("", new Map([ ["O", 0], ["C", 0], ["E", 1], ["A", 0], ["N", 0] ])), 2],
        [new foo.Question("", new Map([ ["O", 0], ["C", 0], ["E", 0], ["A", 1], ["N", -1] ])), 5]

    ]);
    expect(foo.scoresFrom(answers)).toEqual(result);
});

test('Correctly reads off questions ', () => {
    expect(foo.readOffQuestions().size).toEqual(486);
});

test('Correctly reads off people ', () => {
    expect(foo.readOffPeople().size).toEqual(16);
});

test('Plugging in an empty map for the cosine similarity should produce a zero', () => {
    let mapp  = new Map([
        ["O", 2],
        ["C", 4],
        ["E", -1],
        ["A", 2],
        ["N", -2]
    ]); 
    expect(foo.cosineSimilarityOf(mapp, new Map<string, number>())).toEqual(0);
});

test('Plugging in an empty map for the cosine similarity should produce a zero', () => {
    expect(foo.returnRandomizedSet(foo.readOffQuestions(), 8).size).toEqual(8);
});