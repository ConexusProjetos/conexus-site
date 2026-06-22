import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { servicesRouter } from "./services";
import { projectsRouter } from "./projects";
import { blogRouter } from "./blog";
import { contactRouter } from "./contact";
import { testimonialsRouter } from "./testimonials";

/**
 * Primary router for the Conexus application.
 * All sub-routers are merged here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  services: servicesRouter,
  projects: projectsRouter,
  blog: blogRouter,
  contact: contactRouter,
  testimonials: testimonialsRouter,
});

// Export type for client-side type inference
export type AppRouter = typeof appRouter;
