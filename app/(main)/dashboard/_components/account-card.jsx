'use client';

import { ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import useFetch from '@/hooks/use-fetch';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { updateDefaultAccount } from '@/actions/account';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { deleteAccount } from '@/actions/dashboard';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;
  const router = useRouter();
  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation

    if (isDefault) {
      toast.warning('You need atleast 1 default account');
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success('Default account updated successfully');
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to update default account');
    }
  }, [error]);

  return (
    <Card className="group relative border-gray-400 transition-shadow hover:shadow-md">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <div className="flex items-center gap-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-white/80 shadow hover:bg-red-100 transition-colors border border-gray-200"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the account <strong>{name}</strong>{' '}
                    and its transaction link. You cannot undo this action.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={async () => {
                      const res = await deleteAccount(id);
                      if (res.success) {
                        toast.success('Account deleted successfully');
                        router.refresh();
                      } else {
                        toast.error('Failed to delete account');
                      }
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-400"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-muted-foreground text-xs">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="text-muted-foreground flex justify-between text-sm">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
