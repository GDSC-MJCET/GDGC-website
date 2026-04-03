import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Nav from '../Nav';
import { eventsByYear } from './PastEvents';

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const year = location.state?.year || '2025-26';

  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Event Not Found</h1>
          <button
            onClick={() => navigate('/events')}
            className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const currentYearEvents = eventsByYear[year] || [];
  const currentIndex = currentYearEvents.findIndex(e => e.title === event.title && e.bg === event.bg);
  const prevEvent = currentIndex > 0 ? currentYearEvents[currentIndex - 1] : null;
  const nextEvent = currentIndex < currentYearEvents.length - 1 ? currentYearEvents[currentIndex + 1] : null;

  const navigateToEvent = (targetEvent) => {
    navigate('/event-details', { state: { event: targetEvent, year } });
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-black text-white">
        <Nav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 mb-6 sm:mb-8 text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Events
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8" style={{ backgroundColor: event.bg }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="flex-shrink-0">
                  <img
                    src="/poster.png"
                    alt={event.title}
                    className="w-full mx-auto lg:mx-0 lg:w-96 h-auto object-cover rounded-lg lg:rounded-xl"
                  />
                </div>
                <div className="flex-1 text-black">
                    <div className='flex flex-col justify-between h-full'>
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                                {event.title}
                            </h1>
                            
                            <p className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                                {event.desc}
                            </p>
                        </div>
                        <div className="bg-black/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Event Details</h2>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="text-sm sm:text-base">
                                    <span className="font-semibold">Date:</span> {event.date} {event.month}
                                </div>
                                    
                                <div className="text-sm sm:text-base">
                                    <span className="font-semibold">Year:</span> {location.state?.year || '2025-26'}
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

          <div className="border border-white/90 rounded-xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4">Overview</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {event.overview}
            </p>
          </div>
          <div className="space-y-12 sm:space-y-16 lg:space-y-22 mt-8 sm:mt-12">
            <div className='flex flex-col lg:flex-row gap-6 sm:gap-8 items-center'>
                <div className='flex-1 order-2 lg:order-1'>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Description</h2>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{event.neque}</p>
                </div>
                <div className='relative overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300 flex-shrink-0 order-1 lg:order-2 flex-1'>
                    <img
                        src="/poster.png"
                        alt={event.title}
                        className='w-screen h-32 md:w-full   md:h-100   object-cover transform group-hover:scale-105 transition-transform duration-500 '
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>
            </div>
            <div className='flex flex-col-reverse md:flex-col text-right lg:flex-row-reverse gap-6 sm:gap-8 lg:gap-12 xl:gap-22 items-center'>
                <div className='flex-1'>
                    {/* <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Neque</h2> */}
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{event.neque1}</p>
                </div>
                <div className='relative overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300 flex-shrink-0 flex-1'>
                    <img
                        src="/poster.png"
                        alt={event.title}
                        className='w-screen h-32 md:w-full   md:h-100   object-cover transform group-hover:scale-105 transition-transform duration-500 '
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-0 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700">
            <button
              onClick={() => prevEvent && navigateToEvent(prevEvent)}
              disabled={!prevEvent}
              className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 rounded-full shadow-sm shadow-white transition-all border border-white/60  duration-300 text-left w-full sm:w-auto ${
                prevEvent
                  ? ' text-white hover:translate-x-1'
                  : ' text-gray-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm text-gray-400">Previous</div>
                <div className="text-xs sm:text-sm font-medium truncate">
                  {prevEvent?.title}
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/events')}
              className="border border-white shadow-sm shadow-white rounded-full text-white px-4 sm:px-6 py-3 transition-all duration-300 text-center "
            >
              <span className="hidden sm:inline">View All Events</span>
              <span className="sm:hidden">All Events</span>
            </button>

            <button
              onClick={() => nextEvent && navigateToEvent(nextEvent)}
              disabled={!nextEvent}
              className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 rounded-full shadow-sm shadow-white transition-all border border-white/60  duration-300 text-right w-full sm:w-auto ${
                nextEvent
                  ? ' text-white hover:-translate-x-1'
                  : ' text-gray-600 cursor-not-allowed'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm text-gray-400">Next</div>
                <div className="text-xs sm:text-sm font-medium truncate">
                  {nextEvent?.title}
                </div>
              </div>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

