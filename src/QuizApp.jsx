import React, { useState, useEffect } from "react";
const questions = require("./questions.json");

export default function QuizApp() {
  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 25);
    setQuiz(shuffled);
  }, []);

  const handleSelect = (opt) => {
    if (showAnswer) return; // nu mai permite select după răspuns
    const already = selected.includes(opt);
    if (already) {
      setSelected(selected.filter((o) => o !== opt));
    } else {
      setSelected([...selected, opt]);
    }
  };

  const checkAnswer = () => {
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    const correct = quiz[current].correct.map((x) => x.trim().toUpperCase()).sort();
    const answer = [...selected].map((x) => x.trim().toUpperCase()).sort();
    const isCorrect = JSON.stringify(correct) === JSON.stringify(answer);
    setResults([...results, { question: quiz[current].question, correct, answer, isCorrect }]);
    setSelected([]);
    setShowAnswer(false);
    if (current < quiz.length - 1) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (!quiz.length) return <div className="p-6 text-lg">Se încarcă întrebările...</div>;

  if (finished) {
    const score = results.filter((r) => r.isCorrect).length;
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Scor final: {score} / 25</h2>
        <ul className="text-left">
          {results.map((r, i) => (
            <li key={i} className="mb-4 border-b pb-2">
              <p className="font-semibold text-lg">{i + 1}. {r.question}</p>
              <p className={r.isCorrect ? "text-green-600" : "text-red-600"}>
                Ai răspuns: {r.answer.join(", ")} | Corect: {r.correct.join(", ")}
              </p>
            </li>
          ))}
        </ul>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refă testul
        </button>
      </div>
    );
  }

  const q = quiz[current];
  const correctAnswers = q.correct.map((x) => x.toUpperCase());

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 border">
        <h1 className="text-xl font-bold mb-2">Întrebarea {current + 1} / 25</h1>
        <p className="mb-4 text-gray-800">{q.question}</p>
        <div className="space-y-2">
          {["A", "B", "C", "D", "E"].map((opt) => (
            q[opt] ? (
              <label key={opt} className={`block px-4 py-2 border rounded cursor-pointer ${selected.includes(opt) ? "bg-blue-100" : ""} ${showAnswer && correctAnswers.includes(opt) ? "border-green-500" : ""} ${showAnswer && selected.includes(opt) && !correctAnswers.includes(opt) ? "border-red-500" : ""}`}>
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => handleSelect(opt)}
                  className="mr-2"
                  disabled={showAnswer}
                />
                <span>{opt}) {q[opt]}</span>
              </label>
            ) : null
          ))}
        </div>

        {!showAnswer ? (
          <button
            onClick={checkAnswer}
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Verifică răspunsul
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Următoarea întrebare
          </button>
        )}
      </div>
    </div>
  );
}
