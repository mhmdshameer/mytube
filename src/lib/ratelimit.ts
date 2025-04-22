import { redis } from "./redis";
import { Ratelimit } from "@upstash/ratelimit";

export const ratelimiter = new Ratelimit({
redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
  prefix: "ratelimit",
});


