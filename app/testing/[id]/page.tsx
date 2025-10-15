"use client"

import { TestCasesList } from "@/components/testing/test-cases-list"
import { TestRunner } from "@/components/testing/test-runner"
import { TestResults } from "@/components/testing/test-results"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const testData = {
  fileName: "budget-2024.xlsx",
  testCases: [
    {
      id: "test-1",
      name: "Test SUM formulas",
      description: "Vérifier que les formules SUM produisent les mêmes résultats",
      inputs: [
        { cell: "A1", value: 100 },
        { cell: "A2", value: 200 },
        { cell: "A3", value: 300 },
      ],
      excelResult: 600,
      webAppResult: 600,
      status: "passed",
      executionTime: 45,
    },
    {
      id: "test-2",
      name: "Test VLOOKUP conversion",
      description: "Vérifier la recherche de valeurs",
      inputs: [{ cell: "A1", value: "Product-123" }],
      excelResult: 1250.5,
      webAppResult: 1250.5,
      status: "passed",
      executionTime: 32,
    },
    {
      id: "test-3",
      name: "Test IF conditions",
      description: "Vérifier les conditions logiques",
      inputs: [{ cell: "B2", value: 1500 }],
      excelResult: "High",
      webAppResult: "High",
      status: "passed",
      executionTime: 28,
    },
    {
      id: "test-4",
      name: "Test ProcessData macro",
      description: "Vérifier le traitement des données",
      inputs: [
        { cell: "Data!A2", value: 50 },
        { cell: "Data!B2", value: 2.5 },
      ],
      excelResult: 125,
      webAppResult: 125,
      status: "passed",
      executionTime: 156,
    },
    {
      id: "test-5",
      name: "Test complex INDEX/MATCH",
      description: "Vérifier les formules complexes",
      inputs: [{ cell: "E1", value: "Category-A" }],
      excelResult: 4250,
      webAppResult: 4248,
      status: "warning",
      executionTime: 67,
      difference: 2,
    },
  ],
  summary: {
    total: 5,
    passed: 4,
    failed: 0,
    warnings: 1,
    avgExecutionTime: 65.6,
  },
}

export default function TestingPage({ params }: { params: { id: string } }) {
  const [selectedTest, setSelectedTest] = useState(testData.testCases[0])
  const [isRunning, setIsRunning] = useState(false)

  const handleRunTests = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/conversion/conversion-123">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Environnement de test</h1>
                <p className="text-sm text-muted-foreground">{testData.fileName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Nouveau test
              </Button>
              <Button className="gap-2" onClick={handleRunTests} disabled={isRunning}>
                <Play className="h-4 w-4" />
                {isRunning ? "Exécution..." : "Lancer tous les tests"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
          {/* Sidebar - Test Cases */}
          <div>
            <TestCasesList
              testCases={testData.testCases}
              selectedTest={selectedTest}
              onSelectTest={setSelectedTest}
              summary={testData.summary}
            />
          </div>

          {/* Main Content - Test Runner & Results */}
          <div className="space-y-6">
            <TestRunner test={selectedTest} isRunning={isRunning} />
            <TestResults test={selectedTest} />
          </div>
        </div>
      </div>
    </div>
  )
}
