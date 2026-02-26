import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomQuestion, Question } from '../data/questions';
import { answerDuel, DuelChallenge as DuelData } from '../hooks/useGame';

interface DuelChallengeProps {
  pin: string;
  playerId: string;
  duel: DuelData;
  opponentName: string;
  opponentTeam: string;
  myTeam: string;
  onComplete: () => void;
}

export default function DuelChallenge({ 
  pin, 
  playerId, 
  duel, 
  opponentName, 
  opponentTeam,
  myTeam,
  onComplete 
}: DuelChallengeProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  const isPlayer1 = duel.player1Id === playerId;
  const myAnswer = isPlayer1 ? duel.player1Answer : duel.player2Answer;
  const opponentAnswer = isPlayer1 ? duel.player2Answer : duel.player1Answer;

  useEffect(() => {
    // Load the question
    setQuestion(getRandomQuestion());
  }, []);

  useEffect(() => {
    if (myAnswer !== null) {
      setWaitingForOpponent(true);
      return;
    }

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
  }, [myAnswer]);

  useEffect(() => {
    // Check if duel is completed
    if (duel.status === 'completed') {
      setTimeout(() => {
        onComplete();
      }, 5000);
    }
  }, [duel.status]);

  const handleTimeout = async () => {
    if (!question) return;
    // Auto-submit wrong answer
    await answerDuel(pin, duel.id, playerId, -1, question.correctAnswer);
  };

  const handleAnswer = async (answerIndex: number) => {
    if (selectedAnswer !== null || !question) return;

    setSelectedAnswer(answerIndex);
    await answerDuel(pin, duel.id, playerId, answerIndex, question.correctAnswer);
    setWaitingForOpponent(true);
  };

  if (!question) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#f4ebd8] p-8 border-4 border-[#2b2824] animate-pulse">
          <div className="typewriter-text text-xl">Đang chuẩn bị thách đấu...</div>
        </div>
      </div>
    );
  }

  const isCompleted = duel.status === 'completed';
  const iWon = duel.winnerId === playerId;
  const isDraw = duel.winnerId === null && isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, rotateX: -90 }}
        animate={{ scale: 1, rotateX: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="bg-[#f4ebd8] p-8 border-4 border-[#8b1a1a] shadow-[12px_12px_0px_rgba(139,26,26,1)] max-w-2xl w-full"
      >
        {/* Header - VS */}
        <div className="text-center mb-6 border-b-4 border-double border-[#2b2824] pb-4">
          <div className="typewriter-text text-sm uppercase tracking-widest opacity-70 mb-2">⚔️ Thách Đấu 1v1 ⚔️</div>
          <div className="flex items-center justify-center gap-4 text-xl font-bold">
            <div className="text-center">
              <div className="text-2xl">👤</div>
              <div>Bạn</div>
              <div className="text-sm text-[#8b1a1a]">({myTeam})</div>
            </div>
            <div className="text-5xl font-black text-[#8b1a1a]">VS</div>
            <div className="text-center">
              <div className="text-2xl">👤</div>
              <div>{opponentName}</div>
              <div className="text-sm text-[#8b1a1a]">({opponentTeam})</div>
            </div>
          </div>
          
          {!waitingForOpponent && (
            <div className={`mt-4 text-center ${timeLeft <= 5 ? 'animate-pulse' : ''}`}>
              <div className={`text-4xl font-black font-mono ${timeLeft <= 5 ? 'text-[#8b1a1a]' : 'text-[#2b2824]'}`}>
                {timeLeft}s
              </div>
            </div>
          )}
        </div>

        {/* Question */}
        {!isCompleted && (
          <>
            <div className="mb-8">
              <h3 className="newspaper-text text-2xl font-bold leading-relaxed">
                {question.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={waitingForOpponent}
                    whileHover={!waitingForOpponent ? { scale: 1.02, x: 5 } : {}}
                    whileTap={!waitingForOpponent ? { scale: 0.98 } : {}}
                    className={`w-full text-left p-4 border-4 border-[#2b2824] font-bold text-lg transition-all ${
                      isSelected
                        ? 'bg-[#2b2824] text-[#f5ede0]'
                        : 'bg-[#e8dfc7] hover:bg-[#2b2824] hover:text-[#f5ede0]'
                    } ${waitingForOpponent ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <span className="font-black mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </motion.button>
                );
              })}
            </div>

            {waitingForOpponent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-[#2b2824] text-[#f5ede0] text-center font-bold animate-pulse"
              >
                ⏳ Đang chờ đối thủ trả lời...
              </motion.div>
            )}
          </>
        )}

        {/* Result */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-8 border-4 ${
                iWon ? 'border-green-600 bg-green-100' : isDraw ? 'border-yellow-600 bg-yellow-100' : 'border-red-600 bg-red-100'
              }`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {iWon ? '🏆' : isDraw ? '🤝' : '😔'}
                </div>
                <div className="font-black text-4xl mb-4">
                  {iWon ? 'THẮNG!' : isDraw ? 'HÒA!' : 'THUA!'}
                </div>
                {iWon && (
                  <div className="text-xl font-bold text-green-700 mb-4">
                    +1 điểm cho {myTeam}! 🎉
                  </div>
                )}
                
                {/* Show correct answer */}
                <div className="mt-6 p-4 bg-white border-2 border-[#2b2824] text-left">
                  <div className="font-bold mb-2">Đáp án đúng:</div>
                  <div className="text-lg">
                    <span className="font-black mr-2">{String.fromCharCode(65 + question.correctAnswer)}.</span>
                    {question.options[question.correctAnswer]}
                  </div>
                  {question.explanation && (
                    <div className="text-sm mt-3 italic border-t-2 border-dashed border-[#2b2824] pt-3">
                      💡 {question.explanation}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
