import EggInventoryList from '@/components/EggInventoryList';
import prisma from '@/lib/prisma'

export default async function Home() {
  const users = await prisma.employee.findMany()
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        superblog123
      </h1>
      <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.fullName}
          </li>
        ))}
      </ol>
    </div>
  );
}
