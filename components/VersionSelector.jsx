"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const VersionSelector = ({ version, onVersionChange, className }) => {
  const versions = [
    { value: 'KJV', label: 'King James Version (KJV)' },
    { value: 'NKJV', label: 'New King James Version (NKJV)' },
    { value: 'ACF', label: 'Almeida Corrigida Fiel (ACF)' },
  ];

  return (
    <div className={className}>
      <Select value={version} onValueChange={onVersionChange}>
        <SelectTrigger className="w-full h-full border-0 bg-transparent focus:ring-0 hover:bg-white/50 dark:hover:bg-gray-800 dark:text-cream-50">
          <SelectValue 
            placeholder="Select version" 
            className="dark:text-cream-50 text-base"
          />
        </SelectTrigger>
        <SelectContent className="dark:bg-navy-800 dark:border-navy-700">
          {versions.map((v) => (
            <SelectItem 
              key={v.value} 
              value={v.value} 
              className="dark:text-cream-50 dark:hover:bg-navy-700"
            >
              {v.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default VersionSelector; 