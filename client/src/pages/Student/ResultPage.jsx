import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import {
  Award,
  CheckCircle,
  XCircle,
  Clipboard,
  Home,
  ChevronDown
} from 'lucide-react';

const ResultPage = () => {
  const location = useLocation();
  const state = location.state;

  // Redirect if page is opened directly
  if (!state || !state.resultDetails) {
    return <Navigate to="/student/dashboard" replace />;
  }

  const { resultDetails, examTitle } = state;

  const passed = resultDetails.percentage >= 50;

  const evaluation = resultDetails.evaluation || [];

  const getAnswerText = (question, answer) => {
    if (!answer || answer === 'Not Answered') {
      return 'Not Answered';
    }

    return `${answer}. ${question.options?.[answer] || ''}`;
  };

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        paddingBottom: '3rem'
      }}
    >
      {/* Heading */}
      <div
        style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}
      >
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}
        >
          Exam Completed
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)'
          }}
        >
          Your test score has been evaluated successfully.
        </p>
      </div>

      {/* Result Summary Card */}
      <div
        className="card text-center"
        style={{
          padding: '2.5rem 2rem',
          borderTop: `6px solid ${
            passed
              ? 'var(--color-success)'
              : 'var(--color-danger)'
          }`,
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2rem'
        }}
      >
        {/* Award */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: passed
              ? 'var(--color-success-light)'
              : 'var(--color-danger-light)',
            color: passed
              ? 'var(--color-success)'
              : 'var(--color-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}
        >
          <Award size={36} />
        </div>

        <span
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            fontWeight: 600
          }}
        >
          Results Summary
        </span>

        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginTop: '0.25rem',
            marginBottom: '1.5rem'
          }}
        >
          {examTitle || 'Quiz Attempt'}
        </h2>

        {/* Percentage */}
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 2.5rem',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            marginBottom: '2rem'
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: passed
                ? 'var(--color-success)'
                : 'var(--color-danger)',
              lineHeight: 1
            }}
          >
            {parseFloat(resultDetails.percentage).toFixed(2)}%
          </div>

          <span
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              marginTop: '0.25rem'
            }}
          >
            Final Grade: {passed ? 'PASSED' : 'FAILED'}
          </span>
        </div>

        {/* Statistics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            textAlign: 'center'
          }}
        >
          <div>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}
            >
              Total Questions
            </div>

            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginTop: '0.25rem'
              }}
            >
              10
            </div>
          </div>

          <div>
            <div
              style={{
                color: 'var(--color-success)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}
            >
              Correct
            </div>

            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-success)',
                marginTop: '0.25rem'
              }}
            >
              {resultDetails.correctAnswers}
            </div>
          </div>

          <div>
            <div
              style={{
                color: 'var(--color-danger)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}
            >
              Wrong / Skipped
            </div>

            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-danger)',
                marginTop: '0.25rem'
              }}
            >
              {resultDetails.wrongAnswers}
            </div>
          </div>
        </div>
      </div>

      {/* Question-wise Evaluation */}
      {evaluation.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}
          >
            Question-wise Evaluation
          </h2>

          {evaluation.map((item) => (
            <div
              key={item.questionId}
              className="card"
              style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                borderLeft: `5px solid ${
                  item.isCorrect
                    ? 'var(--color-success)'
                    : 'var(--color-danger)'
                }`
              }}
            >
              {/* Question Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0
                  }}
                >
                  Question {item.questionNumber}
                </h3>

                {item.isCorrect ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'var(--color-success)',
                      fontWeight: 600
                    }}
                  >
                    <CheckCircle size={20} />
                    Correct
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'var(--color-danger)',
                      fontWeight: 600
                    }}
                  >
                    <XCircle size={20} />
                    Wrong
                  </div>
                )}
              </div>

              {/* Question */}
              <p
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '1.25rem'
                }}
              >
                {item.question}
              </p>

              {/* Your Answer */}
              <div
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: item.isCorrect
                    ? 'var(--color-success-light)'
                    : 'var(--color-danger-light)',
                  marginBottom: '0.75rem'
                }}
              >
                <strong>Your Answer: </strong>

                {getAnswerText(item, item.studentAnswer)}
              </div>

              {/* Correct Answer */}
              {!item.isCorrect && (
                <div
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-success-light)'
                  }}
                >
                  <strong>Correct Answer: </strong>

                  {getAnswerText(
                    item,
                    item.correctAnswer
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom Buttons */}
      <div
        className="flex gap-2 justify-center"
        style={{
          marginTop: '2rem'
        }}
      >
        <Link
          to="/student/dashboard"
          className="btn btn-outline"
        >
          <Home size={16} />
          <span>Go to Dashboard</span>
        </Link>

        <Link
          to="/student/results"
          className="btn btn-primary"
        >
          <Clipboard size={16} />
          <span>View All History</span>
        </Link>
      </div>
    </div>
  );
};

export default ResultPage;