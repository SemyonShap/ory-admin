import { Alert, AlertDescription } from "../ui/alert";
import { Spinner } from "../ui/spinner";

export const PageLoader = () => {
  return (
    <div className="flex flex-1 justify-center items-center h-96">
      <Spinner />
    </div>
  );
};

export const PageError = (error: Error) => {
  return (
    <div className="p-2">
      <Alert>
        <AlertDescription>Error loading page: {error.message}</AlertDescription>
      </Alert>
    </div>
  );
};
