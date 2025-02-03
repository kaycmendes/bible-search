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
    { value: 'KJV', label: 'KJV', fullName: 'King James Version' },
    { value: 'NKJV', label: 'NKJV', fullName: 'New King James Version' },
    { value: 'ACF', label: 'ACF', fullName: 'Almeida Corrigida Fiel' },
  ];

  return (
    <div className={className}>
      <Select value={version} onValueChange={onVersionChange}>
        <SelectTrigger 
          className="w-full h-full border-0 bg-transparent hover:bg-white/20 dark:hover:bg-navy-700/30 text-navy-800 dark:text-cream-50 transition-colors duration-300 focus:outline-none focus-visible:outline-none text-sm sm:text-base px-2 sm:px-4"
        >
          <SelectValue 
            placeholder="KJV"
            className="text-sm sm:text-base font-medium text-navy-800 dark:text-cream-50"
          />
        </SelectTrigger>
        <SelectContent 
          className="z-[1000] bg-cream-50 dark:bg-navy-800 border-cream-200 dark:border-navy-700"
          align="center"
          sideOffset={4}
        >
            {versions.map((v) => (
              <SelectItem 
                key={v.value} 
                value={v.value} 
                className="text-navy-800 dark:text-cream-50 hover:bg-cream-100 dark:hover:bg-navy-700 h-10"
                title={v.fullName}
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