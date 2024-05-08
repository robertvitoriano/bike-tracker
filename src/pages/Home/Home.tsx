import { getUserStatistics } from "@/api/get-user-statistics";
import { getFormattedTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function Home() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ["get-user-statistics"],
    queryFn: getUserStatistics,
  });
  return (
    <div className="h-screen bg-muted">
      <div className="flex flex-col gap-4 py-4 bg-secondary">
        <div className="flex flex-col gap-4 px-4">
          <div>Your performance:</div>
          <div className="flex gap-4 ">
            <div className="flex flex-col gap-2">
              <span className="text-xs">Tracks</span>
              <span className=" text-2xl font-bold">
                {!isLoading ? (
                  statistics?.totalOfTracks || 0
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs">Time</span>
              <span className=" text-2xl font-bold">
                {!isLoading ? (
                  getFormattedTime(statistics?.totalTime) || 0
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs">Distance</span>
              <span className=" text-2xl font-bold">
                {!isLoading ? (
                  `${statistics?.totalDistance.toFixed(2) || 0} Km`
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
