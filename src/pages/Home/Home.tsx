import { getUserStatistics } from "@/api/get-user-statistics";
import { getFormattedTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { getUserTracks } from "@/api/get-user-tracks";
export function Home() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ["get-user-statistics"],
    queryFn: getUserStatistics,
  });
  const { data: userSavedTracks, isLoading: isLoadingUserSavedTracks } =
    useQuery({
      queryKey: ["get-user-tracks"],
      queryFn: getUserTracks,
    });
  return (
    <div className="bg-muted flex flex-col gap-4">
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
            <div className="flex flex-col gap-2">
              <span className="text-xs">Average speed</span>
              <span className=" text-2xl font-bold">
                {!isLoading ? (
                  `${statistics?.averageSpeed?.toFixed(2) || 0} Km/h`
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 bg-muted py-8">
        {isLoadingUserSavedTracks && <Skeleton className="h-10" />}
        {!isLoadingUserSavedTracks && userSavedTracks.length === 0 ? (
          <h1>You don't have any track</h1>
        ) : (
          userSavedTracks &&
          userSavedTracks.map((track) => (
            <div
              key={track._id}
              className="flex flex-col items-center bg-secondary px-4 py-8"
            >
              <div className="w-full">
                <h1 className="text-center text-4xl font-bold">
                  {!isLoadingUserSavedTracks ? (
                    track.title
                  ) : (
                    <Skeleton className="h-4 w-full" />
                  )}
                </h1>
              </div>
              <div className="flex justify-around">
                <div className="p-4 bg-white">
                  <span className="text-xl">
                    {!isLoadingUserSavedTracks ? (
                      format(new Date(track.createdAt), "dd/MM/yyyy")
                    ) : (
                      <Skeleton className="h-4 w-full" />
                    )}
                  </span>
                </div>
                <div className="p-4 bg-white">
                  <span className="text-xl">
                    {getFormattedTime(track.time)}
                  </span>
                </div>
                <div className="p-4 bg-white">
                  {!isLoadingUserSavedTracks ? (
                    <span className="text-xl">
                      {track.distance.toFixed(2)} Km
                    </span>
                  ) : (
                    <Skeleton className="h-4 w-full" />
                  )}
                </div>
                <div className="p-4 bg-white">
                  {!isLoadingUserSavedTracks ? (
                    <span className="text-xl">{track.speed.toFixed(2)} Km</span>
                  ) : (
                    <Skeleton className="h-4 w-full" />
                  )}
                </div>
              </div>
              <img src={track.image} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
