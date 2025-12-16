# !/bin/bash
echo "Starting React Native App..."
pnpm --filter=mobile ios &

echo "Starting Web App..."
pnpm --filter=web dev &

echo "Waiting for all processes to finish..."
wait

echo "All development processes finished."


