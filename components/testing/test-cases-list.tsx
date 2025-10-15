"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react"

interface TestCase {
  id: string
  name: string
  status: "passed" | "failed" | "warning"
  executionTime: number
}

interface TestCasesListProps {
  testCases: TestCase[]
  selectedTest: TestCase
  onSelectTest: (test: TestCase) => void
  summary: {
    total: number
    passed: number
    failed: number
    warnings: number
    avgExecutionTime: number
  }
}

export function TestCasesList({ testCases, selectedTest, onSelectTest, summary }: TestCasesListProps) {
  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="p-4">
        <h3 className="mb-4 text-sm font-semibold">Résumé des tests</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold">{summary.total}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              Réussis
            </span>
            <span className="font-semibold">{summary.passed}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="h-4 w-4" />
              Avertissements
            </span>
            <span className="font-semibold">{summary.warnings}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-red-500">
              <XCircle className="h-4 w-4" />
              Échoués
            </span>
            <span className="font-semibold">{summary.failed}</span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Temps moyen
              </span>
              <span className="font-semibold">{summary.avgExecutionTime}ms</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Test Cases List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Cas de test</h3>
        {testCases.map((test) => (
          <Card
            key={test.id}
            className={`cursor-pointer p-3 transition-colors hover:bg-accent ${
              selectedTest.id === test.id ? "border-primary bg-accent" : ""
            }`}
            onClick={() => onSelectTest(test)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {test.status === "passed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                {test.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                {test.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                <span className="text-sm font-medium">{test.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{test.executionTime}ms</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
