import { Switch } from '@headlessui/react'
import Image from 'next/image';
import { useState } from "react";

export default function Home() {
  const [colorTheme, setColorTheme] = useState('dark');

  return (
    <main className={`flex flex-col items-center justify-center h-screen w-full ${colorTheme === 'light' ? 'bg-[#fafdfc]' : 'bg-[#002d21]'}`}>
      <Image src={colorTheme === 'dark' ? 'logo-white.svg' : 'logo.svg'} alt="logo" width={296} height={74} className='mb-[80px]'/>
      <p className={`text-[40px] md:text-[60px] lg:text-[120px] mb-[32px] font-bold ${colorTheme === 'light' ? 'text-[#002d21]' : 'text-white'}`}>NADCHODZIMY</p>
      <p className={`text-[15px] md:text-[28px] mb-[120px] text-center font-medium ${colorTheme === 'light' ? 'text-[#002d21]' : 'text-white'}`}>
        Jesteśmy w trakcie tworzenia czegoś niesamowitego <br />
        System będzie wkrótce dostępny.
      </p>
      <Switch
        checked={colorTheme === 'light'}
        onChange={() => setColorTheme(colorTheme === 'light' ? 'dark' : 'light')}
        className={`group border relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10 ${colorTheme === 'light' ? 'bg-[#002d21]' : 'bg-[#fafdfc]'}`}
      >
        <span
        aria-hidden="true"
        className={`pointer-events-none inline-block size-5 translate-x-0 rounded-full ring-0 shadow-lg transition duration-200 ease-in-out  group-data-[checked]:translate-x-7 ${colorTheme === 'light' ? 'bg-[#002d21]' : 'bg-[#fafdfc]'}`}
        />
      </Switch>
    </main>
  );
}
