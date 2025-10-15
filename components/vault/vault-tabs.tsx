"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyOrdinals } from "./my-ordinals"
import { VaultedOrdinals } from "./vaulted-ordinals"
import { VaultHistory } from "./vault-history"

export function VaultTabs() {
  return (
    <Tabs defaultValue="my-ordinals" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="my-ordinals">My Ordinals</TabsTrigger>
        <TabsTrigger value="vaulted">Vaulted</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="my-ordinals" className="mt-6">
        <MyOrdinals />
      </TabsContent>

      <TabsContent value="vaulted" className="mt-6">
        <VaultedOrdinals />
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <VaultHistory />
      </TabsContent>
    </Tabs>
  )
}
