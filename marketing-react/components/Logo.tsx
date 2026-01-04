import React from 'react';

interface LogoProps {
  className?: string;
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-10", withText = true }) => {
  const logoDark = "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/6883df10979e8300a2e23e8e.png"; 
  const logoLight = "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/6893623965ff15cdfbf0cdd6.png"; 
  const iconUrl = "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/690a621f2b2c75f886569ecf.png";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {withText ? (
        <>
            <img 
              src={logoDark} 
              alt="Orengen.io - AI Agents & Business Automation Logo" 
              className="hidden dark:block h-full w-auto object-contain" 
            />
            <img 
              src={logoLight} 
              alt="Orengen.io - AI Agents & Business Automation Logo" 
              className="block dark:hidden h-full w-auto object-contain" 
            />
        </>
      ) : (
         <img 
           src={iconUrl} 
           alt="Orengen.io Official Icon" 
           className="h-full w-auto object-contain" 
         />
      )}
    </div>
  );
};

export default Logo;