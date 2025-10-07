import { MadeWithDyad } from "@/components/made-with-dyad";
import { useSession } from "@/components/SessionContextProvider";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

const Index = () => {
  const { session, supabase } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Your Freeio App</h1>
        {session ? (
          <>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              You are logged in as: {session.user?.email}
            </p>
            <Button onClick={handleLogout} className="mt-4">
              Logout
            </Button>
          </>
        ) : (
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Please log in to continue.
          </p>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;