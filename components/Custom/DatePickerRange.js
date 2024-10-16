import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { pl } from 'date-fns/locale'



import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"



const formatCapitalized = (date, formatStr, locale) => {
  return format(date, formatStr, { locale }).replace(/^\w/, c => c.toUpperCase());
};

export function DatePickerWithRange({
  date,
  setDate,
  className,
}) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (newDate) => {
    setDate(newDate)
    console.log(newDate)
    if (newDate?.from && newDate?.to) {
      setOpen(false)
    }
  }

  return (
    <div className={cn("grid gap-2 border-none", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[230px] justify-center text-center font-normal flex flex-row items-center gap-2",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd.MM.yy")}-
                  {format(date.to, "dd.MM.yyyy")}
                </>
              ) : (
                format(date.from, "dd.MM.yyyy")
              )
            ) : (
              <span>Wybierz datę</span>
            )}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={pl}    
            formatters={{              
              formatCaption: (date) => formatCapitalized(date, "LLLL yyyy", pl)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}