import { useQuery } from "@tanstack/react-query";

const useProfileDetails = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/proxy/auth/v1/me", {
        credentials: "include",
      });
      const result = await res.json();

      return result?.data;
    },
    staleTime: Infinity,
  });
};

export default useProfileDetails;
