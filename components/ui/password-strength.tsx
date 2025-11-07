'use client'

import React from 'react'
import { Check, X } from 'lucide-react'

interface Requirement {
  label: string
  test: (value: string) => boolean
}

interface PasswordStrengthProps {
  password: string
}

const requirements: Requirement[] = [
  {
    label: 'At least 8 characters',
    test: (value) => value.length >= 8,
  },
  {
    label: 'Contains uppercase letter',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    label: 'Contains lowercase letter',
    test: (value) => /[a-z]/.test(value),
  },
  {
    label: 'Contains number',
    test: (value) => /[0-9]/.test(value),
  },
  {
    label: 'Contains special character',
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
]

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const meetsAllRequirements = requirements.every((req) => req.test(password))
  
  return (
    <div className="mt-2 space-y-2">
      <div className="text-sm text-gray-400">Password requirements:</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {requirements.map((req, index) => {
          const passes = req.test(password)
          return (
            <div
              key={index}
              className={`flex items-center space-x-2 text-sm ${
                passes ? 'text-green-400' : 'text-gray-400'
              }`}
            >
              {passes ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              <span>{req.label}</span>
            </div>
          )
        })}
      </div>
      
      {password.length > 0 && (
        <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              meetsAllRequirements
                ? 'bg-green-500'
                : requirements.filter(req => req.test(password)).length >= 3
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{
              width: `${
                (requirements.filter(req => req.test(password)).length /
                  requirements.length) *
                100
              }%`
            }}
          />
        </div>
      )}
    </div>
  )
}