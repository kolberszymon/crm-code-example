import Image from "next/image";
import { AuthLayout } from "@/components/Layouts/AuthLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { showToastNotificationError } from "@/components/Custom/ToastNotification";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Trainings() {
  const router = useRouter();
  const { id } = router.query;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm();

  // useQuery to fetch trainings
  const { data: training, isPending } = useQuery({
    queryKey: ['training-store'],
    queryFn: async () => {
      const res = await fetch(`/api/trainings/fetch-one-without-pdf?id=${id}`);

      const data = await res.json();
      console.log(data);
      return data;
    },
    enabled: !!id,
  });

  //usemutation for creating payment link
  const { mutate: createPaymentLink } = useMutation({
    mutationFn: async (formData) => {
      const stripe = await stripePromise;

      const res = await fetch(`/api/stripe/create-payment-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const session = await res.json();
      
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      console.log(result);

      if (result.error) {
        throw new Error(result.error.message);
      }
    },
    onError: (error) => {
      console.log(error);
      showToastNotificationError("Wystąpił błąd", "Spróbuj ponownie później")
    }
  });

  const onSubmit = (data) => {
    const body = {
      email: data.email,
      name: data.name,
      title: training.title,
      pricePln: training.pricePln,
      trainingId: id,
    }

    createPaymentLink(body);
  };

  if (isPending) return <div className="flex items-center justify-center h-screen">Ładowanie...</div>;

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <Link href="/login">
          <Image src="/logo.svg" width={241} height={62} alt="logo" />
        </Link>
        <div className="flex flex-row p-[16px] my-[40px] rounded-md overflow-hidden w-[830px] h-[550px] bg-white p-[64px] gap-[48px]">
          <div className="flex flex-col gap-[16px] flex-1">
            <div className="flex flex-col gap-[4px]">
              <h2 className="text-[#015640] text-3xl font-extrabold">Zakup szkolenia</h2>
              <p className="text-zinc-950 text-xs font-normal">
              Po wykonanej płatności otrzymasz na swoją skrzynkę mailową plik z gotowym szkoleniem.
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-[#002d21] text-sm font-medium">Nazwa szkolenia</p>
              <p className="text-[#002d21] text-xs font-normal">{training.title}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-[#002d21] text-sm font-medium">Razem do zapłaty</p>
              <p className="text-[#002d21] text-xs font-normal">{training.pricePln} zł</p>
            </div>
            <div className="flex flex-col">
              <p className="text-[#002d21] text-sm font-medium">Sposób płatności</p>
              <p className="text-[#002d21] text-xs font-normal">Karta / BLIK / Przelew</p>
            </div>
          </div>          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
            <div className="border border-zinc-200 rounded-md p-[24px]">
              <div className="flex flex-col gap-[16px] mb-[24px]">
                <p className="text-zinc-800 text-base font-semibold">Dane do płatności</p>
              </div>
              
              <div className="flex flex-col gap-[4px] mb-[16px]">
                <label className="text-sm font-semibold text-[#002d21]">
                  Imię
                </label>
                <div className="flex flex-row border border-main-gray rounded-md focus-within:border-zinc-800 transition-colors">
                  <input
                    {...register("name", {
                      required: "Imię jest wymagane"
                    })}
                    type="text"
                    placeholder="Imię"
                    className="px-[16px] py-[10px] text-sm font-semibold flex-1 outline-none rounded-md"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[4px] mb-[16px]">
                <label className="text-sm font-semibold text-[#002d21]">
                  Email
                </label>
                <div className="flex flex-row border border-main-gray rounded-md focus-within:border-zinc-800 transition-colors">
                  <input
                    {...register("email", {
                      required: "Email jest wymagany",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Wprowadź poprawny email",
                      },
                    })}
                    type="text"
                    placeholder="Email"
                    className="px-[16px] py-[10px] text-sm font-semibold flex-1 outline-none rounded-md"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[4px] mb-[16px]">
                <label className="text-sm font-semibold text-[#002d21]">
                  Powtórz adres email
                </label>
                <div className="flex flex-row border border-main-gray rounded-md focus-within:border-zinc-800 transition-colors">
                  <input
                    {...register("confirmEmail", {
                      required: "Powtórz adres email",
                      validate: (value) => value === watch('email') || "Adresy email nie są zgodne",
                    })}
                    type="text"
                    placeholder="Powtórz adres email"
                    className="px-[16px] py-[10px] text-sm font-semibold flex-1 outline-none rounded-md"
                  />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  {...register("termsAccepted", {
                    required: "Musisz zaakceptować regulamin"
                  })}
                  className="cursor-pointer accent-main-green w-[16px] h-[16px]"
                />
                <label htmlFor="termsAccepted" className="text-zinc-600 text-xs font-normal">
                  Oświadczam, że zapoznałem/am się z polityką prywatności i regulaminem*
                </label>
              </div>
            </div>
            <button
                className={`bg-main-green text-white text-base font-semibold rounded-md py-[10px] mt-[16px] hover:opacity-80 transition-opacity flex items-center justify-center disabled:opacity-70 disabled:bg-gray-300 ${isSubmitting ? 'opacity-70' : ''}`}
                type="submit"
                disabled={isSubmitting || !isValid}
              >
              {isSubmitting ? (                  
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />                  
              ) : (
                'Przejdź do płatności'
              )}
            </button>
          </form>          
        </div>
      </div>
    </AuthLayout>
  );
}
