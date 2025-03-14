"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";

function DashboardPage() {
  const { user } = useUser();
  return <div className="text-black">{user?.firstName}</div>;
}

export default DashboardPage;
