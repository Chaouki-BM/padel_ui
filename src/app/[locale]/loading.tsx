

export default function Loading() {
  // We can't use hooks in a loading component (it's a server component with no props),
  // so we use a simple spinner without translated text.
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
