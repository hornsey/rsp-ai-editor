"use client";

interface TaskCardProps {
  icon: string;
  title: string;
  description: string;
  badge: string;
  href?: string;
  onClick?: () => void;
}

export default function TaskCard({
  icon,
  title,
  description,
  badge,
  href,
  onClick,
}: TaskCardProps) {
  const content = (
    <div className="bg-surface-container border border-outline-variant p-6 rounded-xl flex flex-col items-start gap-3 hover:border-primary transition-colors group cursor-pointer">
      <div className="bg-primary-container/10 p-2 rounded-lg">
        <span className="material-symbols-outlined text-primary text-2xl">
          {icon}
        </span>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
      
      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mt-auto group-hover:bg-primary group-hover:text-on-primary transition-colors">
        {badge}
      </span>
    </div>
  );

  if (href) {
    return <a href={href} className="block">{content}</a>;
  }

  return <div onClick={onClick}>{content}</div>;
}
