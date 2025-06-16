import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);
    
    const client = useStreamVideoClient();

    useEffect(() => {
        // Get user from localStorage
        const storedUser = localStorage.getItem('videoUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const loadCalls = async () => {
            if (!client || !user?.id) return;

            setIsLoading(true);

            try {
                const { calls } = await client.queryCalls({
                    sort: [{ field: 'starts_at', direction: -1 }],
                    filter_conditions: {
                        starts_at: { $exists: true },
                        $or: [
                            { created_by_user_id: user.id },
                            { members: { $in: [user.id] }},
                        ]
                    }
                });

                setCalls(calls);
            } catch (error) {
                console.log(error);
                // For anonymous users, we might not be able to query calls
                // This is expected behavior
                setCalls([]);
            } finally {
                setIsLoading(false);
            }
        }
        loadCalls();

    }, [client, user?.id])

    const now = new Date();

    const endedCalls = calls.filter(({ state: { startsAt, endedAt } }: Call) => {
        return (startsAt && new Date(startsAt) < now || !!endedAt);
    })

    const upcomingCalls = calls.filter(({ state: { startsAt } }: Call) => {
        return (startsAt && new Date(startsAt) > now );
    })

    return { endedCalls, upcomingCalls, callRecordings: calls, isLoading };
}