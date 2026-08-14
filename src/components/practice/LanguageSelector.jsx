import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LANGUAGE_LABELS = {
  javascript: "JavaScript",
  python: "Python",
  python_ml: "Python (ML)",
  cpp: "C++",
  java: "Java",
}

const LanguageSelector = ({ languages, onValueChange, value }) => {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="w-[170px] rounded-xl border-white/10 bg-black/[0.3] text-white shadow-none">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="border-white/10 bg-[#111827] text-white">
        {languages.map((language) => (
          <SelectItem className="focus:bg-white/10 focus:text-white" key={language} value={language}>
            {LANGUAGE_LABELS[language] || language}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LanguageSelector
