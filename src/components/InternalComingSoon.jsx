import React from "react";
import { NavLink } from "react-router-dom";

export default function InternalComingSoon({
  title,
  ctaLabel,
  ctaTo,
  helperText,
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {title}
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">Coming Soon</p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>In Development</span>
        </div>

        {ctaLabel && ctaTo && (
          <div className="pt-6 flex flex-col items-center">
            {helperText ? (
              <p className="text-gray-500 text-sm mb-3">{helperText}</p>
            ) : null}
            <NavLink
              to={ctaTo}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              {ctaLabel}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

