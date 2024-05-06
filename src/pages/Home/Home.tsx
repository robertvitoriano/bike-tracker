import { getUserStatistics } from "@/api/get-user-statistics";
import { getFormattedTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
export function Home() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ["get-user-statistics"],
    queryFn: getUserStatistics,
  });
  return (
    <div className="h-screen bg-muted">
      <div className="flex flex-col gap-4 py-4 bg-secondary">
        {!isLoading && (
          <div className="flex flex-col gap-4 px-4">
            <div>Your performance:</div>
            <div className="flex gap-4 ">
              <div className="flex flex-col gap-2">
                <span className="text-xs">Tracks</span>
                <span className=" text-2xl font-bold">
                  {statistics?.totalOfTracks || 0}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs">Time</span>
                <span className=" text-2xl font-bold">
                  {getFormattedTime(statistics?.totalTime)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs">Distance</span>
                <span className=" text-2xl font-bold">
                  {statistics?.totalDistance.toFixed(2) || 0} Km
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
