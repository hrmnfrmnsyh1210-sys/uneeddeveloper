import React from "react";

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  href?: string;
  hoverColor?: string;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  icon,
  title,
  description,
  href,
  hoverColor = "indigo",
}) => {
  const hoverMap: Record<string, string> = {
    indigo: "group-hover:bg-indigo-600 group-hover:text-white",
    pink: "group-hover:bg-pink-600 group-hover:text-white",
  };

  const titleHoverMap: Record<string, string> = {
    indigo: "group-hover:text-indigo-400",
    pink: "group-hover:text-pink-400",
  };

  const content = (
    <>
      <div
        className={`w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-indigo-400 transition-colors flex-shrink-0 mr-4 ${hoverMap[hoverColor] || ""}`}
      >
        {icon}
      </div>
      <div>
        <h4
          className={`text-white font-semibold mb-1 transition-colors ${titleHoverMap[hoverColor] || ""}`}
        >
          {title}
        </h4>
        <div className="text-slate-400">{description}</div>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-start group"
      >
        {content}
      </a>
    );
  }

  return <div className="flex items-start">{content}</div>;
};
