'use client'
import { useUser } from '@clerk/nextjs'
import React from 'react'

function QaPage() {
  const {user} = useUser();
  return (
    <div>
    <div>Q&A</div>
    </div>
  )
}

export default QaPage;