export default function Logo({ className = "" }: { className?: string }) {
  return <img src="/thygracemerch-logo.png" alt="ThyGraceMerch" width="743" height="960" className={`h-11 w-auto object-contain ${className}`} />;
}
