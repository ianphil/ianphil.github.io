#!/bin/bash
# ralph-blog-comments.sh - Implement GitHub Issues Blog Comments using Ralph Wiggum pattern

MAX_ITERATIONS=${1:-50}
PROMPT_FILE="./RALPH_PROMPT.md"
LOG_FILE="./ralph-execution-log.txt"

echo "🤖 Starting Ralph Wiggum loop for GitHub Issues Blog Comments implementation"
echo "📋 Prompt file: $PROMPT_FILE"
echo "🔢 Max iterations: $MAX_ITERATIONS"
echo "📝 Execution log: $LOG_FILE"
echo "📂 Conversation logs: ~/.claude/conversation-logs/"
echo ""

# Initialize log file
echo "=== Ralph Wiggum Execution Log ===" > "$LOG_FILE"
echo "Started: $(date)" >> "$LOG_FILE"
echo "Max iterations: $MAX_ITERATIONS" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔄 Iteration $i/$MAX_ITERATIONS - $(date '+%H:%M:%S')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # Log iteration start
  echo "--- Iteration $i started at $(date) ---" >> "$LOG_FILE"

  # Run Claude (ignore exit code - we run all iterations)
  claude --dangerously-skip-permissions --add-dir ../tools -p "$(cat $PROMPT_FILE)" 2>&1 | tee -a "$LOG_FILE"

  exit_code=$?
  echo "Exit code: $exit_code" >> "$LOG_FILE"
  echo "" >> "$LOG_FILE"

  echo ""
  echo "⏭️  Continuing to next iteration..."
  echo ""

  # Small delay between iterations
  sleep 2
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏁 Completed $MAX_ITERATIONS iterations"
echo "📝 Full logs available in:"
echo "   - Execution log: $LOG_FILE"
echo "   - Conversation logs: ~/.claude/conversation-logs/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
