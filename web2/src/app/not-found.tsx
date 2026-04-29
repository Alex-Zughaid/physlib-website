import { ButtonLink } from "@/components/button-link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-6xl font-bold text-accent mb-4">404</p>
      <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
      <p className="text-muted mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <ButtonLink href="/">Back to Home</ButtonLink>
    </div>
  );
}
