import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export const AuthButton = () => {
  return (
    <div>
      <Button variant="outline" className="px-4 py-2 text-sm font-medium rounded-full text-blue-600 hover:text-blue-500 border-blue-500/20 shadow-none" >
        <UserCircle/>
        Sign in
      </Button>
    </div>
  );
};
