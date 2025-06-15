import React, { useState, useEffect } from "react";
const questions = require("./questions.json");

export default function QuizApp() {
  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);
  const [mode, setMode] = useState("normal"); // "normal" sau "greseli"

  const generateNewQuiz = (customQuestions = null) => {
    const base = customQuestions || [...questions];
    const shuffled = base.sort(() => 0.5 - Math.random()).slice(0, 25);
    setQuiz(shuffled);
    setCurrent(0);
    setSelected([]);
    setResults([]);
    setShowAnswer(false);
    setFinished(false);
  };

  const loadWrongAnswers = () => {
    const saved = localStorage.getItem("wrongQuestions");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        setMode("greseli");
        generateNewQuiz(parsed);
      }
    }
  };

  useEffect(() => {
    generateNewQuiz();
  }, []);

  const handleSelect = (opt) => {
    if (showAnswer) return;
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
    setResults([...results, { question: quiz[current].question, correct, answer, isCorrect, full: quiz[current] }]);
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

    const wrong = results.filter((r) => !r.isCorrect).map((r) => r.full);
    localStorage.setItem("wrongQuestions", JSON.stringify(wrong));

    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Scor final: {score} / {quiz.length}</h2>
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
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            onClick={() => { setMode("normal"); generateNewQuiz(); }}
            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Începe un test nou
          </button>
          <button
            onClick={loadWrongAnswers}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reia doar greșelile mele
          </button>
        </div>
      </div>
    );
  }

  const q = quiz[current];
  const correctAnswers = q.correct.map((x) => x.toUpperCase());

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold mb-3 text-gray-800">
          Întrebarea {current + 1} / {quiz.length} {mode === "greseli" ? "(Doar greșeli)" : ""}
        </h1>
        <p className="mb-6 text-gray-700 font-medium">{q.question}</p>
        <div className="space-y-3">
          {["A", "B", "C", "D", "E"].map((opt) => (
            q[opt] ? (
              <label
                key={opt}
                className={`block px-4 py-3 border text-sm rounded-lg cursor-pointer transition-all duration-150
                  ${selected.includes(opt) ? "bg-blue-100 border-blue-400" : "border-gray-300"}
                  ${showAnswer && correctAnswers.includes(opt) ? "border-green-500 bg-green-100" : ""}
                  ${showAnswer && selected.includes(opt) && !correctAnswers.includes(opt) ? "border-red-500 bg-red-100" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => handleSelect(opt)}
                  className="mr-2"
                  disabled={showAnswer}
                />
                <span className="font-medium text-gray-800">{opt}) {q[opt]}</span>
              </label>
            ) : null
          ))}
        </div>

        {!showAnswer ? (
          <button
            onClick={checkAnswer}
            className="mt-8 w-full py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
          >
            Verifică răspunsul
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="mt-8 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Următoarea întrebare
          </button>
        )}
      </div>
    </div>
  );
}
