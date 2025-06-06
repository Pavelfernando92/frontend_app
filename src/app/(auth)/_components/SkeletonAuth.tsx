import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonAuth = () => (
  <Card className="w-full max-w-md">
    <CardHeader className="space-y-1">
      <Skeleton className="h-[200px] w-[250px] mx-auto mb-4" />
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-4 w-3/4 mx-auto" />
    </CardFooter>
  </Card>
);
export default SkeletonAuth;
