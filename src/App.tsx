import React, { useState } from 'react';
import { fetchQuizQuestions, Difficulty, QuestionState } from './API';
import QuestionCard from './components/QuestionCard';

export type AnswerObject = {
	question: string;
	answer: string;
	correct: boolean;
	correctAnswer: string;
};
function App() {
	const [isLoading, setIsLoading] = useState(false);
	const [questions, setQuestions] = useState<QuestionState[]>([]);
	const [number, setNumber] = useState(0);
	const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(true);

	const TOTAL_QUESTIONS = 10;

	async function startTrivia() {
		setIsLoading(true);
		setGameOver(false);
		const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY);
		setQuestions(newQuestions);
		setScore(0);
		setUserAnswers([]);
		setNumber(0);
		setIsLoading(false);
	}

	function checkAnswer(event: React.MouseEvent<HTMLButtonElement>) {
		if (!gameOver) {
			//users answer
			const answer = event.currentTarget.value;

			//check the users answer against the correct answer
			const correct = questions[number].correct_answer === answer;

			//add score if the answer is correct
			if (correct) setScore((previousScore) => previousScore + 1);

			//save answer in the array for useranswers
			const answerObject = {
				question: questions[number].question,
				answer,
				correct,
				correctAnswer: questions[number].correct_answer,
			};
			setUserAnswers((previousAnswers) => [...previousAnswers, answerObject]);
		}
	}

	function nextQuestion() {
		const nextQuestion = number + 1;

		//move onto the next question if not the last question
		if (nextQuestion === TOTAL_QUESTIONS) {
			setGameOver(true);
		} else {
			setNumber(nextQuestion);
		}
	}

	return (
		<div>
			<h1>React Quiz</h1>
			{gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
				<button className="start" onClick={startTrivia}>
					Start
				</button>
			) : null}
			{!gameOver && <p className="score">Score:{score}</p>}

			{isLoading && <p className="">{'Loading Questions'}</p>}
			{!isLoading && !gameOver && (
				<QuestionCard
					questionNr={number + 1}
					totalQuestions={TOTAL_QUESTIONS}
					question={questions[number].question}
					answers={questions[number].answers}
					userAnswer={userAnswers ? userAnswers[number] : undefined}
					callback={checkAnswer}
				/>
			)}

			{!gameOver && !isLoading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
				<button className="next" onClick={nextQuestion}>
					next question
				</button>
			) : null}
		</div>
	);
}

export default App;
