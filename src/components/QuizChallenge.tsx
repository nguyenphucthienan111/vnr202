import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomQuestion, Question } from '../data/questions';
import { answerQuizCorrect, resetStreak } from '../hooks/useGame';

interface QuizChallengeProps {
  pin: string;
  playerId: string;
  teamId: string;
  playerStreak: number;
  onComplete: () => void;
}

export default function QuizChallenge({ pin, playerId, teamId, playerStreak, onComplete }: QuizChallengeProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [earnedPoints, setEarnedPoints] = useState(0);

  useEffect(() => {
    // Load a random question
    setQuestion(getRandomQuestion());
  }, []);

  useEffect(() => {
    if (showResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResult]);

  const handleTimeout = async () => {
    setShowResult(true);
    setIsCorrect(false);
    await resetStreak(pin, playerId);
    
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const handleAnswer = async (answerIndex: number) => {
    if (selectedAnswer !== null || !question) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const points = await answerQuizCorrect(pin, playerId, teamId);
      setEarnedPoints(points || 1);
    } else {
      await resetStreak(pin, playerId);
    }

    // Wait 3 seconds before closing
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  if (!question) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#f4ebd8] p-8 border-4 border-[#2b2824] animate-pulse">
          <div className="typewriter-text text-xl">Đang chuẩn bị câu hỏi...</div>
        </div>
      </div>
    );
  }

  const getStreakMultiplier = () => {
    if (playerStreak >= 5) return 'x3';
    if (playerStreak >= 3) return 'x2';
    return 'x1';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, rotateY: -90 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="bg-[#f4ebd8] p-8 border-4 border-[#2b2824] shadow-[12px_12px_0px_rgba(43,40,36,1)] max-w-2xl w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b-4 border-double border-[#2b2824] pb-4">
          <div>
            <div className="typewriter-text text-sm uppercase tracking-widest opacity-70">Câu hỏi lịch sử</div>
            <div className="text-xs mt-1 text-[#8b1a1a] font-bold">
              Độ khó: {question.difficulty === 'easy' ? '⭐' : question.difficulty === 'medium' ? '⭐⭐' : '⭐⭐⭐'}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Streak indicator */}
            {playerStreak > 0 && (
              <div className="bg-[#8b1a1a] text-[#f5ede0] px-3 py-1 font-bold text-sm">
                🔥 {playerStreak} {getStreakMultiplier()}
              </div>
            )}
            
            {/* Timer */}
            <div className={`text-center ${timeLeft <= 5 ? 'animate-pulse' : ''}`}>
              <div className={`text-4xl font-black font-mono ${timeLeft <= 5 ? 'text-[#8b1a1a]' : 'text-[#2b2824]'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="newspaper-text text-2xl font-bold leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctAnswer;
            const showCorrect = showResult && isCorrectAnswer;
            const showWrong = showResult && isSelected && !isCorrectAnswer;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                whileHover={selectedAnswer === null ? { scale: 1.02, x: 5 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                className={`w-full text-left p-4 border-4 border-[#2b2824] font-bold text-lg transition-all ${
                  showCorrect
                    ? 'bg-green-500 text-white'
                    : showWrong
                    ? 'bg-red-500 text-white'
                    : isSelected
                    ? 'bg-[#2b2824] text-[#f5ede0]'
                    : 'bg-[#e8dfc7] hover:bg-[#2b2824] hover:text-[#f5ede0]'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="font-black mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
                {showCorrect && <span className="float-right text-2xl">✓</span>}
                {showWrong && <span className="float-right text-2xl">✗</span>}
              </motion.button>
            );
          })}
        </div>

        {/* Result */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-6 border-4 ${
                isCorrect ? 'border-green-600 bg-green-100' : 'border-red-600 bg-red-100'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{isCorrect ? '🎉' : '😔'}</div>
                <div className="font-black text-2xl mb-2">
                  {isCorrect ? `+${earnedPoints} ĐIỂM!` : 'SAI RỒI!'}
                </div>
                {isCorrect && earnedPoints > 1 && (
                  <div className="text-sm font-bold text-[#8b1a1a] mb-2">
                    Combo {getStreakMultiplier()}! 🔥
                  </div>
                )}
                {question.explanation && (
                  <div className="text-sm mt-3 newspaper-text italic border-t-2 border-dashed border-[#2b2824] pt-3">
                    💡 {question.explanation}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
