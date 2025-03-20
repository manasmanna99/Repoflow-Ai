"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CreditCard, Coins } from "lucide-react";
import { CreditPurchaseModal } from "~/components/CreditPurchaseModal";

export default function BillingPage() {
  const [showCreditModal, setShowCreditModal] = useState(false);
  const utils = api.useUtils();
  const { data: user } = api.user.getCredits.useQuery();

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Credits</h1>
        <p className="text-muted-foreground">
          Manage your credits and billing information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Available Credits
            </CardTitle>
            <CardDescription>
              Credits are used to create and manage projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{user?.credits ?? 0}</div>
            <p className="text-sm text-muted-foreground">
              Each project cost credits
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => setShowCreditModal(true)}
            >
              Purchase Credits
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing History
            </CardTitle>
            <CardDescription>
              View your credit purchase history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Initial Credits</p>
                  <p className="text-sm text-muted-foreground">
                    Free credits for new users
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">50 credits</p>
                  <p className="text-sm text-muted-foreground">On signup</p>
                </div>
              </div>
              {/* Add more billing history items here */}
            </div>
          </CardContent>
        </Card>
      </div>

      <CreditPurchaseModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        onSuccess={() => {
          setShowCreditModal(false);
          // Refetch user credits
          void utils.user.getCredits.refetch();
        }}
      />
    </div>
  );
} 