export function simulateSavingsWithOptionalTargetDates(goals, targetDates, currentDate, savingsIncome, monthlyLimit = 36) {
    let remainingAmounts = { ...goals };
    let savingsAllocation = { MacBook: 0, EspressoMachine: 0, SimRig: 0 };
    let allocationPer = {...savingsAllocation};
    let percentagePer = {...savingsAllocation};
    let allocationHistory = [];
    let month = 0;

    // Calculate the number of months to each target date
    const monthsToTarget = {};
    for (let goal in targetDates) {
        if (targetDates[goal]) {
            const targetDate = new Date(targetDates[goal]);
            const monthsRemaining = (targetDate.getFullYear() - currentDate.getFullYear()) * 12 
                                    + (targetDate.getMonth() - currentDate.getMonth());
            monthsToTarget[goal] = monthsRemaining;
        } else {
            monthsToTarget[goal] = null;  // No target date
        }
    }

    while (Object.values(remainingAmounts).reduce((a, b) => a + b, 0) > 0 && month < monthlyLimit) {
        month++;
      
        let requiredMonthlySavings = {};
        let totalRequiredSavings = 0;

        // Calculate the required monthly savings for goals with target dates
        for (let goal in remainingAmounts) {
            if (monthsToTarget[goal] !== null) {
                requiredMonthlySavings[goal] = remainingAmounts[goal] / monthsToTarget[goal];
            } else {
                requiredMonthlySavings[goal] = remainingAmounts[goal];  // No date, save proportionally
            }
            totalRequiredSavings += requiredMonthlySavings[goal];
        }
      
        // Allocate savings proportionally
        for (let goal in remainingAmounts) {
            let proportion = requiredMonthlySavings[goal] / totalRequiredSavings;
            let allocation = savingsIncome * proportion;
            savingsAllocation[goal] += allocation;
            remainingAmounts[goal] -= allocation;
            percentagePer[goal] = proportion;
            allocationPer[goal] = allocation;
            if (monthsToTarget[goal] !== null) monthsToTarget[goal]--;  // Decrease remaining months if target exists
          
            // Prevent negative remaining amounts
            if (remainingAmounts[goal] < 0) {
                remainingAmounts[goal] = 0;
            }
        }
      
        // Save allocation history for the month
        allocationHistory.push({
            month,
            MacBookAllocation: `${savingsAllocation.MacBook.toFixed(2)} [${percentagePer.MacBook.toFixed(2) * 100}%] - [$${allocationPer.MacBook.toFixed(2)}]`,
            EspressoMachineAllocation: `${savingsAllocation.EspressoMachine.toFixed(2)} [${percentagePer.EspressoMachine.toFixed(2) * 100}%] - [$${allocationPer.EspressoMachine.toFixed(2)}]`,
            SimRigAllocation: `${savingsAllocation.SimRig.toFixed(2)} [${percentagePer.SimRig.toFixed(2) * 100}%] - [$${allocationPer.SimRig.toFixed(2)}]`,
            MacBookRemaining: remainingAmounts.MacBook.toFixed(2),
            EspressoMachineRemaining: remainingAmounts.EspressoMachine.toFixed(2),
            SimRigRemaining: remainingAmounts.SimRig.toFixed(2)
        });
    }
  
    return allocationHistory;
}

export default simulateSavingsWithOptionalTargetDates;
