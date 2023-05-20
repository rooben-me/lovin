import GenerateChat from "@/components/GenerateChat";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center flex-col bg-slate-100">
      <div className="p-8 mb-8 text-4xl text-center font-semibold text-indigo-600">
        Lovin
      </div>

      <GenerateChat />
    </div>
  );
}
