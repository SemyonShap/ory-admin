import { Badge } from "@/components/ui/badge";
import { Identity } from "@ory/client-fetch";
import { CheckCircle, Crown, Shield, User, XCircle } from "lucide-react";

interface UserRowProps {
  user: Identity;
  onUserClick: (id: string) => void;
}

export const UserRow = ({ user, onUserClick }: UserRowProps) => {
  const isEmailVerified =
    user.verifiable_addresses?.some(
      (addr) => addr.value === user.traits?.email && addr.verified,
    ) || false;

  const role = (user.metadata_public as { role?: string })?.role || "user";

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div
      className="flex items-center p-2 border-b cursor-pointer hover:bg-muted/50"
      onClick={() => onUserClick(user.id)}
    >
      <div className="flex-1 max-w-20 truncate ml-2">
        {user.traits?.username || user.traits?.name || "N/A"}
      </div>
      <div className="flex-1 truncate ml-2">{user.traits?.email || "N/A"}</div>
      <div className="w-6 ml-2 flex justify-center">
        {isEmailVerified ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
      </div>
      <div className="w-6 ml-2 flex justify-center">{getRoleIcon(role)}</div>
      <div className="w-24 truncate ml-4 text-muted-foreground">
        {user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "N/A"}
      </div>
      <div className="w-16 ml-4">
        <Badge variant={user.state === "active" ? "default" : "secondary"}>
          {user.state}
        </Badge>
      </div>
    </div>
  );
};
