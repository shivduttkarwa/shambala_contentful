import React from 'react';

interface IconLink {
  id: number;
  title: string;
  icon: string;
  link: string;
}

interface IconLinksSectionProps {
  title?: string;
  iconLinks?: IconLink[];
}

const defaultIconLinks: IconLink[] = [
  { id: 1, title: 'Design my hardscape', icon: 'hardscape', link: '#' },
  { id: 2, title: 'Plan my softscape', icon: 'softscape', link: '#' },
  { id: 3, title: 'Install turf lawn', icon: 'turf', link: '#' },
  { id: 4, title: 'Build a deck', icon: 'deck', link: '#' },
  
];

const IconLinksSection: React.FC<IconLinksSectionProps> = ({
  title = 'Transform Your Landscape',
  iconLinks = defaultIconLinks
}) => {
  const getIcon = (iconType: string): React.ReactElement => {
    const icons: { [key: string]: React.ReactElement } = {
      hardscape: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M6 8h12M6 12h12M6 16h12"/>
          <circle cx="8" cy="10" r="1"/>
          <circle cx="12" cy="10" r="1"/>
          <circle cx="16" cy="10" r="1"/>
        </svg>
      ),
      softscape: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C8 2 4 6 4 10c0 4 4 8 8 8s8-4 8-8c0-4-4-6-8-6z"/>
          <path d="M8 10c0-2 1.5-3.5 3.5-3.5S15 8 15 10"/>
          <path d="M9 12c0-1 0.5-2 1.5-2s1.5 1 1.5 2"/>
          <path d="M12 14v4"/>
          <path d="M10 16h4"/>
        </svg>
      ),
      turf: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 20h20"/>
          <path d="M4 16l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2"/>
          <path d="M4 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2"/>
          <path d="M4 8l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2"/>
        </svg>
      ),
      deck: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="6" width="20" height="12" rx="1"/>
          <path d="M6 10h12M6 14h12"/>
          <path d="M4 8v8M20 8v8"/>
          <circle cx="6" cy="12" r="0.5"/>
          <circle cx="10" cy="12" r="0.5"/>
          <circle cx="14" cy="12" r="0.5"/>
          <circle cx="18" cy="12" r="0.5"/>
        </svg>
      )
    };
    return icons[iconType] || icons.hardscape;
  };

  return (
    <section className="icon-links-section" id="services">
      <div className="section-container">
        <h2 className="section-title">{title}</h2>
        <div className="icon-links-grid">
          {iconLinks.map((item) => (
            <a key={item.id} href={item.link} className="icon-link-item">
              <div className="icon-wrapper">
                {getIcon(item.icon)}
              </div>
              <span>{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IconLinksSection;
