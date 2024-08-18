function simulateSavingsWithRebalancedPriorities(goalNames, goalAmounts, priorities, savingsIncome) {
    let remainingAmounts = [...goalAmounts];
    let savingsAllocation = new Array(goalAmounts.length).fill(0);
    let allocationDelta = [...goalAmounts];
    let allocationHistory = [];
    let month = 0;

    while (remainingAmounts.reduce((a, b) => a + b, 0) > 0) {
        month++;

        // Filter out fully funded goalAmounts and adjust priorities accordingly
        let activePriorities = [];
        let totalPriority = 0;

        remainingAmounts.forEach((remaining, index) => {
            if (remaining > 0) {
                activePriorities.push(priorities[index]);
                totalPriority += priorities[index];
            } else {
                activePriorities.push(0);  // Completed goalAmounts get 0 priority in allocation
            }
        });

        // Allocate savings based on active priorities
        remainingAmounts.forEach((remaining, index) => {
            if (remaining > 0) {
                let proportion = priorities[index] / totalPriority;
                let allocation = savingsIncome * proportion;
                savingsAllocation[index] += allocation;
                remainingAmounts[index] -= allocation;
                allocationDelta[index] = allocation;

                // Prevent negative remaining amounts
                if (remainingAmounts[index] < 0) {
                    remainingAmounts[index] = 0;
                    allocationDelta[index] = 0;
                }
            }
        });

        // Save allocation history for the month
        allocationHistory.push({
            month,
            goalNames,
            allocations: savingsAllocation.map(amount => amount.toFixed(2)),
            allocationDelta: allocationDelta.map(amount => amount.toFixed(2)),
            remaining: remainingAmounts.map(amount => amount.toFixed(2))

        });
    }

    return allocationHistory;
}

export default simulateSavingsWithRebalancedPriorities;