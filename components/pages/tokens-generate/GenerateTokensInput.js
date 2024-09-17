import { ButtonGreen } from "@/components/Buttons/ButtonGreen"

export default function GenerateTokensInput({ tokenNumber, setTokenNumber, setIsModalOpen }) {
  const isValid = tokenNumber !== "" && !isNaN(Number(tokenNumber));

  return (
    <>
      <p className="text-[#0e1726] text-xs font-medium leading-normal mb-[8px]">
        Wpisz liczbę tokenów
      </p>
      <div className="flex flex-row gap-[16px]">
      <input
        type="text"
        placeholder="100 000"
        value={tokenNumber}
        className="border border-zinc-400  px-[16px] py-[8px] rounded-md text-black text-neutral-600 text-sm font-normal" 
        onChange={(e) => setTokenNumber(e.target.value)}
      />
        <ButtonGreen title={"Wygeneruj tokeny"} onPress={() => setIsModalOpen(true)} disabled={!isValid} />
      </div>
    </>
  )
}