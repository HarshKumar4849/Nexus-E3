import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

const DeleteAccountModal = ({ open, onOpenChange, onClose }: DeleteAccountModalProps) => {
  const handleOpenChange = (isOpen: boolean) => {
    if (onOpenChange) onOpenChange(isOpen);
    if (!isOpen && onClose) onClose();
  };
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    // Validate inputs
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter your password to confirm deletion.",
        variant: "destructive",
      });
      return;
    }

    if (!confirmDelete) {
      toast({
        title: "Error",
        description: "Please confirm that you want to delete your account.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/users/delete-account`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          // Send credentials to include cookies
          credentials: "include",
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to delete account.",
          variant: "destructive",
        });
        setIsDeleting(false);
        return;
      }

      // Logout and redirect
      logout();

      // Show success message and redirect
      toast({
        title: "Success",
        description: "Your account has been deleted successfully.",
      });

      // Redirect to onboarding
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      handleOpenChange(false);
      setPassword("");
      setConfirmDelete(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Delete Account?
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-3 space-y-4">
            <p>
              This action is permanent. All your data will be deleted and cannot
              be recovered.
            </p>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Enter your password to confirm:
              </label>
              <Input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isDeleting}
              />
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirm-delete"
                checked={confirmDelete}
                onCheckedChange={(checked) => setConfirmDelete(checked as boolean)}
                disabled={isDeleting}
              />
              <label
                htmlFor="confirm-delete"
                className="text-sm text-foreground cursor-pointer"
              >
                I understand this cannot be undone
              </label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-3 pt-4">
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={isDeleting || !password.trim() || !confirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountModal;
