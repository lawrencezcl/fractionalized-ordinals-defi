"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LendingOverview } from "./lending-overview"
import { BorrowInterface } from "./borrow-interface"
import { SupplyInterface } from "./supply-interface"
import { ActiveLoans } from "./active-loans"

export function LendingDashboard() {
  return (
    <div className="space-y-6">
      <LendingOverview />

      <Tabs defaultValue="borrow" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="borrow">Borrow</TabsTrigger>
          <TabsTrigger value="supply">Supply</TabsTrigger>
          <TabsTrigger value="loans">My Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="borrow" className="mt-6">
          <BorrowInterface />
        </TabsContent>

        <TabsContent value="supply" className="mt-6">
          <SupplyInterface />
        </TabsContent>

        <TabsContent value="loans" className="mt-6">
          <ActiveLoans />
        </TabsContent>
      </Tabs>
    </div>
  )
}
