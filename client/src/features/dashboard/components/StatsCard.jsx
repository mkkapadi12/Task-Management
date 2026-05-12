import { cn } from "@/lib/utils";

const StatsCard = ({ icon: Icon, label, value, className }) => {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
