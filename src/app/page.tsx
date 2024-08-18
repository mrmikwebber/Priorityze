'use client'

import Image from "next/image";
import simulateSavingsWithRebalancedPriorities from "./incomeAllocationPriority";
import React from "react";
import {Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tabs, Tab, Card, CardBody} from "@nextui-org/react";

export default function Home() {


  interface SimulatedGoal {
    month: number;
    goalNames: string[];
    allocations: string[];
    allocationDelta: string[];
    remaining: string[];
 }

  // Example usage with some target dates optional
  const goalInput = {
    MacBook: 1200,
    EspressoMachine: 1500,
    SimRig: 2000
  };

  const targetDates = {
    MacBook: '2025-01-01',          // Has a target date
    EspressoMachine: null,           // No target date
    SimRig: '2025-12-01'             // Has a target date
  };

  const currentDate = new Date('2024-08-15');

  const GoalRow = ({goalCount}: {goalCount: number}) => {
    return (
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4 items-center">
        <Input id={`goal${goalCount}Name`} label="Goal" placeholder="Goal"/>
        <Input id={`goal${goalCount}Amount`} type="number" label="Amount" placeholder="Amount" />
        <Input id={`goal${goalCount}AmountRemaining`} type="number" label="Remaining" placeholder="Remaining Amount" />
        <Input id={`goal${goalCount}Priority`} type="number" label="Priority" placeholder="Priority" />
      </div>
    )
  }

  const [goalCount, setGoalCount] = React.useState(1);
  const [goalTable, setGoalTable] = React.useState([<GoalRow goalCount={goalCount} />]);
  const [savingsIncome, setSavingsIncome] = React.useState(0);
  const [simulatedGoals, setSimulatedGoals] = React.useState<SimulatedGoal[]>([]);

  const addGoalRow = () => {
    console.log('Adding Row')
    setGoalCount(goalCount => goalCount + 1)
    setGoalTable(table => {
      return [
        ...table,
        <GoalRow goalCount={goalCount + 1}/>
      ]
    });
  }

  const simulateGoals = () => {
    let savingsIncome = (document.querySelector('#savingsIncome') as HTMLInputElement).value;
    let goalAmounts: number[] = [];
    let goalWeights: number[] = [];
    let goalNames: string[] = [];
    for(let i = 1; i <= goalCount; i++) {
      const goalName = (document.querySelector(`#goal${i}Name`) as HTMLInputElement).value
      const goalAmount: number = +(document.querySelector(`#goal${i}Amount`) as HTMLInputElement).value
      const goalAmountRemaining: number = +(document.querySelector(`#goal${i}AmountRemaining`) as HTMLInputElement).value;
      const goalPriority: number = +(document.querySelector(`#goal${i}Priority`) as HTMLInputElement).value

      goalAmounts = [...goalAmounts, goalAmount];
      goalNames = [...goalNames, goalName];
      goalWeights = [...goalWeights, goalPriority];

    }
    setSimulatedGoals(simulateSavingsWithRebalancedPriorities(goalNames, goalAmounts, goalWeights, savingsIncome));
  }

  const generateGoalTable = (goalNumber: number) => {
    return (
    <Table aria-label="Example empty table">
    <TableHeader>
      <TableColumn>MONTH</TableColumn>
      <TableColumn>REMAING</TableColumn>
      <TableColumn>AMOUNT ALLOCATED</TableColumn>
    </TableHeader>
    <TableBody emptyContent={"No rows to display."}>
      {simulatedGoals.map((goal) => {
        return (<TableRow key={goal.month}>
          <TableCell>{goal.month}</TableCell>
          <TableCell>{goal.remaining[goalNumber]}</TableCell>
          <TableCell>{goal.allocationDelta[goalNumber]}</TableCell>
        </TableRow>)
      })}
    </TableBody>
  </Table>
    );
  }

  const generateTabs = () => {
    const tabs = [];
    for(let i = 0; i < goalCount; i++) {
      tabs.push(<Tab key={simulatedGoals[0].goalNames[i]} title={simulatedGoals[0].goalNames[i]}>
        {generateGoalTable(i)}
      </Tab>);
    }
    return <Tabs aria-label="Goal Options">{tabs}</Tabs>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {goalTable}
      <div className="gap-2">
        <Input id='savingsIncome' label="Savings Income" placeholder="Savings Income"/>
        <Button onClick={addGoalRow} color="primary" aria-label="add">Add More</Button>
        <Button onClick={simulateGoals} color="danger" aria-label="simulate">Simulate</Button>
      </div>

      {simulatedGoals.length > 0 && <div className="flex w-full flex-col">
        {generateTabs()}
      </div>}  
    </main>
  );
}
