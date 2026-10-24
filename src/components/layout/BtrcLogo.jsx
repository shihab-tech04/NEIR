import React from 'react';

export const BtrcLogo = ({ className = 'h-10 w-10', showText = true, inverted = false, compactOnNarrow = false }) => {
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none min-w-0">
      <div className={`relative flex items-center justify-center shrink-0 overflow-hidden ${className}`}>
        <img
          src={logoSrc}
          alt="BTRC"
          className="w-full h-full object-contain"
          draggable="false"
        />
      </div>

      {showText && (
        <div className={(compactOnNarrow ? 'max-[359px]:hidden ' : '') + 'flex flex-col text-left min-w-0'}>
          <div className="flex items-center gap-1.5">
            <p className={`text-base font-bold tracking-tight leading-none ${inverted ? 'text-white' : 'text-[#202338]'}`}>
              BTRC
            </p>
            <p className={`text-[11px] font-semibold tracking-wider px-1.5 py-0.5 rounded border ${inverted ? 'bg-white/10 text-emerald-300 border-white/15' : 'bg-[#028A97]/10 text-[#028A97] border-[#028A97]/20'}`}>
              NEIR
            </p>
          </div>
          <p className={`hidden sm:block text-[12px] font-medium leading-tight mt-0.5 truncate ${inverted ? 'text-slate-300' : 'text-[#626981]'}`}>
            National Equipment Identity Register
          </p>
        </div>
      )}
    </div>
  );
};
